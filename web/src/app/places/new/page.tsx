import SpotlightCard from '@/components/SpotlightCard/SpotlightCard';
import ClientPlaceForm from '../ClientPlaceForm';

export default async function NewPlace() {
  return (
    <div className="flex md:items-center justify-center p-4">
      <SpotlightCard className="px-4 md:px-8 w-full md:w-2xl">
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
