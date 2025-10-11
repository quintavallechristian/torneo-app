import { ROLE, UserAction } from '@/types';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';

export async function canUser(
  action: UserAction,
  context?: { placeId?: string },
) {
  const { role, permissions } = await getAuthenticatedUserWithProfile();
  if (role === ROLE.Admin) return true;
  if (role === ROLE.Manager) {
    return permissions?.some(
      (p) => p.locationId === context?.placeId && p.action === action,
    );
  }
  return false;
}
