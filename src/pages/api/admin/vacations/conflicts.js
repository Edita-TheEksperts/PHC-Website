import { prisma } from "../../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { vacationId } = req.query;

  if (!vacationId) {
    return res.status(400).json({ error: "Missing vacationId" });
  }

  try {
    const vacation = await prisma.vacation.findUnique({
      where: { id: vacationId },
      include: { employee: true, user: true },
    });

    if (!vacation) {
      return res.status(404).json({ error: "Vacation not found" });
    }

    let conflicts = [];

    // 🔹 Case 1: Employee pushim
    if (vacation.employeeId) {
      conflicts = await prisma.schedule.findMany({
        where: {
          employeeId: vacation.employeeId,
          date: {
            gte: vacation.startDate,
            lte: vacation.endDate,
          },
          status: { not: "cancelled" },
        },
        include: { user: true, employee: true },
      });
    }

    // 🔹 Case 2: Client anulohet
    if (vacation.userId) {
      conflicts = await prisma.schedule.findMany({
        where: {
          userId: vacation.userId,
          status: "cancelled",
        },
        include: { user: true, employee: true },
      });
    }

    res.json({ conflicts });
  } catch (err) {
    console.error("❌ Conflict API error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
