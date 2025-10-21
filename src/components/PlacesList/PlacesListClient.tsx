'use client';

import { useEffect, useState } from 'react';
import { Place } from '@/types';
import EmptyArea from '../EmptyArea/EmptyArea';
import PlaceCardClient from '../PlaceCard/PlaceCardClient';
import PlaceCard from '../PlaceCard/PlaceCard';

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distanza in km
}

interface PlacesListClientProps {
  places: Place[];
  gridCols?: 'md:grid-cols-2' | 'md:grid-cols-3';
  profileId?: string | null;
}

export default function PlacesListClient({
  places,
  gridCols = 'md:grid-cols-2',
  profileId,
}: PlacesListClientProps) {
  const [sortedPlaces, setSortedPlaces] =
    useState<(Place & { distance?: number })[]>(places);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ottieni la posizione dell'utente
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setIsLoading(false);
        },
        (error) => {
          console.error('Errore geolocalizzazione:', error);
          // In caso di errore, usa i luoghi senza ordinamento per distanza
          setSortedPlaces(places);
          setIsLoading(false);
        },
      );
    } else {
      // Geolocalizzazione non supportata
      setSortedPlaces(places);
      setIsLoading(false);
    }
  }, [places]);

  useEffect(() => {
    // Ordina i luoghi in base alla distanza quando abbiamo la posizione
    if (userLocation) {
      const placesWithDistance = places
        .map((place) => ({
          ...place,
          distance: haversineDistance(
            userLocation.lat,
            userLocation.lng,
            place.latitude || 0,
            place.longitude || 0,
          ),
        }))
        .sort((a, b) => a.distance - b.distance);

      setSortedPlaces(placesWithDistance);
    }
  }, [userLocation, places]);

  if (isLoading) {
    return (
      <div className="mt-4 text-center text-muted-foreground">
        🔍 Ricerca luoghi nelle vicinanze...
      </div>
    );
  }

  if (sortedPlaces.length === 0) {
    return (
      <EmptyArea
        title="Nessun locale trovato"
        message="Nessun locale trovato nelle vicinanze"
      />
    );
  }

  return (
    <div className={`grid grid-cols-1 ${gridCols} gap-6 mt-4`}>
      {sortedPlaces.map((place) => (
        <PlaceCard
          distance={place.distance}
          key={place.id}
          place={place}
          placeStats={place.placeStats?.find(
            (stat) => stat.profile_id === profileId,
          )}
          small
        />
      ))}
    </div>
  );
}
