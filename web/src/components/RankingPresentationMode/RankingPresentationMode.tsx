'use client';

import { PlaceStats } from '@/types';
import { useEffect, useState } from 'react';
import { XIcon, TrophyIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard';
import ProfileListItem from '../ProfileListItem/ProfileListItem';
import EmptyArea from '../EmptyArea/EmptyArea';
import StatsExagon from '../StatsExagon/StatsExagon';

interface RankingPresentationModeProps {
  placeName: string;
  ranking: PlaceStats[];
}

export default function RankingPresentationMode({
  placeName,
  ranking,
}: RankingPresentationModeProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(ranking.length / ITEMS_PER_PAGE);

  useEffect(() => {
    if (ranking.length === 0 || totalPages <= 1) return;

    const interval = setInterval(() => {
      setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
    }, 8000);

    return () => clearInterval(interval);
  }, [ranking.length, totalPages]);

  const handleExit = () => {
    router.back();
  };

  if (ranking.length === 0) {
    return (
      <div className="p-8">
        <EmptyArea
          className="w-full h-[70vh]"
          title="Nessun giocatore in classifica"
          message={`Non ci sono ancora giocatori in classifica. Gioca per essere il primo!`}
        />
        <Button
          onClick={handleExit}
          size="icon"
          className="absolute top-20 right-4 hover:bg-white/20 z-50 rounded-full"
        >
          <XIcon className="size-8" />
        </Button>
      </div>
    );
  }

  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, ranking.length);
  const currentRanking = ranking.slice(startIndex, endIndex);

  return (
    <div className="flex justify-center p-8 overflow-hidden min-h-screen">
      {/* Pulsante di uscita */}
      <Button
        onClick={handleExit}
        size="icon"
        className="absolute top-20 right-4 hover:bg-white/20 z-50 rounded-full"
      >
        <XIcon className="size-8" />
      </Button>

      {/* Contenuto principale con SpotlightCard */}
      <div className="w-full max-w-4xl z-30">
        <SpotlightCard className="px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <TrophyIcon className="h-10 w-10 text-amber-500" />
            <h1 className="text-4xl font-bold text-indigo-700 dark:text-indigo-400">
              Classifica - {placeName}
            </h1>
          </div>
          {/* Lista classificati */}
          <div className="space-y-2">
            {currentPage === 0 && ranking.length >= 3
              ? // Se prima pagina, mostra dal 4° in poi
                ranking
                  .slice(0, endIndex)
                  .map((player, index) => (
                    <ProfileListItem
                      key={player.id}
                      player={player}
                      index={startIndex + index + 1}
                      relevant={true}
                      StatsSlot={
                        <StatsExagon size="sm" stat={player.points || 0} />
                      }
                    />
                  ))
              : // Altre pagine o meno di 3 giocatori
                currentRanking.map((player, index) => (
                  <ProfileListItem
                    key={player.id}
                    player={player}
                    index={startIndex + index + 1}
                    relevant={true}
                    StatsSlot={
                      <StatsExagon size="sm" stat={player.points || 0} />
                    }
                  />
                ))}
          </div>

          {/* Info paginazione */}
          {totalPages > 1 && (
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Posizioni {startIndex + 1} - {endIndex} di {ranking.length}
            </div>
          )}
        </SpotlightCard>
      </div>

      {/* Indicatore di progresso */}
      {totalPages > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-40">
          {Array.from({ length: totalPages }).map((_, index) => (
            <div
              key={index}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentPage
                  ? 'w-12 bg-white'
                  : 'w-3 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
