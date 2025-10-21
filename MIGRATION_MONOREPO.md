# Migrazione a Struttura Monorepo

## Modifiche Effettuate

### Struttura
- ✅ Creata cartella `web/` per l'applicazione Next.js
- ✅ Spostati tutti i file dell'app Next.js in `web/`
- ✅ Mantenute le cartelle `supabase/`, `myapp/`, e i file di documentazione nella root

### File Spostati in `web/`
- `src/`
- `public/`
- `__tests__/`
- `package.json` e `package-lock.json`
- `next.config.ts`
- `tsconfig.json`
- File di configurazione (eslint, jest, postcss, ecc.)
- `.env.local`
- `.next/`, `.swc/`, `node_modules/`

### Configurazioni Aggiornate

#### Package.json Root
Creato un nuovo `package.json` nella root con workspaces:
```json
{
  "workspaces": ["web"],
  "scripts": {
    "dev": "npm run dev --workspace=web",
    "build": "npm run build --workspace=web",
    "start": "npm run start --workspace=web",
    "lint": "npm run lint --workspace=web",
    "test": "npm run test --workspace=web",
    "db:types": "npx supabase gen types --lang=typescript --local > database.types.ts"
  }
}
```

#### Next.js Config
Aggiornato `web/next.config.ts` per specificare il root del turbopack:
```typescript
turbopack: {
  root: path.resolve(__dirname),
}
```

#### .gitignore
Aggiornato per includere i path della cartella `web/`:
- `web/node_modules`
- `web/.next/`
- `web/out/`
- `web/coverage`

### Comandi Disponibili

Dalla root del progetto:
- `npm run dev` - Avvia il server di sviluppo
- `npm run build` - Build di produzione
- `npm start` - Avvia il server di produzione
- `npm test` - Esegue i test
- `npm run lint` - Esegue il linter
- `npm run db:types` - Genera i tipi TypeScript dal database

Dalla cartella `web/`:
- `cd web && npm run dev` - Avvia il server direttamente

### Struttura Finale

```
torneo-app/
├── package.json (root workspace)
├── database.types.ts
├── supabase/
├── myapp/
├── web/
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── .env.local
│   ├── src/
│   ├── public/
│   └── __tests__/
└── README.md
```

## Vantaggi

1. **Monorepo Ready**: Struttura pronta per aggiungere altre applicazioni (mobile, backend, ecc.)
2. **Separazione dei Concern**: File di configurazione globali separati da quelli dell'app web
3. **Gestione Centralizzata**: Script npm nella root per gestire tutti i workspace
4. **Scalabilità**: Facile aggiungere nuovi workspace in futuro

## Note

- Il file `database.types.ts` rimane nella root perché può essere condiviso tra più workspace
- La cartella `supabase/` rimane nella root per la configurazione del database
- I file di documentazione (`.md`) sono nella root per visibilità immediata
