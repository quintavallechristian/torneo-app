#!/usr/bin/env tsx
import { exec } from "child_process";
import { promisify } from "util";
import { resolve } from "path";

const execAsync = promisify(exec);

const scriptsDir = resolve(__dirname);

async function runScript(
  scriptName: string,
  description: string
): Promise<boolean> {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`🚀 ${description}`);
  console.log(`${"=".repeat(60)}\n`);

  try {
    const { stdout, stderr } = await execAsync(`npx tsx ${scriptName}`, {
      cwd: scriptsDir,
    });

    console.log(stdout);
    if (stderr) console.error(stderr);

    return true;
  } catch (error: any) {
    console.error(`❌ Errore durante l'esecuzione di ${scriptName}:`);
    console.error(error.stdout || error.message);
    return false;
  }
}

async function main() {
  console.log("\n");
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║                                                           ║");
  console.log("║     🎲  SEED COMPLETO DEL DATABASE DI TEST  🎲           ║");
  console.log("║                                                           ║");
  console.log("╚═══════════════════════════════════════════════════════════╝");
  console.log("\nQuesto script eseguirà in sequenza:");
  console.log("  1️⃣  Seed places e collection");
  console.log("  2️⃣  Seed matches");
  console.log("  3️⃣  Seed utenti (20 profili)");
  console.log("  4️⃣  Seed assegnazioni giocatori ai matches");
  console.log(
    "\n⚠️  Assicurati di aver configurato le variabili d'ambiente in .env.local\n"
  );

  // Attendi 3 secondi prima di iniziare
  console.log("⏱️  Inizio tra 3 secondi...\n");
  await new Promise((resolve) => setTimeout(resolve, 3000));

  let allSuccess = true;

  // 1. Seed places
  const step1 = await runScript(
    "seed-places.ts",
    "STEP 1/4: Creazione Places e Collection"
  );
  allSuccess = allSuccess && step1;

  if (!step1) {
    console.error("\n❌ Step 1 fallito. Interrompo l'esecuzione.");
    process.exit(1);
  }

  // 2. Seed matches
  const step2 = await runScript(
    "seed-matches.ts",
    "STEP 2/4: Creazione Matches"
  );
  allSuccess = allSuccess && step2;

  if (!step2) {
    console.error("\n❌ Step 2 fallito. Interrompo l'esecuzione.");
    process.exit(1);
  }

  // 3. Seed utenti
  const step3 = await runScript(
    "seed-users.ts",
    "STEP 3/4: Creazione Utenti e Profili"
  );
  allSuccess = allSuccess && step3;

  if (!step3) {
    console.error("\n❌ Step 3 fallito. Interrompo l'esecuzione.");
    process.exit(1);
  }

  // 4. Seed giocatori nei matches
  const step4 = await runScript(
    "seed-match-players.ts",
    "STEP 4/4: Assegnazione Giocatori ai Matches"
  );
  allSuccess = allSuccess && step4;

  // Riepilogo finale
  console.log("\n");
  console.log("╔═══════════════════════════════════════════════════════════╗");
  console.log("║                                                           ║");

  if (allSuccess) {
    console.log("║        🎉  SEED COMPLETATO CON SUCCESSO!  🎉            ║");
  } else {
    console.log("║        ⚠️   SEED COMPLETATO CON ERRORI   ⚠️             ║");
  }

  console.log("║                                                           ║");
  console.log("╚═══════════════════════════════════════════════════════════╝");
  console.log("\n📊 Il tuo database di test è ora popolato con:");
  console.log("   ✅ 10 places in diverse città");
  console.log("   ✅ 100 matches (10 per place)");
  console.log("   ✅ 100 giochi nelle collection (10 per place)");
  console.log("   ✅ 20 utenti di test");
  console.log("   ✅ ~450 assegnazioni giocatori-matches");
  console.log("\n🔐 Credenziali di accesso utenti:");
  console.log("   📧 Email: [nome][cognome]@test.com");
  console.log("   🔑 Password: Test1234!");
  console.log("\n✨ Buon sviluppo!\n");

  process.exit(allSuccess ? 0 : 1);
}

main().catch((error) => {
  console.error("❌ Errore fatale:", error);
  process.exit(1);
});
