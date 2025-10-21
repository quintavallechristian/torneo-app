'use server';

import { createClient } from '@/utils/supabase/server';

/**
 * Carica un'immagine su Supabase Storage
 * @param file - File da caricare
 * @param bucket - Nome del bucket (default: 'places-images')
 * @param folder - Cartella all'interno del bucket (opzionale)
 * @returns URL pubblico dell'immagine caricata o null in caso di errore
 */
export async function uploadImage(
  file: File,
  bucket: string = 'places-images',
  folder?: string,
): Promise<{ url: string | null; error: string | null }> {
  try {
    const supabase = await createClient();

    // Genera un nome file unico usando timestamp e nome originale
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}-${sanitizedFileName}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Converti il File in ArrayBuffer per Supabase
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload del file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Error uploading image:', error);
      return { url: null, error: error.message };
    }

    // Ottieni l'URL pubblico
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('Unexpected error uploading image:', error);
    return {
      url: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Elimina un'immagine da Supabase Storage
 * @param imageUrl - URL dell'immagine da eliminare
 * @param bucket - Nome del bucket (default: 'places-images')
 * @returns true se eliminata con successo, false altrimenti
 */
export async function deleteImage(
  imageUrl: string,
  bucket: string = 'places-images',
): Promise<boolean> {
  try {
    const supabase = await createClient();

    // Estrai il path dell'immagine dall'URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split(`/${bucket}/`);
    if (pathParts.length < 2) {
      console.error('Invalid image URL format');
      return false;
    }
    const filePath = pathParts[1];

    // Elimina il file
    const { error } = await supabase.storage.from(bucket).remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error deleting image:', error);
    return false;
  }
}

/**
 * Sostituisce un'immagine: elimina quella vecchia e carica quella nuova
 * @param newFile - Nuovo file da caricare
 * @param oldImageUrl - URL dell'immagine vecchia da eliminare (opzionale)
 * @param bucket - Nome del bucket (default: 'places-images')
 * @param folder - Cartella all'interno del bucket (opzionale)
 * @returns URL pubblico della nuova immagine o null in caso di errore
 */
export async function replaceImage(
  newFile: File,
  oldImageUrl?: string,
  bucket: string = 'places-images',
  folder?: string,
): Promise<{ url: string | null; error: string | null }> {
  // Carica la nuova immagine
  const uploadResult = await uploadImage(newFile, bucket, folder);

  // Se il caricamento è riuscito ed esiste un'immagine vecchia, eliminala
  if (uploadResult.url && oldImageUrl) {
    await deleteImage(oldImageUrl, bucket);
  }

  return uploadResult;
}
