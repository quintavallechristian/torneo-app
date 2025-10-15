import {
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard';
import React from 'react';
import { Game, GameStats } from '@/types';
import Image from 'next/image';
import { Button } from '../ui/button';
import { PencilIcon } from 'lucide-react';
import { UserAction } from '@/types';
import { canUser } from '@/lib/permissions';
import Link from 'next/link';
import DeleteMatchButton from '../DeleteMatchButton/DeleteMatchButton';
import StatsCard from '../StatsCard/StatsCard';
import { updateGame } from '@/lib/server/game';
import ActionButtons from '../ActionButtons/ActionButtons';
import StatsExagon from '../StatsExagon/StatsExagon';

interface GameCardProps {
  game: Game;
  small: boolean;
  gameStats?: GameStats;
  positionInGame?: number;
  context?: 'favourites' | 'all' | 'in_collection' | 'in_wishlist';
}

export default async function GameCard({
  game,
  gameStats,
  small,
  positionInGame,
  context = 'all',
}: GameCardProps) {
  const canManageGames = await canUser(UserAction.ManageGames, {
    gameId: game.id,
  });
  const updatedGame = await updateGame(game);
  const avatarUrl = updatedGame?.image || '/placeholder.png';
  return (
    <SpotlightCard className="px-0 py-0">
      <div className="relative">
        <div
          className={`
            ${context === 'favourites' ? 'from-amber-300' : ''} 
            ${context === 'in_wishlist' ? 'from-sky-300' : ''} 
            ${context === 'in_collection' ? 'from-emerald-300' : ''} 
          size-96 -right-52 -top-52 opacity-20 bg-radial via-transparent to-transparent absolute`}
        ></div>
      </div>
      <div
        className={`flex flex-col md:flex-row p-4 ${
          small ? 'text-sm flex-row' : 'text-base flex-col md:flex-row gap-4'
        }`}
      >
        <div
          className={`flex-shrink-0 relative ${small ? 'size-24' : 'size-60'}`}
        >
          {updatedGame.bgg_rank && (
            <StatsExagon
              className={`text-sm absolute left-1/2 -translate-x-1/2 ${
                small ? 'size-8 -bottom-4' : 'size-14 -bottom-7'
              }`}
              small={small}
              stat={updatedGame.bgg_rank}
              label="POS"
              variant="amber"
            />
          )}
          <Image
            src={avatarUrl}
            alt={updatedGame?.name || 'Game image'}
            width={small ? 120 : 220}
            height={small ? 120 : 220}
            className={`rounded-2xl mx-auto shadow-lg object-cover border border-muted  dark:bg-emerald-800/20 bg-emerald-500 ${
              small ? 'size-24' : 'size-60'
            }`}
          />
          {!small && (
            <div className="space-x-8 md:space-x-4 space-y-2 flex gap-2 mt-2 justify-center">
              {updatedGame.bgg_rating && (
                <StatsExagon
                  className={`text-sm ${small ? 'size-10' : 'size-14'}`}
                  small={small}
                  stat={updatedGame.bgg_rating}
                  label="POS"
                  variant="red"
                />
              )}
              {updatedGame.bgg_weight && (
                <StatsExagon
                  className={`text-sm ${small ? 'size-10' : 'size-14'}`}
                  small={small}
                  stat={updatedGame.bgg_weight}
                  label="PESO"
                  variant="blue"
                />
              )}
            </div>
          )}
        </div>
        <div className="flex-1 w-full">
          <CardHeader className={`pb-2 pr-0`}>
            <CardTitle
              className={
                small
                  ? 'text-lg font-bold text-indigo-700 dark:text-indigo-400 mb-1 gap-2'
                  : 'text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-1 flex md:flex-row flex-col gap-2 justify-between'
              }
            >
              <Link
                href={`/games/${updatedGame.id}`}
                className="hover:underline line-clamp-2 h-14 md:line-clamp-none "
              >
                {updatedGame.name}
              </Link>
              <div className="-ml-2 z-10">
                <ActionButtons
                  game={game}
                  gameStats={gameStats}
                  context={context}
                />
              </div>
            </CardTitle>
            {!small && (
              <CardDescription className="text-muted-foreground line-clamp-2">
                {updatedGame.year_published
                  ? `Anno: ${updatedGame.year_published}`
                  : null}{' '}
                | {updatedGame.designer}
              </CardDescription>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {!small && (
              <>
                <div className="space-x-4 space-y-2">
                  {updatedGame.min_players === updatedGame.max_players ? (
                    <Badge className="bg-green-100 text-green-800">
                      Giocatori: {updatedGame.min_players}
                    </Badge>
                  ) : (
                    <>
                      <Badge className="bg-green-100 text-green-800">
                        Minimo giocatori: {updatedGame.min_players}
                      </Badge>
                      <Badge className="bg-red-100 text-red-800">
                        Massimo giocatori: {updatedGame.max_players}
                      </Badge>
                    </>
                  )}
                  {updatedGame.min_playtime === updatedGame.max_playtime ? (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      Durata: {updatedGame.min_playtime} min
                    </Badge>
                  ) : (
                    <>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Durata minima: {updatedGame.min_playtime} min
                      </Badge>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Durata massima: {updatedGame.max_playtime} min
                      </Badge>
                    </>
                  )}
                </div>
              </>
            )}
            {!small && (
              <div className="max-h-40 overflow-y-auto bg-blue-200 rounded-lg p-3 border border-muted text-sm text-gray-700">
                {updatedGame.description
                  ? updatedGame.description
                  : 'Descrizione non disponibile'}
              </div>
            )}
          </CardContent>
        </div>
      </div>
      {gameStats && !small && (
        <StatsCard stats={gameStats} position={positionInGame!} />
      )}
      {!small && canManageGames && (
        <CardFooter className="pb-4 flex flex-wrap gap-2 mt-4 justify-between">
          <Button className="cursor-pointer" variant="secondary">
            <PencilIcon className="inline mr-2 h-4 w-4" />
            <Link href={`/games/${updatedGame.id}/edit`}>Modifica</Link>
          </Button>
          {updatedGame.id && <DeleteMatchButton id={updatedGame.id} />}
        </CardFooter>
      )}
    </SpotlightCard>
  );
}
