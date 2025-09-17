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


export default async function TournamentDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: tournament, error } = await supabase
    .from('tournaments')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error) {
    console.error('Errore nel recupero del torneo:', error);
    return <p>Errore nel recupero del torneo</p>;
  }

  return (
    <div  className='max-w-2xl  mx-auto'>
      <div className='mb-4'>
        <Button className='mt-4' variant="ghost">
          <Link href='/tournaments'>
            <ChevronLeft className='inline mr-2 h-4 w-4' />
            Indietro
          </Link>
        </Button>
      </div>
      <div className="flex items-center mb-4 justify-between">
      <h1 className='text-2xl font-bold'>Dettagli Torneo</h1>
      <div className="flex gap-2">
      <Button className='cursor-pointer' variant="secondary">
        <PencilIcon className='inline mr-2 h-4 w-4' />
        <Link href={`/tournaments/${params.id}/edit`}>Modifica</Link>
      </Button>
      <DeleteTournamentButton id={params.id} />
      </div>
      </div>
      {tournament ? (
        <Card>
          <CardHeader>
            <CardTitle>{tournament.name}</CardTitle>
            <CardDescription>Gioco: {tournament.game}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Descrizione: {tournament.description}</p>
            <p>Data di inizio: {tournament.startAt}</p>
            <p>Data di fine: {tournament.endAt}</p>
          </CardContent>
        </Card>
      ) : (
        <p>Torneo non trovato</p>
      )}
    </div>
  );
}