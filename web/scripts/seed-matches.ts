import { createClient } from "@supabase/supabase-js";
import { Database } from "../../database.types";
import { config } from "dotenv";
import { resolve } from "path";

// Carica le variabili d'ambiente dal file .env.local
config({ path: resolve(__dirname, "../.env.local") });

// Configura il client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Errore: NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY devono essere configurati nelle variabili d'ambiente"
  );
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Nomi per i matches
const matchNames = [
  "Torneo del Lunedì",
  "Serata Strategica",
  "Campionato Mensile",
  "Game Night Speciale",
  "Torneo Elite",
  "Competizione Amichevole",
  "Sfida del Venerdì",
  "Evento Speciale",
  "Torneo Principianti",
  "Maratona Ludica",
  "Coppa d'Autunno",
  "Sfida Primaverile",
  "Torneo Estivo",
  "Campionato Invernale",
  "Serata a Squadre",
  "Torneo Veloce",
  "Grande Finale",
  "Qualificazioni",
  "Torneo Open",
  "Challenge Cup",
];

// Funzione per generare una data casuale nell'ultimo mese
function getRandomDate(): string {
  const now = new Date();
  const pastDate = new Date(
    now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000
  );
  return pastDate.toISOString();
}

// Funzione per generare date start/end casuali
function getRandomMatchDates(): { startAt: string; endAt: string } {
  const startAt = getRandomDate();
  const startDate = new Date(startAt);
  const endDate = new Date(
    startDate.getTime() + Math.random() * 4 * 60 * 60 * 1000
  ); // 0-4 ore dopo
  return {
    startAt: startAt,
    endAt: endDate.toISOString(),
  };
}

// Funzione per ottenere un elemento casuale da un array
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

