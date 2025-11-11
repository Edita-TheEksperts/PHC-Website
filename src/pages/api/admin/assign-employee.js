// /pages/api/admin/assign-employee.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { userId, employeeId } = req.body;

  if (!userId || !employeeId) {
    return res.status(400).json({ message: "Missing userId or employeeId" });
  }

  try {
    // ✅ Verify the user exists (client)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Verify the employee exists
    const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    // ✅ Create new assignment
    await prisma.assignment.create({
      data: {
        userId,
        employeeId,
        serviceName: "", // optional
      },
    });

    // ✅ Optionally update user's status
    await prisma.user.update({
      where: { id: userId },
      data: { status: "assigned" },
    });

    res.status(200).json({ message: "Employee assigned successfully" });
  } catch (error) {
    console.error("Assign Error:", error);
    res.status(500).json({ message: error.message });
  }
}
