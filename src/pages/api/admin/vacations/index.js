// /api/admin/vacations/index.js
import { prisma } from "../../../../lib/prisma";

export default async function handler(req, res) {
  try {
    const { vacationId } = req.query;
    console.log("➡️ Incoming GET /api/admin/vacations", { vacationId });

    if (vacationId) {
      // ✅ fetch single vacation
      console.log("📋 Fetching vacation by ID...");
      const vacation = await prisma.vacation.findUnique({
        where: { id: vacationId },
        include: {
          employee: true,
          user: true,
        },
      });

      return res.status(200).json(vacation);
    } else {
      // ✅ fetch all vacations
      console.log("📋 Fetching ALL vacations...");
      const vacations = await prisma.vacation.findMany({
        include: {
          employee: true,
          user: true,
        },
      });

      return res.status(200).json(vacations);
    }
  } catch (error) {
    console.error("💥 Error fetching vacations:", error);
    return res.status(500).json({ error: "Failed to fetch vacations" });
  }
}

