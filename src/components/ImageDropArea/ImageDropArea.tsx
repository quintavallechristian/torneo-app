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
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export default function ImageDropArea({
  onImageSelect,
  onImageRemove,
  defaultImageUrl,
  maxSizeMB = 5,
  className,
  size = 'md',
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

  // Mappa delle dimensioni predefinite (quadrate)
  const sizeClasses = {
    sm: 'w-32 h-32', // 128px
    md: 'w-48 h-48', // 160px
    lg: 'w-60 h-60', // 240px
    xl: 'w-80 h-80', // 320px
    full: 'w-full aspect-square', // Full width, mantiene aspect ratio
  };

  // Dimensioni icona e testo in base alla size
  const contentSize = {
    sm: { icon: 'w-8 h-8', text: 'text-xs', subtext: 'text-[10px]' },
    md: { icon: 'w-10 h-10', text: 'text-sm', subtext: 'text-xs' },
    lg: { icon: 'w-12 h-12', text: 'text-sm', subtext: 'text-xs' },
    xl: { icon: 'w-14 h-14', text: 'text-base', subtext: 'text-sm' },
    full: { icon: 'w-12 h-12', text: 'text-sm', subtext: 'text-xs' },
  };

  return (
    <div className={cn(sizeClasses[size], className)}>
      {!preview ? (
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'relative flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-lg cursor-pointer transition-all p-4',
            'hover:bg-gray-50 dark:hover:bg-gray-800/50',
            isDragging
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
              : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30',
            error && 'border-red-500 dark:border-red-500',
          )}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center text-center">
            <Upload
              className={cn(
                contentSize[size].icon,
                'mb-2 transition-colors',
                isDragging
                  ? 'text-emerald-500'
                  : 'text-gray-400 dark:text-gray-500',
              )}
            />
            <p
              className={cn(
                contentSize[size].text,
                'mb-1 text-gray-600 dark:text-gray-300',
              )}
            >
              <span className="font-semibold">Clicca per caricare</span>
              <br />o trascina qui
            </p>
            <p
              className={cn(
                contentSize[size].subtext,
                'text-gray-500 dark:text-gray-400',
              )}
            >
              PNG, JPG, GIF fino a {maxSizeMB}MB
            </p>
          </div>
        </label>
      ) : (
        <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-700">
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
