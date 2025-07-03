const { PrismaClient } = require("@prisma/client");
const nodemailer = require("nodemailer");
require("dotenv").config();

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendReminderEmail(user, scheduleDate) {
  const formattedDate = new Date(scheduleDate).toLocaleDateString("de-CH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const mailOptions = {
    from: '"Prime Home Care AG" <info@primehomecare.ch>',
    to: user.email,
    subject: "In 2 Tagen beginnt Ihre Betreuung.",
    text: `Guten Tag ${user.firstName} ${user.lastName},

Am ${formattedDate} beginnt die Betreuung durch Ihre Betreuungsperson.
Bitte stellen Sie Folgendes bereit:

• Zugang zur Wohnung  
• Informationen zu Medikamenten  
• Tagesstruktur / Gewohnheiten  

Bei kurzfristigen Änderungen erreichen Sie uns jederzeit unter [Telefonnummer].

Mit besten Grüssen  
Ihr Team von Prime Home Care AG`,
  };

  await transporter.sendMail(mailOptions);
}

async function notifySchedulesInTwoDays() {
  try {
    const now = new Date();
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(now.getDate() + 2);

    const targetDate = twoDaysFromNow.toISOString().split("T")[0]; // e.g., "2025-07-05"

    const schedules = await prisma.schedule.findMany({
      where: {
        day: targetDate,
      },
      include: {
        user: true,
      },
    });

    console.log(`📅 Found ${schedules.length} schedules for ${targetDate}`);

    for (const schedule of schedules) {
      const user = schedule.user;
      if (user && user.email) {
        await sendReminderEmail(user, schedule.day);
        console.log(`📧 Reminder sent to ${user.email}`);
      }
    }
  } catch (err) {
    console.error("❌ Error sending reminders:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

notifySchedulesInTwoDays();
