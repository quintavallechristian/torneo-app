# Torneo App

Questo è un progetto monorepo per gestire tornei di giochi da tavolo.

## Struttura del Progetto

- `web/` - Applicazione web Next.js
- `supabase/` - Configurazione e migrazioni del database
- `myapp/` - App mobile (se presente)

## Getting Started

Installa le dipendenze:

```bash
npm install
```

Avvia il server di sviluppo:

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel tuo browser per vedere il risultato.

## Comandi Disponibili

- `npm run dev` - Avvia il server di sviluppo
- `npm run build` - Build di produzione
- `npm start` - Avvia il server di produzione
- `npm run lint` - Esegue il linter
- `npm test` - Esegue i test
- `npm run db:types` - Genera i tipi TypeScript dal database Supabase

## Learn More

Per saperne di più, consulta:

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
