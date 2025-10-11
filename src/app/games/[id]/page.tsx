'use server';
import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import {
  ChevronLeft,
  LibraryBigIcon,
  SparklesIcon,
  StarIcon,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import Image from 'next/image';
import MatchCard from '@/components/MatchCard/MatchCard';
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard';
import { GameStats, ROLE } from '@/types';
import {
  getAuthenticatedUserWithProfile,
  getGameRanking,
  getGameStatsPerProfile,
} from '@/utils/auth-helpers';
import { getGame, updateGame } from './actions';
import {
  setFavouriteGame,
  setInCollectionGame,
  setInWishlistGame,
} from '../actions';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import MatchList from '@/components/MatchList/MatchList';
import Ranking from '@/components/Ranking/Ranking';

interface GameDetaisPageProps {
  params: Promise<{ id: string }>;
}

function getPositionInGame(profileId: string, gameRanking: GameStats[]) {
  let positionInGame = -1;
  if (gameRanking.length !== 0) {
    const position = gameRanking.findIndex((gs) => gs.profile_id === profileId);
    if (position !== -1) {
      positionInGame = position + 1;
    }
  }
  return positionInGame;
}

export default async function GameDetailsPage({ params }: GameDetaisPageProps) {
  const { id } = await params;
  const { profile, role } = await getAuthenticatedUserWithProfile();

  // Get game stats for this user and game
  const gameStats = await getGameStatsPerProfile(profile?.id || '', Number(id));
  const gameRanking = await getGameRanking(Number(id));
  let positionInGame = -1;
  if (profile && profile.id) {
    positionInGame = getPositionInGame(profile.id, gameRanking);
  }

  const { game, error } = await getGame(id);

  if (error || !game) {
    console.error('Errore nel recupero del partita:', error);
    return <p>Errore nel recupero del partita</p>;
  }

  const {
    gameDescription,
    image,
    min_players,
    max_players,
    min_playtime,
    max_playtime,
    year_published,
    designer,
    bgg_rating,
    bgg_weight,
    bgg_rank,
  } = await updateGame(game);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6 flex items-center gap-2">
        <Link href="/games">
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
      <SpotlightCard>
        {gameStats && (
          <SpotlightCard className="px-4 py-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold">Le tue statistiche</div>
                <div className="flex flex-wrap gap-4 mt-2">
                  <Badge className="bg-green-200 text-green-900">
                    Vittorie: {gameStats.win}
                  </Badge>
                  <Badge className="bg-red-200 text-red-900">
                    Sconfitte: {gameStats.loss}
                  </Badge>
                  <Badge className="bg-yellow-200 text-yellow-900">
                    Pareggi: {gameStats.draw}
                  </Badge>
                  <Badge className="bg-purple-200 text-purple-900">
                    Minuti giocati: {gameStats.minutes_played}
                  </Badge>
                </div>
              </div>
              <div className="text-lg font-medium text-right">
                <div>ELO: {gameStats.points}</div>
                <div>Pos: {positionInGame}</div>
              </div>
            </div>
          </SpotlightCard>
        )}
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-shrink-0">
            {image && (
              <Image
                src={image}
                alt={game.name}
                width={250}
                height={250}
                className="rounded-2xl shadow-lg object-cover border border-muted"
              />
            )}
          </div>
          <div className="flex-1 w-full">
            <CardHeader className="pb-8">
              <CardTitle className="text-3xl font-bold text-primary mb-2 items-center gap-2 flex justify-between">
                <div>{game.name}</div>
                <div className="flex gap-2 items-center mt-1.5 ml-auto">
                  <form
                    action={setFavouriteGame.bind(null, {
                      gameId: game.id!,
                      status: !game.gameStats[0]?.favourite,
                    })}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="hover:scale-110" type="submit">
                          <StarIcon
                            className={`size-6  ${
                              game.gameStats[0]?.favourite
                                ? 'text-amber-300 hover:text-gray-600'
                                : 'text-gray-400'
                            }`}
                          />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Aggiungi ai preferiti</p>
                      </TooltipContent>
                    </Tooltip>
                  </form>
                  <form
                    action={setInCollectionGame.bind(null, {
                      gameId: game.id!,
                      status: !game.gameStats[0]?.in_collection,
                    })}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="hover:scale-110" type="submit">
                          <LibraryBigIcon
                            className={`size-6  ${
                              game.gameStats[0]?.in_collection
                                ? 'text-emerald-300 hover:text-gray-600'
                                : 'text-gray-400'
                            }`}
                          />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Aggiungi alla collezione</p>
                      </TooltipContent>
                    </Tooltip>
                  </form>
                  <form
                    action={setInWishlistGame.bind(null, {
                      gameId: game.id!,
                      status: !game.gameStats[0]?.in_wishlist,
                    })}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="hover:scale-110" type="submit">
                          <SparklesIcon
                            className={`size-6  ${
                              game.gameStats[0]?.in_wishlist
                                ? 'text-sky-300 hover:text-gray-600'
                                : 'text-gray-400'
                            }`}
                          />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Aggiungi alla wishlist</p>
                      </TooltipContent>
                    </Tooltip>
                  </form>
                </div>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {year_published ? `Anno: ${year_published}` : null} | {designer}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-x-4 space-y-2">
                {min_players === max_players ? (
                  <Badge className="bg-green-100 text-green-800">
                    Giocatori: {min_players}
                  </Badge>
                ) : (
                  <>
                    <Badge className="bg-green-100 text-green-800">
                      Minimo giocatori: {min_players}
                    </Badge>
                    <Badge className="bg-red-100 text-red-800">
                      Massimo giocatori: {max_players}
                    </Badge>
                  </>
                )}
                {min_playtime === max_playtime ? (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    Durata: {min_playtime} min
                  </Badge>
                ) : (
                  <>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      Durata minima: {min_playtime} min
                    </Badge>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      Durata massima: {max_playtime} min
                    </Badge>
                  </>
                )}
                {/* BGG Stats */}

                {bgg_rating && (
                  <Badge className="bg-cyan-100 text-cyan-800">
                    BGG Rating: {bgg_rating}
                  </Badge>
                )}
                {bgg_rank && (
                  <Badge className="bg-orange-100 text-orange-800">
                    BGG Rank: {bgg_rank}
                  </Badge>
                )}
                {bgg_weight && (
                  <Badge className="bg-fuchsia-100 text-fuchsia-800">
                    BGG Weight: {bgg_weight}
                  </Badge>
                )}
              </div>
              <div className="max-h-40 overflow-y-auto bg-blue-200 rounded-lg p-3 border border-muted text-sm text-gray-700">
                {gameDescription
                  ? gameDescription
                  : 'Descrizione non disponibile'}
              </div>
            </CardContent>
          </div>
        </div>
      </SpotlightCard>
      <section className="mt-8">
        <Tabs defaultValue="matches">
          <TabsList>
            <TabsTrigger value="matches">Partite collegate</TabsTrigger>
            <TabsTrigger value="ranking">Classifica</TabsTrigger>
          </TabsList>
          <TabsContent value="matches" className="w-full">
            <MatchList matches={game.matches} gameId={game.id} />
          </TabsContent>
          <TabsContent value="ranking">
            <Ranking gameId={game.id} />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
