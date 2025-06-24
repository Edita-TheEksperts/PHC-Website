import { prisma } from "../../../lib/prisma";
import { sendEmail } from "../../../lib/emails";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { caregiverName, feedbackLink } = req.body;

  if (!caregiverName || !feedbackLink) {
    return res.status(400).json({ message: "Betreuername und Feedback-Link fehlen" });
  }

  try {
    const clients = await prisma.user.findMany({
      // adjust filter if needed
      select: { email: true, firstName: true, lastName: true }
    });

    const subject = "Wie zufrieden sind Sie mit unserer Betreuung?";

    await Promise.all(
      clients.map(client =>
        sendEmail({
          to: client.email,
          subject,
          html: `
            <p>Guten Tag ${client.firstName} ${client.lastName},</p>
            <p>Wir hoffen, dass Sie mit der Betreuung durch ${caregiverName} zufrieden waren.</p>
            <p>Wir freuen uns über Ihre Rückmeldung: <a href="${feedbackLink}">${feedbackLink}</a></p>
            <p>Ihr Feedback hilft uns, unsere Dienstleistung weiter zu verbessern.</p>
            <p>Danke für Ihr Vertrauen!</p>
            <p>Prime Home Care AG</p>
          `
        })
      )
    );

    res.status(200).json({ message: `Feedback-Mails an ${clients.length} Kunden gesendet.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fehler beim Senden der Feedback-Mails." });
  }
}
