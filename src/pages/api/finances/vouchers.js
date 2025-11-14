import { prisma } from "../../../lib/prisma"; 

export default async function handler(req, res) {
  try {
    const vouchers = await prisma.voucher.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.json({ vouchers });
  } catch (error) {
    console.error("Vouchers API error:", error);
    return res.status(500).json({ vouchers: [] });
  }
}
