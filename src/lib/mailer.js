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

    // Prepare employee data
    const fullName = `${employee.firstName || ""} ${employee.lastName || ""}`.trim();
    const fullAddress = `${employee.address || ""} ${employee.houseNumber || ""}, ${employee.zipCode || ""} ${employee.city || ""}`.trim();
    const contractDate = new Date().toLocaleDateString("de-CH");
    const einsatzort = employee.city || "";
    const taetigkeiten = employee.servicesOffered?.join(", ") || "";
    const arbeitsstunden = employee.desiredWeeklyHours || "";

    // Title
    doc.fontSize(14).font("Helvetica-Bold").text("Einsatz - Arbeitsvertrag", { align: "left" });
    doc.moveDown(2);

    // Parteien
    doc.fontSize(12).font("Helvetica").fillColor("black");
    doc.text("Prime Home Care AG, Schulhausstrasse 1, 8834 Schindellegi\tArbeitgeberin");
    doc.moveDown(2);
    doc.text("und");
    doc.moveDown(2);

    doc.fillColor("red").text(`${fullName}, ${fullAddress}\tArbeitnehmer`);
    doc.fillColor("black");
    doc.moveDown(2);

    // Betreff
    doc.text("betreffend");
    doc.moveDown(1);
    doc.text("gelegentliche Arbeitsleistungen in unechter Arbeit auf Abruf evtl. Teilzeitarbeit");
    doc.moveDown(2);

    // Allgemeines
    doc.font("Helvetica-Bold").text("Allgemeines");
    doc.font("Helvetica").text("Die in diesem Vertrag enthaltenen Personenbezeichnungen beziehen sich in gleicher Weise auf die weibliche und männliche Form.");
    doc.moveDown(2);

    // Beginn der Anstellung
    doc.font("Helvetica-Bold").text("Beginn der Anstellung");
    doc.font("Helvetica").text("Am ", { continued: true });
    doc.fillColor("red").text(`Datum des Versandes dieses Arbeitsvertrages: ${contractDate}`, { continued: true });
    doc.fillColor("black").text(" schliessen die Vertragsparteien gestützt auf die Rahmenvereinbarung einen Arbeitsvertrag als gelegentliche Arbeitsleistung über einen einzelnen Arbeitseinsatz ab. Eine Probezeit ist nicht vorgesehen.");
    doc.moveDown(2);

    // Arbeitsort
    doc.font("Helvetica-Bold").text("Arbeitsort");
    doc.font("Helvetica").text("Als Arbeitsort gilt der bzw. die im Vertrag festgelegten Einsatzorte, vorliegend:");
    doc.fillColor("red").text(einsatzort);
    doc.fillColor("black");
    doc.moveDown(2);

    // Tätigkeit
    doc.font("Helvetica-Bold").text("Tätigkeit");
    doc.font("Helvetica").text("Die folgenden Tätigkeiten fallen in den Aufgabenbereich:");
    doc.fillColor("red").text(taetigkeiten);
    doc.fillColor("black");
    doc.moveDown(2);

    // Arbeitszeit
    doc.font("Helvetica-Bold").text("Arbeitszeit, Dauer des Einsatzes");
    doc.font("Helvetica").text("Der Einsatz ist unbefristet im Umfange der im Vertrag festgelegten Stunden/Woche vorgesehen (");
    doc.fillColor("red").text(`${arbeitsstunden} Stunden/Woche`, { continued: true });
    doc.fillColor("black").text(" …ist befristet im Umfange der im Vertrag festgelegten Stunden /Woche vom……..bis ……..) vorgesehen. Anpassungen als Reduktion oder Erweiterung/Verlängerung sind möglich, wobei beide Parteien damit einverstanden sein müssen. Bei solchen Änderungen des Arbeitspensums fallen irgendwelche Ansprüche der Arbeitnehmer ausser Betracht (Ausnahme Ziff. 4 lit. b Rahmenvereinbarung).");
    doc.moveDown(2);

    // Überstunden
    doc.font("Helvetica-Bold").text("Überstunden");
    doc.font("Helvetica").text("Überstunden ab 43. Wochenstunde dürfen nur auf ausdrückliche Anordnung der Arbeitgeberin hin geleistet werden. Mehrstunden innerhalb der Grenzen von 42 Wochenstunden werden mit Freizeit von gleicher Dauer kompensiert oder in Ausnahmefällen ohne Zuschlag ausbezahlt.");
    doc.moveDown(1);
    doc.text("Der Arbeitsplan für den Einsatz ist auf der Online-Plattform verfügbar. Dieser ist einzuhalten. Der Arbeitnehmer ist ausdrücklich mit der Verwendung des digitalen Arbeitsplans (inkl. Stundeneintrag) einverstanden. Ist der festgelegte Einsatzplan veränderten Kundenbedürfnissen anzupassen, ist die Arbeitgeberin darüber durch den Arbeitnehmer zu informieren und es ist ein neuer Arbeitsplan zwischen Arbeitgeberin und Arbeitnehmer zu vereinbaren.");
    doc.moveDown(2);

    // Lohn
    doc.font("Helvetica-Bold").text("Lohn");
    doc.font("Helvetica").text("Der Stundengrundlohn beträgt\tCHF 25.00");
    doc.text("Zusätzliche Ferienentschädigung\t8.33%/10.64%");
    doc.text("Anteil 13. Monatslohn\t8.33%");
    doc.moveDown(1);
    doc.text("Die Auszahlung des Lohnes erfolgt monatlich, jeweils bis zum 5. des Nachfolgemonats.");
    doc.moveDown(2);

    // Auslagenersatz
    doc.font("Helvetica-Bold").text("Auslagenersatz");
    doc.font("Helvetica").text("Sollten durch die Arbeitsleistung dem Arbeitnehmer Auslagen entstehen, werden solche gegen Beleg mit dem Lohn ausbezahlt.");
    doc.text("Kosten für den Arbeitsweg (Wohnort – Einsatzort) sowie Verpflegung stellen in keinem Falle Auslagen dar, die von der Arbeitgeberin zu vergüten sind.");
    doc.moveDown(2);

    // Ferien
    doc.font("Helvetica-Bold").text("Ferien");
    doc.font("Helvetica").text("Der Ferienanspruch beträgt bis zum zurückgelegten 20. Altersjahr und ab dem vollendeten 50. Altersjahr 25 Arbeitstage (10.6%). Für alle übrigen Arbeitnehmer beträgt der Ferienanspruch 20 Arbeitstage (8.33%) Die Ferienentschädigung wird monatlich mit dem Gehalt ausbezahlt, womit der Arbeitnehmer ausdrücklich einverstanden ist.");
    doc.moveDown(2);

    // Steuern
    doc.font("Helvetica-Bold").text("Steuern");
    doc.font("Helvetica").text("Bei Quellensteuerpflicht wird die Steuer direkt vom Bruttogehalt des Arbeitnehmers abgezogen.");
    doc.moveDown(2);

    // Krankheit
    doc.font("Helvetica-Bold").text("Krankheit");
    doc.font("Helvetica").text("Die Arbeitgeberin unterhält eine Krankentaggeldversicherung mit einer Deckung von 80% des Lohnes während 730 Tagen abzüglich Wartefrist. Der Arbeitnehmer bezahlt die Hälfte der Prämie, diese wird vom Bruttolohn abgezogen. Während einer allfälligen mit der Versicherung vereinbarten Wartefrist bezahlt die Arbeitgeberin das Taggeld.");
    doc.moveDown(2);

    // Unfall
    doc.font("Helvetica-Bold").text("Unfall");
    doc.font("Helvetica").text("Der Arbeitnehmer ist bei unfallbedingter Arbeitsunfähigkeit für 80% des Lohnes ab dem dritten Tag versichert. Diese Deckung gilt für betriebs- und Nichtbetriebsunfälle. Die Nichtbetriebsunfallversicherung deckt den Lohnausfall nur dann, wenn der Arbeitnehmer mehr als 8 Stunden pro Woche (durchschnittlich) arbeitet. Die Prämien für die Betriebsunfallversicherung bezahlt die Arbeitgeberin, diejenigen der Nichtbetriebsunfallversicherung des Arbeitnehmers.");
    doc.moveDown(2);

    // Arbeitsunfähigkeit
    doc.font("Helvetica-Bold").text("Arbeitsunfähigkeit");
    doc.font("Helvetica").text("Abwesenheiten wegen Krankheit oder Unfall müssen umgehend und vor geplantem Arbeitsbeginn gemeldet werden. Dauert die Abwesenheit länger als 2 Tage, kann die Arbeitgeberin ein Arztzeugnis verlangen oder die Überprüfung der Arbeitsunfähigkeit durch einen eigenen Vertrauensarzt vornehmen lassen.");
    doc.moveDown(2);

    // Weitere Bestimmungen
    doc.font("Helvetica-Bold").text("Weitere Bestimmungen");
    doc.font("Helvetica").text("Weisungsrecht: Das Recht auf Arbeitsanweisungen jeglicher Art steht ausschliesslich der Arbeitgeberin zu. Der Arbeitnehmer haftet für die übliche Sorgfalt bei seiner Arbeitsleistung nach Art. 321e OR");
    doc.moveDown(1);
    doc.text("Geheimhaltung: Der Arbeitnehmer ist verpflichtet, vertrauliche Informationen und weitere geheime Fakten und Dokumente, zu welchen er bei der Verrichtung seiner Arbeitsleistung Zugang hat, streng geheim zu halten und keinesfalls an Dritte weiterzugeben. Dies gilt auch nach Beendigung seines Einsatzes. Dokumente oder Gegenstände, welche dem Arbeitnehmer während des Einsatzes ausgehändigt wurden, sind am Ende des Einsatzes zurückzugeben.");
    doc.moveDown(1);
    doc.text("Einsicht des Kunden in persönliche Daten: Soweit der Kunde dies wünscht, kann die Arbeitgeberin ihm persönliche Informationen über den Arbeitnehmer zugänglich machen, jedoch erst dann, wenn der Arbeitnehmer sein Einverständnis hierzu abgegeben hat. Der Kunde ist in einem solchen Fall zur vollständigen Geheimhaltung zu verpflichten.");
    doc.moveDown(1);
    doc.text("Arbeitsbewilligung: Ist für den Arbeitnehmer zur Arbeitsleistung eine behördliche Arbeitsbewilligung nötig, darf die Arbeit erst nach deren Vorliegen begonnen werden. Der Arbeitgeberin ist das Original der Arbeitsbewilligung vorzulegen.");
    doc.moveDown(1);
    doc.text("Anwendbares Recht: Dieser Vertrag unterliegt ausschliesslich schweizerischem Recht. Bei Streitigkeiten aus diesem Vertrag sind ausschliesslich die Gerichte am Arbeits- oder Wohnort des Beklagten zuständig.");
    doc.moveDown(2);

    // Signatures
    doc.text("Schindellegi,");
    doc.moveDown(2);
    doc.text("Prime Home Care AG");
    doc.moveDown(4);
    doc.text("…………………………………………\t\t\t…………………………………………");
    doc.text("Arbeitgeberin\t\t\t\t\tArbeitnehmer");

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
