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

    try {
      doc.image("./public/phc-logo.png", { fit: [120, 120], align: "center" });
    } catch {
      console.log("⚠️ NDA Logo not found, skipping image");
    }

    doc.moveDown(2);
    doc.fontSize(20).font("Helvetica-Bold").text("Non-Disclosure Agreement (NDA)", { align: "center" });
    doc.moveDown(2);
    doc.fontSize(12).font("Helvetica").text(`Datum: ${new Date().toLocaleDateString("de-CH")}`);
    doc.moveDown(2);

    doc.font("Helvetica").text(
      `Mit der Unterzeichnung dieser NDA erklärt sich ${firstName} ${lastName} bereit, alle vertraulichen Informationen von Prime Home Care AG geheim zu halten.`,
      { align: "justify" }
    );

    doc.moveDown(3);
    doc.text("_____________________________");
    doc.text(`${firstName} ${lastName}`);
    doc.moveDown(3);
    doc.text("_____________________________");
    doc.text("Prime Home Care AG");

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

    const fullName = `${employee.firstName || ""} ${employee.lastName || ""}`;
    const city = employee.city || "";
    const date = new Date().toLocaleDateString("de-CH");

    doc.fontSize(18).font("Helvetica-Bold").text("Arbeitsvertrag", { align: "center" });
    doc.moveDown(2);
    doc.fontSize(12).font("Helvetica").text(`Datum: ${date}`).moveDown(2);
    doc.text(`Zwischen Prime Home Care AG und ${fullName}, ${city}.`);
    doc.moveDown(2);
    doc.text("Dieser Vertrag bestätigt die Anstellung als Pflegehilfe / Betreuungsperson.");
    doc.moveDown(2);
    doc.text("Lohn: CHF 25.00 / Stunde + Ferienentschädigung + 13. Monatslohn.");
    doc.moveDown(3);
    doc.text("_____________________________");
    doc.text(`${fullName}`);
    doc.moveDown(3);
    doc.text("_____________________________");
    doc.text("Prime Home Care AG");

    doc.end();
  });
}

/**
 * Send email with NDA + contract
 */
export async function sendApprovalEmail(employee) {
  const { email, firstName, lastName } = employee;

  if (!email) {
    console.error("❌ sendApprovalEmail: Missing employee email!", employee);
    throw new Error("Employee email address is missing.");
  }
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
    html: `
      <p>Liebe ${firstName},</p>
      <p>Vielen Dank für Ihre Registrierung bei <strong>Prime Home Care AG</strong>.</p>
      <p>Im Anhang finden Sie Ihre <strong>NDA</strong> und Ihren <strong>Arbeitsvertrag</strong>.</p>
      <p><strong>Login-Link:</strong> <a href="${portalUrl}">${portalUrl}</a></p>
      <p>Herzliche Grüsse<br/>Prime Home Care AG</p>
    `,
    attachments: [
      { filename: `NDA_${firstName}_${lastName}.pdf`, content: ndaBuffer },
      { filename: `Arbeitsvertrag_${firstName}_${lastName}.pdf`, content: contractBuffer },
    ],
  });
}
