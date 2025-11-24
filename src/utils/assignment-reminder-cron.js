// src/utils/assignment-reminder-cron.js
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "../lib/emails.js";

const prisma = new PrismaClient();

export async function runAssignmentReminders() {
  try {
    const now = new Date();
    const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
    const thirtySixHoursAgo = new Date(now.getTime() - 36 * 60 * 60 * 1000);

    // Gjej assignment-et pending për reminders
    const assignments = await prisma.assignment.findMany({
      where: {
        confirmationStatus: "pending",
        createdAt: { lte: twelveHoursAgo },
      },
      include: { employee: true, user: true },
    });

    console.log(`Found ${assignments.length} assignments needing reminders`);

    for (const assignment of assignments) {
      const employee = assignment.employee;
      if (!employee?.email) continue;

      // 1️⃣ Dërgo reminder i parë pas 12h
      if (assignment.reminderSentCount === 0) {
        const subject = "Reminder: Bitte Job akzeptieren";
        const html = `
          <p>Hallo ${employee.firstName},</p>
          <p>Bitte bestätige deine Aufgabe, die dir zugewiesen wurde.</p>
          <p>Danke!</p>
          <p>Prime Home Care</p>
        `;

        try {
          await sendEmail({ to: employee.email, subject, html });
          console.log(`✅ First reminder sent to ${employee.email}`);

          await prisma.assignment.update({
            where: { id: assignment.id },
            data: { reminderSentCount: 1 },
          });
        } catch (err) {
          console.error(`❌ Could not send first reminder to ${employee.email}`, err);
        }
      }

      // 2️⃣ Dërgo reminder i dytë pas 24h (pra total 36h)
      if (assignment.reminderSentCount === 1 && assignment.createdAt <= thirtySixHoursAgo) {
        const subject = "Final Reminder: Bitte Job akzeptieren";
        const html = `
          <p>Hallo ${employee.firstName},</p>
          <p>Du hast den Job noch nicht bestätigt. Nach 36 Stunden wird der Job automatisch storniert.</p>
          <p>Danke!</p>
          <p>Prime Home Care</p>
        `;

        try {
          await sendEmail({ to: employee.email, subject, html });
          console.log(`✅ Second reminder sent to ${employee.email}`);

          // Anulo assignment pas 36h dhe njofto admin
          await prisma.assignment.update({
            where: { id: assignment.id },
            data: { status: "cancelled", reminderSentCount: 2 },
          });

          // Njofto admin (mund të jetë email global ose lista admin)
          const admins = await prisma.user.findMany({ where: { role: "admin" } });
          for (const admin of admins) {
            if (!admin.email) continue;
            await sendEmail({
              to: admin.email,
              subject: "Assignment automatisch storniert",
              html: `
                <p>Hallo Admin,</p>
                <p>Die Aufgabe von ${employee.firstName} ${employee.lastName} wurde nach 36h ohne Bestätigung automatisch storniert.</p>
              `,
            });
          }
          console.log("✅ Admins notified for cancelled assignment");

        } catch (err) {
          console.error(`❌ Could not send second reminder / cancel for ${employee.email}`, err);
        }
      }
    }

    console.log("✅ Assignment reminders executed");
  } catch (err) {
    console.error("❌ Error running assignment reminders:", err);
  } finally {
    await prisma.$disconnect();
  }
}
