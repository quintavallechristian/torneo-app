import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/server';
import MatchCard from '@/components/MatchCard/MatchCard';
import GameCard from '@/components/GameCard/GameCard';
import PlaceCard from '@/components/PlaceCard/PlaceCard';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import { Game, GameStats, Match, Place, PlaceStats } from '@/types';
import {
  TrophyIcon,
  CalendarIcon,
  StarIcon,
  MapPinIcon,
  DicesIcon,
  ArrowRightIcon,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import StatsShowcase from '@/components/StatsShowcase/StatsShowcase';
import MyAvatar from '@/components/MyAvatar/MyAvatar';

export default async function HomePage() {
  const { profile } = await getAuthenticatedUserWithProfile();
  const supabase = await createClient();

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4 text-indigo-700 dark:text-indigo-400">
          Benvenuto nella tua app per partite!
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Accedi per visualizzare le tue statistiche, partite e preferiti
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/login">Accedi</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/signup">Registrati</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Fetch user's matches (upcoming and recent)
  const { data: myMatches } = await supabase
    .from('matches')
    .select(
      '*, game:games(*), place:places(*), winner:profiles(*), players:profiles_matches(*, profile:profiles(*))',
    )
    .eq('players.profile_id', profile.id)
    .order('startAt', { ascending: false })
    .limit(3);

  // Fetch favourite games
  const { data: favouriteGamesData } = await supabase
    .from('profiles_games')
    .select('*, game:games(*)')
    .eq('profile_id', profile.id)
    .eq('favourite', true)
    .limit(3);

  const favouriteGames =
    favouriteGamesData?.map((item) => ({
      game: item.game as Game,
      gameStats: item as GameStats,
    })) || [];

  // Fetch favourite places
  const { data: favouritePlacesData } = await supabase
    .from('profiles_places')
    .select('*, place:places(*, matches(*))')
    .eq('profile_id', profile.id)
    .eq('favourite', true)
    .limit(3);

  const favouritePlaces =
    favouritePlacesData?.map((item) => ({
      place: item.place as Place,
      placeStats: item as PlaceStats,
    })) || [];

  return (
    <div className="max-w-[90%] mx-auto py-10 px-4">
      <h1 className="flex gap-4 items-center font-bold mb-8 text-indigo-700 dark:text-indigo-400">
        <MyAvatar
          className="size-14 md:size-20 text-xs"
          isOwn={true}
          image={profile?.image}
          placeholder={profile?.username.charAt(0)}
        />
        <div className="text-2xl md:text-4xl">
          Benvenuto, {profile.username}!
        </div>
      </h1>

      {/* Sezione Statistiche */}
      <section className="mb-12">
        <div className="hidden md:block">
          <StatsShowcase size="xxl" />
        </div>
        <div className="block md:hidden">
          <StatsShowcase size="xl" />
        </div>
      </section>

      {/* Sezione Le Mie Partite */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300 flex items-center gap-2">
            <CalendarIcon className="h-6 w-6" />
            Le mie partite
          </h2>
          <Button variant="outline" asChild>
            <Link href="/matches/mine" className="flex items-center gap-2">
              Vedi tutte
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        {myMatches && myMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {myMatches.map((match) => (
              <MatchCard key={match.id} match={match as Match} small={true} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                Non hai ancora partecipato a nessuna partita
              </p>
              <Button asChild>
                <Link href="/matches">Esplora le partite</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Sezione I Miei Preferiti */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300 flex items-center gap-2">
            <StarIcon className="h-6 w-6" />I miei preferiti
          </h2>
        </div>

        {/* Giochi Preferiti */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-indigo-500 dark:text-indigo-200 flex items-center gap-2">
              <DicesIcon className="h-5 w-5" />
              Giochi
            </h3>
            <Button variant="ghost" size="sm" asChild>
              <Link
                href="/games/favourites"
                className="flex items-center gap-1"
              >
                Vedi tutti
                <ArrowRightIcon className="h-3 w-3" />
              </Link>
            </Button>
          </div>
          {favouriteGames && favouriteGames.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {favouriteGames.map((item) => (
                <GameCard
                  key={item.game.id}
                  game={item.game}
                  gameStats={item.gameStats}
                  small={true}
                  context="favourites"
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Nessun gioco preferito. Aggiungi i tuoi giochi preferiti dalle
                  pagine dei giochi!
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Luoghi Preferiti */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-indigo-500 dark:text-indigo-200 flex items-center gap-2">
              <MapPinIcon className="h-5 w-5" />
              Luoghi
            </h3>
            <Button variant="ghost" size="sm" asChild>
              <Link
                href="/places/favourites"
                className="flex items-center gap-1"
              >
                Vedi tutti
                <ArrowRightIcon className="h-3 w-3" />
              </Link>
            </Button>
          </div>
          {favouritePlaces && favouritePlaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {favouritePlaces.map((item) => (
                <PlaceCard
                  key={item.place.id}
                  place={item.place}
                  placeStats={item.placeStats}
                  small={true}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Nessun luogo preferito. Aggiungi i tuoi luoghi preferiti dalle
                  pagine dei luoghi!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
