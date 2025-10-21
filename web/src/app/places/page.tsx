import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import { ROLE, SearchParams } from '@/types';
import { getPlaces } from '@/lib/server/place';
import PlacesList from '@/components/PlacesList/PlacesList';
import { PlusIcon } from 'lucide-react';
import { SearchInput } from '@/components/SearchInput/SearchInput';

export default async function PlacesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q } = await searchParams;
  const query = q || '';
  const { profile, role } = await getAuthenticatedUserWithProfile();
  let placeData = [];
  if (!profile) {
    placeData = (await getPlaces(true)).data ?? [];
  } else {
    placeData = (await getPlaces(true, true)).data ?? [];
  }

  return (
    <div className="max-w-[90%] mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 text-center">
          Tutti i luoghi
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
  );
}
