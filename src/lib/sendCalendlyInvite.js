import nodemailer from "nodemailer";

export async function sendCalendlyInvite(email) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const calendlyLink = "https://calendly.com/your-company/interview";

await transporter.sendMail({
  from: '"Prime Home Care AG" <info@primehomecare.ch>',
  to: email,
  subject: "Vereinbaren Sie Ihr Interview",
  html: `
    <p>Grüezi ${firstName},</p>

    <p>Vielen Dank für Ihre Bewerbung – wir freuen uns, Sie näher kennenzulernen!</p>

    <p>
      Bitte wählen Sie über folgenden Link einen passenden Termin für ein Interview mit uns:
      <br /><br />
      <a href="${calendlyLink}" style="text-decoration: underline;">
        Interview buchen
      </a>
    </p>

    <p>Bei Fragen stehen wir Ihnen jederzeit gerne zur Verfügung.</p>

    <p>Freundliche Grüsse</p>  

    <p>
      Prime Home Care AG<br/>
      Birkenstrasse 49<br/>
      CH-6343 Rotkreuz<br/>
      info@phc.ch<br/>
      www.phc.ch
    </p>

    <p>
      <a
        href="https://phc-website-vert.vercel.app/AVB"
        target="_blank"
        rel="noopener noreferrer"
        style="text-decoration: underline; color: #04436F; font-weight: 500; cursor: pointer;"
      >
        AVB und Nutzungsbedingungen
      </a>
    </p>
  `,
});


}
