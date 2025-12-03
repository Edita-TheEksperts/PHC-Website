import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { appointmentId, userId, employeeId } = req.body;

  if (!appointmentId || !userId || !employeeId) {
    return res.status(400).json({ message: "Missing data" });
  }

  try {
    const appointment = await prisma.schedule.findUnique({
      where: { id: Number(appointmentId) }
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // 1️⃣ Create assignment
    await prisma.assignment.create({
      data: {
        userId,
        employeeId,
        scheduleId: appointment.id,
        serviceName: appointment.serviceName || "",
      },
    });

    // 2️⃣ Update appointment → attach employee
    const updatedSchedule = await prisma.schedule.update({
      where: { id: appointment.id },
      data: {
        employeeId: employeeId,
      },
      include: {
        employee: true,
        user: true
      }
    });

    return res.status(200).json({
      message: "Employee assigned successfully",
      schedule: updatedSchedule,
    });

  } catch (error) {
    console.error("❌ ASSIGN ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
