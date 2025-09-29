'use server';
import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import SpotlightCard from '@/components/SpotlightCard';
import { Location } from '@/types';
//import { getAuthenticatedUserWithProfile } from '@/utils/auth-helpers';

interface PlaceDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function PlaceDetailsPage({
  params,
}: PlaceDetailsPageProps) {
  const { id } = await params;
  //const { role } = await getAuthenticatedUserWithProfile();
  const supabase = await createClient();
  let location, error;
  if (!isNaN(Number(id))) {
    const result = await supabase
      .from('locations')
      .select('*, matches:matches(*)')
      .eq('id', id)
      .single<Location>();
    location = result.data;
    error = result.error;
  } else {
    const result = await supabase
      .from('locations')
      .select('*')
      .eq('name', id)
      .single<Location>();
    location = result.data;
    error = result.error;
  }

  if (error || !location) {
    console.error('Errore nel recupero del partita:', error);
    return <p>Errore nel recupero del partita</p>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6 flex items-center gap-2">
        <Link href="/places">
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
      <SpotlightCard spotlightColor="rgba(0, 229, 255, 0.2)">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-shrink-0">
            <Image
              src={location.image || '/placeholder.png'}
              alt={location.name}
              width={250}
              height={250}
              className="rounded-2xl border-1 w-32 h-32 object-cover"
            />
          </div>
          <div className="flex-1 w-full">
            <CardHeader className="pb-8">
              <CardTitle className="text-3xl font-bold text-primary mb-2 flex items-center gap-2">
                {location.name}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {location.address}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {location.description && (
                <div className="max-h-40 overflow-y-auto bg-blue-200 rounded-lg p-3 border border-muted  text-gray-700  text-sm">
                  <p className="whitespace-pre-line">{location.description}</p>
                </div>
              )}
            </CardContent>
          </div>
        </div>
      </SpotlightCard>
      <section className="mt-8">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-xl font-semibold">Partite collegate</h2>
        </div>
        {location.matches && location.matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              location.matches.map((match: any) => (
                <Link
                  key={match.id}
                  href={`/matches/${match.id}`}
                  className="no-underline"
                >
                  <SpotlightCard>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl font-bold text-indigo-700 dark:text-indigo-400 mb-2">
                        {match.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex gap-2 mb-2">
                        <Badge className="bg-blue-100 text-blue-800">
                          Inizio:{' '}
                          {match.startAt
                            ? new Date(match.startAt).toLocaleDateString()
                            : 'N/A'}
                        </Badge>
                        <Badge className="bg-purple-100 text-purple-800">
                          Fine:{' '}
                          {match.endAt
                            ? new Date(match.endAt).toLocaleDateString()
                            : 'N/A'}
                        </Badge>
                      </div>
                      <div className="max-h-24 overflow-y-auto bg-indigo-100 rounded-lg p-2 border border-muted">
                        {match.description ? (
                          <p className="whitespace-pre-line text-sm text-gray-700">
                            {match.description}
                          </p>
                        ) : (
                          <p className="italic text-muted-foreground">
                            Descrizione non disponibile.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </SpotlightCard>
                </Link>
              ))
            }
          </div>
        ) : (
          <p className="italic text-muted-foreground">
            Nessun partita collegato.
          </p>
        )}
      </section>
    </div>
  );
}
