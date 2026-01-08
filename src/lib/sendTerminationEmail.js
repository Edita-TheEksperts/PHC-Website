import nodemailer from "nodemailer";

export async function sendTerminationEmail({ email, firstName, reason }) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2 style="color:#B99B5F;">Vertragskündigung bestätigt</h2>

      <p>Liebe/r ${firstName || "Kundin/Kunde"},</p>

      <p>
        wir bestätigen hiermit die erfolgreiche Kündigung Ihres Vertrags bei
        <strong>Prime Home Care AG</strong>.
      </p>

      <p><strong>Grund der Kündigung:</strong><br/>
      ${reason}</p>

      <p>
        Ihr Profil wurde archiviert und der Zugriff auf Ihr Konto wurde deaktiviert.
      </p>

      <p>
        Falls Sie Fragen haben, kontaktieren Sie uns jederzeit unter
        <a href="mailto:support@primehomecare.ch">support@primehomecare.ch</a>.
      </p>

      <p>Freundliche Grüsse<br/>Prime Home Care AG</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Prime Home Care AG" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Bestätigung Ihrer Vertragskündigung",
    html,
  });
}
