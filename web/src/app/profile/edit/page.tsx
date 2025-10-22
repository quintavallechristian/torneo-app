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
    <div className="flex md:items-center justify-center p-4">
      <SpotlightCard className="px-4 md:px-8 w-full md:w-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-400 mb-2">
            Modifica il tuo profilo
          </h1>
          <p className="text-gray-500 dark:text-gray-300">
            Compila i dettagli per modificare il tuo profilo!
          </p>
        </div>
        <ClientProfileForm profile={profile} />
      </SpotlightCard>
    </div>
  );
}
