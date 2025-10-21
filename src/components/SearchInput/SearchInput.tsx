'use client';

import * as React from 'react';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/input';

export function SearchInput({
  defaultValue = '',
  placeholder = 'Cerca...',
}: {
  defaultValue?: string;
  placeholder?: string;
}) {
  const [search, setSearch] = useState(defaultValue);
  const router = useRouter();

  // Debounce della ricerca
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams();
      if (search) params.set('q', search);
      const currentPath = window.location.pathname;
      router.replace(`${currentPath}?${params.toString()}`, { scroll: false });
    }, 400);
    return () => clearTimeout(handler);
  }, [search, router]);
  return (
    <Input
      type="text"
      className="max-w-xs bg-gradient-to-br from-white to-slate-200 dark:from-gray-900 dark:to-gray-800"
      placeholder={placeholder}
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}
