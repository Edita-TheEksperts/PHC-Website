import nodemailer from 'nodemailer';

export default async function sendApprovalEmail(email, firstName, portalUrl) 
 {
  const transporter = nodemailer.createTransport({
    host: 'asmtp.mail.hostpoint.ch',
    port: 465,
    secure: true,
    auth: {
       user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const setPasswordUrl = `http://localhost:3000/set-password?email=${encodeURIComponent(email)}`;

   const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f9f9f9; border-radius: 8px;">
      <h2 style="color: #04436F;">Willkommen im Prime Home Care Team</h2>
      <p>Liebe ${firstName}</p>

      <p>Vielen Dank für Ihre Registrierung bei der <strong>Prime Home Care AG</strong>.</p>

      <p>Ihr Zugang zum Mitarbeitenden-Portal ist jetzt freigeschaltet. Dort finden Sie alle relevanten Informationen zu Einsätzen, Dokumenten, Rapports und mehr.</p>

      <p><strong>Login-Link:</strong> <a href="${portalUrl}" style="color: #1a73e8;">${portalUrl}</a></p>
      <p><strong>Benutzername:</strong> ${email}</p>

      <p>Bitte setzen Sie Ihr Passwort über den folgenden Link:</p>
      <p><a href="http://localhost:3000/set-password?email=${encodeURIComponent(email)}" style="color: #1a73e8;">Passwort festlegen</a></p>

      <p>Bei Fragen stehen wir Ihnen jederzeit gerne zur Verfügung.</p>

      <p>Herzliche Grüsse<br/>Ihr Prime Home Care Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"PHC Admin" <landingpage@phc.ch>`,
    to: email,
    subject: "Willkommen im Prime Home Care Team – Ihr Zugang ist aktiviert",
    html: htmlContent,
  });
}

