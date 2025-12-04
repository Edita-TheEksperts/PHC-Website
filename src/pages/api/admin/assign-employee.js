import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { appointmentId, userId, employeeId } = req.body;

  // Always needed
  if (!userId || !employeeId) {
    return res.status(400).json({ message: "Missing userId or employeeId" });
  }

  try {
    let appointment = null;
    let updatedSchedule = null;

    // 👉 Case A: STRICT MODE (client table)
    if (appointmentId) {
      appointment = await prisma.schedule.findUnique({
        where: { id: Number(appointmentId) }
      });

      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
    }

    // 👉 1️⃣ Create assignment (works even without appointment)
    await prisma.assignment.create({
      data: {
        userId,
        employeeId,
        scheduleId: appointment?.id || null,
        serviceName: appointment?.serviceName || "",
      },
    });

    // 👉 2️⃣ Update appointment only if exists
    if (appointment) {
      updatedSchedule = await prisma.schedule.update({
        where: { id: appointment.id },
        data: { employeeId },
        include: {
          employee: true,
          user: true,
        },
      });
    }

    return res.status(200).json({
      message: "Employee assigned successfully",
      schedule: updatedSchedule, // null if none
    });

  } catch (error) {
    console.error("❌ ASSIGN ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
