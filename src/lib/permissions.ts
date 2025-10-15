import { ROLE, UserAction } from '@/types';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';

export async function canUser(
  action: UserAction,
  context?: {
    placeId?: string;
    gameId?: string;
  },
  forceTrue: boolean = false,
) {
  const { role, permissions } = await getAuthenticatedUserWithProfile();
  if (role === ROLE.Admin || forceTrue) return true;
  if (role === ROLE.PlaceManager) {
    return (
      context?.placeId &&
      permissions?.some(
        (p) =>
          String(p.placeId) === String(context?.placeId) && p.action === action,
      )
    );
  }
  if (role === ROLE.GameManager) {
    return (
      context?.gameId &&
      permissions?.some(
        (p) => p.gameId === context?.gameId && p.action === action,
      )
    );
  }
  return false;
}
