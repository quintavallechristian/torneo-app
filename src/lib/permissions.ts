import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';

export enum UserAction {
  ReadMatches = 'read:matches',
  CreateMatches = 'create:matches',
  DeleteMatches = 'delete:matches',
  UpdateMatches = 'update:matches',
  ReadPlaces = 'read:places',
  CreatePlacees = 'create:places',
  DeletePlacees = 'delete:places',
  UpdatePlacees = 'update:places',
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
    return (
      context?.placeId &&
      permissions?.some(
        (p) => p.placeId === context?.placeId && p.action === action,
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
