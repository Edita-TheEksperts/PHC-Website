
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";

// ---------- Rahmenvereinbarung PDF ----------
export function createRahmenvereinbarungPdf(employee) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 40 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));


    // Page 1 - Header and Title
    doc.image("public/images/logo.png", doc.page.width / 2 - 60, 30, { width: 120 });
    doc.moveDown(4.5);
    doc.fontSize(16).font("Helvetica-Bold").text("Rahmenvereinbarung", { align: "left" });
    doc.moveDown(1.2);
    doc.fontSize(11).font("Helvetica").text("zwischen", { align: "left" });
    doc.moveDown(0.3);
    doc.fontSize(11).font("Helvetica").text("Prime Home Care AG, Birkenstrasse 49, 6343 Rotkreuz", { continued: true }).font("Helvetica-Bold").text("    Arbeitgeberin");
    doc.moveDown(0.3);
    doc.fontSize(11).font("Helvetica").text(`und`, { continued: true });
    doc.moveDown(0.1);
    doc.fontSize(11).font("Helvetica").text(`${employee.firstName} ${employee.lastName}, ${employee.street || "[Strasse Nr.]"}, ${employee.zip || "[PLZ]"} ${employee.city || "[Ort]"}`, { continued: true }).font("Helvetica-Bold").text("    Arbeitnehmer");
    doc.moveDown(1);
    doc.fontSize(11).font("Helvetica").text("Betreffend gelegentliche Arbeitsleistungen / Teilzeitarbeit");
    doc.moveDown(1.2);
    doc.fontSize(11).font("Helvetica-Bold").text("Allgemeines");
    doc.fontSize(11).font("Helvetica").text("Die in diesem Vertrag enthaltenen Personenbezeichnungen beziehen sich in gleicher Weise auf die weibliche und männliche Form.");
    doc.moveDown(1);
    doc.font("Helvetica-Bold").text("1. Inhalt der Vereinbarung");
    doc.font("Helvetica").text("Der Arbeitnehmer lässt sich in die Mitarbeiter-Datenbank der Arbeitgeberin eintragen. Gestützt auf den Eintrag schliessen die Arbeitgeberin und der Arbeitnehmer vorliegende zeitlich unbefristete Rahmenvereinbarung, welche es der Arbeitgeberin ermöglicht, dem Arbeitnehmer einzelne Arbeitseinsätze im Haushalts- und Betreuungsbereich anzubieten.");
    doc.moveDown(1);
    doc.font("Helvetica-Bold").text("2. Rechtliche Qualifikation der Arbeitsangebote");
    doc.font("Helvetica").text("Bei den Arbeitsangeboten handelt es sich um unechte Arbeit auf Abruf, da es dem Arbeitnehmer freisteht, die jeweiligen Angebote der Arbeitgeberin anzunehmen oder abzulehnen.");
    doc.moveDown(1);
    doc.font("Helvetica-Bold").text("3. Einsatzvertrag");
    doc.font("Helvetica").text("Ein konkreter Arbeitsvertrag entsteht erst, wenn der Arbeitnehmer ein Angebot annimmt und sich zur Leistung von Arbeit verpflichtet. Ein solcher Einsatz wird jeweils in einem schriftlichen Einsatzvertrag vereinbart.");
    doc.moveDown(1);
    doc.font("Helvetica-Bold").text("4. Rechtliche Qualifikation der einzelnen Arbeitseinsätze");
    doc.font("Helvetica").text("a. Die einzelnen Einsatzverträge stellen grundsätzlich Gelegenheitsarbeit dar. Es werden dem Arbeitnehmer ausdrücklich kein minimales Arbeitspensum und keine Kündigungsfristen garantiert.\nb. Erfolgen mehrere und regelmässige Einsätze während einer Dauer von mehr als drei Jahren, wandelt sich der Einsatzvertrag über Gelegenheitsarbeit in ein andauerndes Arbeitsverhältnis über Teilzeitarbeit um. Daran ändert auch nichts, dass die Vertragsparteien bezüglich der einzelnen Arbeitseinsätze über Abschlussfreiheit verfügen.\nDie Umwandlung in ein Teilzeitarbeitsverhältnis bedeutet, dass ab dem vierten Dienstjahr die Arbeitgeberin dem Arbeitnehmer während der Kündigungsfrist von Art. 335c OR bei fehlenden oder geringeren Einsätzen den Bruttodurchschnittslohn zu entrichten hat, wenn der Arbeitnehmer während dieser Zeit seine Arbeitsleistung anbietet.");

    // Page 2 - Signature Page
    doc.addPage();
    doc.image("public/images/logo.png", doc.page.width / 2 - 60, 30, { width: 120 });
    doc.moveDown(10);
    doc.fontSize(12).font("Helvetica").text(`Rotkreuz, Datum Versand`, { align: "left" });
    doc.moveDown(2.5);
    doc.fontSize(12).font("Helvetica-Bold").text("Prime Home Care AG");
    doc.moveDown(3);
    doc.fillColor("black").fontSize(12).font("Helvetica").text("…………………………………………                …………………………………………");
    doc.text("Arbeitgeberin                                Arbeitnehmer");

    doc.end();
  });
}

