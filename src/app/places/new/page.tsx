import SpotlightCard from '@/components/SpotlightCard/SpotlightCard';
import ClientPlaceForm from '../ClientPlaceForm';

export default async function NewPlace() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <SpotlightCard className="min-w-lg">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 mb-2">
            Aggiungi il tuo locale
          </h1>
          <p className="text-gray-500 dark:text-gray-300">
            Compila i dettagli per inserire il tuo locale!
          </p>
        </div>
        <ClientPlaceForm />
      </SpotlightCard>
    </div>
  );
}
