import { prisma } from "../../../../lib/prisma"; // Adjust path as needed

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const employee = await prisma.employee.findUnique({
      where: { id },
      // Include any relations you want, e.g. schedules, assignments
      include: {
        schedules: true,
        assignments: {
          include: { employee: true }
        }
      },
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (error) {
    console.error("Failed to fetch employee:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
