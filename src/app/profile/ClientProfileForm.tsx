'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ZodErrors } from '@/components/ZodErrors';
import { Profile } from '@/types';
import { toast } from 'sonner';
import ImageDropArea from '@/components/ImageDropArea/ImageDropArea';
import { editProfile } from '@/lib/server/profile';

export default function ClientProfileForm({ profile }: { profile: Profile }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [errors, setErrors] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function action(formData: FormData) {
    if (selectedImage) {
      formData.set('image', selectedImage);
    }
    let res;
    if (profile && profile.id) {
      res = await editProfile(formData, profile.id);
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
            defaultImageUrl={profile?.image || undefined}
            maxSizeMB={1}
            size="md"
          />
          {errors && <ZodErrors error={errors.image} />}
        </div>

        {/* Colonna Campi - Destra */}
        <div className="flex-1 space-y-4">
          <div>
            <label
              htmlFor="firstname"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Nome
            </label>
            <Input
              type="text"
              id="firstname"
              name="firstname"
              required
              className="focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              defaultValue={profile.firstname || ''}
            />
            {errors && <ZodErrors error={errors.name} />}
          </div>
          <div>
            <label
              htmlFor="lastname"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Cognome
            </label>
            <Input
              type="text"
              id="lastname"
              name="lastname"
              required
              className="focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              defaultValue={profile.lastname || ''}
            />
            {errors && <ZodErrors error={errors.lastname} />}
          </div>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Username
            </label>
            <Input
              type="text"
              id="username"
              name="username"
              required
              className="focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              defaultValue={profile.username || ''}
            />
            {errors && <ZodErrors error={errors.username} />}
          </div>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              BGG Username
            </label>
            <Input
              type="text"
              id="bgg_username"
              name="bgg_username"
              className="focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              defaultValue={profile.bgg_username || ''}
            />
            {errors && <ZodErrors error={errors.bgg_username} />}
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
          {isLoading ? 'Caricamento...' : 'Aggiorna profilo'}
        </Button>
      </div>
    </form>
  );
}
