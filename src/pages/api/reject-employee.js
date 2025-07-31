import { prisma } from "../../lib/prisma";
import { sendEmail } from "../../lib/emails";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  const { email } = req.body;

  try {
    const updated = await prisma.employee.update({
      where: { email },
      data: { status: "rejected" },
    });

    const subject = "Ihre Bewerbung bei Prime Home Care AG";
    const text = `Liebe ${updated.firstName}

Vielen Dank für Ihre Bewerbung und Ihr Interesse an der Prime Home Care AG.

Nach sorgfältiger Prüfung haben wir uns entschieden, den Auswahlprozess mit anderen Kandidat*innen fortzusetzen.

Wir danken Ihnen herzlich für Ihre Zeit und wünschen Ihnen für Ihre berufliche Zukunft alles Gute.

Freundliche Grüsse  
Prime Home Care AG`;

    await sendEmail({
      to: email,
      subject,
      html: text,
    });

    res.status(200).json({ message: "Rejected and email sent." });
  } catch (error) {
    console.error("❌ Reject error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
