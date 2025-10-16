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

function MyForm() {
  const [imageFile, setImageFile] = useState<File | null>(null);

  return (
    <form>
      <ImageDropArea
        name="image"
        onImageSelect={(file) => setImageFile(file)}
        onImageRemove={() => setImageFile(null)}
        defaultImageUrl="https://example.com/image.jpg"
        maxSizeMB={5}
      />
    </form>
  );
}
```

## Props

| Prop              | Tipo                   | Default   | Descrizione                                            |
| ----------------- | ---------------------- | --------- | ------------------------------------------------------ |
| `onImageSelect`   | `(file: File) => void` | Required  | Callback chiamata quando viene selezionata un'immagine |
| `onImageRemove`   | `() => void`           | Optional  | Callback chiamata quando l'immagine viene rimossa      |
| `defaultImageUrl` | `string`               | Optional  | URL dell'immagine da mostrare inizialmente             |
| `maxSizeMB`       | `number`               | `5`       | Dimensione massima del file in MB                      |
| `className`       | `string`               | Optional  | Classi CSS aggiuntive per il container                 |
| `name`            | `string`               | `'image'` | Nome del campo per il form                             |

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

### Integrazione con FormData

```tsx
function MyForm() {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (imageFile) {
      formData.set('image', imageFile);
    }

    // Invia formData al server...
  };

  return (
    <form onSubmit={handleSubmit}>
      <ImageDropArea
        name="image"
        onImageSelect={setImageFile}
        onImageRemove={() => setImageFile(null)}
      />
      <button type="submit">Invia</button>
    </form>
  );
}
```

## Validazione

Il componente valida automaticamente:

- **Tipo di file**: Accetta solo immagini (image/\*)
- **Dimensione**: Controlla che il file non superi la dimensione massima specificata

Gli errori vengono visualizzati sotto l'area di drop.
