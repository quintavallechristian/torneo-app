import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import SpotlightCard from '@/components/SpotlightCard';

export default async function PlacesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('locations').select('*').limit(10);
  return (
    <div className="max-w-2xl align-center mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Luoghi</h1>

      <div className="border-0 py-0 px-0">
        {data?.map((location) => (
          <Link href={`/places/${location.id}`} key={location.id}>
            <SpotlightCard
              className="flex items-center gap-4 my-2 px-2 py-2 shadow-xl  bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800"
              spotlightColor="rgba(0, 229, 255, 0.2)"
            >
              <div>
                <Image
                  src={location.image || '/placeholder.png'}
                  alt={location.name}
                  width={64}
                  height={64}
                  className="rounded-2xl border-1 w-16 h-16 object-cover"
                />
              </div>
              <div>{location.name}</div>
              <div className="text-right ml-auto">
                {location.bgg_rating && (
                  <span className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full text-xs font-medium">
                    {location.bgg_rating}
                  </span>
                )}
              </div>
            </SpotlightCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
