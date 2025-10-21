# ImageDropArea

Un componente React per il caricamento di immagini con drag & drop e preview.

## Caratteristiche

- 🎯 **Drag & Drop**: Trascina e rilascia le immagini direttamente nell'area
- 🖼️ **Preview**: Mostra un'anteprima dell'immagine caricata
- ✅ **Validazione**: Controlla il tipo di file e la dimensione massima
- 🎨 **Temi**: Supporta sia tema chiaro che scuro
- ♿ **Accessibile**: Design responsive e accessibile

## Utilizzo

```tsx
import ImageDropArea from '@/components/ImageDropArea/ImageDropArea';
import { useState } from 'react';

function MyForm() {
  const [imageFile, setImageFile] = useState<File | null>(null);

  async function handleSubmit(formData: FormData) {
    // Aggiungi il file al FormData
    if (imageFile) {
      formData.set('image', imageFile);
    }

    // Invia al server...
  }

  return (
    <form action={handleSubmit}>
      <ImageDropArea
        onImageSelect={(file) => setImageFile(file)}
        onImageRemove={() => setImageFile(null)}
        defaultImageUrl="https://example.com/image.jpg"
        maxSizeMB={5}
      />
      <button type="submit">Salva</button>
    </form>
  );
}
```

## Props

| Prop              | Tipo                   | Default  | Descrizione                                            |
| ----------------- | ---------------------- | -------- | ------------------------------------------------------ |
| `onImageSelect`   | `(file: File) => void` | Required | Callback chiamata quando viene selezionata un'immagine |
| `onImageRemove`   | `() => void`           | Optional | Callback chiamata quando l'immagine viene rimossa      |
| `defaultImageUrl` | `string`               | Optional | URL dell'immagine da mostrare inizialmente             |
| `maxSizeMB`       | `number`               | `5`      | Dimensione massima del file in MB                      |
| `className`       | `string`               | Optional | Classi CSS aggiuntive per il container                 |

## Esempi

### Esempio base

```tsx
<ImageDropArea onImageSelect={(file) => console.log('Selected:', file)} />
```

### Con immagine di default

```tsx
<ImageDropArea
  defaultImageUrl="/placeholder.png"
  onImageSelect={(file) => setImage(file)}
  onImageRemove={() => setImage(null)}
/>
```

### Con dimensione personalizzata

```tsx
<ImageDropArea maxSizeMB={10} onImageSelect={(file) => setImage(file)} />
```

### Integrazione con Server Actions (Next.js)

```tsx
'use client';
import { useState } from 'react';
import ImageDropArea from '@/components/ImageDropArea/ImageDropArea';
import { createPlace } from '@/lib/server/place';

function PlaceForm() {
  const [imageFile, setImageFile] = useState<File | null>(null);

  async function handleSubmit(formData: FormData) {
    // Aggiungi il file al FormData prima di inviare
    if (imageFile) {
      formData.set('image', imageFile);
    }

    // Chiama la server action
    await createPlace(formData);
  }

  return (
    <form action={handleSubmit}>
      <input name="name" placeholder="Nome" />
      <ImageDropArea
        onImageSelect={setImageFile}
        onImageRemove={() => setImageFile(null)}
      />
      <button type="submit">Crea Place</button>
    </form>
  );
}
```

### Upload su Supabase Storage

Il file viene automaticamente caricato su Supabase Storage quando viene processato dalla server action. Vedi `SUPABASE_STORAGE_SETUP.md` per la configurazione del bucket.

## Validazione

Il componente valida automaticamente:

- **Tipo di file**: Accetta solo immagini (image/\*)
- **Dimensione**: Controlla che il file non superi la dimensione massima specificata

Gli errori vengono visualizzati sotto l'area di drop.
