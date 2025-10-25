import { createClient } from "@supabase/supabase-js";
import { Database } from "../../database.types";
import { config } from "dotenv";
import { resolve } from "path";

// Carica le variabili d'ambiente dal file .env.local
config({ path: resolve(__dirname, "../.env.local") });

// Configura il client Supabase con Service Role Key per creare utenti
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Errore: NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY devono essere configurati nelle variabili d'ambiente"
  );
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Dati di esempio per i nomi
const firstNames = [
  "Marco",
  "Giulia",
  "Luca",
  "Sofia",
  "Alessandro",
  "Martina",
  "Francesco",
  "Chiara",
  "Matteo",
  "Federica",
  "Andrea",
  "Valentina",
  "Lorenzo",
  "Alessia",
  "Davide",
  "Elena",
  "Riccardo",
  "Sara",
  "Simone",
  "Francesca",
];

const lastNames = [
  "Rossi",
  "Ferrari",
  "Russo",
  "Bianchi",
  "Romano",
  "Colombo",
  "Ricci",
  "Marino",
  "Greco",
  "Bruno",
  "Gallo",
  "Conti",
  "De Luca",
  "Costa",
  "Giordano",
  "Mancini",
  "Rizzo",
  "Lombardi",
  "Moretti",
  "Barbieri",
];

const countries = [
  "Italia",
  "Italia",
  "Italia",
  "Italia", // Italia più probabile
  "Svizzera",
  "Francia",
  "Germania",
  "Spagna",
];

// Funzione per generare una data di nascita casuale tra il 1970 e il 2005
function getRandomBirthday(): string {
  const startDate = new Date(1970, 0, 1);
  const endDate = new Date(2005, 11, 31);
  const randomTime =
    startDate.getTime() +
    Math.random() * (endDate.getTime() - startDate.getTime());
  const date = new Date(randomTime);
  return date.toISOString().split("T")[0]; // Formato YYYY-MM-DD
}

// Funzione per generare un username unico
function generateUsername(
  firstName: string,
  lastName: string,
  index: number
): string {
  const base = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;
  return index < 10 ? base : `${base}${index}`;
}

// Funzione per generare un'email unica
function generateEmail(
  firstName: string,
  lastName: string,
  index: number
): string {
  const username = generateUsername(firstName, lastName, index);
  return `${username}@test.com`;
}

async function main() {
  console.log("👥 Inizio creazione di 20 utenti di test...\n");

  const createdUsers = [];
  const createdProfiles = [];
  const errors = [];

  for (let i = 0; i < 20; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const email = generateEmail(firstName, lastName, i);
    const username = generateUsername(firstName, lastName, i);
    const password = "Test1234!"; // Password di test (uguale per tutti)
    const birthday = getRandomBirthday();
    const country = countries[Math.floor(Math.random() * countries.length)];
    const isManager = Math.random() > 0.7; // 30% chance di essere manager

    console.log(`📝 Creazione utente ${i + 1}/20: ${username} (${email})...`);

    try {
      // 1. Crea l'utente con auth.admin.createUser (bypass email confirmation)
      const { data: userData, error: authError } =
        await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true, // Bypassa la conferma email
        });

      if (authError) {
        console.error(
          `   ❌ Errore creazione auth per ${email}:`,
          authError.message
        );
        errors.push({ email, error: authError.message });
        continue;
      }

      createdUsers.push(userData.user);

      // 2. Crea il profilo
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .insert({
          user_id: userData.user.id,
          firstname: firstName,
          lastname: lastName,
          birthday,
          country,
          username,
        })
        .select()
        .single();

      if (profileError) {
        console.error(
          `   ❌ Errore creazione profilo per ${email}:`,
          profileError.message
        );
        errors.push({ email, error: profileError.message });
        continue;
      }

      createdProfiles.push(profileData);

      // 3. Assegna il ruolo (2 = user, 3 = manager)
      const { error: roleError } = await supabase.from("users_roles").insert({
        user_id: userData.user.id,
        role_id: isManager ? 3 : 2,
      });

      if (roleError) {
        console.error(
          `   ❌ Errore assegnazione ruolo per ${email}:`,
          roleError.message
        );
        errors.push({ email, error: roleError.message });
        continue;
      }

      console.log(
        `   ✅ Utente creato: ${username} (${isManager ? "Manager" : "User"})`
      );
    } catch (error) {
      console.error(`   ❌ Errore imprevisto per ${email}:`, error);
      errors.push({ email, error: String(error) });
    }
  }

  // Riepilogo
  console.log("\n🎉 Processo completato!\n");
  console.log("📊 Riepilogo:");
  console.log(`   - Utenti creati con successo: ${createdUsers.length}/20`);
  console.log(`   - Profili creati: ${createdProfiles.length}/20`);

  if (errors.length > 0) {
    console.log(`   - Errori riscontrati: ${errors.length}`);
    console.log("\n❌ Dettagli errori:");
    errors.forEach((err) => {
      console.log(`   - ${err.email}: ${err.error}`);
    });
  }

  console.log("\n📧 Credenziali di accesso:");
  console.log("   Email: [username]@test.com");
  console.log("   Password: Test1234! (uguale per tutti)\n");

  console.log("👤 Esempi di utenti creati:");
  createdProfiles.slice(0, 5).forEach((profile) => {
    console.log(
      `   - ${profile.username} (${profile.firstname} ${profile.lastname})`
    );
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
