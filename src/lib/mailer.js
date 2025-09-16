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
 * Send welcome email with NDA + Arbeitsvertrag PDFs
 */
export async function sendApprovalEmail(employee) {
  const { email, firstName, lastName } = employee;
  const portalUrl = process.env.NEXT_PUBLIC_BASE_URL + "/login";

  const ndaBuffer = await createNdaPdf(firstName, lastName);
  const contractBuffer = await createContractPdf(employee);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Prime Home Care AG" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Willkommen im Prime Home Care Team – Ihr Zugang ist aktiviert",
    text: `
Liebe ${firstName}

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
      { filename: `NDA_${firstName}_${lastName}.pdf`, content: ndaBuffer },
    ],
  });
}
