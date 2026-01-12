import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "asmtp.mail.hostpoint.ch",
  port: 465,
  secure: true,
  auth: {
    user: "landingpage@phc.ch",
    pass: "4Z6j0JmP7ATGC#%!",
  },
});

export async function sendTerminationEmail({ email, firstName, lastName }) {
  const today = new Date().toLocaleDateString("de-CH");

  const html = `
    <p>Grüezi ${firstName || ""} ${lastName || ""}</p>

    <p>
      Wir bestätigen hiermit die Beendigung der Zusammenarbeit zwischen Ihnen und der
      <strong>Prime Home Care AG</strong>.
    </p>

    <p>
      Es werden ab <strong>${today}</strong> keine weiteren Dienstleistungen mehr erbracht.
    </p>

    <p>
      Ihr Kundenkonto im Prime-Home-Care-Portal wird entsprechend geschlossen.
      Ein Zugriff auf das Kundenportal ist danach nicht mehr möglich.
    </p>

    <p>
      Sollten Sie zu einem späteren Zeitpunkt erneut Dienstleistungen über Prime Home Care
      in Anspruch nehmen wollen, ist eine neue Registrierung sowie eine neue Online-Buchung erforderlich.
    </p>

    <p>
      Wir danken Ihnen für die bisherige Zusammenarbeit.
    </p>

    <p>Freundliche Grüsse</p>

    <p>
      Prime Home Care AG<br/>
      Birkenstrasse 49<br/>
      CH-6343 Rotkreuz<br/>
      info@phc.ch<br/>
      www.phc.ch
    </p>

    <p>
      <a href="https://phc-website-vert.vercel.app/AVB" target="_blank">
        AVB und Nutzungsbedingungen
      </a>
    </p>
  `;

  const info = await transporter.sendMail({
    from: `"Prime Home Care" <landingpage@phc.ch>`,
    to: email,
    subject: "Beendigung der Zusammenarbeit mit Prime Home Care",
    html,
  });

  console.log("📨 Kündigung Email sent:", info.messageId);
}
