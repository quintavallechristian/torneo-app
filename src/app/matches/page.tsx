import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server';
import SpotlightCard from '@/components/SpotlightCard';
import Image from 'next/image';

export default async function matchesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('matches').select('*, game:games(*)');
  return (
    <div className="max-w-[90%] mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-indigo-700 dark:text-indigo-400 text-center">
        Partite
      </h1>
      {data && data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {data.map((match) => (
            <Link key={match.id} href={`/matches/${match.id}`}>
              <SpotlightCard
                className="px-4 py-4 flex gap-4 h-32 shadow-xl border-2 border-indigo-200 bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800"
                spotlightColor="rgba(0, 229, 255, 0.2)"
              >
                <Image
                  src={match.game.image || '/placeholder.png'}
                  alt={match.game.name}
                  width={100}
                  height={100}
                  className="rounded-2xl border-1 object-cover"
                />
                <div className="space-y-2">
                  <div className="text-xl font-bold text-indigo-700 dark:text-indigo-400 mb-2">
                    {match.name}
                  </div>
                  <div className="text-muted-foreground truncate w-60">
                    Gioco:{' '}
                    <span className="font-semibold">{match.game.name}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        Da{' '}
                        {match.startAt
                          ? new Date(match.startAt).toLocaleDateString()
                          : 'N/A'}{' '}
                        a{' '}
                        {match.endAt
                          ? new Date(match.endAt).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </Link>
          ))}
        </div>
      ) : (
        <p className="italic text-muted-foreground text-center">
          Nessun partita disponibile.
        </p>
      )}
      <div className="flex justify-center">
        <Button className="mt-4" asChild>
          <Link href="/matches/new">Crea nuovo partita</Link>
        </Button>
      </div>
    </div>
  );
}
