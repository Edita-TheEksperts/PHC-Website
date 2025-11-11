import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const client = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          address: true,
          postalCode: true,
          languages: true,
          emergencyContactName: true,
          emergencyContactPhone: true,
          firstDate: true,
          frequency: true,
          duration: true,
          status: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          services: true,
          subServices: true,
          assignments: {
            include: {
              employee: {
                select: { firstName: true, lastName: true },
              },
            },
          },
schedules: {
  include: {
    employee: {
      select: { firstName: true, lastName: true },
    },
    user: {
      select: {
        firstName: true,
        lastName: true,
        address: true,
        postalCode: true,
        phone: true
      },
    },
  },
},

        },
      });
console.log("📦 CLIENT FROM DB:", JSON.stringify(client, null, 2));


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
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
