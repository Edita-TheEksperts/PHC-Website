// /pages/api/admin/assign-employee.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { appointmentId, userId } = req.body;

  if (!appointmentId || !userId) {
    return res.status(400).json({ message: "Missing data" });
  }

  try {
    // Get appointment
    const appointment = await prisma.schedule.findUnique({
      where: { id: parseInt(appointmentId) },
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // ✅ Insert into Assignment table
    await prisma.assignment.create({
      data: {
        userId: appointment.userId, // client ID
        employeeId: userId, // employee selected
        serviceName: appointment.serviceName || "",
      },
    });

    // ✅ Update appointment with employeeId
    await prisma.schedule.update({
      where: { id: parseInt(appointmentId) },
      data: { employeeId: userId },
    });

    res.status(200).json({ message: "Employee assigned successfully" });
  } catch (error) {
    console.error("Assign Error:", error);
    res.status(500).json({ message: error.message });
  }
}
