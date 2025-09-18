import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const client = await prisma.user.findUnique({
        where: { id },
        include: {
          schedules: true, // 👈 this adds all schedules for the client
        },
      });

      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      // format schedules to add base + extra values
      const schedulesWithExtras = client.schedules.map((s) => ({
        ...s,
        baseHours: s.baseHours || 0, // store your original planned hours here
        baseKm: s.baseKm || 0,       // store planned km
        extraHours: (s.hours || 0) - (s.baseHours || 0),
        extraKm: (s.kilometers || 0) - (s.baseKm || 0),
      }));

      res.status(200).json({
        ...client,
        schedules: schedulesWithExtras,
      });
    } catch (error) {
      console.error("Error fetching client details:", error);
      res.status(500).json({ message: "Failed to fetch client details" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
