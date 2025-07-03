import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({ to, subject, html }) {
  try {
    console.log(`✉️ Sending email to ${to} with subject "${subject}"`);
    const info = await transporter.sendMail({
      from: '"Prime Home Care" <landingpage@phc.ch>',
      to,
      subject,
      html,
    });
    console.log("✅ Email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Email sending error:", err);
    throw err; // rethrow to catch in your handler if needed
  }
}
