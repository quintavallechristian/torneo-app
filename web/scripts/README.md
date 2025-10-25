# Script di Seed dei Dati di Test

Questa cartella contiene script per generare automaticamente dati di test nel database Supabase.

## Script disponibili

### 1. `seed-places.ts` - Seed Places ⭐ NUOVO

Crea places e le loro collection di giochi.

### 2. `seed-matches.ts` - Seed Matches ⭐ NUOVO

Crea matches per i places esistenti (può essere eseguito più volte).

### 3. `seed-users.ts` - Seed Utenti

Crea 20 utenti di test con profili e ruoli.

### 4. `seed-match-players.ts` - Seed Giocatori nei Matches

Assegna giocatori casuali ai matches esistenti.

### 5. `seed-test-data.ts` - Seed Completo (legacy)

Script originale che crea places, matches e collection insieme.

## 🚀 Ordine consigliato di esecuzione

### Metodo 1: Script separati (consigliato)

Questo metodo ti dà più controllo e puoi eseguire `seed:matches` più volte:

```bash
# 1. Crea places e collection di giochi
npm run seed:places

# 2. Crea matches per i places
npm run seed:matches

# 3. Crea utenti
npm run seed:users

# 4. Assegna giocatori ai matches
npm run seed:players
```

### Metodo 2: Tutto in una volta

```bash
# Esegue automaticamente tutti e 4 gli script in sequenza
npm run seed:all
```

### 🔄 Aggiungere più matches ai places esistenti

Puoi eseguire lo script `seed:matches` più volte per aggiungere altri matches ai places già esistenti:

```bash
# Aggiunge altri 10 matches per ogni place
npm run seed:matches

# Puoi eseguirlo quante volte vuoi!
npm run seed:matches
```

Questo è utile se vuoi popolare il database con più dati senza ricreare i places.

---

## Script 1: Seed Places

### Cosa fa

1. **Recupera i giochi** con `bgg_rank < 100` dal database
2. **Crea 10 places** in diverse città italiane con:
   - Nome, indirizzo e descrizione
   - Coordinate geografiche (latitudine/longitudine)
3. **Aggiunge 10 giochi alla collection di ogni place** (`places_games`):
   - 10 giochi casuali diversi per ogni place
   - Numero di copie casuale (1-3) per ogni gioco

### Come eseguirlo

```bash
npm run seed:places
```

### Output

- ✅ 10 places creati
- ✅ 100 giochi nelle collection (10 per place)

---

## Script 2: Seed Matches

### Cosa fa

1. **Recupera i giochi** con `bgg_rank < 100` dal database
2. **Recupera tutti i places** esistenti
3. **Crea 10 matches per ogni place** con:
   - Game ID selezionato casualmente tra i giochi top 100
   - Date di inizio e fine casuali nell'ultimo mese
   - Numero minimo e massimo di giocatori
   - Nome e descrizione del match
4. **Aggiunge automaticamente i giochi alla collezione del place**:
   - Verifica se il gioco è già presente nella collezione
   - Se non presente, lo aggiunge con 1-2 copie
   - Se già presente, lo salta

### Come eseguirlo

⚠️ **Prerequisito**: Esegui prima `npm run seed:places`

```bash
npm run seed:matches

# Puoi eseguirlo più volte per aggiungere altri matches!
npm run seed:matches
npm run seed:matches
```

### Output

- ✅ 10 matches per ogni place esistente
- ✅ Giochi aggiunti automaticamente alle collection
- 📊 Statistiche per place

---

## Script 3: Seed Utenti

### Cosa fa

1. **Crea 20 utenti** tramite Supabase Auth Admin API
2. **Crea profili** con nomi e cognomi italiani casuali
3. **Assegna ruoli**: 70% User, 30% Manager

### Come eseguirlo

```bash
npm run seed:users
```

### Credenziali

- **Email**: `[nome][cognome]@test.com` (es. `marcorossi@test.com`)
- **Password**: `Test1234!` (uguale per tutti)

📖 Per maggiori dettagli, vedi [SEED_USERS_README.md](./SEED_USERS_README.md)

---

## Script 4: Seed Giocatori nei Matches

### Cosa fa

1. **Assegna giocatori casuali** ai matches esistenti
2. **Popola la tabella `profiles_matches`** con:
   - Numero di giocatori tra min_players e max_players del match
   - Punti casuali (0-100) per ogni giocatore
   - Stato di conferma (80% confermati, 20% in attesa)

### Come eseguirlo

⚠️ **Prerequisiti**: Esegui prima `seed:places`, `seed:matches` e `seed:users`

```bash
npm run seed:players
```

📖 Per maggiori dettagli, vedi [SEED_PLAYERS_README.md](./SEED_PLAYERS_README.md)

---

## Prerequisiti

1. Assicurati di avere giochi nel database con `bgg_rank < 100`
2. Configura le variabili d'ambiente nel file `.env.local` (nella cartella web):

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

⚠️ **Nota**: `SUPABASE_SERVICE_ROLE_KEY` è necessaria solo per lo script `seed:users`

---

## Pulizia dei dati

Se vuoi rimuovere i dati di test creati dallo script:

```sql
-- Elimina i giocatori dalle assegnazioni
DELETE FROM profiles_matches WHERE match_id IN (
  SELECT id FROM matches WHERE place_id IN (
    SELECT id FROM places WHERE name LIKE 'Circolo%' OR name LIKE 'Ludoteca%'
  )
);

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
  'Game Hub Firenze',
  'Associazione Ludica Venezia',
  'Il Regno dei Giochi',
  'Giochi & Caffè Napoli',
  'Spazio Ludico Genova',
  'Arena Boardgames Palermo',
  'Club del Meeple'
);

-- Elimina gli utenti di test (vedi SEED_USERS_README.md)
```

---

## Personalizzazione

Puoi modificare gli script per:

- Cambiare il numero di places, matches o utenti
- Modificare i dati dei places (nomi, indirizzi, coordinate)
- Cambiare i criteri di selezione dei giochi (es. `bgg_rank < 50`)
- Modificare il numero di matches per place (modifica la variabile `matchesPerPlace` in `seed-matches.ts`)
- Cambiare la percentuale di conferme nei matches

---

## Risoluzione problemi

### Errore: "Errore nel recupero dei giochi"

- Verifica che ci siano giochi nel database con `bgg_rank < 100`
- Controlla che la connessione a Supabase funzioni

### Errore: "Nessun place trovato" (in seed:matches)

- Esegui prima `npm run seed:places` per creare i places

### Errore: "NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY devono essere configurati"

- Assicurati di avere il file `.env.local` nella cartella web
- Verifica che le variabili d'ambiente siano corrette

### Errore di permessi

- Controlla di usare la **Service Role Key** per lo script `seed:users`
- Verifica le policy RLS (Row Level Security) su Supabase
