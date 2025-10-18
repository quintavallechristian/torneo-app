'use server';
import { Profile, ProfileSchema } from '@/types';
import { createClient } from '@/utils/supabase/server';
import { replaceImage } from './storage';

import * as z from 'zod';
import { redirect } from 'next/navigation';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';

export async function editProfile(
  formData: FormData,
  profileId?: string,
): Promise<{
  form: Omit<Profile, 'role' | 'id'> | null;
  errors: { general?: string[]; image?: string[] } | null;
}> {
  const { profile } = await getAuthenticatedUserWithProfile();
  if (!profile || profile.id !== profileId) {
    return {
      form: null,
      errors: {
        general: ['Non hai i permessi per modificare il profilo'],
      },
    };
  }

  const supabase = await createClient();

  // Recupera il profile esistente per ottenere l'URL dell'immagine attuale
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('image')
    .eq('id', profileId)
    .single<Profile>();

  const firstname = formData.get('firstname') as string;
  const lastname = formData.get('lastname') as string;
  const username = formData.get('username') as string;
  const imageFile = formData.get('image') as File | null;

  // Gestione dell'immagine
  let imageUrl: string | null = existingProfile?.image ?? null;

  if (imageFile && imageFile instanceof File && imageFile.size > 0) {
    // Se c'è una nuova immagine, sostituisci quella vecchia
    const { url, error: uploadError } = await replaceImage(
      imageFile,
      existingProfile?.image ?? undefined,
      'profiles-images',
      'profiles',
    );

    if (uploadError || !url) {
      return {
        form: null,
        errors: {
          image: [
            `Errore durante il caricamento dell'immagine: ${uploadError}`,
          ],
        },
      };
    }

    imageUrl = url;
  }

  const form: Omit<Profile, 'role' | 'id'> = {
    firstname,
    lastname,
    username,
    image: imageUrl,
  };

  const validationResult = ProfileSchema.safeParse(form);

  if (!validationResult.success) {
    return {
      form,
      errors: z.flattenError(validationResult.error).fieldErrors,
    };
  }

  const { error } = await supabase
    .from('profiles')
    .update([validationResult.data])
    .eq('id', profileId);

  if (error) {
    console.error('Error updating profile:', error);
    return { form, errors: null };
  } else {
    redirect(`/profile`);
  }
}
