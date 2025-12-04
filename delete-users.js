import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * ==============================
 *  USER IDS TO DELETE
 * ==============================
 * Vendosi ketu ID-të e userëve që dëshiron të fshihen
 */
const USER_IDS = [
  "feae04d1-dcd0-457a-82ee-ca2d803aaaad",
  "8c691646-3519-46e2-b445-e4a4075899c7",
  "02a7a3bf-8165-41be-bb53-ac2d4d50621d",
];

/**
 * ==============================
 *   DELETE FUNCTION
 * ==============================
 */
async function deleteUsers() {
  try {
    console.log("🗑  Starting user deletion...");

    for (const userId of USER_IDS) {
      console.log(`\n➡️  Deleting user: ${userId}`);

      // Fshi logs
      await prisma.activityLog.deleteMany({
        where: { actorUserId: userId }
      });

      // Fshi reminders
      await prisma.reminder.deleteMany({
        where: { userId }
      });

      // Fshi schedules
      await prisma.schedule.deleteMany({
        where: { userId }
      });

      // Fshi assignments
      await prisma.assignment.deleteMany({
        where: { userId }
      });

      // Fshi vacations
      await prisma.vacation.deleteMany({
        where: { userId }
      });

      // Fshi transactions
      await prisma.transaction.deleteMany({
        where: { userId }
      });

      // Fshi vouchers mapping table
      await prisma.user.update({
        where: { id: userId },
        data: {
          vouchers: {
            set: []  // remove relations
          },
          services: {
            set: []
          },
          subServices: {
            set: []
          },
        }
      }).catch(() => {});

      // Fshi user-in
      await prisma.user.delete({
        where: { id: userId }
      });

      console.log(`✔️ User deleted successfully: ${userId}`);
    }

    console.log("\n🎉 Done! All selected users have been deleted.");
  } catch (err) {
    console.error("❌ Error deleting users:", err);
  } finally {
    await prisma.$disconnect();
  }
}

deleteUsers();
