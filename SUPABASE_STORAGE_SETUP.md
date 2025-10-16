# Configurazione Supabase Storage per le Immagini

Per permettere l'upload delle immagini dei places su Supabase, devi configurare un bucket di storage.

## 📋 Passaggi di Configurazione

### 1. Crea il Bucket

1. Vai su [Supabase Dashboard](https://supabase.com/dashboard)
2. Seleziona il tuo progetto
3. Nel menu laterale, clicca su **Storage**
4. Clicca su **New bucket**
5. Configura il bucket:
   - **Name**: `places-images`
   - **Public bucket**: ✅ Selezionato (per permettere l'accesso pubblico alle immagini)
   - Clicca su **Create bucket**

### 2. Configura le Policy RLS (Row Level Security)

Per permettere agli utenti autenticati di caricare immagini, devi creare delle policy:

#### Policy per l'Upload (INSERT)

```sql
-- Permetti agli utenti autenticati di caricare immagini
CREATE POLICY "Authenticated users can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'places-images');
```

#### Policy per la Lettura (SELECT)

```sql
-- Permetti a tutti di vedere le immagini (pubblico)
CREATE POLICY "Public can view images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'places-images');
```

#### Policy per l'Aggiornamento (UPDATE)

```sql
-- Permetti agli utenti autenticati di aggiornare le proprie immagini
CREATE POLICY "Authenticated users can update images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'places-images')
WITH CHECK (bucket_id = 'places-images');
```

#### Policy per l'Eliminazione (DELETE)

```sql
-- Permetti agli utenti autenticati di eliminare immagini
CREATE POLICY "Authenticated users can delete images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'places-images');
```

### 3. Applica le Policy tramite Dashboard

1. Nella pagina del bucket `places-images`, clicca su **Policies**
2. Per ogni tipo di operazione (INSERT, SELECT, UPDATE, DELETE):
   - Clicca su **New policy**
   - Seleziona **Create a custom policy**
   - Incolla il codice SQL corrispondente
   - Clicca su **Review** e poi **Save policy**

### 4. (Opzionale) Configura Limiti di Upload

Puoi configurare limiti di dimensione e tipo di file:

1. Vai su **Settings** → **Storage**
2. Configura:
   - **Max file size**: 5 MB (già gestito nel codice)
   - **Allowed MIME types**: `image/*`

## 🔒 Sicurezza Avanzata (Opzionale)

Se vuoi che solo i manager dei places possano caricare/modificare immagini, puoi creare policy più restrittive:

```sql
-- Solo i manager possono caricare immagini per i loro places
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
```

## 🧪 Test della Configurazione

Dopo aver configurato il bucket e le policy, testa l'upload:

1. Vai su `/places/new` o modifica un place esistente
2. Trascina un'immagine nell'area di drop
3. Compila gli altri campi e salva
4. Verifica che l'immagine sia stata caricata su Supabase Storage
5. Controlla che l'URL dell'immagine sia salvato nel database

## 📁 Struttura delle Cartelle

Le immagini vengono salvate con questa struttura:

```
places-images/
  └── places/
      ├── 1697123456789-image1.jpg
      ├── 1697123456790-image2.png
      └── ...
```

Il nome del file include un timestamp per evitare conflitti.

## 🔧 Troubleshooting

### Errore: "Policy violation"

- Verifica che le policy RLS siano state create correttamente
- Controlla che l'utente sia autenticato

### Errore: "Bucket not found"

- Verifica che il bucket `places-images` sia stato creato
- Controlla che sia pubblico se vuoi accesso pubblico alle immagini

### L'immagine non si vede

- Verifica che la policy SELECT sia configurata correttamente
- Controlla l'URL dell'immagine nel database
- Assicurati che il bucket sia pubblico

## 📚 Risorse

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Row Level Security in Supabase](https://supabase.com/docs/guides/auth/row-level-security)
