import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // gjej user
  const user = await prisma.user.findUnique({
    where: { email: "anduelatestagain@hotmail.com" },
  });

  if (!user) {
    throw new Error("❌ User not found!");
  }

  // krijo një termin (Schedule)
  await prisma.schedule.create({
    data: {
      day: "Montag", // ose automatikisht new Date().toLocaleDateString("de-DE", { weekday: "long" })
      startTime: "10:00",
      hours: 2,
      date: new Date("2025-09-01T10:00:00.000Z"),
      userId: user.id,
      status: "active",
      serviceName: "Haushaltshilfe und Wohnpflege",
      subServiceName: "Wohnung reinigen",
    },
  });

  console.log("✅ Appointment created for user anduelatestagain@hotmail.com");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
