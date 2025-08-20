import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
  try {
    // Get today and next month’s end
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);

    const schedules = await prisma.schedule.findMany({
      where: {
        date: {
          gte: startOfMonth,
          lte: endOfNextMonth,
        },
      },
      include: {
        user: true,     // client info
        employee: true, // employee info
      },
    });

    res.status(200).json(schedules);
  } catch (error) {
    console.error("❌ Error fetching employee dashboard:", error);
    res.status(500).json({ error: "Failed to fetch schedules" });
  }
}