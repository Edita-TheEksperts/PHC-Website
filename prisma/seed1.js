import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // 1. Gjej ose krijo user
  let user = await prisma.user.findUnique({
    where: { email: "editalatifi@gmail.com" },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: "editalatifi@gmail.com",
        firstName: "Edita",
        lastName: "Latifi",
      },
    });
    console.log("✅ User created:", user.email);
  } else {
    console.log("👉 User already exists:", user.email);
  }

  // 2. Gjej ose krijo employee
  let employee = await prisma.employee.findUnique({
    where: { email: "editalatifi@gmail.com" },
  });

  if (!employee) {
    employee = await prisma.employee.create({
      data: {
        email: "editalatifi@gmail.com",
        firstName: "Edita",
        lastName: "Latifi",
        status: "approved",
      },
    });
    console.log("✅ Employee created:", employee.email);
  } else {
    console.log("👉 Employee already exists:", employee.email);
  }

  // 3. Krijo assignments
  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(today.getMonth() + 1);

  // Assignment i parë
  const assignment1 = await prisma.assignment.create({
    data: {
      employeeId: employee.id,
      userId: user.id,
      confirmationStatus: "confirmed",
      status: "active",
      serviceName: "Haushaltshilfe",
    },
  });

  await prisma.schedule.create({
    data: {
      userId: user.id,
      employeeId: employee.id,
      date: today,
      day: today.toLocaleDateString("de-DE", { weekday: "long" }),
      startTime: "09:00",
      hours: 2,
      status: "active",
      serviceName: "Haushaltshilfe",
      subServiceName: "Küche putzen",
    },
  });

  // Assignment i dytë
  const assignment2 = await prisma.assignment.create({
    data: {
      employeeId: employee.id,
      userId: user.id,
      confirmationStatus: "confirmed",
      status: "active",
      serviceName: "Pflege",
    },
  });

  await prisma.schedule.create({
    data: {
      userId: user.id,
      employeeId: employee.id,
      date: nextMonth,
      day: nextMonth.toLocaleDateString("de-DE", { weekday: "long" }),
      startTime: "11:00",
      hours: 3,
      status: "active",
      serviceName: "Pflege",
      subServiceName: "Begleitung",
    },
  });

  console.log("✅ Created assignments and schedules for this and next month");
}

main()
  .then(() => {
    console.log("🌱 Seed finished successfully!");
    process.exit(0);
  })
  .catch((e) => {
    console.error("❌ Error in seed:", e);
    process.exit(1);
  });
