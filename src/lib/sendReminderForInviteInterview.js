import { prisma } from "./prisma";
import { sendEmail } from "./emails"; // make sure this exists and works

export async function sendReminderForInviteInterview() {
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  // 1. Get employees who were invited 3+ days ago and haven't scheduled anything
  const employees = await prisma.employee.findMany({
    where: {
      invited: true,
      inviteSentAt: { lte: threeDaysAgo },
      status: "pending",
    },
  });

  const calendlyUrl = "https://calendly.com/YOUR_REAL_LINK"; // replace this

  // 2. Send a reminder email to each one
  for (const emp of employees) {
    const subject = "Erinnerung: Termin für Kennenlernen noch nicht vereinbart";

    const body = `
Liebe ${emp.firstName},

Wir freuen uns auf ein Gespräch mit Ihnen, jedoch haben wir noch keine Terminbuchung über unseren Kalender erhalten.

Bitte wählen Sie jetzt Ihren Wunschtermin aus:
${calendlyUrl}

Bei Fragen helfen wir gerne weiter.

Freundliche Grüsse  
Prime Home Care AG
    `;

    try {
      await sendEmail({
        to: emp.email,
        subject,
        text: body,
      });

      console.log(`📨 Erinnerung gesendet an ${emp.email}`);
    } catch (error) {
      console.error(`❌ Fehler beim Senden an ${emp.email}:`, error);
    }
  }
}
