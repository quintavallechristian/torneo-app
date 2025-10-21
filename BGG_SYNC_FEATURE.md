# Sincronizzazione BoardGameGeek

## Funzionalità

Questa funzionalità permette agli utenti di sincronizzare la propria collezione di giochi da tavolo da BoardGameGeek (BGG) con la collezione presente nell'applicazione.

## Come funziona

### 1. Bottone di Sincronizzazione

Nella pagina della collezione (`/games/collection`), è presente un bottone "Sincronizza BGG" che permette di avviare il processo di sincronizzazione.

### 2. Dialog per Username BGG

Quando l'utente clicca sul bottone:

- Se non ha mai impostato il suo username BGG, verrà mostrato un dialog dove potrà inserirlo
- Se ha già impostato il username, potrà comunque modificarlo prima di procedere con la sincronizzazione
- L'username viene salvato nel database nella tabella `profiles` nel campo `bgg_username`

### 3. Processo di Sincronizzazione

Il processo di sincronizzazione:

1. **Chiama l'API di BGG**: Effettua una chiamata a `https://boardgamegeek.com/xmlapi2/collection?username={USERNAME}&own=1`
2. **Parsing XML**: Analizza la risposta XML che contiene tutti i giochi posseduti dall'utente su BGG

3. **Matching dei Giochi**: Per ogni gioco nella collezione BGG:

   - Cerca il gioco nel database locale usando l'`objectid` di BGG come `game_id`
   - Se il gioco esiste nel database, aggiorna o crea una riga nella tabella `profiles_games` con `in_collection = true`

4. **Reset Collezione**: Prima di sincronizzare, resetta `in_collection = false` per tutti i giochi dell'utente, così la collezione viene completamente sostituita con quella di BGG

## Componenti Creati

### Server Actions (`/src/app/games/collection/actions.ts`)

- `getBggUsername()`: Recupera l'username BGG dell'utente autenticato
- `saveBggUsername(username)`: Salva/aggiorna l'username BGG nel profilo
- `syncBGGCollection(username)`: Sincronizza la collezione da BGG

### Componenti React

- `BggSyncButton`: Bottone che apre il dialog di sincronizzazione
- `BggSyncDialog`: Dialog per inserire/modificare l'username BGG e avviare la sincronizzazione

## Database

### Migrazione

File: `/supabase/migrations/20251020000000_add_bgg_username.sql`

```sql
alter table "public"."profiles" add column "bgg_username" text;
```

### Struttura Dati

- `profiles.bgg_username`: Username BoardGameGeek dell'utente (nullable)
- `profiles_games.in_collection`: Flag booleano che indica se il gioco è nella collezione dell'utente

## Note Tecniche

### Gestione Errori

- Se BGG sta ancora processando la richiesta (risposta 202), viene mostrato un messaggio che chiede all'utente di riprovare
- Se un gioco della collezione BGG non esiste nel database locale, viene semplicemente ignorato
- Gli errori vengono mostrati inline nel dialog

### Limitazioni API BGG

- L'API di BGG può richiedere tempo per processare le richieste, specialmente per collezioni grandi
- È consigliato attendere qualche secondo tra una richiesta e l'altra se la prima fallisce

## Utilizzo

1. Vai su `/games/collection`
2. Clicca sul bottone "Sincronizza BGG"
3. Inserisci il tuo username di BoardGameGeek (es. "chrissj2")
4. Clicca su "Sincronizza"
5. Attendi il completamento (verrà mostrato un messaggio di successo con il numero di giochi sincronizzati)

## Testing

Per testare la funzionalità:

1. Assicurati di aver eseguito le migrazioni: `npx supabase db reset`
2. Avvia l'app: `npm run dev`
3. Accedi con un utente
4. Vai su `/games/collection`
5. Prova a sincronizzare con un username BGG valido

## Possibili Miglioramenti Futuri

- [ ] Caching delle risposte BGG per evitare richieste troppo frequenti
- [ ] Sincronizzazione in background con queue
- [ ] Importazione automatica di giochi da BGG se non presenti nel database
- [ ] Sincronizzazione anche di altre liste (wishlist, want to play, etc.)
- [ ] Notifiche push quando la sincronizzazione è completata
