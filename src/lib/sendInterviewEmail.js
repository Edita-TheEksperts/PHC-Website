import nodemailer from "nodemailer";

export default async function sendInterviewEmail(email, firstName = "") {
  const transporter = nodemailer.createTransport({
    host: "asmtp.mail.hostpoint.ch",
    port: 465,
    secure: true,
    auth: {
       user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const calendlyUrl = "https://calendly.com/your-link"; // ← Replace with real link

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
      <h2 style="color: #2c3e50;">Hallo ${firstName || "Bewerber/in"},</h2>
      <p>Vielen Dank für Ihre Bewerbung bei PHC.</p>
      <p>Bitte klicken Sie auf den folgenden Link, um einen Termin für Ihr Interview zu buchen:</p>
      <p>
        <a href="${calendlyUrl}" style="color: #1a73e8; font-weight: bold;">Interview jetzt buchen</a>
      </p>
      <p>Wir freuen uns auf das Gespräch mit Ihnen.</p>
      <p>Mit freundlichen Grüssen,<br/>Ihr PHC Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"PHC Admin" <landingpage@phc.ch>`,
    to: email,
    subject: "Interview-Termin bei PHC vereinbaren",
    html: htmlContent,
  });
}
