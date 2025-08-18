import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  // Method guard
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Ensure ID is valid
  const rawId = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  const id = Number.parseInt(String(rawId), 10);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ message: "Invalid appointment id" });
  }

  try {
    const appt = await prisma.schedule.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            role: true,
            address: true,
            careCity: true,
          },
        },
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            city: true,
            languages: true,
            profilePhoto: true,
          },
        },
      },
    });

    if (!appt) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      id: appt.id,
      date: appt.date ? appt.date.toISOString() : null,
      startTime: appt.startTime,
      hours: appt.hours,
      notes: appt.notes ?? null,
      user: appt.user,
      client: appt.user, // alias for clarity
      employee: appt.employee,
    });
  } catch (error) {
    console.error("❌ Error loading appointment:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
