'use server';
import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { decode } from 'html-entities';

import { ChevronLeft, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { parseStringPromise } from 'xml2js';
import { isBefore, subDays } from 'date-fns';
import Image from 'next/image';
import MatchCard from '@/components/MatchCard';
import SpotlightCard from '@/components/SpotlightCard';
import { Game, ROLE } from '@/types';
import {
  getAuthenticatedUserWithProfile,
  getGameStatsPerProfile,
} from '@/utils/auth-helpers';
import { getGame, updateGame } from './actions';

interface GameDetaisPageProps {
  params: Promise<{ id: string }>;
}

export default async function GameDetailsPage({ params }: GameDetaisPageProps) {
  const { id } = await params;
  const { profile, role } = await getAuthenticatedUserWithProfile();

  const res = await getGameStatsPerProfile(profile?.id || '', Number(id));
  console.log(res);

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
      <SpotlightCard spotlightColor="rgba(0, 229, 255, 0.2)">
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
              <CardTitle className="text-3xl font-bold text-primary mb-2 flex items-center gap-2">
                {game.name}
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
              <div className="max-h-40 overflow-y-auto bg-blue-200 rounded-lg p-3 border border-muted">
                {gameDescription ? (
                  <p className="whitespace-pre-line text-sm text-gray-700">
                    {gameDescription}
                  </p>
                ) : (
                  <p className="italic text-muted-foreground">
                    Descrizione non disponibile.
                  </p>
                )}
              </div>
            </CardContent>
          </div>
        </div>
      </SpotlightCard>
      <section className="mt-8">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-xl font-semibold">Partite collegate</h2>
          {role === ROLE.Admin && (
            <Link href={`/matches/new?game_id=${game.id}`}>
              <Button variant="outline" size="sm" data-testid="Add player">
                <PlusIcon className="inline h-6 w-6" />
              </Button>
            </Link>
          )}
        </div>
        {game.matches && game.matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {game.matches.map((match) => (
              <MatchCard small key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <p className="italic text-muted-foreground">
            Nessun partita collegato.
          </p>
        )}
      </section>
    </div>
  );
}
