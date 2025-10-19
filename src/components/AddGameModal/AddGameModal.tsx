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
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addGameToCollection } from '@/lib/server/place';
import {
  GameSearchPopover,
  SearchBarItem,
} from '../GameSearchPopover/GameSearchPopover';

type AddGameModalProps = { placeId: string };

export function AddGameModal({ placeId }: AddGameModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<SearchBarItem | null>(null);
  const router = useRouter();

  function addGameAction(game: SearchBarItem | null) {
    if (!game) return;

    addGameToCollection({
      placeId,
      gameId: game.value,
    })
      .then((data) => {
        if (data.success) {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
        router.refresh();
        setSelectedGame(null);
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
      <DialogTrigger asChild className="w-full rounded-full m-0">
        <div className="bg-amber-300 h-20 m-0">
          <Button variant="outline" size="sm" data-testid="Add Game">
            <PlusIcon className="inline h-6 w-6" />
          </Button>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Aggiungi gioco alla collezione</DialogTitle>
          <DialogDescription>
            Aggiungi un nuovo gioco alla collezione.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-3">
            <GameSearchPopover onSelect={setSelectedGame} />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Chiudi</Button>
          </DialogClose>
          <Button onClick={() => addGameAction(selectedGame)}>Aggiungi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
