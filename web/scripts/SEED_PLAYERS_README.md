# Script di Seed per Assegnazione Giocatori ai Matches

Questo script assegna automaticamente giocatori casuali ai matches esistenti, popolando la tabella `profiles_matches`.

## Cosa fa lo script

1. **Recupera tutti i places** dal database
2. **Recupera tutti i profili** (utenti) disponibili
3. **Per ogni match di ogni place**:
   - Assegna un numero casuale di giocatori (tra `min_players` e `max_players`)
   - Seleziona giocatori casuali dalla lista di profili
   - Assegna punti casuali (0-100) a ogni giocatore
   - Imposta lo stato di conferma (80% confermati, 20% in attesa)

## Prerequisiti

⚠️ **IMPORTANTE**: Prima di eseguire questo script, assicurati di aver eseguito:

1. **Script seed places/matches**: `npm run seed`
   - Crea i places e i matches nel database
2. **Script seed utenti**: `npm run seed:users`
   - Crea i profili utente necessari

Configura le variabili d'ambiente nel file `.env.local` (nella cartella web):

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Come eseguirlo

### Dalla cartella web:

```bash
cd web
npm run seed:players
```

### Dalla root del progetto:

```bash
npm run seed:players
```

### Direttamente:

```bash
npx tsx web/scripts/seed-match-players.ts
```

## Output dello script

Lo script mostrerà:

- ✅ Conferme per ogni place processato
- 📊 Riepilogo con statistiche dettagliate
- 👥 Esempi delle prime 10 assegnazioni create

### Esempio di output:

```
🎮 Inizio assegnazione giocatori ai matches...

📍 Recupero places...
✅ Trovati 10 places

👥 Recupero profili...
✅ Trovati 20 profili

🏢 Processando matches per: Circolo Ricreativo Centro...
   📋 Trovati 10 matches
   ✅ Assegnati giocatori a 10 matches di Circolo Ricreativo Centro

🏢 Processando matches per: Ludoteca Il Dado Rosso...
   📋 Trovati 10 matches
   ✅ Assegnati giocatori a 10 matches di Ludoteca Il Dado Rosso

...

💾 Inserimento di 450 assegnazioni nel database...
   ✅ Inserito batch 1/5
   ✅ Inserito batch 2/5
   ...

🎉 Processo completato con successo!

📊 Riepilogo:
   - Places processati: 10
   - Profili disponibili: 20
   - Assegnazioni create: 450
   - Assegnazioni confermate: 360 (80%)
   - Assegnazioni non confermate: 90 (20%)

👥 Primi 10 esempi di assegnazioni:
   ✓ marcorossi → Torneo del Lunedì - Circolo Ricreativo Centro (87 punti)
   ✓ giuliaferrari → Serata Strategica - Circolo Ricreativo Centro (64 punti)
   ⏳ lucarusso → Campionato Mensile - Circolo Ricreativo Centro (42 punti)
   ...
```

## Dettagli tecnici

### Logica di assegnazione

- **Numero di giocatori**: Casuale tra `min_players` e `max_players` del match
- **Selezione giocatori**: Casuali dalla lista di profili disponibili
- **Punti**: Numero casuale tra 0 e 100
- **Conferma**: 80% confermati (`confirmed: true`), 20% in attesa (`confirmed: false`)

### Batch insert

Lo script inserisce i dati in batch da 100 record per volta per evitare problemi di performance con grandi quantità di dati.

## Pulizia dei dati

Se vuoi rimuovere le assegnazioni di test create dallo script:

```sql
-- Elimina tutte le assegnazioni
DELETE FROM profiles_matches;

-- Oppure elimina solo quelle relative a specifici matches
DELETE FROM profiles_matches WHERE match_id IN (
  SELECT id FROM matches WHERE place_id IN (
    SELECT id FROM places WHERE name LIKE 'Circolo%'
  )
);
```

## Personalizzazione

Puoi modificare lo script per:

- Cambiare la percentuale di assegnazioni confermate (default 80%)
- Modificare il range di punti (default 0-100)
- Cambiare la logica di selezione dei giocatori
- Aggiungere vincoli specifici (es. evitare duplicati nello stesso match)

## Ordine consigliato di esecuzione

Per popolare completamente il database di test:

```bash
# 1. Crea places, matches e collection
npm run seed

# 2. Crea utenti
npm run seed:users

# 3. Assegna giocatori ai matches
npm run seed:players
```

## Risoluzione problemi

### Errore: "Nessun place trovato"

- Esegui prima `npm run seed` per creare places e matches

### Errore: "Nessun profilo trovato"

- Esegui prima `npm run seed:users` per creare gli utenti

### Errore: "Nessun match trovato per [place]"

- I matches potrebbero non essere stati creati per quel place
- Verifica che lo script `seed-test-data.ts` abbia creato i matches correttamente

### Errore nell'inserimento batch

- Potrebbe essere un problema di connessione o di policy RLS
- Verifica le policy della tabella `profiles_matches` su Supabase
