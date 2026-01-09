import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).json({ message: "Email not found" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  await prisma.user.update({
    where: { email },
    data: {
      resetToken,
      resetTokenExpiry: new Date(Date.now() + 3600000), // 1h
    },
  });

  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?resetToken=${resetToken}`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Prime Home Care" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Passwort zurücksetzen",
      html: `
        <p>Hallo ${user.firstName},</p>
        <p>Klicken Sie auf den folgenden Link, um Ihr Passwort zurückzusetzen:</p>
<a 
  href="${resetLink}" 
  style="display:inline-block;
         padding:12px 20px;
         background:#04436F;
         color:white;
         text-decoration:none;
         border-radius:6px;
         font-weight:bold;">
  Passwort zurücksetzen
</a>
        <p>Dieser Link ist 1 Stunde gültig.</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Email error:", err);
    return res.status(500).json({ message: "Email could not be sent" });
  }
}
