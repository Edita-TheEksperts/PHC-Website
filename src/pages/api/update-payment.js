import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, cardNumber, expiryDate, cvc } = req.body;

  if (!email || !cardNumber || !expiryDate || !cvc) {
    return res.status(400).json({ error: "Fehlende Zahlungsdaten" });
  }

  try {
    const updated = await prisma.employee.update({
      where: { email },
      data: { cardNumber, expiryDate, cvc },
    });

    res.status(200).json({ success: true, updated });
  } catch (error) {
    console.error("❌ update-payment API error", error);
    res.status(500).json({ error: "Zahlungsdaten konnten nicht gespeichert werden." });
  }
}
