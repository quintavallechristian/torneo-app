/**
 * Test per la funzionalità di sincronizzazione BGG
 *
 * Per testare manualmente:
 * 1. Avvia l'app: npm run dev
 * 2. Accedi con un utente
 * 3. Vai su http://localhost:3001/games/collection
 * 4. Clicca sul bottone "Sincronizza BGG"
 * 5. Inserisci un username BGG valido (es. "chrissj2")
 * 6. Clicca su "Sincronizza"
 * 7. Verifica che i giochi vengano sincronizzati
 *
 * Note:
 * - L'API BGG può richiedere tempo per processare le richieste
 * - Se vedi il messaggio "BGG sta processando la richiesta", attendi qualche secondo e riprova
 * - Solo i giochi che esistono nel database locale verranno aggiunti alla collezione
 */

import { describe, it, expect } from '@jest/globals';

describe('BGG Sync Feature', () => {
  // Mock test per la struttura base
  it('should have actions module', async () => {
    const actions = await import('./actions');
    expect(actions.getBggUsername).toBeDefined();
    expect(actions.saveBggUsername).toBeDefined();
    expect(actions.syncBGGCollection).toBeDefined();
  });
});

describe('BGG XML Parsing', () => {
  it('should parse BGG XML response correctly', () => {
    const sampleXML = `
      <items totalitems="2">
        <item objecttype="thing" objectid="5867" subtype="boardgame" collid="102773738">
          <name sortindex="1">10 Days in Europe</name>
          <status own="1" prevowned="0"/>
          <numplays>1</numplays>
        </item>
        <item objecttype="thing" objectid="7866" subtype="boardgame" collid="102773742">
          <name sortindex="1">10 Days in the USA</name>
          <status own="1" prevowned="0"/>
          <numplays>0</numplays>
        </item>
      </items>
    `;

    // Verifica che il pattern regex funzioni
    const itemMatches = sampleXML.matchAll(
      /<item[^>]*objectid="(\d+)"[^>]*>[\s\S]*?<status[^>]*own="(\d)"[^>]*\/>/g,
    );

    const items = Array.from(itemMatches);
    expect(items.length).toBe(2);
    expect(items[0][1]).toBe('5867'); // objectid
    expect(items[0][2]).toBe('1'); // own
  });
});
