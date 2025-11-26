import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;
  

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const client = await prisma.user.findUnique({
      where: { id },
      include: {
        assignments: {
          include: {
            employee: true,
          },
        },
        schedules: {
          include: {
            employee: true,
            user: true,
          },
        },
        services: true,
        subServices: true,
      },
    });


    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const schedulesWithExtras = client.schedules.map((s) => ({
      ...s,
      baseHours: s.baseHours || 0,
      baseKm: s.baseKm || 0,
      extraHours: (s.hours || 0) - (s.baseHours || 0),
      extraKm: (s.kilometers || 0) - (s.baseKm || 0),
    }));

    res.status(200).json({
      ...client,
      schedules: schedulesWithExtras,
    });

  } catch (error) {
    console.error("❌ Error fetching client details:", error);
    res.status(500).json({ message: "Failed to fetch client details" });
  }
}
