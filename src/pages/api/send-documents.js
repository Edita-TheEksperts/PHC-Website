// pages/api/send-document.js
import PDFDocument from "pdfkit";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { employee, documentType } = req.body;

  if (!employee?.email || !documentType) {
    return res.status(400).json({ success: false, error: "Missing employee or documentType" });
  }
const contentMap = {
  Auflösungschreiben: (employee) => `
Grüezi ${employee.firstName} ${employee.lastName},

hiermit bestätigen wir die einvernehmliche Auflösung Ihres Arbeitsvertrags.

Wir danken Ihnen für die Zusammenarbeit und wünschen Ihnen für die Zukunft alles Gute.

Freundliche Grüsse  

<p>
Prime Home Care AG<br/>
Birkenstrasse 49<br/>
CH-6343 Rotkreuz<br/>
info@phc.ch<br/>
www.phc.ch
</p>

<p>
  <a href="https://phc-website-vert.vercel.app/AVB"
     target="_blank"
     style="text-decoration: underline; color:#04436F; font-weight:500;">
    AVB und Nutzungsbedingungen
  </a>
</p>
`,

  KündigungMA: (employee) => `
Grüezi ${employee.firstName} ${employee.lastName},

hiermit kündigen wir Ihr Arbeitsverhältnis fristgerecht zum nächstmöglichen Zeitpunkt.

Vielen Dank für Ihre Mitarbeit und alles Gute für Ihre Zukunft.

Freundliche Grüsse  

<p>
Prime Home Care AG<br/>
Birkenstrasse 49<br/>
CH-6343 Rotkreuz<br/>
info@phc.ch<br/>
www.phc.ch
</p>

<p>
  <a href="https://phc-website-vert.vercel.app/AVB"
     target="_blank"
     style="text-decoration: underline; color:#04436F; font-weight:500;">
    AVB und Nutzungsbedingungen
  </a>
</p>
`,

  KündigungMAFristlos: (employee) => `
Grüezi ${employee.firstName} ${employee.lastName},

Hiermit teilen wir Ihnen mit, dass das bestehende Arbeitsverhältnis mit Ihnen per sofort fristlos beendet wird.

Das entsprechende Kündigungsschreiben ist diesem E-Mail als Dokument beigefügt und wurde rechtsgültig erstellt.

Freundliche Grüsse  

<p>
Prime Home Care AG<br/>
Birkenstrasse 49<br/>
CH-6343 Rotkreuz<br/>
info@phc.ch<br/>
www.phc.ch
</p>

<p>
  <a href="https://phc-website-vert.vercel.app/AVB"
     target="_blank"
     style="text-decoration: underline; color:#04436F; font-weight:500;">
    AVB und Nutzungsbedingungen
  </a>
</p>
`
};

  const subjectMap = {
    Auflösungschreiben: "Ihr Auflösungsschreiben",
    KündigungMA: "Ihre Kündigung",
    KündigungMAFristlos: "Ihre fristlose Kündigung",
  };

  if (!contentMap[documentType]) {
    return res.status(400).json({ success: false, error: "Invalid documentType" });
  }

  const textContent = contentMap[documentType](employee);
  const subject = subjectMap[documentType];

  // Generate PDF
  const pdfBuffer = await new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err) => reject(err));

      doc.fontSize(18).text("PHC – Personalabteilung", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(textContent, { align: "left" });
      doc.moveDown(2);
      doc.fontSize(10).text("PHC AG • Musterstrasse 1 • 8000 Zürich", { align: "center" });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });

  // Mail setup
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"PHC Personalabteilung" <${process.env.SMTP_USER}>`,
      to: employee.email, // ✅ send directly to employee
      subject,
      text: textContent,
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
