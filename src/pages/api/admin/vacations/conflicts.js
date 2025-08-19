// /api/admin/vacations/conflicts.js
import { prisma } from "../../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { vacationId } = req.query;

    try {
      const vacation = await prisma.vacation.findUnique({
        where: { id: vacationId },
        include: {
          employee: true,
          user: true,
          assignments: {
            include: { user: true, employee: true },
          },
        },
      });

      if (!vacation) return res.status(404).json({ error: "Vacation not found" });

      res.json({
        employee: vacation.employee,
        client: vacation.user,
        conflicts: vacation.assignments,
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch conflicts" });
    }
  }
}