async function main() {
  console.log("🎯 Inizio creazione matches...\n");

  // Parametri configurabili
  const matchesPerPlace = 10; // Numero di matches da creare per ogni place

  // 1. Recupera i giochi con bgg_rank < 100
  console.log("📊 Recupero giochi con BGG rank < 100...");
  const { data: games, error: gamesError } = await supabase
    .from("games")
    .select("id, name, bgg_rank")
    .lt("bgg_rank", 100)
    .gt("bgg_rank", 0)
    .not("bgg_rank", "is", null)
    .order("bgg_rank");

  if (gamesError || !games || games.length === 0) {
    console.error("❌ Errore nel recupero dei giochi:", gamesError);
    console.error(
      "Assicurati che ci siano giochi nel database con bgg_rank < 100"
    );
    process.exit(1);
  }

  console.log(`✅ Trovati ${games.length} giochi con rank < 100\n`);

  // 2. Recupera tutti i places esistenti
  console.log("📍 Recupero places esistenti...");
  const { data: places, error: placesError } = await supabase
    .from("places")
    .select("id, name")
    .order("id");

  if (placesError || !places || places.length === 0) {
    console.error("❌ Errore nel recupero dei places:", placesError);
    console.error(
      "Assicurati che ci siano places nel database. Esegui prima 'npm run seed:places'"
    );
    process.exit(1);
  }

  console.log(`✅ Trovati ${places.length} places\n`);

  // 3. Crea matches per ogni place
  console.log(
    `🎯 Creazione di ${matchesPerPlace} matches per ogni place (${
      places.length * matchesPerPlace
    } totali)...\n`
  );
  const matchesToCreate = [];

  for (const place of places) {
    console.log(`   📋 Creazione matches per: ${place.name}...`);

    for (let i = 0; i < matchesPerPlace; i++) {
      // Seleziona un gioco casuale dalla lista
      const randomGame = getRandomElement(games);
      const randomMatchName = getRandomElement(matchNames);
      const dates = getRandomMatchDates();

      matchesToCreate.push({
        name: `${randomMatchName} - ${place.name}`,
        description: `Match di ${randomGame.name} presso ${place.name}`,
        place_id: place.id,
        game_id: randomGame.id,
        startAt: dates.startAt,
        endAt: dates.endAt,
        min_players: 2,
        max_players: Math.floor(Math.random() * 4) + 3, // tra 3 e 6 giocatori
      });
    }
  }

  // Inserisci tutti i matches
  console.log(
    `\n💾 Inserimento di ${matchesToCreate.length} matches nel database...`
  );
  const { data: createdMatches, error: matchesError } = await supabase
    .from("matches")
    .insert(matchesToCreate)
    .select();

  if (matchesError || !createdMatches) {
    console.error("❌ Errore nella creazione dei matches:", matchesError);
    process.exit(1);
  }

  console.log(`✅ Creati ${createdMatches.length} matches\n`);

  // 4. Aggiungi i giochi utilizzati alla collezione dei places (se non già presenti)
  console.log("🎲 Aggiunta giochi alla collezione dei places...\n");

  // Raggruppa i matches per place e gioco
  const gamesByPlace = createdMatches.reduce((acc: any, match) => {
    const placeId = match.place_id!;
    const gameId = match.game_id!;

    if (!acc[placeId]) {
      acc[placeId] = new Set();
    }
    acc[placeId].add(gameId);

    return acc;
  }, {});

  let totalGamesAdded = 0;

  for (const placeId of Object.keys(gamesByPlace)) {
    const place = places.find((p) => p.id === parseInt(placeId));
    const gameIds = Array.from(gamesByPlace[placeId]);

    console.log(`   🏢 Processando ${place?.name}...`);

    // Per ogni gioco usato nei matches di questo place
    for (const gameId of gameIds as number[]) {
      // Verifica se il gioco è già nella collezione del place
      const { data: existingGame } = await supabase
        .from("places_games")
        .select("id")
        .eq("place_id", parseInt(placeId))
        .eq("game_id", gameId)
        .single();

      if (!existingGame) {
        // Aggiungi il gioco alla collezione
        const { error: insertError } = await supabase
          .from("places_games")
          .insert({
            place_id: parseInt(placeId),
            game_id: gameId,
            copies: Math.floor(Math.random() * 2) + 1, // 1 o 2 copie
            rented: 0,
          });

        if (insertError) {
          console.error(
            `      ❌ Errore aggiunta gioco ${gameId}:`,
            insertError.message
          );
        } else {
          const game = games.find((g) => g.id === gameId);
          console.log(`      ✅ Aggiunto: ${game?.name}`);
          totalGamesAdded++;
        }
      } else {
        const game = games.find((g) => g.id === gameId);
        console.log(`      ⏭️  Già presente: ${game?.name}`);
      }
    }
  }

  console.log(
    `\n✅ Aggiunti ${totalGamesAdded} nuovi giochi alle collection\n`
  );

  // Riepilogo
  console.log("🎉 Creazione matches completata con successo!\n");
  console.log("📊 Riepilogo:");
  console.log(`   - Places processati: ${places.length}`);
  console.log(`   - Matches creati: ${createdMatches.length}`);
  console.log(`   - Matches per place: ${matchesPerPlace}`);
  console.log(`   - Giochi aggiunti alle collection: ${totalGamesAdded}`);
  console.log(`   - Giochi utilizzati: ${games.length} (con BGG rank < 100)`);

  // Mostra alcuni esempi
  console.log("\n🎮 Primi 10 matches creati:");
  createdMatches.slice(0, 10).forEach((match) => {
    console.log(`   - ${match.name}`);
  });

  // Statistiche per place
  console.log("\n📈 Matches creati per place:");
  const matchesByPlace = createdMatches.reduce((acc: any, match) => {
    const placeId = match.place_id;
    if (!acc[placeId!]) {
      const place = places.find((p) => p.id === placeId);
      acc[placeId!] = { name: place?.name, count: 0 };
    }
    acc[placeId!].count++;
    return acc;
  }, {});

  Object.values(matchesByPlace).forEach((placeStats: any) => {
    console.log(`   - ${placeStats.name}: ${placeStats.count} matches`);
  });
}

main()
  .then(() => {
    console.log("\n✨ Script completato!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Errore durante l'esecuzione dello script:", error);
    process.exit(1);
  });
