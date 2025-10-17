'use server';
import { Place, PlaceSchema, PlaceStats, ROLE, UserAction } from '@/types';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { canUser } from '../permissions';
import { uploadImage, replaceImage } from './storage';

import * as z from 'zod';
import { redirect } from 'next/navigation';

export async function getPlaceRanking(placeId?: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles_places')
    .select('*, profile:profiles(*)')
    .eq('place_id', placeId)
    .gt('points', 0)
    .order('points', { ascending: false });

  if (error) throw error;

  return data as PlaceStats[];
}

export async function setFavouritePlace({
  placeId,
  status,
}: {
  placeId: string;
  status: boolean;
}) {
  const { profile } = await getAuthenticatedUserWithProfile();
  const supabase = await createClient();
  const { error } = await supabase.from('profiles_places').upsert(
    {
      place_id: placeId,
      profile_id: profile?.id,
      favourite: status,
    },

    {
      onConflict: 'place_id, profile_id',
    },
  );
  if (error) throw error;
  revalidatePath(`/places`);
}

export async function createPlace(formData: FormData): Promise<{
  form: Place | null;
  errors: { general?: string[]; image?: string[] } | null;
}> {
  const { user, role } = await getAuthenticatedUserWithProfile();
  if (!user || role !== ROLE.PlaceManager) {
    return {
      form: null,
      errors: {
        general: ['Non hai i permessi per creare partite in questo luogo'],
      },
    };
  }

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const address = formData.get('address') as string;
  const imageFile = formData.get('image') as File | null;

  // Upload dell'immagine se presente
  let imageUrl: string | null = null;
  if (imageFile && imageFile instanceof File && imageFile.size > 0) {
    const { url, error: uploadError } = await uploadImage(
      imageFile,
      'places-images',
      'places',
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

  const form: Place = {
    name,
    description,
    address,
    image: imageUrl,
  };

  const validationResult = PlaceSchema.safeParse(form);

  if (!validationResult.success) {
    return {
      form,
      errors: z.flattenError(validationResult.error).fieldErrors,
    };
  }

  const supabase = await createClient();

  const { data: newPlace, error: newPlaceError } = await supabase
    .from('places')
    .insert([validationResult.data])
    .select();

  if (newPlaceError || !newPlace || newPlace.length === 0) {
    console.error('Error creating place:', newPlaceError);
    return { form, errors: null };
  }

  const { error } = await supabase.from('users_permissions').insert([
    {
      user_id: user.id,
      user_action_id: 4,
      place_id: newPlace[0].id,
    },
  ]);

  if (error) {
    console.error('Error providing permission:', error);
    return { form, errors: null };
  }

  redirect('/places');
}

export async function editPlace(
  formData: FormData,
  placeId?: string,
): Promise<{
  form: Place | null;
  errors: { general?: string[]; image?: string[] } | null;
}> {
  const canManagePlaces = !!(await canUser(UserAction.ManagePlaces, {
    placeId,
  }));
  if (!canManagePlaces) {
    return {
      form: null,
      errors: {
        general: ['Non hai i permessi per modificare partite in questo luogo'],
      },
    };
  }

  const supabase = await createClient();

  // Recupera il place esistente per ottenere l'URL dell'immagine attuale
  const { data: existingPlace } = await supabase
    .from('places')
    .select('image')
    .eq('id', placeId)
    .single<Place>();

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const address = formData.get('address') as string;
  const imageFile = formData.get('image') as File | null;

  // Gestione dell'immagine
  let imageUrl: string | null = existingPlace?.image ?? null;

  if (imageFile && imageFile instanceof File && imageFile.size > 0) {
    // Se c'è una nuova immagine, sostituisci quella vecchia
    const { url, error: uploadError } = await replaceImage(
      imageFile,
      existingPlace?.image ?? undefined,
      'places-images',
      'places',
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

  const form: Place = {
    name,
    description,
    address,
    image: imageUrl,
  };

  const validationResult = PlaceSchema.safeParse(form);

  if (!validationResult.success) {
    return {
      form,
      errors: z.flattenError(validationResult.error).fieldErrors,
    };
  }

  const { error } = await supabase
    .from('places')
    .update([validationResult.data])
    .eq('id', placeId);

  if (error) {
    console.error('Error updating place:', error);
    return { form, errors: null };
  } else {
    redirect(`/places/${placeId}`);
  }
}
