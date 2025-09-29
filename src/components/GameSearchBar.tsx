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
import { Game } from '@/types';

export type SearchBarItem = {
  value: string;
  label: string;
  max_players: number | null;
  min_players: number | null;
};

type GameSearchBarProps = {
  game: SearchBarItem | null;
  onSelect?: (game: SearchBarItem | null) => void;
};

export function GameSearchBar({ onSelect, game }: GameSearchBarProps) {
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
        const { data, error } = await supabase
          .from('games')
          .select('id, name, max_players, min_players')
          .ilike('name', `%${search}%`);
        if (!active) return;
        if (error) {
          console.error('Errore fetch items:', error);
          setItems([]);
          return;
        }
        if (data) {
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
        }
      }
      fetchItems();
      return () => {
        active = false;
      };
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full"
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
