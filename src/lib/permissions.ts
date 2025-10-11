import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';

export enum UserAction {
  ReadMatches = 'read:matches',
  CreateMatches = 'create:matches',
  DeleteMatches = 'delete:matches',
  UpdateMatches = 'update:matches',
  ReadLocations = 'read:locations',
  CreateLocationes = 'create:locations',
  DeleteLocationes = 'delete:locations',
  UpdateLocationes = 'update:locations',
  UpdateMatchStats = 'update:match_stats',
  ManagePlatform = 'manage:platform',
}

export enum ROLE {
  Admin = 'Admin',
  User = 'User',
  Manager = 'Manager',
}

export async function canUser(
  action: UserAction,
  context?: {
    locationId?: string;
    gameId?: string;
  },
  forceTrue: boolean = false,
) {
  const { role, permissions } = await getAuthenticatedUserWithProfile();
  if (role === ROLE.Admin || forceTrue) return true;
  if (role === ROLE.Manager) {
    return (
      (context?.locationId &&
        permissions?.some(
          (p) => p.locationId === context?.locationId && p.action === action,
        )) ||
      (context?.gameId &&
        permissions?.some(
          (p) => p.gameId === context?.gameId && p.action === action,
        ))
    );
  }
  return false;
}
