'use server';
import {
  createMatchSchema,
  Game,
  GameStats,
  Match,
  Place,
  PlaceStats,
  Player,
} from '@/types';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { canUser, UserAction } from '../permissions';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import { redirect } from 'next/navigation';

import * as z from 'zod';

const K = 32;

/**
 * Calcola i nuovi punteggi Elo per una partita multiplayer stile BGA,
 * gestendo anche i pareggi.
 * @param players array di giocatori con id, rating e rank (1 = migliore)
 * @returns array con i nuovi rating
 */
export async function updateGameElo(
  players: Pick<Player, 'profile_id' | 'points'>[],
  game: Game,
) {
  const supabase = await createClient();
  const playersWithAllNeeded: {
    [id: string]: {
      currentElo: number;
      points: number;
      position: number;
      result: number;
    };
  } = {};

  const { data } = await supabase
    .from('profiles_games')
    .select<'profile_id, points', GameStats>('profile_id, points')
    .eq('game_id', game.id)
    .in(
      'profile_id',
      players.map((p) => p.profile_id),
    );

  players.forEach(
    (p, index) =>
      (playersWithAllNeeded[p.profile_id] = {
        currentElo:
          data?.find((d) => d.profile_id === p.profile_id)?.points || 0,
        points: p.points || 0,
        position: index + 1,
        result: 0,
      }),
  );

  // confronta ogni coppia di giocatori
  const playerIds = Object.keys(playersWithAllNeeded);
  const results: { [id: string]: number } = {};
  playerIds.forEach((id) => (results[id] = 0));

  for (let i = 0; i < playerIds.length; i++) {
    for (let j = i + 1; j < playerIds.length; j++) {
      const A = playersWithAllNeeded[playerIds[i]];
      const B = playersWithAllNeeded[playerIds[j]];
      console.log('A vs B', A, B);

      // aspettative (probabilità che A vinca contro B)
      const expectedA =
        1 / (1 + Math.pow(10, (B.currentElo - A.currentElo) / 400));
      const expectedB = 1 - expectedA;

      console.log('Expected', expectedA, expectedB);

      // punteggi reali in base al position
      let scoreA = 0.5;
      let scoreB = 0.5;

      if (A.position < B.position) {
        scoreA = 1;
        scoreB = 0;
      } else if (A.position > B.position) {
        scoreA = 0;
        scoreB = 1;
      }
      console.log('Score', scoreA, scoreB);
      // se position uguali → resta scoreA = 0.5 e scoreB = 0.5 (pareggio)

      // aggiorna i risultati accumulati
      results[playerIds[i]] += K * (scoreA - expectedA);
      results[playerIds[j]] += K * (scoreB - expectedB);
      console.log('Results so far', results);
      console.log('---');
    }
  }

  const rows = playerIds.map((playerId) => {
    const eloChange =
      playersWithAllNeeded[playerId].currentElo <= 100
        ? Math.max(Math.round(results[playerId]), 0)
        : Math.round(results[playerId]);
    const newElo =
      playersWithAllNeeded[playerId].currentElo <= 100
        ? Math.max(0, playersWithAllNeeded[playerId].currentElo + eloChange)
        : Math.max(100, playersWithAllNeeded[playerId].currentElo + eloChange);

    return {
      profile_id: playerId,
      game_id: game.id,
      points: newElo,
    };
  });
  console.log('Final ELO changes', rows);

  const { error } = await supabase.from('profiles_games').upsert(rows, {
    onConflict: 'game_id,profile_id',
  });

  if (error) {
    console.error('Error updating ELOs', error);
  }
}
export async function updatePlaceElo(
  players: Pick<Player, 'profile_id' | 'points'>[],
  place: Place,
) {
  const supabase = await createClient();
  const playersWithAllNeeded: {
    [id: string]: {
      currentElo: number;
      points: number;
      position: number;
      result: number;
    };
  } = {};

  const { data } = await supabase
    .from('profiles_places')
    .select<'profile_id, points', PlaceStats>('profile_id, points')
    .eq('place_id', place.id)
    .in(
      'profile_id',
      players.map((p) => p.profile_id),
    );

  players.forEach(
    (p, index) =>
      (playersWithAllNeeded[p.profile_id] = {
        currentElo:
          data?.find((d) => d.profile_id === p.profile_id)?.points || 0,
        points: p.points || 0,
        position: index + 1,
        result: 0,
      }),
  );

  // confronta ogni coppia di giocatori
  const playerIds = Object.keys(playersWithAllNeeded);
  const results: { [id: string]: number } = {};
  playerIds.forEach((id) => (results[id] = 0));

  for (let i = 0; i < playerIds.length; i++) {
    for (let j = i + 1; j < playerIds.length; j++) {
      const A = playersWithAllNeeded[playerIds[i]];
      const B = playersWithAllNeeded[playerIds[j]];
      console.log('A vs B', A, B);

      // aspettative (probabilità che A vinca contro B)
      const expectedA =
        1 / (1 + Math.pow(10, (B.currentElo - A.currentElo) / 400));
      const expectedB = 1 - expectedA;

      console.log('Expected', expectedA, expectedB);

      // punteggi reali in base al position
      let scoreA = 0.5;
      let scoreB = 0.5;

      if (A.position < B.position) {
        scoreA = 1;
        scoreB = 0;
      } else if (A.position > B.position) {
        scoreA = 0;
        scoreB = 1;
      }
      console.log('Score', scoreA, scoreB);
      // se position uguali → resta scoreA = 0.5 e scoreB = 0.5 (pareggio)

      // aggiorna i risultati accumulati
      results[playerIds[i]] += K * (scoreA - expectedA);
      results[playerIds[j]] += K * (scoreB - expectedB);
      console.log('Results so far', results);
      console.log('---');
    }
  }

  const rows = playerIds.map((playerId) => {
    const eloChange =
      playersWithAllNeeded[playerId].currentElo <= 100
        ? Math.max(Math.round(results[playerId]), 0)
        : Math.round(results[playerId]);
    const newElo =
      playersWithAllNeeded[playerId].currentElo <= 100
        ? Math.max(0, playersWithAllNeeded[playerId].currentElo + eloChange)
        : Math.max(100, playersWithAllNeeded[playerId].currentElo + eloChange);

    return {
      profile_id: playerId,
      place_id: place.id,
      points: newElo,
    };
  });
  console.log('Final ELO changes', rows);

  const { error } = await supabase.from('profiles_places').upsert(rows, {
    onConflict: 'place_id,profile_id',
  });

  if (error) {
    console.error('Error updating ELOs', error);
  }
}
export async function setWinner({
  match,
  players,
  place,
  game,
  winnerId,
}: {
  match: Match;
  players: Pick<Player, 'profile_id' | 'points'>[];
  place: Place;
  game: Game;
  winnerId?: string;
}) {
  const supabase = await createClient();
  const { profile } = await getAuthenticatedUserWithProfile();
  const { error } = await supabase
    .from('matches')
    .update({ winner_id: winnerId || players[0].profile_id })
    .eq('id', match.id);
  if (error) throw error;
  const canUpdateMatchStats = !!(await canUser(
    UserAction.UpdateMatchStats,
    {
      placeId: match.place_id,
    },
    match.players?.some((p) => p.confirmed && p.profile_id === profile?.id),
  ));
  if (!canUpdateMatchStats) {
    return {
      success: false,
      message: 'Non hai i permessi per aggiornare le statistiche',
    };
  }
  updateGameElo(players, game);
  updatePlaceElo(players, place);
  revalidatePath(`/matches/${match.id}`);
  return { success: true, message: 'Vincitore aggiornato con successo' };
}

