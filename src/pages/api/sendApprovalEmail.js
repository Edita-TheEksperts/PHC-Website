import nodemailer from 'nodemailer';

export default async function sendApprovalEmail(email) {
  const transporter = nodemailer.createTransport({
    host: 'asmtp.mail.hostpoint.ch',
    port: 465,
    secure: true,
    auth: {
      user: 'landingpage@phc.ch',
      pass: '45uYjTaR_N!x4AE',
    },
  });

  const setPasswordUrl = `http://localhost:3000/set-password?email=${encodeURIComponent(email)}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
      <h2 style="color: #2c3e50;">Willkommen bei PHC</h2>
      <p>Ihr Zugang wurde genehmigt. Klicken Sie bitte auf den folgenden Link, um Ihr Passwort festzulegen:</p>
      <p><a href="${setPasswordUrl}" style="color: #1a73e8;">Passwort festlegen</a></p>
      <p>Mit freundlichen Grüssen,<br/>Ihr PHC Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"PHC Admin" <landingpage@phc.ch>`,
    to: email,
    subject: "Ihr PHC-Zugang wurde genehmigt",
    html: htmlContent,
  });
}
