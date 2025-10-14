import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';

export enum UserAction {
  ReadMatches = 'read:matches',
  CreateMatches = 'create:matches',
  DeleteMatches = 'delete:matches',
  UpdateMatches = 'update:matches',
  ReadPlaces = 'read:places',
  CreatePlaces = 'create:places',
  DeletePlaces = 'delete:places',
  UpdatePlaces = 'update:places',
  UpdateMatchStats = 'update:match_stats',
  ManagePlatform = 'manage:platform',
}

export enum ROLE {
  Admin = 'Admin',
  User = 'User',
  PlaceManager = 'PlaceManager',
  GameManager = 'GameManager',
}

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
    console.log(permissions, context, action);
    return (
      context?.placeId &&
      permissions?.some(
        (p) =>
          String(p.placeId) === String(context?.placeId) && p.action === action,
      )
    );
  }
  if (role === ROLE.GameManager) {
    console.log('gg');
    return (
      context?.gameId &&
      permissions?.some(
        (p) => p.gameId === context?.gameId && p.action === action,
      )
    );
  }
  console.log('ehd');
  return false;
}
