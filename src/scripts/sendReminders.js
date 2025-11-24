import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

async function sendReminderEmail(user, assignment) {
  if (!user.email) return;

  await transporter.sendMail({
    from: '"Prime Home Care AG" <info@primehomecare.ch>',
    to: user.email,
    subject: "Bitte Job akzeptieren",
    text: `Hallo ${user.firstName},\n\nBitte bestätigen Sie den Job für ${assignment.serviceName}.`,
  });

  console.log(`Reminder an ${user.email} geschickt.`);
}

async function main() {
  const now = new Date();
  const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);

  const assignments = await prisma.assignment.findMany({
    where: {
      confirmationStatus: "pending",
      createdAt: { lte: twelveHoursAgo },
      reminderSentCount: 0,
    },
    include: { user: true },
  });

  for (const assignment of assignments) {
    await sendReminderEmail(assignment.user, assignment);
    await prisma.assignment.update({
      where: { id: assignment.id },
      data: { reminderSentCount: 1 },
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
