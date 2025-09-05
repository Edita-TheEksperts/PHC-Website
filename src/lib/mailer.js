import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";

/**
 * Create NDA PDF
 */
export function createNdaPdf(firstName, lastName) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    // Logo
    try {
      doc.image("./public/phc-logo.png", { fit: [120, 120], align: "center" });
    } catch (e) {
      console.log("⚠️ NDA Logo not found, skipping image");
    }

    doc.moveDown(2);

    // Title
    doc.fontSize(20).font("Helvetica-Bold").text("Non-Disclosure Agreement (NDA)", { align: "center" });
    doc.moveDown(2);

    // Date
    doc.fontSize(12).font("Helvetica").text(`Datum: ${new Date().toLocaleDateString("de-CH")}`);
    doc.moveDown(2);

    // Parties
    doc.fontSize(12).text(`Diese NDA wird abgeschlossen mit:`, { continued: false });
    doc.font("Helvetica-Bold").text(`${firstName} ${lastName}`, { indent: 20 });
    doc.moveDown(2);

    // Agreement text
    doc.font("Helvetica").text(
      `Mit der Unterzeichnung dieser NDA erklärt sich ${firstName} ${lastName} bereit, alle vertraulichen Informationen von Prime Home Care AG geheim zu halten.`,
      { align: "justify" }
    );
    doc.moveDown(3);

    // Signature section
    doc.text("_____________________________", { align: "left" });
    doc.text(`${firstName} ${lastName}`, { align: "left" });
    doc.moveDown(3);

    doc.text("_____________________________", { align: "left" });
    doc.text("Prime Home Care AG", { align: "left" });

    doc.end();
  });
}
/**
 * Create Arbeitsvertrag PDF
 */
export function createContractPdf(employee) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    const fullName = `${employee.firstName} ${employee.lastName}`;
    const fullAddress = `${employee.address || ""} ${employee.houseNumber || ""}, ${employee.zipCode || ""} ${employee.city || ""}, ${employee.country || ""}`.trim();

    // Logo
    try {
      doc.image("./public/phc-logo.png", { fit: [120, 120], align: "center" });
    } catch (e) {
      console.log("⚠️ Logo not found, skipping image");
    }

    doc.moveDown(2);

    // Title
    doc.fontSize(18).font("Helvetica-Bold").text("Einsatz - Arbeitsvertrag", { align: "center" });
    doc.moveDown(2);

    // Parties
    doc.fontSize(12).font("Helvetica").text("zwischen", { align: "center" });
    doc.moveDown();
// Arbeitgeberin
doc.fontSize(12).font("Helvetica").fillColor("black");
doc.text("Prime Home Care AG, Schulhausstrasse 1, 8834 Schindellegi", { align: "left" });
doc.text("Arbeitgeberin", { align: "right" });
doc.moveDown(1.5);