export async function sendApprovalEmail(employee, plainPassword) {
  const { email, firstName, lastName } = employee;

  console.log("📨 Starting email process...");
  console.log("Recipient:", email);

  try {
    console.log("📄 Generating Rahmenvereinbarung PDF...");
    const rahmenBuffer = await createRahmenvereinbarungPdf(employee);
    console.log("✅ Rahmenvereinbarung PDF created");

    console.log("🔌 Creating SMTP transporter...");
    console.log("SMTP HOST:", process.env.SMTP_HOST);
    console.log("SMTP PORT:", process.env.SMTP_PORT);
    console.log("SMTP USER:", process.env.SMTP_USER);
    console.log("SMTP SECURE:", process.env.SMTP_SECURE);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log("📤 Sending email...");

    const info = await transporter.sendMail({
      from: `"Prime Home Care AG" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Willkommen im Prime Home Care Team – Ihr Zugang ist aktiviert",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>Grüezi ${firstName}</p>
          <p>Vielen Dank für Ihre Registrierung bei der Prime Home Care AG.</p>
          <p>Ihr Zugang zum Mitarbeiter-Portal ist jetzt freigeschaltet.</p>
          <ul>
            <li>Login-Link: <a href="${process.env.NEXT_PUBLIC_BASE_URL}/login">${process.env.NEXT_PUBLIC_BASE_URL}/login</a></li>
            <li>Benutzername: ${email}</li>
            <li>Passwort: <strong>${plainPassword}</strong></li>
          </ul>
          <p>Bitte ändern Sie Ihr Passwort nach dem ersten Login.</p>
          <p>Im Anhang finden Sie Ihre Rahmenvereinbarung.</p>
          <br>
          <p>Freundliche Grüsse</p>
          <p>Prime Home Care AG<br>
          Birkenstrasse 49<br>
          CH-6343 Rotkreuz<br>
          info@phc.ch<br>
          www.phc.ch</p>
          <p>
            <a href="https://phc.ch/AVB" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">AVB</a> und 
            <a href="https://phc.ch/nutzungsbedingungen" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">Nutzungsbedingungen</a>
          </p>
        </div>
      `,
      attachments: [
        { filename: `Rahmenvereinbarung_${firstName}_${lastName}.pdf`, content: rahmenBuffer },
      ],
    });

    console.log("✅ Email sent successfully!");
    console.log("📨 Message ID:", info.messageId);

  } catch (error) {
    console.error("❌ Email sending failed!");
    console.error("ERROR MESSAGE:", error.message);
    console.error("FULL ERROR:", error);
  }
}
