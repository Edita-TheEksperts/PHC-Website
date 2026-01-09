const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * ==============================
 *  USER (CLIENT) IDS TO DELETE
 * ==============================
 */
const USER_IDS = [
  "57184810-4cf4-4c60-a3fb-a3c1809825ef",
  // "another-user-id",
];

async function deleteUsers() {
  try {
    console.log("🗑  Starting USER deletion...");

    for (const userId of USER_IDS) {
      console.log(`\n➡️  Deleting user: ${userId}`);

      // (Optional) Sigurohu qe ekziston
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true, email: true },
      });

      if (!user) {
        console.log(`⚠️  User not found: ${userId}`);
        continue;
      }

      // (Optional) nese do veç client-at:
      // if (user.role !== "client") {
      //   console.log(`⚠️  Skipping (role is ${user.role}): ${userId}`);
      //   continue;
      // }

      // 1) Activity logs (where user was actor)
      await prisma.activityLog.deleteMany({
        where: { actorUserId: userId },
      });

      // 2) Reminders
      await prisma.reminder.deleteMany({
        where: { userId },
      });

      // 3) Transactions (User side)
      await prisma.transaction.deleteMany({
        where: { userId },
      });

      // 4) Assignments (User side)
      // NOTE: Assignments kanë relation me Schedule; por meqë i fshijmë Schedule poshtë,
      // këtu i fshijmë assignment-et e user-it direkt.
      await prisma.assignment.deleteMany({
        where: { userId },
      });

      // 5) Schedules (User side)
      // (Schedule ka transactions + Assignment, por i kemi fshirë më lart)
      await prisma.schedule.deleteMany({
        where: { userId },
      });

      // 6) Vacations (User side)
      await prisma.vacation.deleteMany({
        where: { userId },
      });

      // 7) Lidhjet many-to-many: services, subServices, vouchers
      // Prisma e bën këtë me disconnect (fshin rreshtat në join table)
      await prisma.user.update({
        where: { id: userId },
        data: {
          services: { set: [] },
          subServices: { set: [] },
          vouchers: { set: [] },
        },
      });

      // 8) Finally delete user
      await prisma.user.delete({
        where: { id: userId },
      });

      console.log(`✔️ User deleted successfully: ${userId} (${user.email})`);
    }

    console.log("\n🎉 Done! All selected users have been deleted.");
  } catch (err) {
    console.error("❌ Error deleting users:", err);
  } finally {
    await prisma.$disconnect();
  }
}

deleteUsers();
