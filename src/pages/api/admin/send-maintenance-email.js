import { prisma } from "../../../lib/prisma";
import { sendEmail } from "../../../lib/emails"; // Your email sender utility

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { date, timeStart, timeEnd } = req.body;
  if (!date || !timeStart || !timeEnd) {
    return res.status(400).json({ message: "Datum und Zeiten fehlen" });
  }

  try {
    const clients = await prisma.user.findMany({
      select: { email: true, firstName: true, lastName: true }
    });

    const subject = "Information: Vorübergehende Systemwartung";
    const phone = process.env.SUPPORT_PHONE || "[Telefonnummer]";

    const sendTasks = clients.map(client => {
      console.log(`📤 Sende E-Mail an: ${client.email}`);
      
      return sendEmail({
        to: client.email,
        subject,
        html: `
          <p>Guten Tag ${client.firstName} ${client.lastName},</p>
          <p>Am ${date} zwischen ${timeStart} und ${timeEnd} führen wir geplante Wartungsarbeiten an unserem System durch.</p>
          <p>In diesem Zeitraum ist das Kundenportal vorübergehend nicht erreichbar. Bei dringenden Anliegen erreichen Sie uns telefonisch unter ${phone}.</p>
          <p>Vielen Dank für Ihr Verständnis.</p>
          <p>Freundliche Grüsse<br/>Ihr Prime Home Care Team</p>
        `
      });
    });

    await Promise.all(sendTasks);

    res.status(200).json({ message: `E-Mails an ${clients.length} Kunden gesendet.` });
  } catch (error) {
    console.error("❌ Fehler beim Senden:", error);
    res.status(500).json({ message: "Fehler beim Senden der E-Mails." });
  }
}
