import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import ProfileCard from '@/components/ProfileCard/ProfileCard';
import MatchCard from '@/components/MatchCard/MatchCard';
import { createClient } from '@/utils/supabase/server';

export default async function PrivatePage() {
  const { user, profile } = await getAuthenticatedUserWithProfile();
  if (!user || !profile) {
    redirect('/login');
  }
  const supabase = await createClient();
  const { data: matches } = await supabase
    .from('matches')
    .select(
      `
      *,
      game:games(*),
      place:places(*),
      winner:profiles(*),
      profiles_matches!inner(profile_id)
    `,
    )
    .eq('profiles_matches.profile_id', profile.id);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6 flex items-center gap-2">
        <Link href="/matches">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Indietro
          </Button>
        </Link>
      </div>
      {profile && (
        <>
          <ProfileCard profile={profile} />
          <section className="mt-8">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-xl font-semibold">Partite</h2>
            </div>
            {matches && matches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matches.map((match) => (
                  <MatchCard key={match.id} match={match} small />
                ))}
              </div>
            ) : (
              <p className="italic text-muted-foreground">
                Nessun partita collegata.
              </p>
            )}
          </section>
        </>
      )}
    </div>
  );
}
