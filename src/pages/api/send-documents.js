// pages/api/send-document.js
import PDFDocument from "pdfkit";
import nodemailer from "nodemailer";
import { PassThrough } from "stream";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { employee, documentType } = req.body;

  // Text templates (simple but customizable)
  const contentMap = {
    "Auflösungschreiben": `
      Sehr geehrte/r ${employee.firstName} ${employee.lastName},

      hiermit bestätigen wir die einvernehmliche Auflösung Ihres Arbeitsvertrags.

      Wir danken Ihnen für die Zusammenarbeit und wünschen Ihnen für die Zukunft alles Gute.

      Mit freundlichen Grüßen
      Personalabteilung PHC
    `,
    "KündigungMA": `
      Sehr geehrte/r ${employee.firstName} ${employee.lastName},

      hiermit kündigen wir Ihr Arbeitsverhältnis fristgerecht zum nächstmöglichen Zeitpunkt.

      Vielen Dank für Ihre Mitarbeit und alles Gute für Ihre Zukunft.

      Mit freundlichen Grüßen
      Personalabteilung PHC
    `,
    "KündigungMAFristlos": `
      Sehr geehrte/r ${employee.firstName} ${employee.lastName},

      hiermit kündigen wir Ihr Arbeitsverhältnis fristlos mit sofortiger Wirkung.

      Bitte setzen Sie sich mit unserer Personalabteilung in Verbindung, um die nächsten Schritte zu klären.

      Mit freundlichen Grüßen
      Personalabteilung PHC
    `,
  };

  const subjectMap = {
    "Auflösungschreiben": "Ihr Auflösungsschreiben",
    "KündigungMA": "Ihre Kündigung",
    "KündigungMAFristlos": "Ihre fristlose Kündigung",
  };

  const textContent = contentMap[documentType] || "Dokument";
  const subject = subjectMap[documentType] || "Dokument";

  // Generate PDF in memory
  const pdfBuffer = await new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const chunks = [];
      const stream = new PassThrough();

      doc.pipe(stream);

      // simple header
      doc.fontSize(18).text("PHC – Personalabteilung", { align: "center" });
      doc.moveDown();

      // main text
      doc.fontSize(12).text(textContent, { align: "left" });

      // footer
      doc.moveDown(2);
      doc.fontSize(10).text("PHC AG • Musterstrasse 1 • 8000 Zürich", {
        align: "center",
      });

      doc.end();

      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(chunks)));
    } catch (err) {
      reject(err);
    }
  });

  // Setup SMTP transport using env values
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"PHC Personalabteilung" <${process.env.SMTP_USER}>`,
  to: "landingpage@phc.ch", // <-- replace with a real email
      subject: subject,
      text: textContent, // plain text
      attachments: [
        {
          filename: `${documentType}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Mail error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
