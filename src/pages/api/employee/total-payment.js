import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body;
  try {
    const employee = await prisma.employee.findUnique({
      where: { email },
      include: { assignments: true },
    });
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    const rate = 28.15; // fixed hourly rate
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const reduceAssignments = (assignments) =>
      assignments.reduce(
        (sum, a) => {
          const hours = a.workedHours ?? 0;
          const km = a.kilometers ?? 0;
          const serviceCost = hours * rate;

          return {
            serviceHours: sum.serviceHours + hours,
            kilometers: sum.kilometers + km,
            serviceCost: sum.serviceCost + serviceCost,
            travelCost: sum.travelCost + km,
            total: sum.total + serviceCost + km,
          };
        },
        {
          serviceHours: 0,
          kilometers: 0,
          serviceCost: 0,
          travelCost: 0,
          total: 0,
        }
      );

    const thisMonthAssignments = employee.assignments.filter((a) => {
      const d = new Date(a.day);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const thisMonth = reduceAssignments(thisMonthAssignments);
    const allTime = reduceAssignments(employee.assignments);

    res.json({ thisMonth, allTime, rate });
  } catch (error) {
    console.error("❌ Prisma error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
