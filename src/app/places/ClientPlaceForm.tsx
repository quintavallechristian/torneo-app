'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createPlace, editPlace } from '@/lib/server/place';
import { ZodErrors } from '@/components/ZodErrors';
import { Place } from '@/types';
import { toast } from 'sonner';
import ImageDropArea from '@/components/ImageDropArea/ImageDropArea';
import AddressPicker from '@/components/AddressPicker/AddressPicker';

export default function ClientPlaceForm({ place }: { place?: Place }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [errors, setErrors] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState<{
    address: string;
    lat: number;
    lng: number;
  } | null>({
    address: place?.address || '',
    lat: place?.latitude || 0,
    lng: place?.longitude || 0,
  });

  async function action(formData: FormData) {
    setIsLoading(true);

    // Aggiungi il file immagine al FormData se presente
    if (selectedImage) {
      formData.set('image', selectedImage);
    }

    let res;
    if (place && place.id) {
      res = await editPlace(formData, place.id);
    } else {
      res = await createPlace(formData);
    }

    setIsLoading(false);

    if (res && res.errors) {
      if ('general' in res.errors) {
        toast.error(res.errors.general);
      } else {
        toast.error('Ci sono degli errori nel form, controlla i campi.');
        console.log(res.errors);
        setErrors(res.errors);
      }
    } else {
      setErrors(null);
    }
  }

  return (
    <form action={action} className="space-y-6 w-full">
      {/* Layout con immagine a sinistra e campi a destra */}
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Colonna Immagine - Sinistra */}
        <div className="flex-shrink-0">
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Immagine
          </label>
          <ImageDropArea
            onImageSelect={(file) => setSelectedImage(file)}
            onImageRemove={() => setSelectedImage(null)}
            defaultImageUrl={place?.image || undefined}
            maxSizeMB={1}
            size="md"
          />
          {errors && <ZodErrors error={errors.image} />}
        </div>

        {/* Colonna Campi - Destra */}
        <div className="flex-1 space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Nome locale
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              required
              className="focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              defaultValue={place?.name}
            />
            {errors && <ZodErrors error={errors.name} />}
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Descrizione
            </label>
            <Textarea
              id="description"
              name="description"
              rows={5}
              className="focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              defaultValue={place?.description || ''}
            />
            {errors && <ZodErrors error={errors.description} />}
          </div>
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Indirizzo
            </label>
            <AddressPicker
              address={
                place
                  ? {
                      address: place.address,
                      lat: place.latitude || 0,
                      lng: place.longitude || 0,
                    }
                  : null
              }
              onSelect={setAddress}
            />
            <input
              type="hidden"
              name="address"
              value={address?.address || ''}
            />
            <input type="hidden" name="latitude" value={address?.lat || 0} />
            <input type="hidden" name="longitude" value={address?.lng || 0} />
            {errors && <ZodErrors error={errors.address} />}
            {errors && <ZodErrors error={errors.latitude} />}
            {errors && <ZodErrors error={errors.longitude} />}
          </div>
        </div>
      </div>

      {/* Bottone Submit */}
      <div className="flex items-center justify-center mt-6">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800 text-white font-semibold py-2 rounded-lg transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? 'Caricamento...'
            : place
            ? 'Aggiorna locale'
            : 'Crea locale'}
        </Button>
      </div>
    </form>
  );
}
