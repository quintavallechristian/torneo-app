'use server';
import { Place, PlaceSchema, PlaceStats, ROLE, UserAction } from '@/types';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { canUser } from '../permissions';
import { uploadImage, replaceImage } from './storage';

import * as z from 'zod';
import { redirect } from 'next/navigation';
import { PostgrestError } from '@supabase/supabase-js';

export async function getPlaces(
  withMatches: boolean = false,
  withProfileStats: boolean = false,
  withCollection: boolean = false,
  limit: number = 100,
): Promise<{ data: Place[] | null; error: PostgrestError | null }> {
  const supabase = await createClient();

  const selectFields = [
    'id',
    'name',
    'address',
    'latitude',
    'longitude',
    'description',
    'image',

    ...(withMatches
      ? [
          `
          matches:matches(
            *,
            players:profiles_matches(
              *,
              profile:profiles(*)
            ),
            game:games(id, name, image),
            place:places(id, name),
            winner:profiles(id, username)
          )
          `,
        ]
      : []),

    ...(withProfileStats
      ? ['placeStats:profiles_places(profile_id, favourite)']
      : []),
    ...(withCollection ? ['places_games(id)'] : []),
  ].join(', ');

  // Creazione query
  const query = supabase.from('places').select(selectFields).limit(limit);

  // Esecuzione query
  const { data, error } = await query;
  const placeData = data as Place[] | null;

  if (error) {
    console.error('Errore nel recupero dei luoghi:', error);
    return { data: null, error };
  }

  return { data: placeData, error: null };
}

export async function getPlaceDetails(
  searchBy: 'id' | 'name',
  placeId: string,
  withMatches: boolean = false,
  withProfileStats: boolean = false,
  withCollection: boolean = false,
): Promise<{ data: Place | null; error: Error | null }> {
  const supabase = await createClient();

  const selectFields = [
    'id',
    'name',
    'address',
    'latitude',
    'longitude',
    'description',
    'image',
    ...(withMatches
      ? [
          `matches:matches(
          *,
          players:profiles_matches(
            *,
            profile:profiles(*)
          ),
          game:games(name, image, id), 
          place:places(name, id), 
          winner:profiles(id, username)
        )`,
        ]
      : []),
    ...(withProfileStats
      ? ['placeStats:profiles_places(profile_id, favourite)']
      : []),
    ...(withCollection ? ['places_games(id, games(name, image, id))'] : []),
  ].join(', ');

  let query = supabase
    .from('places')
    .select(selectFields)
    .eq(searchBy, placeId);

  if (withProfileStats) {
    const { profile } = await getAuthenticatedUserWithProfile();
    if (!profile) {
      return { data: null, error: new Error('Utente non autenticato') };
    }
    query = query.eq('placeStats.profile_id', profile.id);
  }

  // Esegui la query
  const { data, error } = await query.single<Place>();

  if (error) {
    console.error('Errore nel recupero del luogo:', error);
    return { data: null, error: error };
  }

  return { data, error: null };
}

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
  if (!user || (role !== ROLE.PlaceManager && role !== ROLE.Admin)) {
    return {
      form: null,
      errors: {
        general: ['Non hai i permessi per creare un locale'],
      },
    };
  }

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const address = formData.get('address') as string;
  const latitude = Number(formData.get('latitude'));
  const longitude = Number(formData.get('longitude'));
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
    latitude,
    longitude,
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
  const latitude = formData.get('latitude') as string;
  const longitude = formData.get('longitude') as string;
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
    latitude: Number(latitude),
    longitude: Number(longitude),
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

export async function addGameToCollection({
  placeId,
  gameId,
}: {
  placeId: string;
  gameId: string;
}): Promise<{ success: boolean; message: string }> {
  const canManagePlaces = !!(await canUser(UserAction.ManagePlaces, {
    placeId,
  }));
  if (!canManagePlaces) {
    return {
      success: false,
      message:
        'Non hai i permessi per modificare la collezione di questo luogo',
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.from('places_games').insert([
    {
      place_id: placeId,
      game_id: gameId,
    },
  ]);

  if (error) {
    console.error('Error adding game to collection:', error);
    return { success: false, message: "Errore durante l'aggiunta del gioco" };
  }

  return { success: true, message: 'Gioco aggiunto con successo' };
}
