import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  const { employeeId } = req.query;

  console.log("👉 API called with employeeId:", employeeId);

  if (!employeeId) {
    return res.status(400).json({ error: "Missing employeeId" });
  }

  try {
    const schedules = await prisma.schedule.findMany({
      where: { employeeId },
      include: {
        user: {
          select: { firstName: true, lastName: true },
        },
        employee: {
          select: { firstName: true, lastName: true },
        },
      },
      orderBy: { id: "asc" },
    });

    // add fallback hours if not in DB
    const formatted = schedules.map((s) => ({
      id: s.id,
      day: s.day,
      startTime: s.startTime,
      hours: s.hours || 3, // default to 3 hours if missing
      user: s.user,
      employee: s.employee,
    }));

    console.log("✅ Prisma returned schedules:", formatted);
    res.status(200).json(formatted);
  } catch (error) {
    console.error("❌ Error fetching schedules:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
