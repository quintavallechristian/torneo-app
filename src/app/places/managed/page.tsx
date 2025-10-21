import { createClient } from '@/utils/supabase/server';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import { Place, ROLE, SearchParams, UserAction } from '@/types';
import PlaceCard from '@/components/PlaceCard/PlaceCard';
import EmptyArea from '@/components/EmptyArea/EmptyArea';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SearchInput } from '@/components/SearchInput/SearchInput';
import { PlusIcon } from 'lucide-react';
import PlacesList from '@/components/PlacesList/PlacesList';

export default async function ManagedPlacesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q } = await searchParams;
  const query = q || '';
  const supabase = await createClient();
  const { profile, permissions, role } =
    await getAuthenticatedUserWithProfile();
  let placeData: Place[] = [];
  if (profile && (role === ROLE.PlaceManager || role === ROLE.Admin)) {
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

  return profile && (role === ROLE.PlaceManager || role === ROLE.Admin) ? (
    <div className="max-w-[90%] mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 text-center">
          Luoghi gestiti
        </h1>
        <div className="flex gap-2 items-center">
          <SearchInput defaultValue={query} placeholder="Cerca un luogo..." />
          {(role === ROLE.PlaceManager || role === ROLE.Admin) && (
            <Button variant="outline" size="lg" data-testid="Add Match">
              <Link href="/places/new">
                <PlusIcon className="h-6 w-6" />
              </Link>
            </Button>
          )}
        </div>
      </div>
      <PlacesList
        places={placeData}
        useGeolocation={true}
        gridCols="md:grid-cols-3"
        searchQuery={query}
      />
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center">
      <EmptyArea />
    </div>
  );
}
