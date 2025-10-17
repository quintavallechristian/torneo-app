# Modalità Presentazione

## Descrizione

La **Modalità Presentazione** è una funzionalità progettata per i PlaceManager che permette di visualizzare in modo dinamico e accattivante tutti i match attualmente attivi nel proprio locale.

## Caratteristiche

- 🎬 **Slideshow automatico**: I match scorrono automaticamente ogni 5 secondi
- 📺 **Vista a schermo intero**: Interfaccia immersiva ottimizzata per display grandi
- 🎨 **Design moderno**: Gradiente animato e effetti visivi accattivanti
- 🔒 **Accesso controllato**: Disponibile solo per i PlaceManager del locale specifico
- 📊 **Informazioni complete**: Mostra tutti i dettagli rilevanti del match (gioco, giocatori, stato, vincitore, etc.)

## Come Accedere

1. Accedi come utente con ruolo **PlaceManager**
2. Vai alla pagina di dettaglio di un place che gestisci
3. Clicca sul pulsante **"🎬 Modalità Presentazione"** nella sezione in basso
4. La modalità presentazione si aprirà a schermo intero

## Contenuto Visualizzato

Per ogni match vengono mostrati:

- **Immagine del gioco** (se disponibile)
- **Nome del match** e del gioco
- **Stato del match** (Programmato, In corso, Completato, etc.)
- **Date di inizio e fine**
- **Lista giocatori** con i loro punti
- **Vincitore** (se il match è completato)
- **Descrizione** del match

## Match Visualizzati

Vengono visualizzati solo i match con stato:

- `Ongoing` (In corso)
- `Scheduled` (Programmato)

I match completati o cancellati non vengono mostrati nella presentazione.

## Controlli

- **Pulsante X** in alto a destra per uscire dalla modalità presentazione
- **Indicatore di progresso** in basso che mostra quanti match sono presenti e quale è attualmente visualizzato

## Casi d'Uso

- Display su TV/Monitor nei locali per mostrare i tornei in corso ai clienti
- Presentazioni durante eventi gaming
- Dashboard live per tornei e competizioni
- Promozione dei match attivi nel locale

## Implementazione Tecnica

### File Coinvolti

- `src/components/PresentationMode/PresentationMode.tsx` - Componente client per lo slideshow
- `src/app/places/[id]/presentation/page.tsx` - Pagina server per la rotta di presentazione
- `src/components/PlaceCard/PlaceCard.tsx` - Pulsante per attivare la modalità

### Permessi

La modalità presentazione è protetta e richiede:

- Utente autenticato
- Permesso `UserAction.ManagePlaces` per il place specifico
- In caso di accesso non autorizzato, l'utente viene reindirizzato alla pagina del place

### Timer

Il componente utilizza un `setInterval` React con cleanup automatico per cambiare slide ogni 5 secondi. L'intervallo viene pulito quando:

- Il componente viene smontato
- Non ci sono match da visualizzare

## Note

- Se non ci sono match attivi, viene mostrato un messaggio appropriato
- L'interfaccia è completamente responsive e funziona su diverse dimensioni di schermo
- Gli effetti visivi (blur, gradienti) sono ottimizzati per prestazioni fluide
