import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";

export async function sendApprovalEmail(email, firstName, lastName) {
  const portalUrl = process.env.NEXT_PUBLIC_BASE_URL + "/login";

  // 1. Create PDF in memory
  const doc = new PDFDocument();
  const buffers = [];

  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", async () => {
    const pdfBuffer = Buffer.concat(buffers);

    // 2. Setup transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 3. Send email with PDF attachment
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
        <p>Liebe ${firstName},</p>
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
          content: pdfBuffer,
        },
      ],
    });
  });

  // 4. Add NDA content
  doc.fontSize(20).text("Non-Disclosure Agreement (NDA)", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Datum: ${new Date().toLocaleDateString("de-CH")}`);
  doc.moveDown();

  doc.text(`Diese NDA wird abgeschlossen mit: ${firstName} ${lastName}`);
  doc.moveDown();

  doc.text(
    `Mit der Unterzeichnung dieser NDA erklärt sich ${firstName} ${lastName} bereit, alle vertraulichen Informationen von Prime Home Care AG geheim zu halten.`
  );

  doc.moveDown().text("_____________________________", { align: "left" });
  doc.text(`${firstName} ${lastName}`, { align: "left" });

  // Finalize
  doc.end();
}
