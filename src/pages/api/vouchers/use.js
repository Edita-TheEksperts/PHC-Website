import { prisma } from "../../../lib/prisma"; 

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { code, userId } = req.body;

    if (!code || !userId) {
      return res.status(400).json({ error: "Missing code or userId" });
    }

    // Find voucher
    const voucher = await prisma.voucher.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!voucher) {
      return res.status(404).json({ error: "Gutschein nicht gefunden." });
    }

    // Check validity
    const now = new Date();
    const isExpired =
      (voucher.validUntil && new Date(voucher.validUntil) < now) ||
      (voucher.maxUses && voucher.usedCount >= voucher.maxUses);

    if (!voucher.isActive || isExpired) {
      return res.status(400).json({ error: "Gutschein ist abgelaufen oder inaktiv." });
    }

    // Update usage + connect to user
    await prisma.voucher.update({
      where: { code: voucher.code },
      data: {
        usedCount: { increment: 1 },
        usedBy: {
          connect: { id: userId },
        },
      },
    });

    return res.status(200).json({
      success: true,
      discountType: voucher.discountType?.toLowerCase() || null,
      discountValue: voucher.discountValue ?? 0,
      message: "Gutschein erfolgreich eingelöst!",
    });

  } catch (err) {
    console.error("❌ Fehler beim Überprüfen des Gutscheins:", err);
    return res.status(500).json({ error: "Serverfehler beim Überprüfen des Gutscheins." });
  }
}
