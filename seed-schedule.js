import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // find employee by email
  const employee = await prisma.employee.findUnique({
    where: { email: "editalatifi1444@gmail.com" },
  });

  if (!employee) {
    return; // ❌ Employee not found
  }

  // find any test client (User with role client)
  const client = await prisma.user.findFirst({
    where: { role: "client" },
  });

  if (!client) {
    return; // ❌ No client found in database. Please create one first.
  }

  // create a schedule for this employee + client
  await prisma.schedule.create({
    data: {
      day: "Montag",
      startTime: "09:00",
      hours: 3,
      date: new Date("2025-08-25T09:00:00Z"),
      userId: client.id,
      employeeId: employee.id,
    },
  });
}

main()
  .catch(async (e) => {
    // error is still caught, but no console.log
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
