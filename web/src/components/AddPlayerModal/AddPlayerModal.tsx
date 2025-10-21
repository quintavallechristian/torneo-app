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
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addPlayer } from '@/lib/server/match';
import { Match } from '@/types';

type AddPlayerModalProps = { match: Match };

export function AddPlayerModal({ match }: AddPlayerModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const router = useRouter();

  function addPlayerAction(profileId: string, match: Match) {
    addPlayer({
      profileId,
      match: match!,
    })
      .then((data) => {
        if (data.success) {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
        router.refresh();
        setSelectedPlayer('');
        setOpen(false);
      })
      .catch((err) => {
        if (err.message === '23505') {
          toast.error('Giocatore già aggiunto a questa partita.');
        } else {
          toast.error('Impossibile aggiungere il giocatore.');
        }
      });
  }

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
            <input type="hidden" name="match_id" value={match.id} />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Chiudi</Button>
          </DialogClose>
          <Button onClick={() => addPlayerAction(selectedPlayer, match)}>
            Aggiungi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
