import SpotlightCard from '@/components/SpotlightCard';
import ClientMatchForm from '../ClientMatchForm';
import { createClient } from '@/utils/supabase/server';
import { Game } from '@/types';

type NewMatchPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Newmatch({ searchParams }: NewMatchPageProps) {
  const gameId =
    typeof searchParams?.game_id === 'string'
      ? searchParams.game_id
      : Array.isArray(searchParams?.game_id)
      ? searchParams?.game_id[0]
      : undefined;

  if (!gameId) {
    return <p>Parametro game_id mancante</p>;
  }

  const supabase = await createClient();
  const { data: game, error } = await supabase
    .from('games')
    .select('id, name, min_players, max_players')
    .eq('id', gameId)
    .single<Game>();

  if (error || !game) {
    console.error('Errore nel recupero del gioco:', error);
    return <p>Errore nel recupero del gioco</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <SpotlightCard
        className="shadow-xl border-2 border-indigo-200 bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800"
        spotlightColor="rgba(0, 229, 255, 0.2)"
      >
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-400 mb-2">
            Crea un nuovo partita
          </h1>
          <p className="text-gray-500 dark:text-gray-300">
            Compila i dettagli per organizzare una nuova competizione!
          </p>
        </div>
        <ClientMatchForm game={game} />
      </SpotlightCard>
    </div>
  );
}
