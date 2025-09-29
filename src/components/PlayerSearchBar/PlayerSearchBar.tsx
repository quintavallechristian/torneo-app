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

export type SearchBarItem = {
  value: string;
  label: string;
};

type PlayerSearchBarProps = {
  onSelect?: (player: string) => void;
};

export function PlayerSearchBar({ onSelect }: PlayerSearchBarProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [items, setItems] = useState<SearchBarItem[]>([]);
  const [search, setSearch] = useState('');

  // Debounce della ricerca
  useEffect(() => {
    const handler = setTimeout(() => {
      if (!search) {
        setItems([]);
        return;
      }
      let active = true;
      async function fetchItems() {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, firstname, username')
          .or(`firstname.ilike.%${search}%,username.ilike.%${search}%`);
        if (!active) return;
        if (error) {
          console.error('Errore fetch items:', data, error);
          setItems([]);
          return;
        }
        if (data) {
          setItems(
            data.map(
              (profile: {
                id: string;
                firstname: string;
                username: string;
              }) => ({
                value: profile.id,
                label: `${profile.firstname} (${profile.username})`,
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
          {value
            ? items.find((item) => item.value === value)?.label
            : 'Seleziona giocatore...'}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Cerca giocatore..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {items.length === 0 ? (
              <CommandEmpty>Nessun giocatore trovato.</CommandEmpty>
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
                      setValue(selected ? selected.value : '');
                      setOpen(false);
                      if (selected && onSelect) {
                        onSelect(selected.value);
                      }
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === item.value ? 'opacity-100' : 'opacity-0',
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
