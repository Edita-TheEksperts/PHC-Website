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
      <p>Liebe ${firstName || "Bewerber/in"},</p>

      <p>Vielen Dank für Ihre Bewerbung bei der <strong>Prime Home Care AG</strong>.</p>

      <p>Wir haben Ihre Unterlagen erfolgreich erhalten und werden diese sorgfältig prüfen.</p>

      <p>Wir melden uns so bald wie möglich mit weiteren Informationen bei Ihnen.</p>

      <p>Freundliche Grüsse<br/>Prime Home Care AG</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Prime Home Care AG" <landingpage@phc.ch>`,
    to: email,
    subject: "Ihre Bewerbung bei Prime Home Care AG",
    html: htmlContent,
  });
}
