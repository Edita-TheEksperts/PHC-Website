import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query; // Get the employee ID from the URL query

  if (req.method === 'GET') {
    try {
      const employee = await prisma.employee.findUnique({
         where: { id: id }, // UUID string


      });

      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      res.status(200).json(employee);  // Return employee data
    } catch (error) {
      console.error("Error fetching employee details:", error);
      res.status(500).json({ message: 'Failed to fetch employee details' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
