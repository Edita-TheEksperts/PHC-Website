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

const vorname = "Edita";
const nachname = "Latifi";
const betrag = 120;
const buchungsnummer = "BCH123456";
const einsatzDatum = "Freitag, 5. Juli 2025";
const betreuerin = "Frau Müller";
const calendlyLink = "https://calendly.com/your-link-here";

// 4 Email Templates
const emails = [
  {
    subject: "Zahlungsbestätigung / Rechnung zu Ihrer Buchung",
    text: `Guten Tag ${vorname} ${nachname},

Wir bestätigen den Eingang Ihrer Zahlung über CHF ${betrag} zur Buchung ${buchungsnummer}.
Ihre Rechnung finden Sie im Anhang als PDF oder auf Ihrer persönlichen PHC-Plattform

Bei Fragen stehen wir Ihnen jederzeit gerne zur Verfügung.

Freundliche Grüsse
Prime Home Care AG`,
  },
  {
    subject: "In 2 Tagen beginnt Ihre Betreuung.",
    text: `Guten Tag ${vorname} ${nachname},

Am ${einsatzDatum} beginnt die Betreuung durch ${betreuerin}.
Bitte stellen Sie Folgendes bereit:

• Zugang zur Wohnung  
• Informationen zu Medikamenten  
• Tagesstruktur / Gewohnheiten  

Bei kurzfristigen Änderungen erreichen Sie uns jederzeit unter [Telefonnummer].

Mit besten Grüssen  
Ihr Team von Prime Home Care AG`,
  },
  {
    subject: "Terminvereinbarung für ein persönliches Kennenlernen",
    text: `Liebe ${vorname},

Vielen Dank für Ihre Bewerbung – wir freuen uns, Sie näher kennenzulernen!
Bitte wählen Sie über folgenden Link einen passenden Termin für ein Interview mit uns:
${calendlyLink}

Bei Fragen stehen wir Ihnen jederzeit gerne zur Verfügung.

Freundliche Grüsse  
Prime Home Care AG`,
  },
  {
    subject: "Erinnerung: Termin für Kennenlernen noch nicht vereinbart",
    text: `Liebe ${vorname},

Wir freuen uns auf ein Gespräch mit Ihnen, jedoch haben wir noch keine Terminbuchung über unseren Kalender erhalten.

Bitte wählen Sie jetzt Ihren Wunschtermin aus:
${calendlyLink}

Bei Fragen helfen wir gerne weiter.

Freundliche Grüsse  
Prime Home Care AG`,
  },
];

// Send all emails to each recipient
async function sendTestEmails() {
  for (const email of emails) {
    for (const recipient of recipients) {
      try {
        const info = await transporter.sendMail({
          from: '"Prime Home Care AG" <landingpage@phc.ch>',
          to: recipient,
          subject: email.subject,
          text: email.text,
        });
        console.log(`✅ Sent: "${email.subject}" to ${recipient}`);
      } catch (err) {
        console.error(`❌ Failed to send to ${recipient}:`, err.message);
      }
    }
  }
}

sendTestEmails();
