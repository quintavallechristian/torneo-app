import SpotlightCard from '@/components/SpotlightCard/SpotlightCard';
import ClientMatchForm from '../ClientMatchForm';
import { createClient } from '@/utils/supabase/server';
import { Game, Place } from '@/types';
import { getPlaceDetails } from '@/lib/server/place';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function NewMatch({ searchParams }: any) {
  const supabase = await createClient();
  const { game_id, place_id } = await searchParams;

  const gameId =
    typeof game_id === 'string'
      ? game_id
      : Array.isArray(game_id)
      ? searchParams?.game_id[0]
      : undefined;

  const placeId =
    typeof place_id === 'string'
      ? place_id
      : Array.isArray(place_id)
      ? place_id[0]
      : undefined;

  let game: Game | undefined = undefined;
  if (gameId) {
    const { data: gameData, error } = await supabase
      .from('games')
      .select('id, name, min_players, max_players')
      .eq('id', gameId)
      .single<Game>();

    if (error || !gameData) {
      console.error('Errore nel recupero del gioco:', error);
      return <p>Errore nel recupero del gioco</p>;
    }
    game = gameData;
  }

  let place: Place | null = null;
  if (placeId) {
    place = (await getPlaceDetails('id', placeId)).data;
    if (!place) {
      return <p>Errore nel recupero del luogo</p>;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <SpotlightCard
        className=" border-2  bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800"
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
        <ClientMatchForm game={game} place={place} />
      </SpotlightCard>
    </div>
  );
}
