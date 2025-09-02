import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  if (!req.body) {
    return res.status(400).json({ message: "Request body is missing" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(404).json({ message: "Email not found" });
  }

  // Create a random reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  try {
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry: new Date(Date.now() + 3600000), // expires in 1h
      },
    });
  } catch (error) {
    console.error("❌ Prisma update error:", error);
    return res.status(500).json({ message: "Failed to update user with reset token" });
  }

  res.status(200).json({ message: "Reset link created", resetToken });
}
