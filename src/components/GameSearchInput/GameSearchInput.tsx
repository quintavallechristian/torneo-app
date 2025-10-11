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
import { useRouter } from 'next/navigation';
import { Input } from '../ui/input';

export type SearchBarItem = {
  value: string;
  label: string;
  max_players: number | null;
  min_players: number | null;
};

export function GameSearchInput({
  defaultValue = '',
}: {
  defaultValue?: string;
}) {
  const [search, setSearch] = useState(defaultValue);
  const router = useRouter();

  // Debounce della ricerca
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams();
      if (search) params.set('q', search);
      const currentPath = window.location.pathname;
      router.push(`${currentPath}?${params.toString()}`);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);
  return (
    <Input
      type="text"
      className="max-w-xs"
      placeholder="Cerca un gioco..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}
