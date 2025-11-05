import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  const { employeeId } = req.query;
// lejo që të marrë të gjitha schedules nëse employeeId s'është dërguar
const whereClause = {
  date: { not: null },
  userId: { not: null },
};

if (employeeId) {
  whereClause.employeeId = employeeId;
}


  try {
    const schedules = await prisma.schedule.findMany({
  where: whereClause,

      include: {
user: { select: { id: true, firstName: true, lastName: true } },
        employee: { select: { firstName: true, lastName: true } },
        service: { select: { name: true } }, // ✅ include service
        subservice: { select: { name: true } }, // ✅ include subservice
      },
      orderBy: { date: "asc" },
    });

    const formatted = schedules.map((s) => ({
      id: s.id,
      date: s.date,
      day: s.day,
      startTime: s.startTime,
      hours: s.hours || 3,
      user: s.user,
      employee: s.employee,
      status: s.status,
      serviceName: s.service?.name || s.serviceName || null, // ✅ return
      subServiceName: s.subservice?.name || s.subServiceName || null,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("❌ Error fetching schedules:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
