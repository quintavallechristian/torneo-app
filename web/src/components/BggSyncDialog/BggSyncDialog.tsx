'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  saveBggUsername,
  syncBGGCollection,
} from '@/app/games/collection/actions';
import { Loader2 } from 'lucide-react';

interface BggSyncDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUsername: string | null;
}

export function BggSyncDialog({
  open,
  onOpenChange,
  currentUsername,
}: BggSyncDialogProps) {
  const [username, setUsername] = useState(currentUsername || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSync = async () => {
    if (!username.trim()) {
      setError('Inserisci il tuo username di BoardGameGeek');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Salva l'username se è cambiato
      if (username !== currentUsername) {
        await saveBggUsername(username);
      }

      // Sincronizza la collezione
      const result = await syncBGGCollection(username);

      setSuccess(result.message);

      // Chiudi il dialog dopo 2 secondi
      setTimeout(() => {
        onOpenChange(false);
        setSuccess(null);
      }, 2000);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Errore durante la sincronizzazione',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sincronizza con BoardGameGeek</DialogTitle>
          <DialogDescription>
            Inserisci il tuo username di BoardGameGeek per sincronizzare la tua
            collezione.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="col-span-3"
              placeholder="chrissj2"
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          {success && (
            <p className="text-sm text-green-500 text-center">{success}</p>
          )}
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Annulla
          </Button>
          <Button type="button" onClick={handleSync} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sincronizza
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
