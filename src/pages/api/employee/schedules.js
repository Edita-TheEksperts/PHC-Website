import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  const { employeeId, status } = req.query;

  // lejo që të marrë të gjitha schedules nëse employeeId s'është dërguar
  const whereClause = {
    date: { not: null },
    userId: { not: null },
  };

  if (employeeId) {
    whereClause.employeeId = employeeId;
  }

  // -------------------------
  //   ⚡ STATUS FILTERS
  // -------------------------
  if (status === "cancelled") {
    whereClause.status = "cancelled";
  }

  if (status === "active") {
    whereClause.status = "active";
  }

  if (status === "modified") {
    whereClause.status = "modified";
  }

  if (status === "past") {
    whereClause.date = { lt: new Date() };
    whereClause.status = "active"; 
  }

  if (status === "vacation") {
    whereClause.status = "vacation";
  }
  // -------------------------

  try {
    const schedules = await prisma.schedule.findMany({
      where: whereClause,

      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
        employee: { select: { firstName: true, lastName: true } },
        service: { select: { name: true } },
        subservice: { select: { name: true } },
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
      serviceName: s.service?.name || s.serviceName || null,
      subServiceName: s.subservice?.name || s.subServiceName || null,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("❌ Error fetching schedules:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
