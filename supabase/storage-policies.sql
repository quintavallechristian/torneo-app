-- ============================================
-- Setup Storage Policies per places-images
-- ============================================
-- Esegui questo script nella SQL Editor di Supabase
-- dopo aver creato il bucket 'places-images'

-- 1. Policy per l'Upload (INSERT)
-- Permetti agli utenti autenticati di caricare immagini
CREATE POLICY "Authenticated users can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'places-images');

-- 2. Policy per la Lettura (SELECT)
-- Permetti a tutti di vedere le immagini (pubblico)
CREATE POLICY "Public can view images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'places-images');

-- 3. Policy per l'Aggiornamento (UPDATE)
-- Permetti agli utenti autenticati di aggiornare le proprie immagini
CREATE POLICY "Authenticated users can update images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'places-images')
WITH CHECK (bucket_id = 'places-images');

-- 4. Policy per l'Eliminazione (DELETE)
-- Permetti agli utenti autenticati di eliminare immagini
CREATE POLICY "Authenticated users can delete images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'places-images');

-- ============================================
-- Policy Avanzate (Opzionali)
-- ============================================
-- Decommentare per policy più restrittive

/*
-- Solo i place managers possono caricare immagini
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;

CREATE POLICY "Only place managers can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'places-images' AND
  EXISTS (
    SELECT 1 FROM users_permissions up
    WHERE up.user_id = auth.uid()
    AND up.user_action_id = 4  -- ManagePlaces action
  )
);
*/

/*
-- Solo i place managers possono eliminare immagini
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;

CREATE POLICY "Only place managers can delete images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'places-images' AND
  EXISTS (
    SELECT 1 FROM users_permissions up
    WHERE up.user_id = auth.uid()
    AND up.user_action_id = 4  -- ManagePlaces action
  )
);
*/

-- ============================================
-- Verifica le policy create
-- ============================================
-- Esegui questa query per vedere tutte le policy del bucket
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
ORDER BY policyname;
