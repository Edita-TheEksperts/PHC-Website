import { PrismaClient } from '@prisma/client'; // Correct Prisma client import

const prisma = new PrismaClient(); // Initialize Prisma Client

// Fetch all employees
// Fetch all employees with required fields
async function fetchEmployees() {
  return await prisma.employee.findMany();
}



  

// Fetch all clients
async function fetchClients() {
  return await prisma.user.findMany({ where: { role: 'client' } }); // Fetch all clients from DB
}

// The handler function to fetch dashboard data
async function getDashboardData(req, res) {
  if (req.method === "GET") {
    try {
      const employees = await fetchEmployees(); // Fetch employees from DB
      const clients = await fetchClients(); // Fetch clients from DB
      res.status(200).json({ employees, clients });
    } catch (error) {
      console.error("Error fetching data:", error); // Log the error for debugging
      res.status(500).json({ message: "Error fetching data" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

// Approve employee in DB
async function approveEmployeeInDB(employeeId) {
  return await prisma.employee.update({
    where: { id: employeeId },
    data: { status: 'approved' },
  });
}

// Reject employee in DB
async function rejectEmployeeInDB(employeeId) {
  return await prisma.employee.update({
    where: { id: employeeId },
    data: { status: 'rejected' },
  });
}

// The handler function for approving/rejecting employee
async function approveEmployee(req, res) {
  const { employeeId, action } = req.body;

  if (action === "approve") {
    try {
      await approveEmployeeInDB(employeeId); // Approve the employee in the database
      res.status(200).send("Employee approved.");
    } catch (error) {
      console.error("Error approving employee:", error); // Log error for debugging
      res.status(500).send("Error approving employee.");
    }
  } else if (action === "reject") {
    try {
      await rejectEmployeeInDB(employeeId); // Reject the employee in the database
      res.status(200).send("Employee rejected.");
    } catch (error) {
      console.error("Error rejecting employee:", error); // Log error for debugging
      res.status(500).send("Error rejecting employee.");
    }
  } else {
    res.status(400).send("Invalid action.");
  }
}

// Export getDashboardData as default
export default getDashboardData;
