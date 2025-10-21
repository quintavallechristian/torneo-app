'use server';

import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

interface BGGCollectionItem {
  objectid: string;
  status: {
    own: string;
  };
}

export async function getBggUsername() {
  const { user } = await getAuthenticatedUserWithProfile();
  const supabase = await createClient();
  if (!user) {
    throw new Error('Non autenticato');
  }
  const { data: profile } = await supabase
    .from('profiles')
    .select('bgg_username')
    .eq('user_id', user.id)
    .single();

  return profile?.bgg_username || null;
}

export async function saveBggUsername(username: string) {
  const supabase = await createClient();
  const { user } = await getAuthenticatedUserWithProfile();

  if (!user) {
    throw new Error('Non autenticato');
  }

  const { error } = await supabase
    .from('profiles')
    .update({ bgg_username: username })
    .eq('user_id', user.id);

  if (error) {
    throw new Error('Errore durante il salvataggio del username BGG');
  }

  return { success: true };
}

async function parseBGGXML(xmlText: string): Promise<BGGCollectionItem[]> {
  // Parse XML manualmente (semplice parsing per la struttura BGG)
  const items: BGGCollectionItem[] = [];
  const itemMatches = xmlText.matchAll(
    /<item[^>]*objectid="(\d+)"[^>]*>[\s\S]*?<status[^>]*own="(\d)"[^>]*\/>/g,
  );

  for (const match of itemMatches) {
    const objectid = match[1];
    const own = match[2];

    if (own === '1') {
      items.push({
        objectid,
        status: { own },
      });
    }
  }

  return items;
}

export async function syncBGGCollection(username: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Non autenticato');
  }

  // Ottieni il profilo
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!profile) {
    throw new Error('Profilo non trovato');
  }

  try {
    // Chiamata all'API BGG
    const response = await fetch(
      `https://boardgamegeek.com/xmlapi2/collection?username=${username}&own=1`,
    );

    if (!response.ok) {
      throw new Error('Errore durante il recupero della collezione BGG');
    }

    const xmlText = await response.text();

    // Controlla se BGG sta ancora processando la richiesta
    if (
      xmlText.includes('Your request for this collection has been accepted')
    ) {
      throw new Error(
        'BGG sta processando la richiesta. Riprova tra qualche secondo.',
      );
    }

    const items = await parseBGGXML(xmlText);

    if (items.length === 0) {
      return {
        success: true,
        synced: 0,
        message: 'Nessun gioco trovato nella collezione BGG',
      };
    }

    // Prima, rimuovi tutti i giochi dalla collezione
    await supabase
      .from('profiles_games')
      .update({ in_collection: false })
      .eq('profile_id', profile.id);

    let synced = 0;

    // Per ogni item della collezione BGG
    for (const item of items) {
      const gameId = parseInt(item.objectid, 10);

      // Verifica se il gioco esiste nel database
      const { data: game } = await supabase
        .from('games')
        .select('id')
        .eq('id', gameId)
        .single();

      if (game) {
        // Verifica se esiste già una riga in profiles_games
        const { data: existingProfileGame } = await supabase
          .from('profiles_games')
          .select('id')
          .eq('profile_id', profile.id)
          .eq('game_id', gameId)
          .single();

        if (existingProfileGame) {
          // Aggiorna la riga esistente
          await supabase
            .from('profiles_games')
            .update({ in_collection: true })
            .eq('id', existingProfileGame.id);
        } else {
          // Crea una nuova riga
          await supabase.from('profiles_games').insert({
            profile_id: profile.id,
            game_id: gameId,
            in_collection: true,
          });
        }
        synced++;
      }
    }

    revalidatePath('/games/collection');
    return {
      success: true,
      synced,
      total: items.length,
      message: `Sincronizzati ${synced} giochi su ${items.length} della collezione BGG`,
    };
  } catch (error) {
    console.error('Errore durante la sincronizzazione:', error);
    throw error;
  }
}
