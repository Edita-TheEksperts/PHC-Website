import nodemailer from 'nodemailer';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false, // required for formidable
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields) => {
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(500).json({ error: 'Error parsing form data' });
    }

    const { name, phone, email, message } = fields;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const transporter = nodemailer.createTransport({
      host: 'asmtp.mail.hostpoint.ch',
      port: 465,
      secure: true,
      auth: {
        user: 'landingpage@phc.ch',
        pass: '45uYjTaR_N!x4AE',
      },
    });

    try {
      await transporter.verify();

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
          <h2 style="color: #2c3e50;">Neue Kontaktanfrage von der Website</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>Name:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>Telefon:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${phone || '-'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>Email:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>Nachricht:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${message}</td>
            </tr>
          </table>
          <p style="margin-top: 20px; text-align: center;">Bitte antworten Sie so bald wie möglich.</p>
        </div>
      `;

      const info = await transporter.sendMail({
        from: '"Website Kontakt" <landingpage@phc.ch>',
        to: 'landingpage@phc.ch',
        cc: ['info@phc.ch'],
        subject: `Kontaktformular von ${name}`,
        html,
      });

      console.log('Email sent:', info.messageId);
      res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
      console.error('Send error:', error);
      res.status(500).json({ error: `Email send failed: ${error.message}` });
    }
  });
}
