import {
  Game,
  GameStats,
  Location,
  LocationStats,
  Match,
  MATCHSTATUS,
  Player,
} from '@/types';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export function formatMatchStatus(status: MATCHSTATUS): {
  label: string;
  color: string;
} {
  switch (status) {
    case MATCHSTATUS.Scheduled:
      return {
        label: 'Programmata',
        color: 'bg-yellow-200 text-yellow-900',
      };
    case MATCHSTATUS.Ongoing:
      return {
        label: 'In corso',
        color: 'bg-green-200 text-green-900',
      };
    case MATCHSTATUS.Completed:
      return {
        label: 'Completata',
        color: 'bg-blue-200 text-blue-900',
      };
    case MATCHSTATUS.Canceled:
      return {
        label: 'Annullata',
        color: 'bg-red-200 text-red-900',
      };
    case MATCHSTATUS.WaitingForResults:
      return {
        label: 'In attesa di risultati',
        color: 'bg-purple-200 text-purple-900',
      };
    default:
      return {
        label: 'Annullata',
        color: 'bg-red-200 text-red-900',
      };
  }
}

export function getMatchStatus(match: Match) {
  const now = new Date();
  const startAt = new Date(match.startAt);
  const endAt = new Date(match.endAt);
  if (match.winner) {
    return MATCHSTATUS.Completed;
  }
  if (now < startAt) {
    return MATCHSTATUS.Scheduled;
  } else if (now >= startAt && now <= endAt) {
    return MATCHSTATUS.Ongoing;
  } else if (now > endAt) {
    return MATCHSTATUS.WaitingForResults;
  }
  return MATCHSTATUS.Canceled;
}

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
export async function updateLocationElo(
  players: Pick<Player, 'profile_id' | 'points'>[],
  location: Location,
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
    .from('profiles_locations')
    .select<'profile_id, points', LocationStats>('profile_id, points')
    .eq('location_id', location.id)
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
      location_id: location.id,
      points: newElo,
    };
  });
  console.log('Final ELO changes', rows);

  const { error } = await supabase.from('profiles_locations').upsert(rows, {
    onConflict: 'location_id,profile_id',
  });

  if (error) {
    console.error('Error updating ELOs', error);
  }
}

export async function setWinner({
  matchId,
  players,
  location,
  game,
  winnerId,
}: {
  matchId: string;
  players: Pick<Player, 'profile_id' | 'points'>[];
  location: Location;
  game: Game;
  winnerId?: string;
}) {
  'use server';
  const supabase = await createClient();
  const { error } = await supabase
    .from('matches')
    .update({ winner_id: winnerId || players[0].profile_id })
    .eq('id', matchId);
  if (error) throw error;
  updateGameElo(players, game);
  updateLocationElo(players, location);
  revalidatePath(`/matches/${matchId}`);
}

export async function updatePlayerPoints(formData: FormData) {
  'use server';
  const matchId = formData.get('matchId') as string;
  const playerId = formData.get('playerId');
  const points = formData.get('points');
  const supabase = await createClient();
  const { error } = await supabase
    .from('profiles_matches')
    .update({ points })
    .eq('match_id', matchId)
    .eq('profile_id', playerId);
  if (error) throw error;

  await supabase
    .from('profiles_matches')
    .select('profile_id, points')
    .eq('match_id', matchId)
    .order('points', { ascending: false });

  revalidatePath(`/matches/${matchId}`);
}
