// pages/api/employee/save-vacation.js
import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, start, end } = req.body;

  if (!email || !start || !end) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const employee = await prisma.employee.findUnique({ where: { email } });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const vacation = await prisma.vacation.create({
      data: {
        employeeId: employee.id,
        startDate: new Date(start),
        endDate: new Date(end),
      },
    });

    res.status(200).json(vacation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving vacation" });
  }
}
