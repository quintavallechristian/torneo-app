import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server';
import MatchCard from '@/components/MatchCard/MatchCard';
import { canUser } from '@/lib/permissions';
import { SearchParams, UserAction } from '@/types';
import EmptyArea from '@/components/EmptyArea/EmptyArea';
import { SearchInput } from '@/components/SearchInput/SearchInput';
import { PlusIcon } from 'lucide-react';

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q } = await searchParams;
  const query = q || '';
  const supabase = await createClient();
  const { data } = await supabase
    .from('matches')
    .select(
      '*, game:games(*), place:places(*), winner:profiles(*), players:profiles_matches(*, profile:profiles(*))',
    )
    .ilike('name', `%${query}%`);
  const canManagePlatform = await canUser(UserAction.ManagePlatform);
  return (
    <div className="max-w-[90%] mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 text-center">
          Tutti i giochi
        </h1>
        <div className="flex gap-2 items-center">
          <SearchInput
            defaultValue={query}
            placeholder="Cerca una partita..."
          />
          {canManagePlatform && (
            <Button variant="outline" size="lg" data-testid="Add Match">
              <Link href="/matches/new">
                <PlusIcon className="h-6 w-6" />
              </Link>
            </Button>
          )}
        </div>
      </div>
      {data && data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {data.map((match) => (
            <MatchCard key={match.id} match={match} small={true} />
          ))}
        </div>
      ) : (
        <EmptyArea
          title="Nessuna partita disponibile."
          message="Torna qui più tardi per vedere le partite attive"
        ></EmptyArea>
      )}
    </div>
  );
}
