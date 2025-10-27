'use server';
import { createClient } from '@/utils/supabase/server';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import PlaceStats from '@/components/PlaceStats/PlaceStats';

interface PlaceStatsPageProps {
  params: Promise<{ id: string }>;
}

export default async function PlaceStatsPage({ params }: PlaceStatsPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Get place details
  const { data: place } = await supabase
    .from('places')
    .select('id, name, address, image')
    .eq('id', id)
    .single();

  if (!place) {
    return <p>Luogo non trovato</p>;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-6 flex items-center gap-2">
        <Link href={`/places/${id}`}>
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

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-2">
          Statistiche: {place.name}
        </h1>
        <p className="text-muted-foreground">{place.address}</p>
      </div>

      <PlaceStats placeId={Number(place.id)} />
    </div>
  );
}
