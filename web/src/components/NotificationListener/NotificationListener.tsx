// app/components/NotificationListener.tsx
'use client';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';
import { toast } from 'sonner'; // o react-hot-toast

export function NotificationListener({ profileId }: { profileId: string }) {
  useEffect(() => {
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `profile_id=eq.${profileId}`,
        },
        (payload) => {
          console.log('Nuova notifica ricevuta:', payload);
          const n = payload.new as { title: string; body?: string };
          toast(`${n.title}`, { description: n.body });
        },
      )
      .subscribe();

    return () => {
      // call unsubscribe but do not return its Promise so the cleanup is synchronous
      void channel.unsubscribe();
    };
  }, [profileId]);

  return null; // non rende nulla, ma ascolta eventi
}
