// /api/admin/vacations/conflicts.js
import { prisma } from "../../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { vacationId } = req.query;

    // Validate vacationId
    if (!vacationId || isNaN(Number(vacationId))) {
      return res.status(400).json({ error: "Invalid or missing vacationId" });
    }

    try {
      const vacation = await prisma.vacation.findUnique({
        where: { id: Number(vacationId) }, // 👈 ensure integer
        include: {
          employee: true,
          user: true,
          assignments: {
            include: { user: true, employee: true },
          },
        },
      });

      if (!vacation) {
        return res.status(404).json({ error: "Vacation not found" });
      }

      res.json({
        employee: vacation.employee,
        client: vacation.user,
        conflicts: vacation.assignments,
      });
    } catch (err) {
      console.error("❌ Conflict API error:", err);
      res.status(500).json({ error: "Failed to fetch conflicts", details: err.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }
}
