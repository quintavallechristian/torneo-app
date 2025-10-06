// lib/permissions.ts
// import { Profile, ROLE } from '@/types';

// export function canUser(
//   profile: Profile,
//   action: UserAction,
//   context?: { placeId?: string },
// ) {
//   if (profile.role === ROLE.Admin) return true;

//   switch (action) {
//     case 'read:matches':
//       return true; // tutti possono leggere

//     case 'create:match':
//       if (
//         [
//           ROLE.Admin,
//           ROLE.Moderator,
//           ROLE.PlaceAdmin,
//           ROLE.PlaceModerator,
//         ].includes(profile.role)
//       )
//         return true;

//       if (profile.role === ROLE.PlaceAdmin && context?.placeId) {
//         return profile.places?.includes(context.placeId) ?? false;
//       }

//       return false;

//     case 'delete:match':
//       // Solo place_admin nel proprio place
//       if (profile.role === 'place_admin' && context?.placeId) {
//         return profile.places?.includes(context.placeId) ?? false;
//       }

//       return false;

//     case 'manage:platform':
//       return false; // riservato a platform_admin
//   }
// }
