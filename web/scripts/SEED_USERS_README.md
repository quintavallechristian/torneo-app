# Script di Seed per Utenti di Test

Questo script genera automaticamente 20 utenti di test nel database Supabase utilizzando il processo di signup dell'applicazione.

## Cosa fa lo script

1. **Crea 20 utenti** tramite Supabase Auth Admin API con:

   - Email nel formato `[nome][cognome]@test.com`
   - Password uguale per tutti: `Test1234!`
   - Email già confermata (bypass della conferma email)

2. **Crea il profilo** per ogni utente nella tabella `profiles` con:

   - Nome e cognome casuali da una lista di nomi italiani
   - Username generato da nome + cognome
   - Data di nascita casuale tra il 1970 e il 2005
   - Paese casuale (principalmente Italia)

3. **Assegna il ruolo** nella tabella `users_roles`:
   - 70% degli utenti: ruolo User (role_id: 2)
   - 30% degli utenti: ruolo Manager (role_id: 3)

## Prerequisiti

⚠️ **IMPORTANTE**: Questo script richiede la **Service Role Key** (non la chiave pubblica anon) perché usa l'Admin API di Supabase per creare utenti senza conferma email.

Configura le variabili d'ambiente nel file `.env.local` (nella cartella web):

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Come eseguirlo

### Dalla cartella web:

```bash
cd web
npm run seed:users
```

### Dalla root del progetto:

```bash
npm run seed:users
```

### Direttamente:

```bash
npx tsx web/scripts/seed-users.ts
```

## Output dello script

Lo script mostrerà:

- ✅ Conferma per ogni utente creato
- 📊 Riepilogo finale con numero di utenti creati
- 📧 Credenziali di accesso comuni
- 👤 Lista di esempi di utenti creati
- ❌ Eventuali errori riscontrati

### Esempio di output:

```
👥 Inizio creazione di 20 utenti di test...

📝 Creazione utente 1/20: marcorossi (marcorossi@test.com)...
   ✅ Utente creato: marcorossi (User)
📝 Creazione utente 2/20: giuliaferrari (giuliaferrari@test.com)...
   ✅ Utente creato: giuliaferrari (Manager)
...

🎉 Processo completato!

📊 Riepilogo:
   - Utenti creati con successo: 20/20
   - Profili creati: 20/20

📧 Credenziali di accesso:
   Email: [username]@test.com
   Password: Test1234! (uguale per tutti)

👤 Esempi di utenti creati:
   - marcorossi (Marco Rossi)
   - giuliaferrari (Giulia Ferrari)
   - lucarusso (Luca Russo)
   ...
```

## Credenziali di accesso

Tutti gli utenti creati hanno la stessa password:

- **Password**: `Test1234!`

Le email seguono il pattern:

- `marcorossi@test.com`
- `giuliaferrari@test.com`
- `lucarusso@test.com`
- ecc.

## Pulizia dei dati

Se vuoi rimuovere gli utenti di test creati dallo script, puoi usare Supabase Studio o eseguire query SQL:

```sql
-- Trova gli utenti di test (tutti con email @test.com)
SELECT * FROM auth.users WHERE email LIKE '%@test.com';

-- Elimina i ruoli associati
DELETE FROM users_roles WHERE user_id IN (
  SELECT id FROM auth.users WHERE email LIKE '%@test.com'
);

-- Elimina i profili
DELETE FROM profiles WHERE user_id IN (
  SELECT id FROM auth.users WHERE email LIKE '%@test.com'
);

-- Elimina gli utenti (usando l'Admin API o manualmente da Supabase Studio)
-- Nota: l'eliminazione degli utenti va fatta tramite Supabase Dashboard
```

⚠️ **Attenzione**: L'eliminazione degli utenti da `auth.users` richiede l'uso dell'Admin API o del Dashboard di Supabase.

## Personalizzazione

Puoi modificare lo script per:

- Cambiare il numero di utenti da creare
- Modificare la lista di nomi e cognomi
- Cambiare la password di default
- Modificare la distribuzione dei ruoli (Manager vs User)
- Aggiungere altri campi al profilo (immagine, bgg_username, ecc.)

## Note tecniche

- Lo script usa `supabase.auth.admin.createUser()` con `email_confirm: true` per bypassare la conferma email
- Gli username sono generati in formato `[nome][cognome]` o `[nome][cognome][numero]` se ci sono duplicati
- Le date di nascita sono generate casualmente tra il 1970 e il 2005
- Il 30% degli utenti viene assegnato al ruolo Manager (role_id: 3)

## Troubleshooting

### Errore: "User already registered"

- Un utente con quella email esiste già nel database
- Soluzione: Elimina gli utenti esistenti o modifica le email nello script

### Errore: "Service role key required"

- Stai usando la chiave anon invece della service role key
- Soluzione: Usa `SUPABASE_SERVICE_ROLE_KEY` nel file `.env.local`

### Errore nella creazione del profilo

- La tabella `profiles` potrebbe avere vincoli o trigger
- Verifica che i campi required siano tutti presenti
