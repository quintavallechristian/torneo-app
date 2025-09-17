'use client';

import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export async function deleteTournament(tournamentId: string) {
  const { data, error } = await supabase
    .from('tournaments')
    .delete()
    .eq('id', tournamentId);

  if (error) {
    console.error('Error deleting tournament:', error);
  } else {
    console.log('Tournament deleted successfully:', data);
    redirect('/tournaments')
  }
}

export default function DeleteTournamentButton({ id }: { id: string }) {
    const [open, setOpen] = useState(false);

    const handleDelete = async () => {
        setOpen(false);
        await deleteTournament(id);
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" className="cursor-pointer">
                    <Trash className='inline mr-2 h-4 w-4' />
                    Elimina
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Questa azione non può essere annullata. Verrà eliminato il torneo in modo permanente.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Annulla</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Continua</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}