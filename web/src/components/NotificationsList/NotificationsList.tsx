'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, CheckCheck, Mail, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';
import SpotlightCard from '../SpotlightCard/SpotlightCard';

type Notification = {
  id: string;
  profile_id: number;
  title: string;
  body: string | null;
  read: boolean;
  created_at: string;
};

type NotificationsListProps = {
  notifications: Notification[];
  profileId: string;
};

export function NotificationsList({
  notifications: initialNotifications,
  profileId,
}: NotificationsListProps) {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [loading, setLoading] = useState<string | null>(null);

  const markAsRead = async (notificationId: string) => {
    setLoading(notificationId);
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    } finally {
      setLoading(null);
    }
  };

  const markAsUnread = async (notificationId: string) => {
    setLoading(notificationId);
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: false })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: false } : n)),
      );
    } catch (error) {
      console.error('Error marking notification as unread:', error);
    } finally {
      setLoading(null);
    }
  };

  const markAllAsRead = async () => {
    setLoading('all');
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('profile_id', profileId)
        .eq('read', false);

      if (error) throw error;

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    } finally {
      setLoading(null);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    setLoading(notificationId);
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    } finally {
      setLoading(null);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Nessuna notifica disponibile
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {unreadCount > 0 ? (
            <Badge variant="default">
              {unreadCount} non {unreadCount === 1 ? 'letta' : 'lette'}
            </Badge>
          ) : (
            <span>Tutte le notifiche sono state lette</span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={loading === 'all'}
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Segna tutte come lette
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <SpotlightCard
            key={notification.id}
            className={`transition-all ${
              !notification.read
                ? 'border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                : 'opacity-60'
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-start gap-2">
                    {notification.title}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(notification.created_at), {
                      addSuffix: true,
                      locale: it,
                    })}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!notification.read ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => markAsRead(notification.id)}
                      disabled={loading === notification.id}
                      title="Segna come letta"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => markAsUnread(notification.id)}
                      disabled={loading === notification.id}
                      title="Segna come da leggere"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteNotification(notification.id)}
                    disabled={loading === notification.id}
                    title="Elimina"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {notification.body && (
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {notification.body}
                </p>
              </CardContent>
            )}
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
}
