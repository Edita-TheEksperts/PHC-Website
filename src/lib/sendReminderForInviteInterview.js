import { prisma } from "./prisma";
import { sendEmail } from "./emails"; // make sure this exists and works

export async function sendReminderForInviteInterview() {
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  // 1. Get employees who were invited 3+ days ago and haven't scheduled anything
  const employees = await prisma.employee.findMany({
    where: {
      invited: true,
      inviteSentAt: { lte: threeDaysAgo },
      status: "pending",a
    },
  });

  const calendlyUrl = "https://calendly.com/primehomecare";

  // 2. Send a reminder email to each one
  for (const emp of employees) {
    const subject = "Erinnerung: Termin für Kennenlernen noch nicht vereinbart";

    const body = `
Liebe ${emp.firstName},

Wir freuen uns auf ein Gespräch mit Ihnen, jedoch haben wir noch keine Terminbuchung über unseren Kalender erhalten.

<p>
  Bitte wählen Sie jetzt Ihren Wunschtermin aus: 
  <a href="https://calendly.com/primehomecare" 
     style="text-decoration: underline; color:#04436F;">
     Hier Termin vereinbaren
  </a>
</p>


Bei Fragen helfen wir gerne weiter.


Freundliche Grüsse  

<p>
  Prime Home Care AG<br/>
  Birkenstrasse 49<br/>
  CH-6343 Rotkreuz<br/>
  info@phc.ch<br/>
  www.phc.ch
</p>

<p>
  <a
    href="https://phc-website-vert.vercel.app/AVB"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      textDecoration: "underline",
      color: "#04436F",
      fontWeight: "500",
      cursor: "pointer"
    }}
  >
    AVB und Nutzungsbedingungen
  </a>
</p>
    `;

    try {
      await sendEmail({
        to: emp.email,
        subject,
        text: body,
      });
    } catch (error) {
      console.error(`❌ Fehler beim Senden an ${emp.email}:`, error);
    }
  }
}
