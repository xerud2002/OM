/**
 * Send one sample email per template to a test address.
 * 
 * Usage:
 *   npx tsx scripts/send-test-emails.ts ciprian.rotopanescu@gmail.com
 */

import * as fs from "fs";
import * as path from "path";
import { Resend } from "resend";

// Load .env.local manually (no dotenv dependency needed)
function loadEnv(filePath: string) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}
loadEnv(path.resolve(__dirname, "../.env.local"));
loadEnv(path.resolve(__dirname, "../.env"));

// We can't use path aliases in a standalone script, so import the template
// builder from the compiled source. Instead, we'll inline the import path.
// Actually, let's just use tsx with tsconfig paths support.

async function main() {
  const to = process.argv[2];
  if (!to) {
    console.error("Usage: npx tsx scripts/send-test-emails.ts <email>");
    process.exit(1);
  }

  // Dynamically import the email templates (tsx resolves path aliases via tsconfig)
  const { emailTemplates } = await import("../services/email");

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = `OferteMutare.ro <${process.env.RESEND_FROM_EMAIL || "info@ofertemutare.ro"}>`;

  const samples: { name: string; subject: string; html: string }[] = [
    {
      name: "1. guestRequestConfirmation",
      subject: "[TEST] Confirmare cerere client",
      html: emailTemplates.guestRequestConfirmation(
        "MUT-2026-0042",
        "Ciprian",
        "București",
        "Cluj-Napoca",
        "15 martie 2026",
      ),
    },
    {
      name: "2. newOffer",
      subject: "[TEST] Ofertă nouă primită",
      html: emailTemplates.newOffer({
        requestCode: "MUT-2026-0042",
        requestId: "abc123",
        companyName: "TransRapid Mutări SRL",
        companyMessage: "Bună ziua! Putem efectua mutarea în data solicitată. Echipă de 3 persoane + camion de 20mc.",
        price: 2450,
        fromCity: "București",
        toCity: "Cluj-Napoca",
        moveDate: "15 martie 2026",
        dashboardUrl: "https://ofertemutare.ro/customer/dashboard",
      }),
    },
    {
      name: "3. offerAccepted (detailed)",
      subject: "[TEST] Ofertă acceptată (detaliat)",
      html: emailTemplates.offerAccepted(
        "MUT-2026-0042",
        "Ciprian Rotopanescu",
        "0721 123 456",
        "ciprian@exemplu.ro",
        {
          companyName: "TransRapid Mutări SRL",
          price: 2450,
          fromCity: "București",
          toCity: "Cluj-Napoca",
          rooms: 3,
          details: "Apartament cu 3 camere, etaj 4 cu lift. Canapea extensibilă, mașină de spălat, frigider. Aproximativ 15 cutii.",
        },
      ),
    },
    {
      name: "4. offerAccepted (simple)",
      subject: "[TEST] Ofertă acceptată (simplu)",
      html: emailTemplates.offerAccepted(
        "MUT-2026-0099",
        "Maria Ionescu",
        "0733 987 654",
        "maria@exemplu.ro",
      ),
    },
    {
      name: "5. contactForm",
      subject: "[TEST] Mesaj contact nou",
      html: emailTemplates.contactForm(
        "Ion Popescu",
        "ion.popescu@exemplu.ro",
        "0745 111 222",
        "Bună ziua, doresc mai multe informații despre cum funcționează platforma pentru companiile de mutări. Mulțumesc!",
      ),
    },
    {
      name: "6. newRequestNotification",
      subject: "[TEST] Cerere nouă pentru companie",
      html: emailTemplates.newRequestNotification(
        "MUT-2026-0042",
        "București, Sector 3",
        "Cluj-Napoca, Mănăștur",
        "15 martie 2026",
        "3 camere (mobilier complet)",
      ),
    },
    {
      name: "7. offerDeclined",
      subject: "[TEST] Ofertă refuzată",
      html: emailTemplates.offerDeclined(
        "MUT-2026-0042",
        "TransRapid Mutări SRL",
        "Ciprian R.",
      ),
    },
    {
      name: "8. offerReminder",
      subject: "[TEST] Oferte în așteptare",
      html: emailTemplates.offerReminder(
        "MUT-2026-0042",
        "Ciprian",
        3,
        "https://ofertemutare.ro/customer/dashboard",
      ),
    },
    {
      name: "9. newMessageFromCompany",
      subject: "[TEST] Mesaj nou de la companie",
      html: emailTemplates.newMessageFromCompany(
        "TransRapid Mutări SRL",
        "Bună ziua! Am confirmat disponibilitatea echipei pentru data de 15 martie. Vă rog să ne confirmați adresa exactă de preluare.",
        "https://ofertemutare.ro/customer/messages/abc123",
      ),
    },
    {
      name: "10. newMessageFromCustomer",
      subject: "[TEST] Mesaj nou de la client",
      html: emailTemplates.newMessageFromCustomer(
        "Ciprian Rotopanescu",
        "MUT-2026-0042",
        "Bună ziua, am o întrebare legată de ambalajul oferit. Includeți și cutii sau doar transportul?",
        "https://ofertemutare.ro/company/messages/abc123",
      ),
    },
    {
      name: "11. mediaUploadLink",
      subject: "[TEST] Link încărcare fotografii",
      html: emailTemplates.mediaUploadLink(
        "Ciprian",
        "MUT-2026-0042",
        "https://ofertemutare.ro/upload/token123",
      ),
    },
    {
      name: "12. mediaUploadedNotification",
      subject: "[TEST] Fotografii noi încărcate",
      html: emailTemplates.mediaUploadedNotification(
        "TransRapid Mutări SRL",
        "MUT-2026-0042",
        "București → Cluj-Napoca",
      ),
    },
    {
      name: "13. reviewRequest",
      subject: "[TEST] Cerere recenzie",
      html: emailTemplates.reviewRequest(
        "Ciprian",
        "TransRapid Mutări SRL",
        "https://ofertemutare.ro/reviews/write/abc123",
      ),
    },
    {
      name: "14. uploadReminder",
      subject: "[TEST] Reminder fotografii",
      html: emailTemplates.uploadReminder(
        "Ciprian",
        "MUT-2026-0042",
        "https://ofertemutare.ro/upload/token123",
      ),
    },
    {
      name: "15. campaignWrapper",
      subject: "[TEST] Campanie email",
      html: emailTemplates.campaignWrapper(
        `<h2 style="margin:0 0 16px 0;font-size:22px;color:#111827;">🚀 Update platformă!</h2>
        <p style="margin:0 0 16px 0;color:#4b5563;font-size:15px;line-height:1.6;">
          Am adăugat funcționalități noi pe OferteMutare.ro: dashboard îmbunătățit, notificări în timp real și un sistem de mesagerie actualizat.
        </p>
        <p style="margin:0 0 16px 0;color:#4b5563;font-size:15px;line-height:1.6;">
          Conectează-te acum pentru a descoperi toate noutățile!
        </p>`,
      ),
    },
  ];

  console.log(`\nSending ${samples.length} test emails to ${to}...\n`);

  let sent = 0;
  let failed = 0;

  for (const sample of samples) {
    try {
      const { data, error } = await resend.emails.send({
        from,
        to: [to],
        subject: sample.subject,
        html: sample.html,
      });

      if (error) {
        console.error(`  ✗ ${sample.name}: ${error.message}`);
        failed++;
      } else {
        console.log(`  ✓ ${sample.name}  (id: ${data?.id})`);
        sent++;
      }

      // Small delay to avoid rate limiting
      await new Promise((r) => setTimeout(r, 500));
    } catch (err: any) {
      console.error(`  ✗ ${sample.name}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone! ${sent} sent, ${failed} failed.\n`);
}

main().catch(console.error);
