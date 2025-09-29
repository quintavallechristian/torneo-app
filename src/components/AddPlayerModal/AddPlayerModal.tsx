'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { PlusIcon } from 'lucide-react';
import { PlayerSearchBar } from '../PlayerSearchBar/PlayerSearchBar';
import { useState, useTransition } from 'react';
import { addPlayer } from './actions';
import { useRouter } from 'next/navigation';

type AddPlayerModalProps = { matchId: string };

export function AddPlayerModal({ matchId }: AddPlayerModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPlayer) {
      toast.error('Seleziona un giocatore.');
      return;
    }
    startTransition(async () => {
      try {
        await addPlayer({ profile_id: selectedPlayer, match_id: matchId });
        router.refresh();
        setSelectedPlayer('');
        toast.success('Giocatore aggiunto con successo!');
        setOpen(false); // Chiude il modale
      } catch (err: any) {
        if (err.message === '23505') {
          toast.error('Giocatore già aggiunto a questa partita.');
        } else {
          toast.error('Impossibile aggiungere il giocatore.');
        }
        return;
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>
          <Button variant="outline" size="sm" data-testid="Add player">
            <PlusIcon className="inline h-6 w-6" />
          </Button>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Aggiungi giocatore</DialogTitle>
            <DialogDescription>
              Aggiungi un nuovo giocatore al torneo.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <PlayerSearchBar onSelect={setSelectedPlayer} />
              <input type="hidden" name="profile_id" value={selectedPlayer} />
              <input type="hidden" name="match_id" value={matchId} />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Chiudi</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Aggiungendo...' : 'Aggiungi'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
