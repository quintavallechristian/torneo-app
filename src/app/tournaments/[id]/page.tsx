'use server'
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { ChevronLeft, PencilIcon } from "lucide-react";
import Link from 'next/link';
import DeleteTournamentButton from '@/components/DeleteTournamentButton';
import { createClient } from '@/utils/supabase/server'
import Image from "next/image";
import SpotlightCard from "@/components/SpotlightCard";


export default async function TournamentDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: tournament, error } = await supabase
    .from('tournaments')
    .select(`
      *,
      game:games(*)
    `)
    .eq('id', params.id)
    .single();

  if (error) {
    console.error('Errore nel recupero del torneo:', error);
    return <p>Errore nel recupero del torneo</p>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6 flex items-center gap-2">
        <Link href="/tournaments">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Indietro
          </Button>
        </Link>
      </div>
      {tournament ? (
        <SpotlightCard className="shadow-xl border-2 border-indigo-200 bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800" spotlightColor="rgba(0, 229, 255, 0.2)">
          <div className="flex flex-col md:flex-row gap-6 items-center p-6">
            {/* Immagine del gioco se disponibile */}
            {tournament.game?.image && (
              <div className="flex-shrink-0">
                <Image
                  src={tournament.game.image}
                  alt={tournament.game.name}
                  width={220}
                  height={220}
                  className="rounded-2xl shadow-lg object-cover border border-muted"
                />
              </div>
            )}
            <div className="flex-1 w-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-2 flex items-center gap-2">
                  {tournament.name}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Gioco: <Link href={`/games/${tournament.game?.id}`} className="font-semibold">{tournament.game?.name ?? tournament.game_id}</Link>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    Inizio: {tournament.startAt}
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                    Fine: {tournament.endAt}
                  </span>
                </div>
                <div className="max-h-40 overflow-y-auto bg-indigo-100 rounded-lg p-3 border border-muted">
                  {tournament.description ? (
                    <p className="whitespace-pre-line text-sm text-gray-700">{tournament.description}</p>
                  ) : (
                    <p className="italic text-muted-foreground">Descrizione non disponibile.</p>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button className="cursor-pointer" variant="secondary">
                    <PencilIcon className="inline mr-2 h-4 w-4" />
                    <Link href={`/tournaments/${tournament.id}/edit`}>Modifica</Link>
                  </Button>
                  <DeleteTournamentButton id={tournament.id} />
                </div>
              </CardContent>
            </div>
          </div>
        </SpotlightCard>
      ) : (
        <p>Torneo non trovato</p>
      )}
    </div>
  );
}