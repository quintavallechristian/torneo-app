import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import { NotificationsList } from '@/components/NotificationsList/NotificationsList';

export default async function NotificationsPage() {
  const { profile } = await getAuthenticatedUserWithProfile();

  if (!profile) {
    redirect('/login');
  }

  const supabase = await createClient();

  // Recupera tutte le notifiche dell'utente
  const { data: notifications, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('profile_id', profile.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching notifications:', error);
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Notifiche</h1>
      <NotificationsList
        notifications={notifications || []}
        profileId={profile.id}
      />
    </div>
  );
}
