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
        color:
          'bg-gradient-to-br from-yellow-200 to-yellow-600 text-yellow-900',
      };
    case MATCHSTATUS.Starting:
      return {
        label: 'In arrivo',
        color: 'bg-gradient-to-br from-lime-200 to-lime-600 text-lime-900',
      };
    case MATCHSTATUS.Ongoing:
      return {
        label: 'In corso',
        color: 'bg-gradient-to-br from-green-200 to-green-500 text-green-900',
      };
    case MATCHSTATUS.Completed:
      return {
        label: 'Completata',
        color: 'bg-gradient-to-br from-blue-200 to-blue-500 text-blue-900',
      };
    case MATCHSTATUS.Canceled:
      return {
        label: 'Annullata',
        color: 'bg-gradient-to-br from-red-200 to-red-500 text-red-900',
      };
    case MATCHSTATUS.WaitingForResults:
      return {
        label: 'In attesa di risultati',
        color:
          'bg-gradient-to-br from-purple-200 to-purple-400 text-purple-900',
      };
    case MATCHSTATUS.PendingConfirmation:
      return {
        label: 'In attesa di conferma',
        color:
          'bg-gradient-to-br from-purple-200 to-purple-400 text-purple-900',
      };
    default:
      return {
        label: 'Annullata',
        color: 'bg-gradient-to-br from-red-200 to-red-500 text-red-900',
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
    return match.pending_confirmation
      ? MATCHSTATUS.PendingConfirmation
      : MATCHSTATUS.WaitingForResults;
  }
  return MATCHSTATUS.Canceled;
}
