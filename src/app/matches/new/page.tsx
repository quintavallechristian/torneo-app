'use server';

import SpotlightCard from '@/components/SpotlightCard';
import ClientMatchForm from '../ClientMatchForm';
export default async function Newmatch() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <SpotlightCard
        className="shadow-xl border-2 border-indigo-200 bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800"
        spotlightColor="rgba(0, 229, 255, 0.2)"
      >
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-400 mb-2">
            Crea un nuovo partita
          </h1>
          <p className="text-gray-500 dark:text-gray-300">
            Compila i dettagli per organizzare una nuova competizione!
          </p>
        </div>
        <ClientMatchForm />
      </SpotlightCard>
    </div>
  );
}
