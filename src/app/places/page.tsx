import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { Button } from '@/components/ui/button';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import { Place, ROLE } from '@/types';
import { UserAction } from '@/types';
import { canUser } from '@/lib/permissions';
import PlaceCard from '@/components/PlaceCard/PlaceCard';

export default async function PlacesPage() {
  const supabase = await createClient();
  const { profile, role } = await getAuthenticatedUserWithProfile();
  let placeData: Place[] = [];
  if (!profile) {
    const { data } = await supabase.from('places').select('*').limit(10);
    placeData = data ?? [];
  } else {
    const { data } = await supabase
      .from('places')
      .select(
        '*, placeStats:profiles_places(profile_id, favourite), matches(*)',
      )
      .eq('placeStats.profile_id', profile.id)
      .limit(100);
    placeData = data?.sort((a, b) => b.matches.length - a.matches.length) || [];
  }

  const canUpdatePlacesMap: Record<string, boolean> = {};
  if (profile) {
    await Promise.all(
      placeData.map(async (place) => {
        if (place.id) {
          canUpdatePlacesMap[place.id] =
            (await canUser(UserAction.ManagePlaces, {
              placeId: place.id,
            })) || false;
        }
      }),
    );
  }

  return (
    <div className="max-w-[90%] mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-indigo-700 dark:text-indigo-400 text-center">
        Luoghi
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
        <p className="italic text-muted-foreground text-center">
          Nessun luogo disponibile.
        </p>
      )}
      {role === ROLE.PlaceManager && (
        <div className="flex justify-center">
          <Button className="mt-4" asChild>
            <Link href="/places/new">Crea nuovo luogo</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
