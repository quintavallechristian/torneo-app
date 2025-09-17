'use server'
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { decode } from "html-entities";

import { ChevronLeft, PencilIcon } from "lucide-react";
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { parseStringPromise } from 'xml2js';
import  { isBefore, subDays } from "date-fns";
import Image from "next/image";

export default async function GameDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  let game, error;
  if (!isNaN(Number(params.id))) {
    const result = await supabase
      .from('games')
      .select('*')
      .eq('id', params.id)
      .single();
    game = result.data;
    error = result.error;
  } else {
    const result = await supabase
      .from('games')
      .select('*')
      .eq('name', params.id)
      .single();
    game = result.data;
    error = result.error;
  }

  if (error) {
    console.error('Errore nel recupero del torneo:', error);
    return <p>Errore nel recupero del torneo</p>;
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
  let designer = game.designer;

  // Se la descrizione non esiste, la recuperiamo dall'API esterna e la salviamo nel database
  if (!updateAt || isBefore(updateAt, subDays(Date.now(), 30))) {
    console.log("again");
    try {
      // Nota: Per rendere il codice più robusto, dovresti anche gestire il caso
      // in cui game.bgg_id non esista.
      const response = await fetch(`https://boardgamegeek.com/xmlapi2/thing?id=${game.id}`);
      const xmlData = await response.text();
      
      const parsedData = await parseStringPromise(xmlData);

      gameDescription = parsedData?.items?.item?.[0].description?.[0] || '';
      image = parsedData?.items?.item?.[0].image?.[0] || '';
      thumbnail = parsedData?.items?.item?.[0].thumbnail?.[0] || '';
      min_players = parsedData?.items?.item?.[0].minplayers?.[0].$.value || 0;
      max_players = parsedData?.items?.item?.[0].maxplayers?.[0].$.value || 0;
      year_published = parsedData?.items?.item?.[0].yearpublished?.[0].$.value || null;
      min_playtime = parsedData?.items?.item?.[0].minplaytime?.[0].$.value || null;
      max_playtime = parsedData?.items?.item?.[0].maxplaytime?.[0].$.value || null;
      year_published = parsedData?.items?.item?.[0].yearpublished?.[0].$.value || null;
      designer = parsedData?.items?.item?.[0].link?.find((link: any) => link?.$.type === 'boardgamedesigner')?.$.value || null;

      gameDescription = decode(gameDescription.replace(/<br\s*\/?>/gi, "\n"));

      const { error: updateError } = await supabase
        .from('games')
        .update({ 
          description: gameDescription,
          min_players,
          image,
          thumbnail,
          year_published,
          designer,
          min_playtime,
          max_playtime,
          //updated_at: new Date(),
          })
        .eq('id', game.id);

      if (updateError) {
        console.error('Errore nell\'aggiornamento della descrizione:', updateError);
      }
    } catch (apiError) {
      console.error('Errore nel recupero della descrizione dall\'API:', apiError);
    }
  }

  return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-6 flex items-center gap-2">
          <Link href="/games">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Indietro
            </Button>
          </Link>
        </div>
        <Card className="shadow-xl border-2 border-muted bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <div className="flex flex-col md:flex-row gap-6 items-center p-6">
            <div className="flex-shrink-0">
              <Image
                src={image || game.image}
                alt={game.name}
                width={350}
                height={350}
                className="rounded-2xl shadow-lg object-cover border border-muted"
              />
            </div>
            <div className="flex-1 w-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-3xl font-bold text-primary mb-2 flex items-center gap-2">
                  {game.name}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {year_published ? `Anno: ${year_published}` : null} | {designer}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {min_players === max_players ? (
                  <div className="flex gap-2 mb-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Giocatori: {min_players}</span>
                  </div>
                ) : (
                  <div className="flex gap-2 mb-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Minimo giocatori: {min_players}</span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Massimo giocatori: {max_players}</span>
                  </div>
                )}
                {min_playtime === max_playtime ? (
                  <div className="flex gap-2 mb-2">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Durata: {min_playtime} minuti</span>
                  </div>
                ) : (
                  <div className="flex gap-2 mb-2">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Durata minima: {min_playtime} minuti</span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Durata massima: {max_playtime} minuti</span>
                  </div>
                )}
                <div className="max-h-40 overflow-y-auto bg-blue-200 rounded-lg p-3 border border-muted">
                  {gameDescription ? (
                    <p className="whitespace-pre-line text-sm text-gray-700">{gameDescription}</p>
                  ) : (
                    <p className="italic text-muted-foreground">Descrizione non disponibile.</p>
                  )}
                </div>
              </CardContent>
            </div>
          </div>
        </Card>
      </div>
  );
}