'use server';

import SpotlightCard from '@/components/SpotlightCard/SpotlightCard';
import ClientMatchForm from '../../ClientMatchForm';
import { createClient } from '@/utils/supabase/server';
import { Match, UserAction } from '@/types';
import { canUser } from '@/lib/permissions';
import EmptyArea from '@/components/EmptyArea/EmptyArea';

interface MatchEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function MatchEditPage({ params }: MatchEditPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: match, error } = await supabase
    .from('matches')
    .select(
      '*, game:games(id, name, min_players, max_players), place:places(id, name)',
    )
    .eq('id', id)
    .single<Match>();

  if (error) {
    console.error('Errore nel recupero del partita:', error);
    return <p>Errore nel recupero del partita</p>;
  }
  const canManagePlaces = !!(await canUser(UserAction.ManagePlaces, {
    placeId: match?.place_id,
  }));
  if (!canManagePlaces) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyArea />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center mt-4">
      <SpotlightCard
        className=" border-2  bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800"
        spotlightColor="rgba(0, 229, 255, 0.2)"
      >
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-400 mb-2">
            Modifica partita
          </h1>
          <p className="text-gray-500 dark:text-gray-300">
            Compila i dettagli per organizzare una nuova competizione!
          </p>
        </div>
        <ClientMatchForm match={match} />
      </SpotlightCard>
    </div>
  );
}