export async function confirmPlayer({
  match,
  profileId,
  placeId,
}: {
  match: Match;
  profileId: string;
  placeId: string;
}) {
  const supabase = await createClient();

  const { profile } = await getAuthenticatedUserWithProfile();

  const canUpdateMatchStats = !!(await canUser(
    UserAction.UpdateMatchStats,
    {
      placeId: placeId,
    },
    match.players?.some((p) => p.confirmed && p.profile_id === profile?.id),
  ));
  if (!canUpdateMatchStats) {
    return {
      success: false,
      message: 'Non hai i permessi per aggiornare le statistiche',
    };
  }

  const { error } = await supabase
    .from('profiles_matches')
    .update([{ confirmed: true }])
    .eq('match_id', match.id)
    .eq('profile_id', profileId);

  if (error) {
    console.error('Error creating profiles_matches:', error);
    throw error;
  }
  revalidatePath(`/matches/${match.id}`);

  return { success: true, message: 'Giocatore confermato con successo' };
}

export async function removePlayer({
  match,
  profileId,
  placeId,
}: {
  match: Match;
  profileId: string;
  placeId: string;
}) {
  const supabase = await createClient();

  const { profile } = await getAuthenticatedUserWithProfile();

  const canUpdateMatchStats = !!(await canUser(
    UserAction.UpdateMatchStats,
    {
      placeId: placeId,
    },
    match.players?.some((p) => p.confirmed && p.profile_id === profile?.id),
  ));
  if (!canUpdateMatchStats) {
    return {
      success: false,
      message: 'Non hai i permessi per aggiornare le statistiche',
    };
  }

  const { error } = await supabase
    .from('profiles_matches')
    .delete()
    .eq('match_id', match.id)
    .eq('profile_id', profileId);

  if (error) {
    console.error('Error removing player from match:', error);
    throw error;
  }
  revalidatePath(`/matches/${match.id}`);

  return { success: true, message: 'Giocatore rimosso con successo' };
}

