import { prisma } from "../../lib/prisma";
import { sendEmail } from "../../lib/emails"; // ✅ must match function name below

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, firstName } = req.body;

  if (!email || !firstName) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const calendlyLink = "https://calendly.com/YOUR_CALENDLY_LINK";

  const subject = "Terminvereinbarung für ein persönliches Kennenlernen";
  const body = `
Liebe ${firstName},

Vielen Dank für Ihre Bewerbung – wir freuen uns, Sie näher kennenzulernen!

Bitte wählen Sie über folgenden Link einen passenden Termin für ein Interview mit uns:
${calendlyLink}

Bei Fragen stehen wir Ihnen jederzeit gerne zur Verfügung.

Freundliche Grüsse  
Prime Home Care AG
`;

  try {
 await sendEmail({
  to: email,
  subject,
  html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; max-width: 600px; margin: auto;">
      <p>Liebe ${firstName},</p>

      <p>Vielen Dank für Ihre Bewerbung – wir freuen uns, Sie näher kennenzulernen!</p>

      <p>Bitte wählen Sie über folgenden Link einen passenden Termin für ein Interview mit uns:</p>

      <p><a href="${calendlyLink}" style="color: #1a73e8;">Interview buchen</a></p>

      <p>Bei Fragen stehen wir Ihnen jederzeit gerne zur Verfügung.</p>

      <p>Freundliche Grüsse<br>Prime Home Care AG</p>
    </div>
  `,
});


  await prisma.employee.update({
  where: { email },
  data: {
    invited: true,
    inviteSentAt: new Date(), // ⏱ Save invite time
  },
});


    return res.status(200).json({ message: "Einladung gesendet" });
  } catch (err) {
    console.error("❌ Error sending invitation:", err);
    return res.status(500).json({ message: "Fehler beim Senden der Einladung" });
  }
}
