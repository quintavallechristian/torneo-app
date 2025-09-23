'use server'
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { ChevronLeft, PencilIcon } from "lucide-react";
import Link from 'next/link';
import DeleteMatchButton from '@/components/DeleteMatchButton';
import { createClient } from '@/utils/supabase/server'
import Image from "next/image";
import SpotlightCard from "@/components/SpotlightCard";
import { Match, Player, ROLE } from "@/types";
import { getAuthenticatedUserWithProfile } from "@/utils/auth-helpers";
import { AddPlayerModal } from "@/components/AddPlayerModal/AddPlayerModal";


export default async function matchDetailsPage({ params }: { params: { id: string } }) {
  const { role } = await getAuthenticatedUserWithProfile();
  const supabase = await createClient();
  const { data: match, error } = await supabase
    .from('matches')
    .select(`
      *,
      game:games(*),
      players:profiles_matches(
        profile:profiles(*)
      )
    `)
    .eq('id', params.id)
    .single<Match>();

  if (error) {
    console.error('Errore nel recupero del partita:', error);
    return <p>Errore nel recupero del partita</p>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6 flex items-center gap-2">
        <Link href="/matches">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Indietro
          </Button>
        </Link>
      </div>
      {match ? (
        <>
        <SpotlightCard className="shadow-xl border-2 border-indigo-200 bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800">
          <div className="flex flex-col md:flex-row gap-6 items-center p-6">
            {/* Immagine del gioco se disponibile */}
            {match.game?.image && (
              <div className="flex-shrink-0">
                <Image
                  src={match.game.image}
                  alt={match.game.name}
                  width={220}
                  height={220}
                  className="rounded-2xl shadow-lg object-cover border border-muted"
                />
              </div>
            )}
            <div className="flex-1 w-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-2 flex items-center gap-2">
                  {match.name}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Gioco: <Link href={`/games/${match.game?.id}`} className="font-semibold">{match.game?.name ?? match.game_id}</Link>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    Inizio: {match.startAt}
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                    Fine: {match.endAt}
                  </span>
                </div>
                <div className="max-h-40 overflow-y-auto bg-indigo-100 rounded-lg p-3 border border-muted">
                  {match.description ? (
                    <p className="whitespace-pre-line text-sm text-gray-700">{match.description}</p>
                  ) : (
                    <p className="italic text-muted-foreground">Descrizione non disponibile.</p>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button className="cursor-pointer" variant="secondary">
                    <PencilIcon className="inline mr-2 h-4 w-4" />
                    <Link href={`/matches/${match.id}/edit`}>Modifica</Link>
                  </Button>
                  {match.id && <DeleteMatchButton id={match.id} />}
                </div>
              </CardContent>
            </div>
          </div>
        </SpotlightCard>
        <section className="mt-8">
          <h2
            className="text-xl font-semibold mb-4 gap-4 flex items-center"
          >
            <div>
              Giocatori <span className={`${
              match.players.length >= match.min_players ? "text-green-300" : ""
            } ${match.players.length < match.min_players ? "text-red-300" : ""}`}>
              ({match.players.length}/{match.max_players || "∞"})
            </span>
            </div>
            {role === ROLE.Admin && (
              <>{match.id && <AddPlayerModal matchId={match.id} />}</>
            )}
          </h2>
          {match.players && match.players.length > 0 ? (
            <div className="space-y-4">
              {match.players.map((playerObj: Player, index: number) => (
                <SpotlightCard
                  className="flex items-center gap-4 my-2 px-2 py-2 shadow-xl border-indigo-200 bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800"
                  spotlightColor="rgba(0, 229, 255, 0.2)"
                  key={`${playerObj.profile?.id}-${index}`}
                >
                  <div>
                    <Image
                      src={playerObj.profile?.image || '/placeholder.png'}
                      alt={playerObj.profile?.username}
                      width={64}
                      height={64}
                      className="rounded-2xl border-1 w-16 h-16 object-cover"
                    />
                  </div>
                  <div className="font-bold text-lg">{playerObj.profile?.username ?? playerObj.profile?.firstname ?? "Anonimo"}</div>
                  <div className="text-right ml-auto">
                    <span className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full text-xs font-medium">
                      ELO
                    </span>
                  </div>
                </SpotlightCard>
                ))}
            </div>
          ) : (
            <p className="italic text-muted-foreground">Nessun giocatore associato.</p>
          )}
        </section>
      </>
      ) : (
        <p>Partita non trovato</p>
      )}
    </div>
  );
}