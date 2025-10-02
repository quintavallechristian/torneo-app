import { Match, MATCHSTATUS } from '@/types';

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

type Player = {
  id: string;
  rating: number;
  rank: number;
};

const K = 32;

/**
 * Calcola i nuovi punteggi Elo per una partita multiplayer stile BGA,
 * gestendo anche i pareggi.
 * @param players array di giocatori con id, rating e rank (1 = migliore)
 * @returns array con i nuovi rating
 */
export function updateElo(
  players: Player[],
): { id: string; newRating: number }[] {
  const results: { [id: string]: number } = {};

  // inizializza i risultati
  players.forEach((p) => (results[p.id] = 0));

  // confronta ogni coppia di giocatori
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      const A = players[i];
      const B = players[j];

      // aspettative (probabilità che A vinca contro B)
      const expectedA = 1 / (1 + Math.pow(10, (B.rating - A.rating) / 400));
      const expectedB = 1 - expectedA;

      // punteggi reali in base al rank
      let scoreA = 0.5;
      let scoreB = 0.5;

      if (A.rank < B.rank) {
        scoreA = 1;
        scoreB = 0;
      } else if (A.rank > B.rank) {
        scoreA = 0;
        scoreB = 1;
      }
      // se rank uguali → resta scoreA = 0.5 e scoreB = 0.5 (pareggio)

      // aggiorna i risultati accumulati
      results[A.id] += K * (scoreA - expectedA);
      results[B.id] += K * (scoreB - expectedB);
    }
  }

  // ritorna i nuovi rating
  return players.map((p) => ({
    id: p.id,
    newRating: Math.round(p.rating + results[p.id]),
  }));
}

// -----------------
// 🔹 Esempio d’uso
// -----------------
const players: Player[] = [
  { id: 'Alice', rating: 1600, rank: 1 },
  { id: 'Bob', rating: 1500, rank: 2 },
  { id: 'Carla', rating: 1400, rank: 2 },
  { id: 'Diego', rating: 1300, rank: 4 },
];

console.log(updateElo(players));
