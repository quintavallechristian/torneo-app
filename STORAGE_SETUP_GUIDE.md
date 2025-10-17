# 📦 Guida Completa Setup Supabase Storage

Questa guida ti aiuta a configurare correttamente i bucket di storage su Supabase per la tua applicazione.

## 🎯 Panoramica

L'applicazione utilizza tre bucket principali:

- **profiles-images**: per le immagini dei profili utente
- **places-images**: per le immagini dei luoghi
- **matches-images**: per le immagini dei match (opzionale)

## 📋 Setup Passo-Passo

### Step 1: Accedi alla Dashboard Supabase

1. Vai su [Supabase Dashboard](https://supabase.com/dashboard)
2. Seleziona il tuo progetto
3. Nel menu laterale, clicca su **Storage**

### Step 2: Crea i Bucket

Per ogni bucket, segui questi passaggi:

#### 2.1 Crea `profiles-images`

1. Clicca su **New bucket**
2. Configura:
   - **Name**: `profiles-images`
   - **Public bucket**: ✅ **Selezionato** (per accesso pubblico)
3. Clicca su **Create bucket**

#### 2.2 Crea `places-images`

1. Clicca su **New bucket**
2. Configura:
   - **Name**: `places-images`
   - **Public bucket**: ✅ **Selezionato**
3. Clicca su **Create bucket**

#### 2.3 Crea `matches-images` (opzionale)

1. Clicca su **New bucket**
2. Configura:
   - **Name**: `matches-images`
   - **Public bucket**: ✅ **Selezionato**
3. Clicca su **Create bucket**

### Step 3: Configura le Policy RLS

Dopo aver creato i bucket, devi configurare le Row-Level Security policies.

#### Metodo 1: SQL Editor (Raccomandato)

1. Nel menu laterale, clicca su **SQL Editor**
2. Clicca su **New query**
3. Copia e incolla il contenuto del file `supabase/storage-setup-complete.sql`
4. Clicca su **Run** per eseguire lo script

#### Metodo 2: Policy Manager (Manuale)

Per ogni bucket, devi creare 4 policy (INSERT, SELECT, UPDATE, DELETE).

**Esempio per `profiles-images`:**

1. Vai su **Storage** → `profiles-images` → **Policies**
2. Clicca su **New policy**

**Policy INSERT:**

```sql
CREATE POLICY "Authenticated users can upload profile images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profiles-images');
```

**Policy SELECT:**

```sql
CREATE POLICY "Public can view profile images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profiles-images');
```

**Policy UPDATE:**

```sql
CREATE POLICY "Authenticated users can update profile images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'profiles-images')
WITH CHECK (bucket_id = 'profiles-images');
```

**Policy DELETE:**

```sql
CREATE POLICY "Authenticated users can delete profile images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'profiles-images');
```

Ripeti per gli altri bucket sostituendo `profiles-images` con il nome appropriato.

### Step 4: Verifica la Configurazione

#### 4.1 Verifica i Bucket

Nella SQL Editor, esegui:

```sql
SELECT
  id,
  name,
  public,
  created_at
FROM storage.buckets
ORDER BY name;
```

Dovresti vedere i tre bucket creati.

#### 4.2 Verifica le Policy

Nella SQL Editor, esegui:

```sql
SELECT
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'objects'
  AND policyname LIKE '%images%'
ORDER BY policyname;
```

Dovresti vedere 12 policy (4 per ogni bucket).

### Step 5: Test della Configurazione

#### Test Upload Profilo

1. Vai su `/profile/edit`
2. Carica un'immagine del profilo
3. Salva il profilo
4. Verifica che l'immagine sia visibile

#### Test Upload Place

1. Vai su `/places/new`
2. Carica un'immagine del luogo
3. Salva il place
4. Verifica che l'immagine sia visibile

## 🔒 Policy di Sicurezza Avanzate (Opzionale)

Se vuoi implementare policy più restrittive, puoi modificare le policy per:

### Solo il proprietario può modificare la propria immagine profilo

```sql
-- Sostituisci la policy UPDATE per profiles-images
DROP POLICY IF EXISTS "Authenticated users can update profile images" ON storage.objects;

CREATE POLICY "Users can only update their own profile images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profiles-images' AND
  -- Verifica che l'utente stia modificando la propria immagine
  name LIKE 'profiles/' || auth.uid() || '%'
)
WITH CHECK (
  bucket_id = 'profiles-images' AND
  name LIKE 'profiles/' || auth.uid() || '%'
);
```

### Solo i manager possono gestire immagini dei places

```sql
-- Sostituisci le policy per places-images
DROP POLICY IF EXISTS "Authenticated users can upload places images" ON storage.objects;

CREATE POLICY "Only managers can upload places images"
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
```

## 🐛 Troubleshooting

### Errore: "new row violates row-level security policy"

**Causa**: Le policy RLS non sono state create o sono configurate male.

**Soluzione**:

1. Verifica che i bucket siano stati creati
2. Esegui lo script SQL completo in `supabase/storage-setup-complete.sql`
3. Verifica che le policy siano state create con la query di verifica

### Errore: "Bucket not found"

**Causa**: Il bucket non esiste.

**Soluzione**:

1. Vai su **Storage** nella dashboard
2. Verifica che il bucket esista
3. Se non esiste, crealo seguendo lo Step 2

### Errore: "Invalid bucket name"

**Causa**: Il nome del bucket nel codice non corrisponde al nome su Supabase.

**Soluzione**:

1. Verifica i nomi dei bucket nella dashboard
2. Controlla che corrispondano ai nomi usati nel codice (`storage.ts`, `profile.ts`, ecc.)

### L'immagine non si vede dopo l'upload

**Causa**: Il bucket non è pubblico o la policy SELECT non è configurata.

**Soluzione**:

1. Vai su **Storage** → seleziona il bucket
2. Clicca su **Settings**
3. Abilita **Public bucket**
4. Verifica che la policy SELECT sia creata per `public`

### Errore: "File size too large"

**Causa**: Il file supera il limite di dimensione.

**Soluzione**:

1. Il limite nel codice è 5MB (configurabile in `storage.ts`)
2. Puoi aumentare il limite modificando il codice
3. Su Supabase, vai su **Settings** → **Storage** per configurare limiti globali

## 📁 Struttura dei File nei Bucket

### profiles-images

```
profiles-images/
  └── profiles/
      ├── 1697123456789-avatar1.jpg
      ├── 1697123456790-avatar2.png
      └── ...
```

### places-images

```
places-images/
  └── places/
      ├── 1697123456789-place1.jpg
      ├── 1697123456790-place2.png
      └── ...
```

### matches-images

```
matches-images/
  └── matches/
      ├── 1697123456789-match1.jpg
      ├── 1697123456790-match2.png
      └── ...
```

## 🔧 Configurazione nel Codice

### Verifica la configurazione in `storage.ts`

Il file dovrebbe avere queste funzioni:

- `uploadImage(file, bucket, folder)` - Carica un'immagine
- `deleteImage(imageUrl, bucket)` - Elimina un'immagine
- `replaceImage(newFile, oldImageUrl, bucket, folder)` - Sostituisce un'immagine

### Verifica l'utilizzo nei form

**Profile Edit** (`profile.ts`):

```typescript
await replaceImage(
  imageFile,
  existingProfile?.image ?? undefined,
  "profiles-images",
  "profiles"
);
```

**Place Create/Edit** (`place.ts`):

```typescript
await replaceImage(
  imageFile,
  existingPlace?.image ?? undefined,
  "places-images",
  "places"
);
```

## 📚 Risorse Utili

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Policies](https://supabase.com/docs/guides/storage/security/access-control)

## ✅ Checklist

- [ ] Bucket `profiles-images` creato e pubblico
- [ ] Bucket `places-images` creato e pubblico
- [ ] Bucket `matches-images` creato e pubblico (opzionale)
- [ ] Policy RLS configurate per tutti i bucket
- [ ] Verificato upload profilo
- [ ] Verificato upload place
- [ ] Testato visualizzazione immagini
