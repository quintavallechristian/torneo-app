import { Match, MATCHSTATUS } from '@/types';
import { addHours, isToday } from 'date-fns';

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
    case MATCHSTATUS.Starting:
      return {
        label: 'In arrivo',
        color: 'bg-lime-200 text-lime-900',
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
  const twoHoursAfterStart = addHours(startAt, 2);

  if (match.winner_id || match.winner) {
    return MATCHSTATUS.Completed;
  } else if (now >= startAt && now < twoHoursAfterStart) {
    return MATCHSTATUS.Ongoing;
  } else if (isToday(startAt) && now < startAt) {
    return MATCHSTATUS.Starting;
  } else if (now < startAt) {
    return MATCHSTATUS.Scheduled;
  } else if (now >= twoHoursAfterStart) {
    return MATCHSTATUS.WaitingForResults;
  }
  return MATCHSTATUS.Canceled;
}
