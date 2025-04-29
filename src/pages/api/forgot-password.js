import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(404).json({ message: "Email not found" });
  }

  // ✅ Create a random reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // ✅ Save resetToken into database
  await prisma.user.update({
    where: { email },
    data: {
      resetToken, // You need to add resetToken column in your User model in database
      resetTokenExpiry: new Date(Date.now() + 3600000), // 1 hour expiry
    },
  });

  // (Later) send resetToken in real email - for now we just return it for testing
  res.status(200).json({ message: "Reset link created", resetToken });
}
