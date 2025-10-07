import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const vouchers = await prisma.voucher.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(vouchers);
  } catch (error) {
    console.error("Voucher fetch error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
