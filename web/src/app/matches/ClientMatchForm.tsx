'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GameSearchPopover } from '@/components/GameSearchPopover/GameSearchPopover';
import { DatePicker } from '@/components/DatePicker/DatePicker';
import { createMatch, editMatch } from '@/lib/server/match';
import { ZodErrors } from '@/components/ZodErrors';
import { Game, Place, Match } from '@/types';
import { DualRangeSlider } from '@/components/ui/dual-range-slider';
import { PlaceSearchBar } from '@/components/PlaceSearchBar/PlaceSearchBar';
import PlaceListItem from '@/components/PlaceListItem/PlaceListItem';
import { toast } from 'sonner';

export default function ClientMatchForm({
  match,
  game,
  place,
}: {
  match?: Match | null;
  game?: Game | null;
  place?: Place | null;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [errors, setErrors] = useState<any>(null);

  const preSelectedGame =
    match && match.game
      ? {
          value: match.game.id,
          label: match.game.name,
          min_players: match.game.min_players,
          max_players: match.game.max_players,
        }
      : game
      ? {
          value: game.id,
          label: game.name,
          min_players: game.min_players,
          max_players: game.max_players,
        }
      : null;

  const preSelectedPlaceRaw = match && match.place ? match.place : place;

  const preSelectedPlace =
    match && match.place
      ? {
          value: match.place.id,
          label: match.place.name,
        }
      : place
      ? {
          value: place.id,
          label: place.name,
        }
      : null;

  const [selectedGame, setSelectedGame] = useState(preSelectedGame);
  const [selectedPlace, setSelectedPlace] = useState(preSelectedPlace);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>(
    match ? new Date(match.startAt) : undefined,
  );
  const [startTime, setStartTime] = useState<string>(
    match ? new Date(match.startAt).toTimeString().slice(0, 8) : '20:00:00',
  );

  const [minMaxParticipants, setMinMaxParticipants] = useState([
    selectedGame?.min_players ?? 1,
    selectedGame?.max_players ?? 10,
  ]);

  // Funzione per combinare data e orario in un'unica datetime
  const combineDateTime = (date: Date | undefined, time: string): string => {
    if (!date) return '';
    const [hours, minutes, seconds] = time.split(':');
    const combined = new Date(date);
    combined.setHours(parseInt(hours, 10));
    combined.setMinutes(parseInt(minutes, 10));
    combined.setSeconds(parseInt(seconds, 10));
    return combined.toISOString();
  };

  async function action(formData: FormData) {
    let res;
    if (match && match.id) {
      res = await editMatch(
        formData,
        match.id,
        selectedGame?.min_players ?? 1,
        selectedGame?.max_players ?? 10,
        selectedPlace?.value,
      );
    } else {
      res = await createMatch(
        formData,
        selectedGame?.min_players ?? 1,
        selectedGame?.max_players ?? 10,
        selectedPlace?.value,
      );
    }
    if (res && res.errors) {
      if ('general' in res.errors) {
        toast.error(res.errors.general);
      } else {
        toast.error('Ci sono degli errori nel form, controlla i campi.');
        setErrors(res.errors);
      }
    } else {
      setErrors(null);
    }
  }

  useEffect(() => {
    if (
      selectedGame?.min_players &&
      selectedGame?.max_players &&
      selectedGame?.min_players < selectedGame?.max_players
    ) {
      setMinMaxParticipants([
        selectedGame.min_players,
        selectedGame.max_players,
      ]);
    } else {
      setMinMaxParticipants([selectedGame?.min_players ?? 1, 1]);
    }
  }, [selectedGame]);

  return (
    <form action={action} className="space-y-4 max-w-lg">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Nome partita
        </label>
        <Input
          type="text"
          id="name"
          name="name"
          required
          className="focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
          defaultValue={match?.name}
        />
        {errors && <ZodErrors error={errors.name} />}
      </div>
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 mt-4"
        >
          Luogo
        </label>
        {preSelectedPlaceRaw ? (
          <PlaceListItem
            key={preSelectedPlaceRaw.id}
            place={preSelectedPlaceRaw}
            DescriptionSlot={
              preSelectedPlaceRaw.address && (
                <span>{preSelectedPlaceRaw.address}</span>
              )
            }
            IntroSlot={''}
            StatsSlot={''}
          />
        ) : (
          <>
            <PlaceSearchBar
              place={
                selectedPlace
                  ? {
                      value: selectedPlace.value ?? '',
                      label: selectedPlace.label ?? '',
                    }
                  : null
              }
              onSelect={setSelectedPlace}
            />
            <input
              type="hidden"
              name="game"
              value={selectedGame ? selectedGame.value : ''}
            />
            <input
              type="hidden"
              name="place"
              value={selectedPlace ? selectedPlace.value : ''}
            />
            {errors && <ZodErrors error={errors.game_id} />}
          </>
        )}
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 mt-2"
        >
          Gioco
        </label>
        <GameSearchPopover
          disabled={!selectedPlace}
          game={
            selectedGame
              ? {
                  value: selectedGame.value ?? '',
                  label: selectedGame.label ?? '',
                  min_players: selectedGame.min_players ?? null,
                  max_players: selectedGame.max_players ?? null,
                }
              : null
          }
          placeId={selectedPlace?.value || ''}
          onSelect={setSelectedGame}
        />
      </div>
      <div>
        <label />
        <input
          type="hidden"
          name="game"
          value={selectedGame ? selectedGame.value : ''}
        />
        {errors && <ZodErrors error={errors.game_id} />}
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Descrizione
        </label>
        <Textarea
          id="description"
          name="description"
          className="focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
          defaultValue={match?.description}
        />
        {errors && <ZodErrors error={errors.description} />}
      </div>
      <div>
        <label
          htmlFor="participants"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Partecipanti
        </label>
        {selectedGame?.min_players &&
        selectedGame?.max_players &&
        selectedGame?.min_players < selectedGame?.max_players ? (
          <div className="flex gap-2 text-sm mt-2 pt-12 px-4 pb-4 rounded-md border-input border bg-white dark:bg-input/30">
            <span>Da</span>
            <DualRangeSlider
              label={(value) => <span>{value}</span>}
              value={minMaxParticipants}
              onValueChange={setMinMaxParticipants}
              min={selectedGame?.min_players ?? 1}
              max={selectedGame?.max_players ?? 10}
              step={1}
            />
            <span>A</span>
          </div>
        ) : (
          <span className="italic text-xs">
            Numero di partecipanti: {preSelectedGame?.min_players ?? 1}
          </span>
        )}
        <input type="hidden" name="min_players" value={minMaxParticipants[0]} />
        <input type="hidden" name="max_players" value={minMaxParticipants[1]} />
        {errors && <ZodErrors error={errors.min_players} />}
        {errors && <ZodErrors error={errors.max_players} />}
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
          <label
            htmlFor="startAt"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Inizio
          </label>
          <div className="col-span-1 md:col-span-2">
            <DatePicker
              defaultDate={match ? new Date(match.startAt) : undefined}
              onSelect={setSelectedStartDate}
            />
          </div>
          <Input
            type="time"
            id="time-picker"
            step="1"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
          <Input
            type="hidden"
            name="startAt"
            value={combineDateTime(selectedStartDate, startTime)}
          />
          {errors && <ZodErrors error={errors.startAt} />}
        </div>
      </div>
      <div className="flex items-center justify-center mt-6">
        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white font-semibold py-2 rounded-lg transition-all shadow-md"
        >
          {match ? 'Aggiorna partita' : 'Crea partita'}
        </Button>
      </div>
    </form>
  );
}
