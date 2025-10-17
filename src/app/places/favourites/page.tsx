import { createClient } from '@/utils/supabase/server';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import { Place } from '@/types';
import PlaceCard from '@/components/PlaceCard/PlaceCard';
import EmptyArea from '@/components/EmptyArea/EmptyArea';

export default async function PlacesPage() {
  const supabase = await createClient();
  const { profile } = await getAuthenticatedUserWithProfile();
  let placeData: Place[] = [];

  if (profile) {
    const { data: playerPlaces } = await supabase
      .from('profiles_places')
      .select('place_id')
      .eq('profile_id', profile?.id)
      .eq('favourite', true);

    const placeIds = playerPlaces?.map((p) => p.place_id) ?? [];

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

  return profile ? (
    <div className="max-w-[90%] mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-indigo-700 dark:text-indigo-400 text-center">
        Luoghi preferiti
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
        <EmptyArea
          title="Nessun luogo"
          message="Non hai ancora aggiunto luoghi ai preferiti."
        />
      )}
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center">
      <EmptyArea />
    </div>
  );
}
