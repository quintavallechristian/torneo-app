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
    "Errore: NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY devono essere configurati nelle variabili d'ambiente"
  );
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Dati di esempio per i places
const placesData = [
  {
    name: "Circolo Ricreativo Centro",
    address: "Via Roma, 123, Milano, Italia",
    description:
      "Spazio accogliente nel centro città per tornei e serate di gioco",
    latitude: 45.4642,
    longitude: 9.19,
  },
  {
    name: "Ludoteca Il Dado Rosso",
    address: "Corso Vittorio Emanuele, 45, Torino, Italia",
    description: "Ludoteca con ampia collezione di giochi da tavolo",
    latitude: 45.0703,
    longitude: 7.6869,
  },
  {
    name: "Taverna dei Giocatori",
    address: "Via del Corso, 78, Roma, Italia",
    description: "Pub tematico con area dedicata ai giochi da tavolo",
    latitude: 41.9028,
    longitude: 12.4964,
  },
  {
    name: "Game Hub Firenze",
    address: "Piazza della Repubblica, 12, Firenze, Italia",
    description: "Centro gaming moderno con sala tornei",
    latitude: 43.7696,
    longitude: 11.2558,
  },
  {
    name: "Associazione Ludica Venezia",
    address: "Calle Larga, 56, Venezia, Italia",
    description:
      "Associazione per appassionati di giochi da tavolo e strategia",
    latitude: 45.4408,
    longitude: 12.3155,
  },
  {
    name: "Il Regno dei Giochi",
    address: "Via Garibaldi, 89, Bologna, Italia",
    description: "Negozio e spazio gioco con eventi settimanali",
    latitude: 44.4949,
    longitude: 11.3426,
  },
  {
    name: "Giochi & Caffè Napoli",
    address: "Via Toledo, 234, Napoli, Italia",
    description: "Caffetteria con area giochi e tornei mensili",
    latitude: 40.8518,
    longitude: 14.2681,
  },
  {
    name: "Spazio Ludico Genova",
    address: "Via XX Settembre, 67, Genova, Italia",
    description: "Spazio dedicato a giochi da tavolo e eventi ludici",
    latitude: 44.4056,
    longitude: 8.9463,
  },
  {
    name: "Arena Boardgames Palermo",
    address: "Via Maqueda, 145, Palermo, Italia",
    description: "Arena per tornei e campionati di giochi da tavolo",
    latitude: 38.1157,
    longitude: 13.3615,
  },
  {
    name: "Club del Meeple",
    address: "Corso Italia, 90, Verona, Italia",
    description:
      "Club esclusivo per giocatori esperti con biblioteca di giochi",
    latitude: 45.4384,
    longitude: 10.9916,
  },
];

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

async function main() {
  console.log("🎲 Inizio creazione dati di test...\n");

  // 1. Recupera i giochi con bgg_rank < 100
  console.log("📊 Recupero giochi con BGG rank < 100...");
  const { data: games, error: gamesError } = await supabase
    .from("games")
    .select("id, name, bgg_rank")
    .lt("bgg_rank", 100)
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

  // 2. Crea 10 places
  console.log("📍 Creazione di 10 places...");
  const { data: createdPlaces, error: placesError } = await supabase
    .from("places")
    .insert(placesData)
    .select();

  if (placesError || !createdPlaces) {
    console.error("❌ Errore nella creazione dei places:", placesError);
    process.exit(1);
  }

  console.log(`✅ Creati ${createdPlaces.length} places\n`);

  // 3. Crea 10 matches per ogni place
  console.log("🎯 Creazione di 100 matches (10 per place)...");
  const matchesToCreate = [];

  for (const place of createdPlaces) {
    for (let i = 0; i < 10; i++) {
      // Seleziona un gioco casuale dalla lista
      const randomGame = games[Math.floor(Math.random() * games.length)];
      const dates = getRandomMatchDates();

      matchesToCreate.push({
        name: `${matchNames[i]} - ${place.name}`,
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
  const { data: createdMatches, error: matchesError } = await supabase
    .from("matches")
    .insert(matchesToCreate)
    .select();

  if (matchesError || !createdMatches) {
    console.error("❌ Errore nella creazione dei matches:", matchesError);
    process.exit(1);
  }

  console.log(`✅ Creati ${createdMatches.length} matches\n`);

  // 4. Aggiungi 10 giochi alla collection di ogni place
  console.log("🎲 Aggiunta di 10 giochi alla collection di ogni place...");
  const placesGamesToCreate = [];

  for (const place of createdPlaces) {
    // Seleziona 10 giochi casuali diversi per ogni place
    const shuffledGames = [...games].sort(() => Math.random() - 0.5);
    const selectedGames = shuffledGames.slice(0, 10);

    for (const game of selectedGames) {
      placesGamesToCreate.push({
        place_id: place.id,
        game_id: game.id,
        copies: Math.floor(Math.random() * 3) + 1, // tra 1 e 3 copie
        rented: 0,
      });
    }
  }

  // Inserisci tutti i places_games
  const { data: createdPlacesGames, error: placesGamesError } = await supabase
    .from("places_games")
    .insert(placesGamesToCreate)
    .select();

  if (placesGamesError || !createdPlacesGames) {
    console.error(
      "❌ Errore nella creazione dei places_games:",
      placesGamesError
    );
    process.exit(1);
  }

  console.log(
    `✅ Aggiunti ${createdPlacesGames.length} giochi alle collection dei places\n`
  );

  // Riepilogo
  console.log("🎉 Creazione dati completata con successo!\n");
  console.log("📊 Riepilogo:");
  console.log(`   - Places creati: ${createdPlaces.length}`);
  console.log(`   - Matches creati: ${createdMatches.length}`);
  console.log(`   - Giochi nelle collection: ${createdPlacesGames.length}`);
  console.log(`   - Giochi utilizzati: ${games.length} (con BGG rank < 100)`);

  // Mostra alcuni esempi
  console.log("\n📝 Esempi di places creati:");
  createdPlaces.slice(0, 3).forEach((place) => {
    console.log(`   - ${place.name} (${place.address})`);
  });

  console.log("\n🎮 Esempi di matches creati:");
  createdMatches.slice(0, 5).forEach((match) => {
    console.log(`   - ${match.name}`);
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
