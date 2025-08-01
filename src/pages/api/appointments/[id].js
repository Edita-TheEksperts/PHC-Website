import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const appointment = await prisma.schedule.findUnique({
      where: { id: Number(id) },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            role: true, // ✅ Include role to check if it's a client
            address: true,
            careCity: true,
          },
        },
        employee: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error("❌ Error loading appointment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
