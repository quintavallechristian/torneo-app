'use server'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { ChevronLeft } from "lucide-react";
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server'


 export async function editmatch(matchId: string, formData: FormData) {
    const name = formData.get('name') as string;
    const game = formData.get('game') as string;
    const description = formData.get('description') as string;
    const startAt = formData.get('startAt') as string;
    const endAt = formData.get('endAt') as string;

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('matches')
      .update([{ name, game, description, startAt, endAt }])
      .eq('id', matchId);

    if (error) {
      console.error('Error updating match:', error);
    } else {
      redirect(`/matches/${matchId}`)
    }
  }


export default async function matchEditPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: match, error } = await supabase
    .from('matches')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error) {
    console.error('Errore nel recupero del partita:', error);
    return <p>Errore nel recupero del partita</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
        <div className="mb-6 flex items-center justify-between">
          <Button className="" variant="ghost" size="sm">
            <Link href='/matches' className="flex items-center text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors">
              <ChevronLeft className='inline mr-2 h-4 w-4' />
              Indietro
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-400 mb-2 text-center">Modifica partita</h1>
        <p className="text-gray-500 dark:text-gray-300 text-center mb-6">Aggiorna i dettagli della competizione.</p>
        {match ? (
          <form action={editmatch.bind(null, params.id)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome partita</label>
              <Input type="text" id="name" name="name" required defaultValue={match.name} className="focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700" />
            </div>
            <div>
              <label htmlFor="game" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gioco</label>
              <Input type="text" id="game" name="game" required defaultValue={match.game} className="focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrizione</label>
              <Textarea id="description" name="description" defaultValue={match.description} className="focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700" />
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label htmlFor="startAt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data inizio</label>
                <Input type="date" id="startAt" name="startAt" defaultValue={match.startAt} className="focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700" />
              </div>
              <div className="w-1/2">
                <label htmlFor="endAt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data fine</label>
                <Input type="date" id="endAt" name="endAt" defaultValue={match.endAt} className="focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700" />
              </div>
            </div>
            <div className="flex items-center justify-center mt-6">
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white font-semibold py-2 rounded-lg transition-all shadow-md">Salva modifiche</Button>
            </div>
          </form>
        ) : (
          <p className="text-center text-red-500 dark:text-red-400">Partita non trovato</p>
        )}
      </div>
    </div>
  );
}