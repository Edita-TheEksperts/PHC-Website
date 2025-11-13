import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
  try {
    // 1️⃣ MARRIM KLIENTËT ME TË GJITHA TË DHËNAT E NEVOJSHME
    const clients = await prisma.user.findMany({
      include: {
        assignments: true,
        schedules: true,
        transactions: true,
      },
    });

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filtrim: vetëm klientët aktivë (ata që kanë assignments)
    const activeClients = clients.filter(
      (c) => c.assignments && c.assignments.length > 0
    );

    // 2️⃣ INCOME (EINNAHMEN)
    const totalIncomeAllTime = activeClients.reduce(
      (sum, c) => sum + (c.totalPayment || 0),
      0
    );

    const totalIncomeThisMonth = activeClients.reduce((sum, c) => {
      const paymentsThisMonth =
        c.transactions?.filter((t) => {
          const d = new Date(t.createdAt);
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        }) || [];

      return (
        sum +
        paymentsThisMonth.reduce(
          (pSum, t) => pSum + (t.amountClient || 0),
          0
        )
      );
    }, 0);

    // 3️⃣ COSTS (AUSGABEN)
    const totalCostAllTime = activeClients.reduce((sum, c) => {
      return (
        sum +
        (c.schedules?.reduce((sSum, s) => {
          const hoursCost = (s.hours || 0) * 30;
          const kmCost = (s.kilometers || 0) * 0.5;
          return sSum + hoursCost + kmCost;
        }, 0) || 0)
      );
    }, 0);

    const totalCostThisMonth = activeClients.reduce((sum, c) => {
      return (
        sum +
        (c.schedules?.reduce((sSum, s) => {
          if (!s.date) return sSum;
          const d = new Date(s.date);
          if (d.getMonth() !== currentMonth || d.getFullYear() !== currentYear)
            return sSum;

          const hoursCost = (s.hours || 0) * 30;
          const kmCost = (s.kilometers || 0) * 0.5;
          return sSum + hoursCost + kmCost;
        }, 0) || 0)
      );
    }, 0);

    // 4️⃣ REVENUE FINAL (INCOME − COST)
    const revenueAllTime = totalIncomeAllTime - totalCostAllTime;
    const revenueThisMonth = totalIncomeThisMonth - totalCostThisMonth;

    // 5️⃣ MARRIM FAKTURAT — SI MË PARË
    const invoices = await prisma.transaction.findMany({
      include: { user: true },
    });

    const mappedInvoices = invoices.map((t) => ({
      id: t.id,
      customer: t.user?.firstName + " " + t.user?.lastName,
      status:
        t.status === "pending"
          ? "offen"
          : t.status === "paid"
          ? "bezahlt"
          : "fehler",
      amount: Number(t.amountClient),
    }));

    // 6️⃣ VOUCHERS
    const vouchers = await prisma.voucher.findMany({
      orderBy: { createdAt: "desc" },
    });

    const mappedVouchers = vouchers.map((v) => ({
      id: v.id,
      code: v.code,
      isActive: v.isActive,
      value: v.discountValue,
      usedCount: v.usedCount,
      used: v.usedCount > 0,
      discountType: v.discountType,
    }));

    // 7️⃣ PËRGJIGJA
    return res.status(200).json({
      invoices: mappedInvoices,
      revenue: {
        totalIncomeAllTime,
        totalIncomeThisMonth,
        totalCostAllTime,
        totalCostThisMonth,
        revenueAllTime,
        revenueThisMonth,
      },
      vouchers: mappedVouchers,
    });
  } catch (err) {
    console.error("Finanzen error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
