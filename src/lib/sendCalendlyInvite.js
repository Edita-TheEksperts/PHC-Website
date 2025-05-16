import nodemailer from "nodemailer";

export async function sendCalendlyInvite(email) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const calendlyLink = "https://calendly.com/your-company/interview";

  await transporter.sendMail({
    from: `"Your Company" <no-reply@yourdomain.com>`,
    to: email,
    subject: "Schedule your interview",
    html: `
      <p>Thank you for registering.</p>
      <p>Please <a href="${calendlyLink}">book your interview here</a>.</p>
    `,
  });
}