export async function updatePlayerPoints({
  match,
  profileId,
  placeId,
  points,
}: {
  match: Match;
  profileId: string;
  placeId: string;
  points: number;
}) {
  const { profile } = await getAuthenticatedUserWithProfile();
  const canUpdateMatchStats = !!(await canUser(
    UserAction.UpdateMatchStats,
    {
      placeId,
    },
    match.players?.some((p) => p.confirmed && p.profile_id === profile?.id),
  ));
  if (!canUpdateMatchStats) {
    return {
      success: false,
      message: 'Non hai i permessi per aggiornare le statistiche',
    };
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from('profiles_matches')
    .update({ points })
    .eq('match_id', match.id)
    .eq('profile_id', profileId);
  if (error) throw error;

  await supabase
    .from('profiles_matches')
    .select('profile_id, points')
    .eq('match_id', match.id)
    .order('points', { ascending: false });

  revalidatePath(`/matches/${match.id}`);
  return { success: true, message: 'Punti aggiornati con successo' };
}

export async function createMatch(
  formData: FormData,
  minAllowedPlayers: number,
  maxAllowedPlayers: number,
): Promise<{ form: Match; errors: any }> {
  const name = formData.get('name') as string;
  const game_id = formData.get('game') as string;
  const place_id = formData.get('place') as string;
  const description = formData.get('description') as string;
  const startAt = formData.get('startAt') as string;
  const endAt = formData.get('endAt') as string;
  const min_players = Number(formData.get('min_players') ?? 0);
  const max_players = Number(formData.get('max_players') ?? 0);

  const form: Match = {
    name,
    game_id,
    place_id,
    description,
    startAt,
    endAt,
    min_players,
    max_players,
  };

  const validationResult = createMatchSchema(
    minAllowedPlayers,
    maxAllowedPlayers,
  ).safeParse(form);

  if (!validationResult.success) {
    return {
      form,
      errors: z.flattenError(validationResult.error).fieldErrors,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('matches')
    .insert([validationResult.data]);

  if (error) {
    console.error('Error creating match:', error);
    return { form, errors: null };
  } else {
    redirect('/matches');
  }
}
export async function editMatch(
  formData: FormData,
  matchId: string,
  minAllowedPlayers: number,
  maxAllowedPlayers: number,
): Promise<{ form: Match; errors: any }> {
  const name = formData.get('name') as string;
  const game_id = formData.get('game') as string;
  const place_id = formData.get('place') as string;
  const description = formData.get('description') as string;
  const startAt = formData.get('startAt') as string;
  const endAt = formData.get('endAt') as string;
  const min_players = Number(formData.get('min_players') ?? 0);
  const max_players = Number(formData.get('max_players') ?? 0);

  const form: Match = {
    name,
    game_id,
    place_id,
    description,
    startAt,
    endAt,
    min_players,
    max_players,
  };

  const validationResult = createMatchSchema(
    minAllowedPlayers,
    maxAllowedPlayers,
  ).safeParse(form);

  if (!validationResult.success) {
    return {
      form,
      errors: z.flattenError(validationResult.error).fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('matches')
    .update([validationResult.data])
    .eq('id', matchId);

  if (error) {
    console.error('Error updating match:', error);
    return { form, errors: null };
  } else {
    redirect(`/matches/${matchId}`);
  }
}

export async function addPlayer({
  profileId,
  match,
}: {
  profileId: string;
  match: Match;
}): Promise<{ success: boolean; message: string }> {
  try {
    const canUpdateMatches = !!(await canUser(UserAction.UpdateMatches, {
      placeId: match.place_id,
    }));
    if (!canUpdateMatches) {
      return {
        success: false,
        message: 'Non hai i permessi per aggiungere giocatori',
      };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from('profiles_matches')
      .insert([{ profile_id: profileId, match_id: match.id, confirmed: true }]);

    if (error) {
      console.error('Error creating profiles_matches:', error);
      throw error;
    }

    return { success: true, message: 'Giocatore aggiunto con successo' };
  } catch (err) {
    if (err && typeof err === 'object' && 'code' in err) {
      return {
        success: false,
        message: (err as { code: unknown }).code as string,
      };
    }
    return { success: false, message: err as string };
  }
}

export async function subscribeMatch({ match_id }: { match_id: string }) {
  const { profile } = await getAuthenticatedUserWithProfile();
  if (!profile) throw new Error('User not authenticated');
  const supabase = await createClient();
  const { error } = await supabase
    .from('profiles_matches')
    .insert([{ profile_id: profile.id, match_id }]);

  if (error) {
    console.error('Error creating profiles_matches:', error);
    throw error;
  }
  revalidatePath(`/matches/${match_id}`);
}
export async function unsubscribeMatch({ match_id }: { match_id: string }) {
  const { profile } = await getAuthenticatedUserWithProfile();
  if (!profile) throw new Error('User not authenticated');
  const supabase = await createClient();
  const { error } = await supabase
    .from('profiles_matches')
    .delete()
    .eq('profile_id', profile.id)
    .eq('match_id', match_id);

  if (error) {
    console.error('Error removing profiles_matches:', error);
    throw error;
  }
  revalidatePath(`/matches/${match_id}`);
}
