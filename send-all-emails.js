import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'asmtp.mail.hostpoint.ch',
  port: 465,
  secure: true,
  auth: {
    user: 'landingpage@phc.ch',
    pass: '45uYjTaR_N!x4AE',
  },
});

const recipients = ['info@the-eksperts.com', 'edita.latifi@the-eksperts.com'];

const loginLink = "https://phc-website-vert.vercel.app/login";
const email = "landingpage@phc.ch";
const feedbackLink = "https://phc-website-vert.vercel.app/login";
const einsatzort = "Zürich";
const einsatzDatumZeit = "15.08.2025, 08:00 Uhr";
const kundenName = "Frau Muster";

// Employees
const employees = [
  { name: "Edita Latifi", vorname: "Edita" },
  { name: "Fisnik Salihu", vorname: "Fisnik" }
];

const emails = (vorname) => [
  {
    subject: "Willkommen im Prime Home Care Team – Ihr Zugang ist aktiviert",
    html: `
      <p>Liebe ${vorname}</p>
      <p>Vielen Dank für Ihre Registrierung bei Prime Home Care AG.</p>
      <p>Ihr Zugang zum Mitarbeitenden-Portal ist jetzt freigeschaltet. Hier finden Sie alle relevanten Informationen zu Einsätzen, Dokumenten, Rapports und mehr.</p>
      <p><strong>Login-Link:</strong> <a href="${loginLink}">Portal öffnen</a><br/>
      <strong>Benutzername:</strong> ${email}</p>
      <p>Bei Fragen stehen wir Ihnen jederzeit zur Verfügung. Willkommen im Team!</p>
      <p>Herzliche Grüsse<br/>Prime Home Care AG</p>
    `,
  },
  {
    subject: "Ihre Bewerbung bei Prime Home Care AG",
    html: `
      <p>Liebe ${vorname}</p>
      <p>Vielen Dank für Ihre Bewerbung bei der Prime Home Care AG. Wir haben Ihre Unterlagen erfolgreich erhalten und werden diese sorgfältig prüfen.</p>
      <p>Wir melden uns so bald wie möglich mit weiteren Informationen bei Ihnen.</p>
      <p>Freundliche Grüsse<br/>Prime Home Care AG</p>
    `,
  },
  {
    subject: "Ihre Bewerbung bei Prime Home Care AG",
    html: `
      <p>Liebe ${vorname}</p>
      <p>Vielen Dank für Ihre Bewerbung und Ihr Interesse an der Prime Home Care AG.</p>
      <p>Nach sorgfältiger Prüfung haben wir uns entschieden, den Auswahlprozess mit anderen Kandidat*innen fortzusetzen.</p>
      <p>Wir danken Ihnen herzlich für Ihre Zeit und wünschen Ihnen für Ihre berufliche Zukunft alles Gute.</p>
      <p>Freundliche Grüsse<br/>Prime Home Care AG</p>
    `,
  },
  {
    subject: "Neuer Einsatzvorschlag – jetzt in der App bestätigen",
    html: `
      <p>Liebe ${vorname}</p>
      <p>Wir haben einen neuen Einsatzvorschlag für Sie in der App hinterlegt.</p>
      <ul>
        <li><strong>Ort:</strong> ${einsatzort}</li>
        <li><strong>Datum/Zeit:</strong> ${einsatzDatumZeit}</li>
      </ul>
      <p>Bitte bestätigen oder lehnen Sie den Einsatz direkt in der App innerhalb der nächsten 24 Stunden ab.</p>
      <p>Vielen Dank für Ihre Flexibilität!</p>
      <p>Freundliche Grüsse<br/>Prime Home Care AG</p>
    `,
  },
  {
    subject: "Rückmeldung zu Ihren Einsatzentscheidungen",
    html: `
      <p>Liebe ${vorname}</p>
      <p>Uns ist aufgefallen, dass Sie in letzter Zeit mehrere Einsatzvorschläge abgelehnt haben.</p>
      <p>Bitte beachten Sie, dass eine regelmässige Ablehnung von Einsätzen unsere Einsatzplanung erschwert. Gerne möchten wir mit Ihnen besprechen, ob es bestimmte Gründe gibt und wie wir Sie besser unterstützen können.</p>
      <p>Melden Sie sich gerne bei uns für ein kurzes Gespräch.</p>
      <p>Freundliche Grüsse<br/>Prime Home Care AG</p>
    `,
  },
  {
    subject: "Rückmeldung zu Ihrem letzten Einsatz",
    html: `
      <p>Liebe ${vorname}</p>
      <p>Wir hoffen, Ihr letzter Einsatz bei ${kundenName} verlief erfolgreich und Sie konnten Ihre Arbeit mit einem guten Gefühl abschliessen.</p>
      <p>Wir sind stets bemüht, unsere Prozesse und Zusammenarbeit weiter zu verbessern. Daher freuen wir uns sehr über Ihr Feedback: <a href="${feedbackLink}">Feedback geben</a></p>
      <p>Ihre Einschätzung ist für uns von grosser Bedeutung – vielen Dank im Voraus!</p>
      <p>Freundliche Grüsse<br/>Ihr Team von Prime Home Care AG</p>
    `,
  },
  {
    subject: "Einsatzvergabe – leider kein Einsatz möglich",
    html: `
      <p>Liebe ${vorname}</p>
      <p>Vielen Dank für Ihre Rückmeldung zum vorgeschlagenen Einsatz.</p>
      <p>Leider wurde der Einsatz inzwischen anderweitig vergeben.</p>
      <p>Wir danken Ihnen dennoch für Ihre Bereitschaft und schlagen Ihnen gerne bald einen neuen Einsatz vor.</p>
      <p>Freundliche Grüsse<br/>Prime Home Care AG</p>
    `,
  },
];

async function sendAllEmployeeEmails() {
  for (const { name, vorname } of employees) {
    const templates = emails(vorname);
    for (const emailData of templates) {
      for (const recipient of recipients) {
        try {
          const info = await transporter.sendMail({
            from: '"Prime Home Care" <landingpage@phc.ch>',
            to: recipient,
            subject: emailData.subject,
            html: emailData.html,
          });
          console.log(`✅ Sent to ${recipient} (${vorname}): ${info.messageId}`);
        } catch (err) {
          console.error(`❌ Failed to ${recipient} (${vorname}):`, err.message);
        }
      }
    }
  }
}

sendAllEmployeeEmails();
