// test-emails.js
// Tests: 1) Client welcome email  2) Employee approval email (with Rahmenvereinbarung PDF)

require('dotenv').config();
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const path = require('path');

const TEST_EMAIL = 'edita.latifi@the-eksperts.com';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// --- 1. Client Welcome Email ---
async function testClientWelcomeEmail() {
  const firstName = 'Max';
  const lastName = 'Mustermann';
  const passwordLink = `${process.env.NEXT_PUBLIC_BASE_URL}/forgot-password`;

  await transporter.sendMail({
    from: `"Prime Home Care AG" <${process.env.SMTP_USER}>`,
    to: TEST_EMAIL,
    subject: 'Willkommen bei Prime Home Care – Ihr Zugang ist aktiv',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <p>Grüezi ${firstName} ${lastName}</p>
        <p>Vielen Dank für Ihre Registrierung bei Prime Home Care AG.</p>
        <p>Ihr Zugang zum Kundenportal wurde erfolgreich eingerichtet. Sie können dort:</p>
        <ul>
          <li>Buchungen verwalten</li>
          <li>Mit uns kommunizieren</li>
        </ul>
        <p><strong>Bitte erstellen Sie Ihr Passwort über den folgenden Button:</strong></p>
        <a href="${passwordLink}"
           style="display:inline-block; background-color:#B99B5F; color:#fff; padding:10px 18px; border-radius:5px; text-decoration:none; font-weight:bold;">
          Passwort erstellen
        </a>
        <br><br>
        <p>Freundliche Grüsse</p>
        <p>Prime Home Care AG<br>Birkenstrasse 49<br>CH-6343 Rotkreuz<br>info@phc.ch<br>www.phc.ch</p>
        <p>
          <a href="https://phc.ch/AVB" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;">AVB</a> und
          <a href="https://phc.ch/nutzungsbedingungen" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;">Nutzungsbedingungen</a>
        </p>
      </div>
    `,
  });

  console.log('✅ Client welcome email sent to', TEST_EMAIL);
}

// --- 2. Employee Approval Email (with Rahmenvereinbarung PDF) ---
function generateRahmenvereinbarungPdf(employee) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 40 });
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));

    const fitBox = [100, 70];
    const pageWidth = doc.page.width;
    const logoPath = path.join(__dirname, 'public/images/phc_logo.png');
    doc.image(logoPath, (pageWidth - fitBox[0]) / 2, doc.page.margins.top, { fit: fitBox });
    doc.moveDown(3);

    doc.fontSize(16).font('Helvetica-Bold').text('Rahmenvereinbarung', { align: 'left' });
    doc.moveDown(1.2);
    doc.fontSize(11).font('Helvetica').text('zwischen');
    doc.moveDown(0.5);
    doc.font('Helvetica').text('Prime Home Care AG, Birkenstrasse 49, 6343 Rotkreuz', { continued: true })
      .font('Helvetica-Bold').text('    Arbeitgeberin');
    doc.moveDown(0.8);
    doc.font('Helvetica').text('und');
    doc.moveDown(0.5);
    doc.font('Helvetica')
      .text(`${employee.firstName} ${employee.lastName}, ${employee.street || '[Strasse Nr.]'}, ${employee.zip || '[PLZ]'} ${employee.city || '[Ort]'}`, { continued: true })
      .font('Helvetica-Bold').text('    Arbeitnehmer');
    doc.moveDown(1.5);
    doc.fontSize(11).font('Helvetica').text('Betreffend gelegentliche Arbeitsleistungen / Teilzeitarbeit');
    doc.end();
  });
}

async function testEmployeeApprovalEmail() {
  const employee = {
    firstName: 'Anna',
    lastName: 'Müller',
    email: TEST_EMAIL,
    street: 'Bahnhofstrasse 5',
    zip: '6300',
    city: 'Zug',
  };

  console.log('📄 Generating Rahmenvereinbarung PDF...');
  const rahmenBuffer = await generateRahmenvereinbarungPdf(employee);
  console.log('✅ PDF generated');

  await transporter.sendMail({
    from: `"Prime Home Care AG" <${process.env.SMTP_USER}>`,
    to: TEST_EMAIL,
    subject: 'Willkommen im Prime Home Care Team – Ihr Zugang ist aktiviert',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <p>Grüezi ${employee.firstName}</p>
        <p>Vielen Dank für Ihre Registrierung bei der Prime Home Care AG.</p>
        <p>Ihr Zugang zum Mitarbeiter-Portal ist jetzt freigeschaltet.</p>
        <ul>
          <li>Login-Link: <a href="https://phc.ch/login">https://phc.ch/login</a></li>
          <li>Benutzername: ${employee.email}</li>
        </ul>
        <p>Hier zum Passwort zurücksetzen: <a href="https://www.phc.ch/forgot-password" style="text-decoration:underline;color:#04436F;font-weight:500;">Passwort zurücksetzen</a></p>
        <p>Im Anhang finden Sie Ihre Rahmenvereinbarung.</p>
        <br>
        <p>Freundliche Grüsse</p>
        <p>Prime Home Care AG<br>Birkenstrasse 49<br>CH-6343 Rotkreuz<br>info@phc.ch<br>www.phc.ch</p>
        <p>
          <a href="https://phc.ch/AVB" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;">AVB</a> und
          <a href="https://phc.ch/nutzungsbedingungen" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;">Nutzungsbedingungen</a>
        </p>
      </div>
    `,
    attachments: [
      { filename: `Rahmenvereinbarung_${employee.firstName}_${employee.lastName}.pdf`, content: rahmenBuffer },
    ],
  });

  console.log('✅ Employee approval email sent to', TEST_EMAIL);
}

// --- Run both ---
async function main() {
  console.log('\n📧 Testing Client Welcome Email...');
  await testClientWelcomeEmail();

  console.log('\n📧 Testing Employee Approval Email...');
  await testEmployeeApprovalEmail();

  console.log('\n✅ All test emails sent to', TEST_EMAIL);
}

main().catch(console.error);
