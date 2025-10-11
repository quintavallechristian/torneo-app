import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard';
import { Button } from '@/components/ui/button';
import { setFavouriteLocation } from './actions';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import { StarIcon } from 'lucide-react';
import { Location } from '@/types';

export default async function PlacesPage() {
  const supabase = await createClient();
  const { profile } = await getAuthenticatedUserWithProfile();
  let locationData: Location[] = [];
  if (!profile) {
    const { data } = await supabase.from('locations').select('*').limit(10);
    locationData = data ?? [];
  } else {
    const { data } = await supabase
      .from('locations')
      .select('*, locationStats:profiles_locations(profile_id, favourite)')
      .eq('locationStats.profile_id', profile.id)
      .limit(10);
    locationData = data ?? [];
  }
  return (
    <div className="max-w-2xl align-center mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Luoghi</h1>

      <div className="border-0 py-0 px-0">
        {locationData?.map((location) => (
          <SpotlightCard
            key={location.id}
            className="flex justify-between items-center gap-4 my-2 px-2 py-2 shadow-xl  bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800"
            spotlightColor="rgba(0, 229, 255, 0.2)"
          >
            <div className="flex items-center gap-4">
              <Image
                src={location.image || '/placeholder.png'}
                alt={location.name}
                width={64}
                height={64}
                className="rounded-2xl border-1 w-16 h-16 object-cover dark:bg-emerald-800/20 bg-emerald-500"
              />
              <div>
                <Link href={`/places/${location.id}`}>{location.name}</Link>
                {location.address && (
                  <p className="text-xs text-muted-foreground">
                    {location.address}
                  </p>
                )}
              </div>
            </div>
            <div>
              <form
                action={setFavouriteLocation.bind(null, {
                  locationId: location.id!,
                  status: !location.locationStats[0]?.favourite,
                })}
              >
                <Button
                  variant="link"
                  className="hover:scale-110"
                  type="submit"
                >
                  <StarIcon
                    className={`size-6  ${
                      location.locationStats[0]?.favourite
                        ? 'text-amber-300 hover:text-gray-600'
                        : 'text-gray-400'
                    }`}
                  />
                </Button>
              </form>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
}
