import { createClient } from '@/utils/supabase/server';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import { Place, ROLE, UserAction } from '@/types';
import PlaceCard from '@/components/PlaceCard/PlaceCard';
import ForbiddenArea from '@/components/ForbiddenArea/ForbiddenArea';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function PlacesPage() {
  const supabase = await createClient();
  const { profile, permissions, role } =
    await getAuthenticatedUserWithProfile();
  let placeData: Place[] = [];
  if (profile && role === ROLE.PlaceManager) {
    const placeIds =
      permissions
        ?.filter((p) => p.action === UserAction.ManagePlaces)
        .map((p) => p.placeId) ?? [];

    const { data } = await supabase
      .from('places')
      .select(
        `
    *,
    placeStats:profiles_places(profile_id, favourite), matches(*)
  `,
      )
      .in('id', placeIds)
      .eq('placeStats.profile_id', profile.id);
    placeData = data?.sort((a, b) => b.matches.length - a.matches.length) || [];
  }

  return profile && role === ROLE.PlaceManager ? (
    <div className="max-w-[90%] mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-indigo-700 dark:text-indigo-400 text-center">
        Luoghi gestiti
      </h1>
      {placeData && placeData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {placeData.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              placeStats={place.placeStats?.[0]}
              small={true}
            />
          ))}
        </div>
      ) : (
        <ForbiddenArea
          title="Nessun luogo"
          message="Non gestisci nessun luogo."
        />
      )}
      {role === ROLE.PlaceManager && (
        <div className="flex justify-center">
          <Button className="mt-4" asChild>
            <Link href="/places/new">Crea nuovo luogo</Link>
          </Button>
        </div>
      )}
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center">
      <ForbiddenArea />
    </div>
  );
}
