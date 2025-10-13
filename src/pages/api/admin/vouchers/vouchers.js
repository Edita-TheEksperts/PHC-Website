// /api/admin/vouchers.js

import { prisma } from "../../../../lib/prisma";

export default async function handler(req, res) {
  try {
    const vouchers = await prisma.voucher.findMany({
      include: {
        _count: {
          select: { redemptions: true }, // assumes relation Voucher -> Redemption
        },
      },
    });

    // Add usage metrics
    const total = vouchers.length;
    const used = vouchers.filter(v => v._count.redemptions > 0).length;
    const active = vouchers.filter(v => v.isActive).length;

    res.json({
      vouchers,
      stats: {
        total,
        used,
        active,
        usageRate: total ? Math.round((used / total) * 100) : 0,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch vouchers" });
  }
}
