import { prisma } from "../../../lib/prisma"; // ✅ Corrected import path for your structure


export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Kein Gutscheincode angegeben." });
    }

    // 🔍 Find voucher by code
    const voucher = await prisma.voucher.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    console.log("✅ Voucher found:", voucher);

    if (!voucher) {
      return res.status(404).json({ error: "Gutschein nicht gefunden." });
    }

    // ⛔ Check if voucher is still valid
    const now = new Date();
    const isExpired =
      (voucher.validUntil && new Date(voucher.validUntil) < now) ||
      (voucher.maxUses && voucher.usedCount >= voucher.maxUses);

    if (!voucher.isActive || isExpired) {
      return res
        .status(400)
        .json({ error: "Gutschein ist abgelaufen oder inaktiv." });
    }

    // ✅ Update usedCount
    await prisma.voucher.update({
      where: { code: voucher.code },
      data: { usedCount: { increment: 1 } },
    });

    // ✅ Return correct fields matching your schema
    return res.status(200).json({
      success: true,
      discountType: voucher.discountType?.toLowerCase() || null, // 💡 correct field
      discountValue: voucher.discountValue ?? 0, // 💡 correct field
      message: "Gutschein erfolgreich eingelöst!",
    });
  } catch (err) {
    console.error("❌ Fehler beim Überprüfen des Gutscheins:", err);
    return res
      .status(500)
      .json({ error: "Serverfehler beim Überprüfen des Gutscheins." });
  }
}
