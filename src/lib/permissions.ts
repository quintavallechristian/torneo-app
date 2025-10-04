// lib/permissions.ts
//import { ROLE } from '@/types';

// export function canUser(
//   user: User,
//   action: UserAction,
//   context?: { placeId?: string },
// ) {
//   // Admin globale bypassa tutto
//   if (user.role === 'platform_admin') return true;

//   switch (action) {
//     case 'read:matches':
//       return true; // tutti possono leggere

//     case 'create:match':
//       if (!isFlagOn('can_create_match')) return false;

//       if (user.role === 'creator') return true;

//       if (user.role === 'place_admin' && context?.placeId) {
//         return user.places?.includes(context.placeId) ?? false;
//       }

//       return false;

//     case 'delete:match':
//       // Flag deve essere attivo
//       if (!isFlagOn('can_delete_match')) return false;

//       // Solo place_admin nel proprio place
//       if (user.role === 'place_admin' && context?.placeId) {
//         return user.places?.includes(context.placeId) ?? false;
//       }

//       return false;

//     case 'manage:platform':
//       return false; // riservato a platform_admin
//   }
// }
