# Script di Seed dei Dati di Test

Questa cartella contiene script per generare automaticamente dati di test nel database Supabase.

## Script disponibili

### 1. `seed-test-data.ts` - Seed Places e Matches

Crea places, matches e collection di giochi.

### 2. `seed-users.ts` - Seed Utenti

Crea 20 utenti di test con profili e ruoli.

### 3. `seed-match-players.ts` - Seed Giocatori nei Matches

Assegna giocatori casuali ai matches esistenti.

## 🚀 Ordine consigliato di esecuzione

Per popolare completamente il database di test, esegui gli script in questo ordine:

```bash
# 1. Crea places, matches e collection di giochi
npm run seed

# 2. Crea utenti
npm run seed:users

# 3. Assegna giocatori ai matches
npm run seed:players
```

### 🎯 Oppure esegui tutto in una volta!

```bash
# Esegue automaticamente tutti e 3 gli script in sequenza
npm run seed:all
```

Questo comando eseguirà automaticamente tutti gli script nell'ordine corretto e mostrerà un riepilogo finale.

---

## Script 1: Seed Places e Matches

### Cosa fa lo script

1. **Recupera i giochi** con `bgg_rank < 100` dal database
2. **Crea 10 places** in diverse città italiane con:
   - Nome, indirizzo e descrizione
   - Coordinate geografiche (latitudine/longitudine)
3. **Crea 100 matches** (10 per ogni place) con:
   - Game ID selezionato casualmente tra i giochi top 100
   - Date di inizio e fine casuali nell'ultimo mese
   - Numero minimo e massimo di giocatori
   - Nome e descrizione del match
4. **Aggiunge 10 giochi alla collection di ogni place** (`places_games`):
   - 10 giochi casuali diversi per ogni place
   - Numero di copie casuale (1-3) per ogni gioco
   - Campo `rented` impostato a 0

## Prerequisiti

1. Assicurati di avere giochi nel database con `bgg_rank < 100`
2. Configura le variabili d'ambiente nel file `.env.local` (nella cartella web):

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

⚠️ **Nota**: Hai bisogno della **Service Role Key** (non la chiave pubblica anon) per poter inserire dati nel database. Puoi trovarla nelle impostazioni del tuo progetto Supabase.

## Come eseguire lo script

### 1. Installa le dipendenze necessarie

Le dipendenze necessarie (`tsx`, `dotenv`, `@supabase/supabase-js`) sono già incluse nel progetto. Se non lo sono, esegui:

```bash
npm install -D tsx dotenv
npm install @supabase/supabase-js
```

### 2. Carica le variabili d'ambiente

Aggiungi la tua **Service Role Key** al file `.env.local` (nella cartella web):

```bash
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 3. Esegui lo script

Dalla cartella `web`:

```bash
npm run seed
```

Oppure dalla root del progetto:

```bash
npm run seed --workspace=web
```

O direttamente:

```bash
npx tsx web/scripts/seed-test-data.ts
```

## Output dello script

Lo script mostrerà:

- ✅ Conferme delle operazioni completate
- 📊 Riepilogo dei dati creati (places, matches, giochi nelle collection)
- 📝 Esempi di places e matches creati

## Pulizia dei dati

Se vuoi rimuovere i dati di test creati dallo script, puoi usare Supabase Studio o eseguire query SQL per eliminare:

```sql
-- Elimina i giochi dalle collection dei places
DELETE FROM places_games WHERE place_id IN (
  SELECT id FROM places WHERE name LIKE 'Circolo%' OR name LIKE 'Ludoteca%'
);

-- Elimina i matches creati
DELETE FROM matches WHERE place_id IN (
  SELECT id FROM places WHERE name LIKE 'Circolo%' OR name LIKE 'Ludoteca%'
);

-- Elimina i places creati
DELETE FROM places WHERE name IN (
  'Circolo Ricreativo Centro',
  'Ludoteca Il Dado Rosso',
  'Taverna dei Giocatori',
  -- ... altri nomi
);
```

---

## Script 2: Seed Utenti

### Cosa fa

1. **Crea 20 utenti** tramite Supabase Auth Admin API
2. **Crea profili** con nomi e cognomi italiani casuali
3. **Assegna ruoli**: 70% User, 30% Manager

### Come eseguirlo

```bash
# Dalla cartella web
npm run seed:users

# Dalla root
npm run seed:users
```

### Credenziali

- **Email**: `[nome][cognome]@test.com` (es. `marcorossi@test.com`)
- **Password**: `Test1234!` (uguale per tutti)

📖 Per maggiori dettagli, vedi [SEED_USERS_README.md](./SEED_USERS_README.md)

---

## Script 3: Seed Giocatori nei Matches

### Cosa fa

1. **Assegna giocatori casuali** ai matches esistenti
2. **Popola la tabella `profiles_matches`** con:
   - Numero di giocatori tra min_players e max_players del match
   - Punti casuali (0-100) per ogni giocatore
   - Stato di conferma (80% confermati, 20% in attesa)

### Come eseguirlo

⚠️ **Prerequisiti**: Esegui prima `npm run seed` e `npm run seed:users`

```bash
# Dalla cartella web
npm run seed:players

# Dalla root
npm run seed:players
```

📖 Per maggiori dettagli, vedi [SEED_PLAYERS_README.md](./SEED_PLAYERS_README.md)

---

## Personalizzazione

Puoi modificare gli script per:

- Cambiare il numero di places, matches o utenti
- Modificare i dati dei places (nomi, indirizzi, coordinate)
- Cambiare i criteri di selezione dei giochi (es. `bgg_rank < 50`)
- Aggiungere altri campi ai dati generati
- Modificare la distribuzione dei ruoli
- Cambiare la percentuale di conferme nei matches

## Risoluzione problemi

### Errore: "Errore nel recupero dei giochi"

- Verifica che ci siano giochi nel database con `bgg_rank < 100`
- Controlla che la connessione a Supabase funzioni

### Errore: "NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY devono essere configurati"

- Assicurati di avere il file `.env.local` nella cartella web
- Verifica che le variabili d'ambiente siano corrette

### Errore di permessi

- Controlla di usare la **Service Role Key** e non la chiave pubblica
- Verifica le policy RLS (Row Level Security) su Supabase
