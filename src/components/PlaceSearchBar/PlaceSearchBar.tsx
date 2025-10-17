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
import { Place } from '@/types';

export type SearchBarItem = {
  value: string;
  label: string;
};

type PlaceSearchBarProps = {
  place: SearchBarItem | null;
  onSelect?: (place: SearchBarItem | null) => void;
};

export function PlaceSearchBar({ onSelect, place }: PlaceSearchBarProps) {
  const [open, setOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(place);
  const [items, setItems] = useState<SearchBarItem[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!search) {
        return;
      }
      let active = true;
      async function fetchItems() {
        const { data, error } = await supabase
          .from('places')
          .select('id, name')
          .ilike('name', `%${search}%`);
        const places = data as Place[] | null;

        if (!active) return;
        if (error) {
          console.error('Errore fetch items:', error);
          setItems([]);
          return;
        }
        if (places) {
          setItems(
            places.map((place) => ({
              value: place.id || '',
              label: place.name,
            })),
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
          {selectedPlace ? selectedPlace.label : 'Seleziona luogo...'}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Cerca luogo..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {items.length === 0 ? (
              <CommandEmpty>Nessun luogo trovato.</CommandEmpty>
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
                      setSelectedPlace(selected ?? null);
                      setOpen(false);
                      if (selected && onSelect) {
                        onSelect(selected);
                      }
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedPlace?.value === item.value
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
