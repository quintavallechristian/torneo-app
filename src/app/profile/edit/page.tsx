import { redirect } from 'next/navigation';
import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';
import SpotlightCard from '@/components/SpotlightCard/SpotlightCard';
import ClientProfileForm from '../ClientProfileForm';

export default async function PrivatePage() {
  const { user, profile } = await getAuthenticatedUserWithProfile();
  if (!user || !profile) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <SpotlightCard className="min-w-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 mb-2">
            Modifica il tuo locale
          </h1>
          <p className="text-gray-500 dark:text-gray-300">
            Compila i dettagli per modificare il tuo locale!
          </p>
        </div>
        <ClientProfileForm profile={profile} />
      </SpotlightCard>
    </div>
  );
}
