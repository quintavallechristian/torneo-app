'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GameSearchBar } from '@/components/GameSearchBar';
import { DatePicker } from '@/components/DatePicker';
import { createMatch, editMatch } from './actions';
import { ZodErrors } from '@/components/ZodErrors';
import { Game, Match } from '@/types';
import { DualRangeSlider } from '@/components/ui/dual-range-slider';

export default function ClientMatchForm({
  match,
  game,
}: {
  match?: Match;
  game?: Game;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [errors, setErrors] = useState<any>(null);

  const preSelectedGame = match
    ? {
        value: match.game?.id,
        label: match.game?.name,
        min_players: match.game?.min_players,
        max_players: match.game?.max_players,
      }
    : game
    ? {
        value: game.id,
        label: game.name,
        min_players: game.min_players,
        max_players: game.max_players,
      }
    : null;

  const [selectedGame, setSelectedGame] = useState(preSelectedGame);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>(
    match ? new Date(match.startAt) : undefined,
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(
    match ? new Date(match.endAt) : undefined,
  );

  const [minMaxParticipants, setMinMaxParticipants] = useState([
    selectedGame?.min_players ?? 1,
    selectedGame?.max_players ?? 10,
  ]);

  async function action(formData: FormData) {
    let res;
    if (match && match.id) {
      res = await editMatch(
        formData,
        match.id,
        selectedGame?.min_players ?? 1,
        selectedGame?.max_players ?? 10,
      );
    } else {
      res = await createMatch(
        formData,
        selectedGame?.min_players ?? 1,
        selectedGame?.max_players ?? 10,
      );
    }
    if (res && res.errors) {
      setErrors(res.errors);
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
    <form action={action} className="space-y-4">
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
        <GameSearchBar
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
          onSelect={setSelectedGame}
        />
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
          <div className="flex gap-2 text-sm mt-8">
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

      <div className="flex gap-4">
        <div className="w-1/2">
          <label
            htmlFor="startAt"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Data inizio
          </label>
          <DatePicker
            defaultDate={match ? new Date(match.startAt) : undefined}
            onSelect={setSelectedStartDate}
          />
          <input
            type="hidden"
            name="startAt"
            value={
              selectedStartDate
                ? selectedStartDate.toISOString().slice(0, 10)
                : ''
            }
          />
          {errors && <ZodErrors error={errors.startAt} />}
        </div>
        <div className="w-1/2">
          <label
            htmlFor="endAt"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Data fine
          </label>
          <DatePicker
            defaultDate={match ? new Date(match?.endAt) : undefined}
            onSelect={setSelectedEndDate}
          />
          <input
            type="hidden"
            name="endAt"
            value={
              selectedEndDate ? selectedEndDate.toISOString().slice(0, 10) : ''
            }
          />
          {errors && <ZodErrors error={errors.endAt} />}
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
