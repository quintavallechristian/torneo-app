'use server';
import { Button } from '@/components/ui/button';

import { ChevronLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { GameStats } from '@/types';
import {
  getAuthenticatedUserWithProfile,
  getGameRanking,
  getGameStatsPerProfile,
} from '@/utils/auth-helpers';

import MatchList from '@/components/MatchList/MatchList';
import Ranking from '@/components/Ranking/Ranking';
import { getGame } from '@/lib/server/game';
import GameCard from '@/components/GameCard/GameCard';
import PlacesList from '@/components/PlacesList/PlacesList';
import { Badge } from '@/components/ui/badge';

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
  const { profile } = await getAuthenticatedUserWithProfile();

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
      <GameCard
        game={game}
        small={false}
        gameStats={gameStats}
        positionInGame={positionInGame}
      />
      <section className="mt-8">
        <Tabs defaultValue="matches">
          <TabsList>
            <TabsTrigger className="cursor-pointer" value="matches">
              Partite collegate
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="ranking">
              Classifica
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="places">
              Locali <Badge>{(game.gamePlaces || []).length}</Badge>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="matches" className="w-full">
            <MatchList matches={game.matches} gameId={game.id} />
          </TabsContent>
          <TabsContent value="ranking">
            <Ranking gameId={game.id} />
          </TabsContent>
          <TabsContent value="places">
            <PlacesList gameId={game.id} />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
