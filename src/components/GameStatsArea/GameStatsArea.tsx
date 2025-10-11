import React from 'react';
import { Game } from '@/types';
import { LibraryBigIcon, SparklesIcon, StarIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import {
  setFavouriteGame,
  setInCollectionGame,
  setInWishlistGame,
} from '@/app/games/actions';

interface MatchCardProps {
  game: Game;
}

export default async function GameStatsArea({ game }: MatchCardProps) {
  return (
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
  );
}
