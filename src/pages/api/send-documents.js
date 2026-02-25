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
<html>
  <body style="font-family: Arial, sans-serif; color: #222; font-size: 15px; line-height: 1.6;">
    <p>Grüezi ${employee.firstName} ${employee.lastName},</p>
    <p>
      Hiermit bestätigen wir die einvernehmliche Auflösung Ihres Arbeitsvertrags.<br>
      Wir danken Ihnen für die Zusammenarbeit und wünschen Ihnen für die Zukunft alles Gute.
    </p>
    <p>Freundliche Grüsse<br>
      <strong>Prime Home Care AG</strong><br>
      Birkenstrasse 49<br>
      CH-6343 Rotkreuz<br>
      <a href="mailto:info@phc.ch" style="color: #04436f; text-decoration: underline;">info@phc.ch</a>
    </p>
    <p>
      <a href="https://phc.ch" style="color: #04436f; text-decoration: underline; font-weight: 500;" target="_blank">www.phc.ch</a>
    </p>
    <p>
      <a href="https://phc.ch/AVB" style="color: #04436f; text-decoration: underline; font-weight: 500;" target="_blank">AVB und Nutzungsbedingungen</a>
    </p>
  </body>
</html>
`,
    KündigungMA: (employee) => `
<html>
  <body style="font-family: Arial, sans-serif; color: #222; font-size: 15px; line-height: 1.6;">
    <p>Grüezi ${employee.firstName} ${employee.lastName},</p>
    <p>
      Hiermit kündigen wir Ihr Arbeitsverhältnis fristgerecht zum nächstmöglichen Zeitpunkt.<br>
      Vielen Dank für Ihre Mitarbeit und alles Gute für Ihre Zukunft.
    </p>
    <p>Freundliche Grüsse<br>
      <strong>Prime Home Care AG</strong><br>
      Birkenstrasse 49<br>
      CH-6343 Rotkreuz<br>
      <a href="mailto:info@phc.ch" style="color: #04436f; text-decoration: underline;">info@phc.ch</a>
    </p>
    <p>
      <a href="https://phc.ch" style="color: #04436f; text-decoration: underline; font-weight: 500;" target="_blank">www.phc.ch</a>
    </p>
    <p>
      <a href="https://phc.ch/AVB" style="color: #04436f; text-decoration: underline; font-weight: 500;" target="_blank">AVB und Nutzungsbedingungen</a>
    </p>
  </body>
</html>
`,

    KündigungMAFristlos: (employee) => `
<html>
  <body style="font-family: Arial, sans-serif; color: #222; font-size: 15px; line-height: 1.6;">
    <p>Grüezi ${employee.firstName} ${employee.lastName},</p>
    <p>
      Hiermit teilen wir Ihnen mit, dass das bestehende Arbeitsverhältnis mit Ihnen per sofort fristlos beendet wird.<br>
      Das entsprechende Kündigungsschreiben ist diesem E-Mail als Dokument beigefügt und wurde rechtsgültig erstellt.
    </p>
    <p>Freundliche Grüsse<br>
      <strong>Prime Home Care AG</strong><br>
      Birkenstrasse 49<br>
      CH-6343 Rotkreuz<br>
      <a href="mailto:info@phc.ch" style="color: #04436f; text-decoration: underline;">info@phc.ch</a>
    </p>
    <p>
      <a href="https://phc.ch" style="color: #04436f; text-decoration: underline; font-weight: 500;" target="_blank">www.phc.ch</a>
    </p>
    <p>
      <a href="https://phc.ch/AVB" style="color: #04436f; text-decoration: underline; font-weight: 500;" target="_blank">AVB und Nutzungsbedingungen</a>
    </p>
  </body>
