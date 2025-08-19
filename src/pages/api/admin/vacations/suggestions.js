// /api/admin/vacations/suggestions.js
import { prisma } from "../../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { vacationId } = req.query;
    console.log("➡️ Suggestions API called with vacationId:", vacationId);

    try {
      const vacation = await prisma.vacation.findUnique({
        where: { id: vacationId },
        include: { employee: true }
      });

      if (!vacation) {
        return res.status(404).json({ error: "Vacation not found" });
      }

      console.log("✅ Vacation found, calculating suggestions...");

      // Example: just return alternative dates + employee who can cover
      const availableEmployees = await prisma.employee.findMany({
        where: { id: { not: vacation.employeeId } }, // exclude the one on vacation
        select: { id: true, firstName: true, lastName: true, phone: true }
      });

      const suggestions = availableEmployees.map((emp, i) => ({
        startDate: new Date(vacation.startDate).toISOString(),
        endDate: new Date(vacation.endDate).toISOString(),
        employee: emp
      }));

      console.log("💡 Suggestions generated:", suggestions);
      return res.json(suggestions);
    } catch (err) {
      console.error("💥 Error in suggestions:", err);
      return res.status(500).json({ error: "Failed to generate suggestions" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
