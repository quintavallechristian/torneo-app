import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import SpotlightCard from '@/components/SpotlightCard';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function PrivatePage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', data.user.id)
    .single();

  const avatarUrl = profile?.image || '/placeholder.png';

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6 flex items-center gap-2">
        <Link href="/matches">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Indietro
          </Button>
        </Link>
      </div>
      <SpotlightCard>
        <div className="flex flex-col md:flex-row gap-8 items-center p-8">
          <div className="flex-shrink-0">
            <Image
              src={avatarUrl}
              alt={profile?.username || 'Avatar'}
              width={120}
              height={120}
              className="rounded-2xl shadow-lg object-cover border border-muted bg-white"
              priority
            />
          </div>
          <div className="flex-1 w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-2 flex items-center gap-2">
                {profile?.firstname
                  ? `${profile.firstname} ${profile.lastname ?? ''}`
                  : 'Utente'}
              </CardTitle>
              <CardDescription className="text-muted-foreground text-lg">
                @{profile?.username ?? 'username'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-gray-700">Email:</span>
                <span className="text-indigo-700 dark:text-indigo-400">
                  {data.user.email}
                </span>
              </div>
            </CardContent>
            <div className="mt-6">
              <Button variant="secondary">Modifica profilo</Button>
            </div>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
}
