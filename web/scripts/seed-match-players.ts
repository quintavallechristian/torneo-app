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

// Funzione per ottenere un numero casuale tra min e max (inclusi)
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Funzione per selezionare elementi casuali da un array
function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, array.length));
}

// Funzione per generare punti casuali (0-100)
function getRandomPoints(): number {
  return getRandomInt(0, 100);
}

async function main() {
  console.log("🎮 Inizio assegnazione giocatori ai matches...\n");

  // 1. Recupera tutti i places
  console.log("📍 Recupero places...");
  const { data: places, error: placesError } = await supabase
    .from("places")
    .select("id, name")
    .order("id");

  if (placesError || !places || places.length === 0) {
    console.error("❌ Errore nel recupero dei places:", placesError);
    console.error("Assicurati che ci siano places nel database");
    process.exit(1);
  }

  console.log(`✅ Trovati ${places.length} places\n`);

  // 2. Recupera tutti i profili disponibili
  console.log("👥 Recupero profili...");
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, username, firstname, lastname")
    .order("id");

  if (profilesError || !profiles || profiles.length === 0) {
    console.error("❌ Errore nel recupero dei profili:", profilesError);
    console.error(
      "Assicurati che ci siano utenti nel database. Esegui prima 'npm run seed:users'"
    );
    process.exit(1);
  }

  console.log(`✅ Trovati ${profiles.length} profili\n`);

  // 3. Per ogni place, recupera i suoi matches e assegna giocatori
  let totalAssignments = 0;
  const profilesMatchesToCreate = [];

  for (const place of places) {
    console.log(`🏢 Processando matches per: ${place.name}...`);

    // Recupera i matches del place
    const { data: matches, error: matchesError } = await supabase
      .from("matches")
      .select("id, name, min_players, max_players")
      .eq("place_id", place.id)
      .order("id");

    if (matchesError || !matches) {
      console.error(
        `   ❌ Errore nel recupero dei matches per ${place.name}:`,
        matchesError
      );
      continue;
    }

    if (matches.length === 0) {
      console.log(`   ⚠️  Nessun match trovato per ${place.name}`);
      continue;
    }

    console.log(`   📋 Trovati ${matches.length} matches`);

    // Per ogni match, assegna giocatori casuali
    for (const match of matches) {
      // Determina il numero di giocatori da assegnare
      const minPlayers = match.min_players || 2;
      const maxPlayers = match.max_players || 6;
      const numPlayers = getRandomInt(minPlayers, maxPlayers);

      // Seleziona giocatori casuali
      const selectedProfiles = getRandomElements(profiles, numPlayers);

      // Crea le assegnazioni
      for (let i = 0; i < selectedProfiles.length; i++) {
        const profile = selectedProfiles[i];
        profilesMatchesToCreate.push({
          match_id: match.id,
          profile_id: profile.id,
          points: getRandomPoints(),
          confirmed: Math.random() > 0.2, // 80% confermati
        });
        totalAssignments++;
      }
    }

    console.log(
      `   ✅ Assegnati giocatori a ${matches.length} matches di ${place.name}\n`
    );
  }

  // 4. Inserisci tutti i profiles_matches
  console.log(
    `💾 Inserimento di ${profilesMatchesToCreate.length} assegnazioni nel database...`
  );

  // Inserisci in batch per evitare problemi con troppi dati
  const batchSize = 100;
  let inserted = 0;

  for (let i = 0; i < profilesMatchesToCreate.length; i += batchSize) {
    const batch = profilesMatchesToCreate.slice(i, i + batchSize);

    const { data, error } = await supabase
      .from("profiles_matches")
      .insert(batch)
      .select();

    if (error) {
      console.error(
        `❌ Errore nell'inserimento batch ${i / batchSize + 1}:`,
        error
      );
      continue;
    }

    inserted += data?.length || 0;
    console.log(
      `   ✅ Inserito batch ${i / batchSize + 1}/${Math.ceil(
        profilesMatchesToCreate.length / batchSize
      )}`
    );
  }

  console.log(
    `\n✅ Inserite ${inserted} assegnazioni su ${profilesMatchesToCreate.length} totali\n`
  );

  // 5. Calcola statistiche
  const confirmedCount = profilesMatchesToCreate.filter(
    (pm) => pm.confirmed
  ).length;
  const unconfirmedCount = profilesMatchesToCreate.length - confirmedCount;

  // Riepilogo
  console.log("🎉 Processo completato con successo!\n");
  console.log("📊 Riepilogo:");
  console.log(`   - Places processati: ${places.length}`);
  console.log(`   - Profili disponibili: ${profiles.length}`);
  console.log(`   - Assegnazioni create: ${inserted}`);
  console.log(
    `   - Assegnazioni confermate: ${confirmedCount} (${Math.round(
      (confirmedCount / profilesMatchesToCreate.length) * 100
    )}%)`
  );
  console.log(
    `   - Assegnazioni non confermate: ${unconfirmedCount} (${Math.round(
      (unconfirmedCount / profilesMatchesToCreate.length) * 100
    )}%)`
  );

  // Mostra alcuni esempi
  console.log("\n👥 Primi 10 esempi di assegnazioni:");
  const { data: sampleAssignments } = await supabase
    .from("profiles_matches")
    .select(
      `
      id,
      points,
      confirmed,
      profiles:profile_id (username, firstname, lastname),
      matches:match_id (name)
    `
    )
    .order("id", { ascending: false })
    .limit(10);

  if (sampleAssignments) {
    sampleAssignments.forEach((assignment: any) => {
      const profile = assignment.profiles;
      const match = assignment.matches;
      const status = assignment.confirmed ? "✓" : "⏳";
      console.log(
        `   ${status} ${profile.username} → ${match.name} (${assignment.points} punti)`
      );
    });
  }
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