</html>
`,
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

  // Convert HTML -> plain text fallback (so email looks normal even if client shows text-only)
  function stripHtml(html) {
    if (!html) return "";
    return html
      .replace(/<\s*br\s*\/?\s*>/gi, "\n")
      .replace(/<\/p\s*>/gi, "\n\n")
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  // Generate PDF with custom content for each document type
  function generatePdfContent(doc, employee, documentType) {
    const today = new Date();
    const datum = today.toLocaleDateString("de-CH");
    const ort = employee.city || "[Ort]";
    const kuendigungsdatum = employee.terminationDate || "[Kündigungsdatum]";
    const nachname = employee.lastName || "[Nachname]";
    const vorname = employee.firstName || "[Vorname]";
    const adresse = employee.address || "[Adresse]";
    const plz = employee.zip || "[PLZ]";
    // Header
    doc.image("public/images/phc_logo.png", 220, 30, { width: 150 }).moveDown(3);
    // Address block
    doc
      .fillColor("black")
      .fontSize(12)
      .text(`${vorname} ${nachname} Mitarbeiter/in\n\n${adresse}\n\n${plz} ${ort}\n\n\n`, { align: "left" });
    doc.fillColor("black");
    doc.text(`${ort}, ${datum}\n\n`);
    // Title and salutation
    if (documentType === "Auflösungschreiben") {
      doc.fontSize(14).text("Auflösung des Arbeitsverhältnisses", { bold: true }).moveDown();
      doc.fontSize(12).fillColor("black").text(`Sehr geehrte/r Frau/Herr ${nachname}\n\n`);
      doc.fillColor("black").text(
        `Hiermit bestätigen wir Ihnen die Auflösung Ihres Arbeitsverhältnisses mit der Prime Home Care AG.\n\nDas Arbeitsverhältnis endet per ${kuendigungsdatum} im gegenseitigen Einverständnis. Sämtliche bis zu diesem Zeitpunkt bestehenden Ansprüche (inkl. Lohn, Ferien- und Überzeitguthaben) werden entsprechend den gesetzlichen Vorgaben und unseren Vereinbarungen abgerechnet.\n\nWir bitten Sie, allfällige Arbeitsmaterialien und Unterlagen bis spätestens zu Ihrem letzten Arbeitstag an Ihrem Einsatzort zu deponieren.\n\nWir bedanken uns herzlich für Ihre Mitarbeit und wünschen Ihnen für Ihre berufliche wie auch private Zukunft alles Gute.\n\nFreundliche Grüsse\nPrime Home Care AG\n\nKündigungsdatum, Digitale Unterschrift`
      );
    } else if (documentType === "KündigungMA") {
      doc.fontSize(14).text("Kündigung des Arbeitsverhältnisses", { bold: true }).moveDown();
      doc.fontSize(12).fillColor("red").text(`Sehr geehrte/r Frau/Herr ${nachname}\n\n`);
      doc.fillColor("black").text(
        `Wir teilen Ihnen hiermit mit, dass das Arbeitsverhältnis mit der Prime Home Care AG ordentlich und fristgerecht per ${kuendigungsdatum} endet. Die gesetzlich gültige Kündigungsfrist wurde dabei automatisch berücksichtigt.\n\nBis zum Beendigungsdatum bleiben alle bisherigen Vereinbarungen bestehen.\n\nBitte geben Sie alle Arbeitsmaterialien und gegebenenfalls ausgehändigte Schlüssel spätestens an Ihrem letzten Arbeitstag zurück.\n\nWir machen Sie darauf aufmerksam, dass Sie noch 31 Tage ab dem letzten Arbeitstag gegen Nichtberufsunfälle versichert sind. Nach dem Ablauf dieser 31 Tage geniessen Sie keine Unfalldeckung mehr. Es besteht die Möglichkeit bei der SUVA eine Abredeversicherung abzuschliessen.\n\nWir bedanken uns herzlich für Ihre Mitarbeit und wünschen Ihnen für Ihre berufliche wie auch private Zukunft alles Gute.\n\nFreundliche Grüsse\nPrime Home Care AG\n\n${kuendigungsdatum} Digitale Unterschrift`
      );
    } else if (documentType === "KündigungMAFristlos") {
      doc.fontSize(14).text("Kündigung des Arbeitsverhältnisses", { bold: true }).moveDown();
      doc.fontSize(12).fillColor("red").text(`Sehr geehrte/r Frau/Herr ${nachname}\n\n`);
      doc.fillColor("black").text(
        `Hiermit beenden wir das Arbeitsverhältnis mit der Prime Home Care AG mit sofortiger Wirkung.\n\nDiese Entscheidung wurde aufgrund einer schwerwiegenden Situation getroffen, die eine Fortsetzung des Arbeitsverhältnisses unzumutbar macht. Das Arbeitsverhältnis endet deshalb per sofort.\n\nBitte geben Sie sämtliche Arbeitsmaterialien und ausgehändigte Schlüssel umgehend zurück.\n\nWir machen Sie darauf aufmerksam, dass Sie noch 31 Tage ab dem letzten Arbeitstag gegen Nichtberufsunfälle versichert sind. Nach dem Ablauf dieser 31 Tage geniessen Sie keine Unfalldeckung mehr. Es besteht die Möglichkeit bei der SUVA eine Abredeversicherung abzuschliessen.\n\nWir danken Ihnen für die bisherige Zusammenarbeit und wünschen Ihnen für die Zukunft alles Gute.\n\nFreundliche Grüsse\nPrime Home Care AG\n\n${kuendigungsdatum} Digitale Unterschrift`
      );
    }
    // Footer
    doc.moveDown(2);
    doc.fontSize(10).fillColor("gray").text("Prime Home Care AG – info@phc.ch – www.phc.ch", { align: "center" });
  }

  const pdfBuffer = await new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err) => reject(err));
      generatePdfContent(doc, employee, documentType);
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
      // ✅ This makes it display like a normal email in HTML-capable clients
      html: textContent,
      // ✅ This makes it display like a normal email in text-only clients
      text: stripHtml(textContent),
      attachments: [
        {
          filename: `${documentType}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    // Update employee documentStatus to the sent document type in DB after successful email send
    let updatedEmployee = null;
    try {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();
      updatedEmployee = await prisma.employee.update({
        where: { id: employee.id },
        data: { documentStatus: documentType },
      });
    } catch (dbError) {
      // Log DB error but do not fail the email send
      console.error('DB update error:', dbError);
    }
    res.status(200).json({ success: true, documentStatus: updatedEmployee?.documentStatus || documentType });
  } catch (error) {
    console.error("Mail error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}