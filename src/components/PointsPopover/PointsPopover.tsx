'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { updatePlayerPoints } from '@/lib/server/match';
import { Match } from '@/types';
import { toast } from 'sonner';
//import { createClient } from '@/utils/supabase/server';

export function PointsPopover({
  startingPoints,
  match,
  placeId,
  playerId,
}: {
  startingPoints: number;
  match: Match;
  placeId: string;
  playerId: string;
}) {
  function updatePlayerPointsAction(formData: FormData) {
    const points = formData.get('points') as string;
    console.log(points);
    updatePlayerPoints({
      match: match,
      profileId: playerId,
      placeId,
      points: parseInt(points, 10),
    })
      .then((data) => {
        if (data.success) {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      })
      .catch(() => {
        toast.error('Errore nel confermare il vincitore');
      });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="cursor-pointer focus:outline-none">
          <span className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full text-xs font-medium">
            {startingPoints || 0} pts
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <form action={updatePlayerPointsAction}>
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="leading-none font-medium">Aggiorna punti</h4>
              <p className="text-muted-foreground text-sm">
                Modifica i punti del giocatore.
              </p>
            </div>
            <div className="grid gap-2">
              {/* {scoreSheet &&
                scoreSheet.configuration &&
                scoreSheet.configuration.map((category: any) => (
                  <div
                    key={category.name}
                    className="grid grid-cols-3 items-center gap-4"
                  >
                    <Label
                      htmlFor={category.name}
                      className="capitalize col-span-2"
                    >
                      {category.name}
                    </Label>
                    {category.type === 'boolean' ? (
                      <Switch name={`category.name`} checked={field.value} />
                    ) : (
                      <Input
                        name={category.name}
                        id={category.name}
                        defaultValue={startingPoints}
                        className="col-span-1 h-8"
                        type="number"
                      />
                    )}
                  </div>
                ))} */}
              <div className="grid grid-cols-3 items-center gap-4">
                <Label
                  htmlFor="points"
                  className="capitalize font-bold col-span-2"
                >
                  Totale
                </Label>
                <Input
                  name="points"
                  id="points"
                  defaultValue={startingPoints}
                  className="col-span-1 h-8"
                  type="number"
                />
              </div>
            </div>
          </div>
          <Button type="submit" className="cursor-pointer w-full mt-4">
            Aggiorna
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
