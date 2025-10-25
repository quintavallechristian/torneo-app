'use client';

import { MATCHSTATUS } from '@/types';
import { formatMatchStatus } from '@/lib/client/match';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Badge } from '../ui/badge';

export function MatchStatusFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get('status');

  const handleStatusChange = (status: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === null) {
      params.delete('status');
    } else {
      params.set('status', status);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const statusOptions = [
    {
      value: MATCHSTATUS.Scheduled,
      ...formatMatchStatus(MATCHSTATUS.Scheduled),
    },
    { value: MATCHSTATUS.Ongoing, ...formatMatchStatus(MATCHSTATUS.Ongoing) },
    {
      value: MATCHSTATUS.Completed,
      ...formatMatchStatus(MATCHSTATUS.Completed),
    },
    {
      value: MATCHSTATUS.WaitingForResults,
      ...formatMatchStatus(MATCHSTATUS.WaitingForResults),
    },
    { value: MATCHSTATUS.Canceled, ...formatMatchStatus(MATCHSTATUS.Canceled) },
  ];

  const activeFilter = currentStatus
    ? statusOptions.find((opt) => opt.value === currentStatus)
    : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {activeFilter ? (
          <Button
            variant="ghost"
            size="lg"
            data-testid="Filter matches"
            className={
              activeFilter ? 'px-0 py-0 focus:ring-0 border-primary' : ''
            }
          >
            <Badge
              className={`flex gap-2 items-center px-2 py-1 rounded-full ${
                formatMatchStatus(activeFilter.value).color
              } `}
            >
              {activeFilter.label} <Filter className="h-6 w-6" />
            </Badge>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="lg"
            data-testid="Filter matches"
            className={activeFilter ? 'border-primary' : ''}
          >
            <Filter className="h-6 w-6" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onClick={() => handleStatusChange(null)}
          className={!currentStatus ? 'bg-accent' : ''}
        >
          <span className="font-medium">Tutti i match</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {statusOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleStatusChange(option.value)}
            className={currentStatus === option.value ? 'bg-accent' : ''}
          >
            <Badge
              className={`hidden md:block px-2 py-1 rounded-full ${
                formatMatchStatus(option.value).color
              } `}
            >
              {option.label}
            </Badge>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
