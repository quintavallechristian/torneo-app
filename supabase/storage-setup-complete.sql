-- ============================================
-- Setup completo Supabase Storage Buckets
-- ============================================
-- Esegui questo script nella SQL Editor di Supabase

-- ============================================
-- 1. BUCKET: places-images
-- ============================================

-- Policy per l'Upload (INSERT)
CREATE POLICY "Authenticated users can upload places images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'places-images');

-- Policy per la Lettura (SELECT)
CREATE POLICY "Public can view places images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'places-images');

-- Policy per l'Aggiornamento (UPDATE)
CREATE POLICY "Authenticated users can update places images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'places-images')
WITH CHECK (bucket_id = 'places-images');

-- Policy per l'Eliminazione (DELETE)
CREATE POLICY "Authenticated users can delete places images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'places-images');

-- ============================================
-- 2. BUCKET: profiles-images
-- ============================================

-- Policy per l'Upload (INSERT)
-- Gli utenti autenticati possono caricare immagini del profilo
CREATE POLICY "Authenticated users can upload profile images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profiles-images');

-- Policy per la Lettura (SELECT)
-- Tutti possono vedere le immagini del profilo (pubblico)
CREATE POLICY "Public can view profile images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profiles-images');

-- Policy per l'Aggiornamento (UPDATE)
-- Gli utenti autenticati possono aggiornare le proprie immagini del profilo
CREATE POLICY "Authenticated users can update profile images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'profiles-images')
WITH CHECK (bucket_id = 'profiles-images');

-- Policy per l'Eliminazione (DELETE)
-- Gli utenti autenticati possono eliminare immagini del profilo
CREATE POLICY "Authenticated users can delete profile images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'profiles-images');

-- ============================================
-- 3. BUCKET: matches-images (opzionale)
-- ============================================

-- Policy per l'Upload (INSERT)
CREATE POLICY "Authenticated users can upload match images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'matches-images');

-- Policy per la Lettura (SELECT)
CREATE POLICY "Public can view match images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'matches-images');

-- Policy per l'Aggiornamento (UPDATE)
CREATE POLICY "Authenticated users can update match images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'matches-images')
WITH CHECK (bucket_id = 'matches-images');

-- Policy per l'Eliminazione (DELETE)
CREATE POLICY "Authenticated users can delete match images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'matches-images');

-- ============================================
-- Verifica le policy create
-- ============================================
-- Esegui questa query per vedere tutte le policy dei bucket
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'objects'
  AND policyname LIKE '%images%'
ORDER BY policyname;

-- ============================================
-- Verifica i bucket esistenti
-- ============================================
SELECT 
  id,
  name,
  public,
  created_at
FROM storage.buckets
ORDER BY name;
