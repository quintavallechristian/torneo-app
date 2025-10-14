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
