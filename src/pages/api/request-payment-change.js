import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, name } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: "Fehlende Angaben" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "asmtp.mail.hostpoint.ch",
      port: 465,
      secure: true,
      auth: {
        user: "landingpage@phc.ch",
        pass: "45uYjTaR_N!x4AE",
      },
    });

    await transporter.sendMail({
      from: `"PHC System" <landingpage@phc.ch>`,
      to: "admin@phc.ch", // Replace with your admin email
      subject: "Zahlungsänderung angefragt",
      html: `
        <p>Der Mitarbeiter <strong>${name}</strong> (${email}) möchte seine Zahlungsdaten aktualisieren.</p>
        <p>Bitte kontaktieren Sie ihn für weitere Schritte.</p>
      `,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ E-Mail Fehler:", error);
    res.status(500).json({ error: "E-Mail konnte nicht gesendet werden." });
  }
}
