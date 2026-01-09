import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";

/* ---------- NDA PDF ---------- */
export function createNdaPdf(firstName, lastName) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    doc.fontSize(20).font("Helvetica-Bold").text("Non-Disclosure Agreement (NDA)", { align: "center" });
    doc.moveDown(2);
    doc.fontSize(12).text(`Datum: ${new Date().toLocaleDateString("de-CH")}`);
    doc.moveDown(2);
    doc.text(
      `Mit der Unterzeichnung erklärt sich ${firstName} ${lastName} bereit, alle vertraulichen Informationen von Prime Home Care AG geheim zu halten.`,
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

/* ---------- CONTRACT PDF ---------- */
export function createContractPdf(employee) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    const fullName = `${employee.firstName} ${employee.lastName}`;
    const date = new Date().toLocaleDateString("de-CH");

    doc.fontSize(18).font("Helvetica-Bold").text("Arbeitsvertrag", { align: "center" });
    doc.moveDown(2);
    doc.text(`Datum: ${date}`);
    doc.moveDown(2);
    doc.text(`Zwischen Prime Home Care AG und ${fullName}.`);
    doc.moveDown(2);
    doc.text("Anstellung als Pflegehilfe / Betreuungsperson.");
    doc.moveDown(2);
    doc.text("Lohn: CHF 25.00 / Stunde + Ferienentschädigung + 13. Monatslohn.");

    doc.moveDown(3);
    doc.text("_____________________________");
    doc.text(fullName);
    doc.moveDown(3);
    doc.text("_____________________________");
    doc.text("Prime Home Care AG");

    doc.end();
  });
}

export async function sendApprovalEmail(employee, plainPassword) {
  const { email, firstName, lastName } = employee;

  console.log("📨 Starting email process...");
  console.log("Recipient:", email);

  try {
    console.log("📄 Generating NDA PDF...");
    const ndaBuffer = await createNdaPdf(firstName, lastName);
    console.log("✅ NDA PDF created");

    console.log("📄 Generating Contract PDF...");
    const contractBuffer = await createContractPdf(employee);
    console.log("✅ Contract PDF created");

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
      subject: "Willkommen im Prime Home Care Team – Zugangsdaten",
      html: `
        <p>Liebe ${firstName},</p>
        <p>Ihr Profil wurde akzeptiert.</p>
        <p><strong>Login-Daten:</strong></p>
        <ul>
          <li>Email: ${email}</li>
          <li>Passwort: <strong>${plainPassword}</strong></li>
        </ul>
        <p>Bitte ändern Sie Ihr Passwort nach dem ersten Login.</p>
        <p>Im Anhang finden Sie Ihre NDA und Ihren Arbeitsvertrag.</p>
        <p>Freundliche Grüsse<br/>Prime Home Care AG</p>
      `,
      attachments: [
        { filename: `NDA_${firstName}_${lastName}.pdf`, content: ndaBuffer },
        { filename: `Arbeitsvertrag_${firstName}_${lastName}.pdf`, content: contractBuffer },
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
