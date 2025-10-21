'use client';

import * as React from 'react';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { Game, PlaceGame } from '@/types';

export type SearchBarItem = {
  value: string;
  label: string;
  max_players: number | null;
  min_players: number | null;
};

type GameSearchPopoverProps = {
  placeId?: string | null;
  game?: SearchBarItem | null;
  onSelect?: (game: SearchBarItem | null) => void;
  disabled?: boolean;
};

export function GameSearchPopover({
  onSelect,
  placeId,
  game,
  disabled = false,
}: GameSearchPopoverProps) {
  const [open, setOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(game);
  const [items, setItems] = useState<SearchBarItem[]>([]);
  const [search, setSearch] = useState('');

  // Debounce della ricerca
  useEffect(() => {
    const handler = setTimeout(() => {
      if (!search) {
        return;
      }
      let active = true;
      async function fetchItems() {
        if (!placeId) {
          const { data, error } = await supabase
            .from('games')
            .select('id, name, max_players, min_players')
            .gt('bgg_rank', 0)
            .ilike('name', `%${search}%`)
            .order('bgg_rank', { ascending: true });
          if (error || !data) {
            console.error('Errore fetch items:', error);
            setItems([]);
            return;
          }
          setItems(
            data.map(
              (
                game: Pick<Game, 'id' | 'name' | 'max_players' | 'min_players'>,
              ) => ({
                value: game.id,
                label: game.name,
                max_players: game.max_players,
                min_players: game.min_players,
              }),
            ),
          );
        } else {
          const { data, error } = await supabase
            .from('places_games')
            .select('place_id, game:games(id, name, max_players, min_players)')
            .eq('place_id', placeId)
            .ilike('game.name', `%${search}%`);
          if (!active) return;
          if (error) {
            console.error('Errore fetch items:', error);
            setItems([]);
            return;
          }
          const placeGame = data as PlaceGame[] | null;
          if (placeGame) {
            // Estrai i giochi unici dalla relazione places_games
            const uniqueGames = new Map<
              string,
              Pick<Game, 'id' | 'name' | 'max_players' | 'min_players'>
            >();

            placeGame.forEach((pg: PlaceGame) => {
              if (pg.game) {
                // games potrebbe essere un array o un singolo oggetto
                const games = Array.isArray(pg.game) ? pg.game : [pg.game];
                games.forEach(
                  (
                    game: Pick<
                      Game,
                      'id' | 'name' | 'max_players' | 'min_players'
                    >,
                  ) => {
                    if (game) {
                      uniqueGames.set(game.id, game);
                    }
                  },
                );
              }
            });

            setItems(
              Array.from(uniqueGames.values()).map((game) => ({
                value: game.id,
                label: game.name,
                max_players: game.max_players,
                min_players: game.min_players,
              })),
            );
          }
        }
      }
      fetchItems();
      return () => {
        active = false;
      };
    }, 400);
    return () => clearTimeout(handler);
  }, [search, placeId]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full"
          disabled={disabled}
        >
          {selectedGame ? selectedGame.label : 'Seleziona gioco...'}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Cerca gioco..."
            value={search}
            onValueChange={setSearch}
            disabled={disabled}
          />
          <CommandList>
            {items.length === 0 ? (
              <CommandEmpty>Nessun gioco trovato.</CommandEmpty>
            ) : (
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.label}
                    onSelect={(currentLabel) => {
                      const selected = items.find(
                        (item) => item.label === currentLabel,
                      );
                      setSelectedGame(selected ?? null);
                      setOpen(false);
                      if (selected && onSelect) {
                        onSelect(selected);
                      }
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedGame?.value === item.value
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