// Arbeitnehmer
doc.fillColor("red").text(`${fullName}, ${fullAddress}`, { align: "left" });
doc.fillColor("black").text("Arbeitnehmer", { align: "right" });
doc.moveDown(2);


    // Intro
    doc.font("Helvetica-Oblique").text("betreffend", { align: "center" });
    doc.text("gelegentliche Arbeitsleistungen in unechter Arbeit auf Abruf evtl. Teilzeitarbeit", { align: "center" });
    doc.moveDown(2);

    // Sections helper
    const addSection = (title, body, numbered = null) => {
      if (numbered) {
        doc.font("Helvetica-Bold").fontSize(12).text(`${numbered}. ${title}`);
      } else {
        doc.font("Helvetica-Bold").fontSize(12).text(title);
      }
      doc.moveDown(0.5);
      doc.font("Helvetica").fontSize(11).text(body, { align: "justify" });
      doc.moveDown(1.5);
    };

    // Sections
    addSection("Allgemeines",
      "Die in diesem Vertrag enthaltenen Personenbezeichnungen beziehen sich in gleicher Weise auf die weibliche und männliche Form."
    );

    addSection("Beginn der Anstellung",
      "Am (Datum des Versandes dieses Arbeitsvertrages) schliessen die Vertragsparteien gestützt auf die Rahmenvereinbarung einen Arbeitsvertrag als gelegentliche Arbeitsleistung über einen einzelnen Arbeitseinsatz ab. Eine Probezeit ist nicht vorgesehen.",
      1
    );

    addSection("Arbeitsort",
      "Als Arbeitsort gilt der bzw. die im Vertrag festgelegten Einsatzorte, vorliegend:\n(Angabe des Einsatzortes)",
      2
    );

    addSection("Tätigkeit",
      "Die folgenden Tätigkeiten fallen in den Aufgabenbereich:\n(Angabe der Aufgabenbereiche, Oberbegriffe)\n(Angabe der Aufgabenbereiche)",
      3
    );

    addSection("Arbeitszeit, Dauer des Einsatzes",
      "Der Einsatz ist unbefristet im Umfange der im Vertrag festgelegten Stunden/Woche vorgesehen (...ist befristet im Umfange der im Vertrag festgelegten Stunden/Woche vom ……..bis ……..). Anpassungen sind möglich, wenn beide Parteien zustimmen.",
      4
    );

    addSection("Überstunden",
      "Überstunden ab 43. Wochenstunde dürfen nur auf ausdrückliche Anordnung der Arbeitgeberin hin geleistet werden. Mehrstunden innerhalb der Grenzen von 42 Wochenstunden werden mit Freizeit von gleicher Dauer kompensiert oder in Ausnahmefällen ohne Zuschlag ausbezahlt.\n\nDer Arbeitsplan für den Einsatz ist auf der Online-Plattform verfügbar. Dieser ist einzuhalten. Der Arbeitnehmer ist ausdrücklich mit der Verwendung des digitalen Arbeitsplans (inkl. Stundeneintrag) einverstanden.",
      5
    );

    addSection("Lohn",
      "Stundengrundlohn: CHF 25.00\nZusätzliche Ferienentschädigung: 8.33% / 10.64%\nAnteil 13. Monatslohn: 8.33%\n\nDie Auszahlung erfolgt monatlich, jeweils bis zum 5. des Nachfolgemonats.",
      6
    );

    addSection("Auslagenersatz",
      "Sollten durch die Arbeitsleistung dem Arbeitnehmer Auslagen entstehen, werden solche gegen Beleg mit dem Lohn ausbezahlt.\n\nKosten für den Arbeitsweg sowie Verpflegung werden nicht vergütet.",
      7
    );

    addSection("Ferien",
      "Der Ferienanspruch beträgt bis zum zurückgelegten 20. Altersjahr und ab dem vollendeten 50. Altersjahr 25 Arbeitstage (10.6%). Für alle übrigen Arbeitnehmer beträgt er 20 Arbeitstage (8.33%).",
      8
    );

    addSection("Steuern",
      "Bei Quellensteuerpflicht wird die Steuer direkt vom Bruttogehalt abgezogen.",
      9
    );

    addSection("Krankheit",
      "Die Arbeitgeberin unterhält eine Krankentaggeldversicherung mit 80% Lohn während 730 Tagen abzüglich Wartefrist. Der Arbeitnehmer bezahlt die Hälfte der Prämie.",
      10
    );

    addSection("Unfall",
      "Der Arbeitnehmer ist bei unfallbedingter Arbeitsunfähigkeit für 80% des Lohnes ab dem dritten Tag versichert. Die Betriebsunfallversicherung zahlt die Arbeitgeberin, die Nichtbetriebsunfallversicherung der Arbeitnehmer.",
      11
    );

    addSection("Arbeitsunfähigkeit",
      "Abwesenheiten wegen Krankheit oder Unfall müssen sofort gemeldet werden. Dauert die Abwesenheit länger als 2 Tage, kann ein Arztzeugnis verlangt werden.",
      12
    );

    addSection("Weitere Bestimmungen",
      "Weisungsrecht: ausschliesslich bei der Arbeitgeberin.\n\nGeheimhaltung: streng einzuhalten, auch nach Einsatzende.\n\nArbeitsbewilligung: nötig vor Arbeitsbeginn.\n\nAnwendbares Recht: ausschliesslich schweizerisches Recht. Zuständig sind die Gerichte am Arbeits- oder Wohnort des Beklagten.",
      13
    );

    // Signature section
    doc.moveDown(3);
    doc.font("Helvetica").text("Schindellegi,", { align: "left" });
    doc.moveDown(2);
    doc.text("Prime Home Care AG", { align: "left" });
    doc.moveDown(4);

    doc.font("Helvetica").text("………………………………………           …………………………………………");
    doc.text("Arbeitgeberin                                   Arbeitnehmer");

    doc.end();
  });
}

/**
 * Send welcome email with NDA + Arbeitsvertrag PDFs
 */
export async function sendApprovalEmail(employee) {
  const { email, firstName, lastName } = employee;
  const portalUrl = process.env.NEXT_PUBLIC_BASE_URL + "/login";

  // Create PDFs
  const ndaBuffer = await createNdaPdf(firstName, lastName);
  const contractBuffer = await createContractPdf(employee);

  // Setup transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Send mail
  await transporter.sendMail({
    from: `"Prime Home Care AG" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Willkommen im Prime Home Care Team – Ihr Zugang ist aktiviert",
    text: `
Liebe ${firstName},

Vielen Dank für Ihre Registrierung bei Prime Home Care AG.

Ihr Zugang zum Mitarbeitenden-Portal ist jetzt freigeschaltet. Hier finden Sie alle relevanten Informationen zu Einsätzen, Dokumenten, Rapports und mehr.

Login-Link: ${portalUrl}
Benutzername: ${email}

Bei Fragen stehen wir Ihnen jederzeit zur Verfügung. Willkommen im Team!

Herzliche Grüsse  
Prime Home Care AG
    `,
    html: `
      <p>Liebe ${firstName}</p>
      <p>Vielen Dank für Ihre Registrierung bei <strong>Prime Home Care AG</strong>.</p>
      <p>Ihr Zugang zum Mitarbeitenden-Portal ist jetzt freigeschaltet. Hier finden Sie alle relevanten Informationen zu Einsätzen, Dokumenten, Rapports und mehr.</p>
      <p><strong>Login-Link:</strong> <br/> <a href="${portalUrl}">${portalUrl}</a><br/>
      <strong>Benutzername:</strong> ${email}</p>
      <p>Bei Fragen stehen wir Ihnen jederzeit zur Verfügung. Willkommen im Team!</p>
      <p>Herzliche Grüsse<br/>
      Prime Home Care AG</p>
    `,
    attachments: [
      {
        filename: `NDA_${firstName}_${lastName}.pdf`,
        content: ndaBuffer,
      },
      {
        filename: `Arbeitsvertrag_${firstName}_${lastName}.pdf`,
        content: contractBuffer,
      },
    ],
  });
}
