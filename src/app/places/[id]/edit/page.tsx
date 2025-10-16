import SpotlightCard from '@/components/SpotlightCard/SpotlightCard';
import ClientPlaceForm from '../../ClientPlaceForm';
import { createClient } from '@/utils/supabase/server';
import { Place, UserAction } from '@/types';
import { canUser } from '@/lib/permissions';
import ForbiddenArea from '@/components/ForbiddenArea/ForbiddenArea';

interface PlaceEditPageProps {
  params: Promise<{ id: string }>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function EditPlace({ params }: PlaceEditPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: place, error } = await supabase
    .from('places')
    .select('*')
    .eq('id', id)
    .single<Place>();

  if (error) {
    console.error('Errore nel recupero del partita:', error);
    return <p>Errore nel recupero del partita</p>;
  }
  const canManagePlaces = !!(await canUser(UserAction.ManagePlaces, {
    placeId: place?.id,
  }));
  if (!canManagePlaces) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ForbiddenArea />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <SpotlightCard className="min-w-lg">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 mb-2">
            Modifica il tuo locale
          </h1>
          <p className="text-gray-500 dark:text-gray-300">
            Compila i dettagli per modificare il tuo locale!
          </p>
        </div>
        <ClientPlaceForm place={place} />
      </SpotlightCard>
    </div>
  );
}
