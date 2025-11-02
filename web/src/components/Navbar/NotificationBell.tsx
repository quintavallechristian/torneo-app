'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Bell } from 'lucide-react';
import { Badge } from '../ui/badge';

export function NotificationBell({
  profileId,
  initialCount,
}: {
  profileId: string;
  initialCount: number;
}) {
  const [unreadCount, setUnreadCount] = useState(initialCount);

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profileId)
        .eq('read', false);

      setUnreadCount(count || 0);
    };

    const channel = supabase
      .channel('notification-count')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `profile_id=eq.${profileId}`,
        },
        () => {
          fetchCount();
        },
      )
      .subscribe();

    return () => {
      void channel.unsubscribe();
    };
  }, [profileId]);

  return (
    <Link href="/notifications" className="relative">
      <Button variant="ghost" size="icon">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>
    </Link>
  );
}
