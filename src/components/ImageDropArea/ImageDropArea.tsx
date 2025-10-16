'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageDropAreaProps {
  onImageSelect: (file: File) => void;
  onImageRemove?: () => void;
  defaultImageUrl?: string;
  maxSizeMB?: number;
  className?: string;
  name?: string;
}

export default function ImageDropArea({
  onImageSelect,
  onImageRemove,
  defaultImageUrl,
  maxSizeMB = 5,
  className,
  name = 'image',
}: ImageDropAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    defaultImageUrl || null,
  );
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback(
    (file: File): boolean => {
      // Controlla se è un'immagine
      if (!file.type.startsWith('image/')) {
        setError("Il file deve essere un'immagine");
        return false;
      }

      // Controlla la dimensione
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSizeMB) {
        setError(`L'immagine deve essere massimo ${maxSizeMB}MB`);
        return false;
      }

      setError(null);
      return true;
    },
    [maxSizeMB],
  );

  const handleFile = useCallback(
    (file: File) => {
      if (validateFile(file)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        onImageSelect(file);
      }
    },
    [onImageSelect, validateFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile],
  );

  const handleRemove = useCallback(() => {
    setPreview(null);
    setError(null);
    onImageRemove?.();
  }, [onImageRemove]);

  return (
    <div className={cn('w-full', className)}>
      {!preview ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-all',
            'hover:bg-gray-50 dark:hover:bg-gray-800/50',
            isDragging
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
              : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30',
            error && 'border-red-500 dark:border-red-500',
          )}
        >
          <input
            type="file"
            name={name}
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload
              className={cn(
                'w-12 h-12 mb-4 transition-colors',
                isDragging
                  ? 'text-emerald-500'
                  : 'text-gray-400 dark:text-gray-500',
              )}
            />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Clicca per caricare</span> o
              trascina qui
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG, GIF fino a {maxSizeMB}MB
            </p>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-700">
          <Image src={preview} alt="Preview" fill className="object-cover" />
          <Button
            type="button"
            onClick={handleRemove}
            size="icon"
            variant="destructive"
            className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-lg z-10"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-md text-xs flex items-center gap-1 z-10">
            <ImageIcon className="h-3 w-3" />
            Immagine caricata
          </div>
        </div>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
