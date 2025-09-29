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
import SpotlightCard from '@/components/SpotlightCard';
import { Game, ROLE } from '@/types';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';

interface GameDetaisPageProps {
  params: Promise<{ id: string }>;
}

export default async function GameDetailsPage({ params }: GameDetaisPageProps) {
  const { id } = await params;
  const { role } = await getAuthenticatedUserWithProfile();
  const supabase = await createClient();
  let game, error;
  if (!isNaN(Number(id))) {
    const result = await supabase
      .from('games')
      .select('*, matches:matches(*)')
      .eq('id', id)
      .single<Game>();
    game = result.data;
    error = result.error;
  } else {
    const result = await supabase
      .from('games')
      .select('*')
      .eq('name', id)
      .single<Game>();
    game = result.data;
    error = result.error;
  }

  if (error || !game) {
    console.error('Errore nel recupero del partita:', error);
    return <p>Errore nel recupero del partita</p>;
  }

  const updateAt = game.updated_at;
  let gameDescription = decode(game.description);
  let image = game.image;
  let thumbnail = game.thumbnail;
  let min_players = game.min_players;
  let max_players = game.max_players;
  let min_playtime = game.min_playtime;
  let max_playtime = game.max_playtime;
  let year_published = game.year_published;
  let age = game.age;
  let designer = game.designer;
  let bgg_rating = game.bgg_rating;
  let bgg_weight = game.bgg_weight;
  let bgg_rank = game.bgg_rank;

  // Se la descrizione non esiste, la recuperiamo dall'API esterna e la salviamo nel database
  if (!updateAt || isBefore(updateAt, subDays(Date.now(), 30))) {
    try {
      // Nota: Per rendere il codice più robusto, dovresti anche gestire il caso
      // in cui game.bgg_id non esista.
      const response = await fetch(
        `https://boardgamegeek.com/xmlapi2/thing?id=${game.id}&stats=1`,
      );
      const xmlData = await response.text();

      const parsedData = await parseStringPromise(xmlData);

      gameDescription = parsedData?.items?.item?.[0].description?.[0] || '';
      image = parsedData?.items?.item?.[0].image?.[0] || '';
      thumbnail = parsedData?.items?.item?.[0].thumbnail?.[0] || '';
      min_players = parsedData?.items?.item?.[0].minplayers?.[0].$.value || 0;
      max_players = parsedData?.items?.item?.[0].maxplayers?.[0].$.value || 0;
      min_playtime =
        parsedData?.items?.item?.[0].minplaytime?.[0].$.value || null;
      max_playtime =
        parsedData?.items?.item?.[0].maxplaytime?.[0].$.value || null;
      year_published =
        parsedData?.items?.item?.[0].yearpublished?.[0].$.value || null;
      age = parsedData?.items?.item?.[0].minage?.[0].$.value || null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      designer =
        parsedData?.items?.item?.[0].link
          ?.filter((link: any) => link?.$.type === 'boardgamedesigner')
          ?.map((link: any) => link?.$.value)
          .join(', ') || null;

      bgg_rating = parsedData?.items?.item?.[0]?.statistics?.[0]?.ratings?.[0]
        ?.average?.[0].$.value
        ? Math.round(
            parseFloat(
              parsedData.items.item[0].statistics[0].ratings[0].average[0].$
                .value,
            ) * 100,
          ) / 100
        : null;

      bgg_weight = parsedData?.items?.item?.[0]?.statistics?.[0]?.ratings?.[0]
        ?.averageweight?.[0].$.value
        ? Math.round(
            parseFloat(
              parsedData.items.item[0].statistics[0].ratings[0].averageweight[0]
                .$.value,
            ) * 100,
          ) / 100
        : null;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      bgg_rank =
        parsedData?.items?.item?.[0]?.statistics?.[0]?.ratings?.[0]?.ranks?.[0].rank.find(
          (r: any) => r?.$.name === 'boardgame',
        )?.$.value || null;

      gameDescription = decode(gameDescription.replace(/<br\s*\/?>/gi, '\n'));

      const { error: updateError } = await supabase
        .from('games')
        .update({
          description: gameDescription,
          min_players,
          max_players,
          image,
          thumbnail,
          year_published,
          designer,
          min_playtime,
          max_playtime,
          age,
          bgg_rating,
          bgg_weight,
          bgg_rank,
          //updated_at: new Date(),
        })
        .eq('id', game.id);

      if (updateError) {
        console.error(
          "Errore nell'aggiornamento della descrizione:",
          updateError,
        );
      }
    } catch (apiError) {
      console.error(
        "Errore nel recupero della descrizione dall'API:",
        apiError,
      );
    }
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
            {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              game.matches.map((match: any) => (
                <Link
                  key={match.id}
                  href={`/matches/${match.id}`}
                  className="no-underline"
                >
                  <SpotlightCard>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl font-bold text-indigo-700 dark:text-indigo-400 mb-2">
                        {match.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex gap-2 mb-2">
                        <Badge className="bg-blue-100 text-blue-800">
                          Inizio:{' '}
                          {match.startAt
                            ? new Date(match.startAt).toLocaleDateString()
                            : 'N/A'}
                        </Badge>
                        <Badge className="bg-purple-100 text-purple-800">
                          Fine:{' '}
                          {match.endAt
                            ? new Date(match.endAt).toLocaleDateString()
                            : 'N/A'}
                        </Badge>
                      </div>
                      <div className="max-h-24 overflow-y-auto bg-indigo-100 rounded-lg p-2 border border-muted">
                        {match.description ? (
                          <p className="whitespace-pre-line text-sm text-gray-700">
                            {match.description}
                          </p>
                        ) : (
                          <p className="italic text-muted-foreground">
                            Descrizione non disponibile.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </SpotlightCard>
                </Link>
              ))
            }
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
