'use client';

import { Match, Player } from '@/types';
import { useEffect, useState } from 'react';
import { CalendarIcon, CrownIcon, DicesIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { formatMatchStatus, getMatchStatus } from '@/lib/client/match';
import { Badge } from '@/components/ui/badge';
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard';
import FlipCard from '@/components/FlipCard/FlipCard';
import ProfileListItem from '../ProfileListItem/ProfileListItem';
import Link from 'next/link';
import MyAvatar from '../MyAvatar/MyAvatar';
import { CardContent, CardHeader, CardTitle } from '../ui/card';
import QRCode from 'react-qr-code';
import ForbiddenArea from '../ForbiddenArea/ForbiddenArea';

const PUBLIC_URL = process.env.PUBLIC_URL || '';

interface PresentationModeProps {
  matches: Match[];
  placeName: string;
}

export default function PresentationMode({
  matches,
  placeName,
}: PresentationModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (matches.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % matches.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [matches.length]);

  const handleExit = () => {
    router.back();
  };

  if (matches.length === 0) {
    return (
      <div>
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-4">{placeName}</h1>
          <p className="text-3xl">Nessun match attivo al momento</p>
        </div>
        <Button
          onClick={handleExit}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-white hover:bg-white/20"
        >
          <XIcon className="h-8 w-8" />
        </Button>
      </div>
    );
  }

  const currentMatch = matches[0];
  const matchStatus = getMatchStatus(currentMatch);

  return (
    <div className="flex items-center justify-center p-8 overflow-hidden">
      {/* Pulsante di uscita */}
      <Button
        onClick={handleExit}
        variant="ghost"
        size="icon"
        className="absolute top-20 right-4 text-white hover:bg-white/20 z-50"
      >
        <XIcon className="h-8 w-8" />
      </Button>

      {/* Contenuto principale con SpotlightCard */}
      <div className="max-w-7xl w-full mt-10 z-30">
        <div className="grid grid-cols-3 gap-4">
          <SpotlightCard className="flex-1 px-0 py-0 col-span-2">
            <div className="flex justify-between items-center p-4 gap-2">
              <div className={`flex items-center gap-2 max-w-64 md:max-w-full`}>
                <DicesIcon className="h-5 w-5 text-amber-500 shrink-0" />
                <Link
                  href={`/games/${currentMatch.game?.id}`}
                  className={`font-bold text-amber-600 dark:text-amber-400 hover:underline truncate`}
                >
                  {currentMatch.game?.name ?? currentMatch.game_id}
                </Link>
              </div>
              {currentMatch.winner?.id ? (
                <div className="relative">
                  <div className="size-96 -right-52 -top-52 from-amber-200 opacity-20 bg-radial via-transparent to-transparent absolute"></div>
                  <div className="flex items-center gap-1">
                    <CrownIcon className="h-4 w-4 text-amber-500 -rotate-30 shrink-0" />
                    <span className="text-sm text-amber-500 truncate">
                      {currentMatch.winner.username}
                    </span>
                    <MyAvatar
                      className="size-5 text-xs"
                      isOwn={false}
                      image={currentMatch.winner?.image}
                      placeholder={currentMatch.winner?.username.charAt(0)}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <Badge
                    className={`md:block px-2 py-1 rounded-full${
                      formatMatchStatus(matchStatus).color
                    } `}
                  >
                    {formatMatchStatus(matchStatus).label}
                  </Badge>
                </>
              )}
            </div>
            <div
              className={`flex px-4 pb-6 text-base flex-col md:flex-row gap-4 items-center`}
            >
              {/* Immagine del gioco se disponibile */}
              {currentMatch.game?.image && (
                <FlipCard
                  imageSrc={currentMatch.game.image}
                  imageAlt={currentMatch.game.name}
                  size={300}
                  enableFlip={false}
                />
              )}
              <div>
                <CardHeader className="">
                  <CardTitle
                    className={
                      'text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-1 flex items-center gap-2'
                    }
                  >
                    <Link
                      href={`/matches/${currentMatch.id}`}
                      className="hover:underline"
                    >
                      {currentMatch.name}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 w-full">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="size-4 text-slate-500 shrink-0" />
                      <span className="text-xs text-slate-600 dark:text-slate-400 hover:underline">
                        Dal {currentMatch.startAt} al {currentMatch.endAt}
                      </span>
                    </div>
                  </div>

                  <div className="max-h-40 overflow-y-auto bg-blue-200 rounded-lg p-3 border border-muted text-sm text-gray-700">
                    {currentMatch.description
                      ? currentMatch.description
                      : 'Descrizione non disponibile'}
                  </div>
                  <QRCode
                    value={`${PUBLIC_URL}/matches/${currentMatch.id}`}
                    size={150}
                  />
                </CardContent>
              </div>
            </div>
          </SpotlightCard>
          {currentMatch.players && currentMatch.players.length > 0 ? (
            <SpotlightCard className="flex-1 col-span-1 pt-4">
              <h3
                className={
                  'text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-1 flex items-center gap-2'
                }
              >
                Risultati
              </h3>
              {currentMatch.players.map((playerObj: Player, index: number) => (
                <ProfileListItem
                  key={`${playerObj.profile?.id}-${index}`}
                  player={playerObj}
                  index={index + 1}
                  relevant={!!playerObj.confirmed}
                  isWinner={playerObj.profile?.id === currentMatch.winner?.id}
                />
              ))}
            </SpotlightCard>
          ) : (
            <ForbiddenArea
              title="Nessun giocatore presente"
              message="Scansiona il codice QR per iscriverti al match"
            />
          )}
        </div>
      </div>

      {/* Indicatore di progresso */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-40">
        {matches.map((_, index) => (
          <div
            key={index}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'w-12 bg-white'
                : 'w-3 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
