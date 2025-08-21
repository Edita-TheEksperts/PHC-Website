// pages/api/employee/total-payment.js
import {prisma} from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body;

  try {
    const employee = await prisma.employee.findUnique({
      where: { email },
      include: { assignments: true },
    });

    if (!employee) return res.status(404).json({ error: "Employee not found" });

    const rate = 28.15; // 🔒 fixed hourly rate

    const totals = employee.assignments.reduce(
      (sum, a) => {
        const hours = a.workedHours ?? 0;
        const km = a.kilometers ?? 0;
        const serviceCost = hours * rate;
        return {
          serviceCost: sum.serviceCost + serviceCost,
          travelCost: sum.travelCost + km,
          total: sum.total + serviceCost + km,
        };
      },
      { serviceCost: 0, travelCost: 0, total: 0 }
    );

    res.json({ ...totals, rate });
  } catch (error) {
    console.error("❌ Prisma error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}