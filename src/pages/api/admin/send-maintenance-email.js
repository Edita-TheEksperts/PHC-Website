import { prisma } from "../../../lib/prisma";
import { sendEmail } from "../../../lib/emails";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { date, timeStart, timeEnd } = req.body;
  if (!date || !timeStart || !timeEnd) {
    return res.status(400).json({ message: "Datum und Zeiten fehlen" });
  }

  try {
    // get template
    const template = await prisma.emailTemplate.findUnique({
      where: { name: "maintenanceEmail" },
    });

    if (!template) {
      return res.status(500).json({ message: "Template not found" });
    }

    const clients = await prisma.user.findMany({
      select: { email: true, firstName: true, lastName: true },
    });

    const phone = process.env.SUPPORT_PHONE || "[Telefonnummer]";

    const sendTasks = clients.map((client) => {
      // Replace placeholders
      const html = template.body
        .replace(/{{firstName}}/g, client.firstName || "")
        .replace(/{{lastName}}/g, client.lastName || "")
        .replace(/{{date}}/g, date)
        .replace(/{{timeStart}}/g, timeStart)
        .replace(/{{timeEnd}}/g, timeEnd)
        .replace(/{{phone}}/g, phone);

      return sendEmail({
        to: client.email,
        subject: template.subject,
        html,
      });
    });

    await Promise.all(sendTasks);

    res.status(200).json({ message: `E-Mails an ${clients.length} Kunden gesendet.` });
  } catch (error) {
    console.error("❌ Fehler beim Senden:", error);
    res.status(500).json({ message: "Fehler beim Senden der E-Mails." });
  }
}
