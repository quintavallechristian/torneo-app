'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BggSyncDialog } from '@/components/BggSyncDialog/BggSyncDialog';
import { Download } from 'lucide-react';

interface BggSyncButtonProps {
  bggUsername: string | null;
}

export function BggSyncButton({ bggUsername }: BggSyncButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Sincronizza BGG
      </Button>
      <BggSyncDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        currentUsername={bggUsername}
      />
    </>
  );
}
