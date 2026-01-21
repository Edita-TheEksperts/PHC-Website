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
  html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <p>Grüezi ${user.firstName} ${user.lastName},</p>
      <p>Am <strong>${formattedDate}</strong> um <strong>Zeit</strong> beginnt die Betreuung durch Ihre Betreuungsperson.</p>
      <p>Bitte stellen Sie Folgendes bereit:</p>
      <ul>
        <li>Zugang zur Wohnung</li>
        <li>Tagesstruktur / Gewohnheiten</li>
      </ul>
      <p>Bei kurzfristigen Änderungen erreichen Sie uns jederzeit unter <strong>[Telefonnummer]</strong>.</p>
      <br>
      <p>Freundliche Grüsse</p>
      <p>Prime Home Care AG<br/>
        Birkenstrasse 49<br/>
        CH-6343 Rotkreuz<br/>
        info@phc.ch<br/>
        www.phc.ch
      </p>
      <p>
        <a href="https://phc.ch/AVB" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">AVB</a> und 
        <a href="https://phc.ch/nutzungsbedingungen" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">Nutzungsbedingungen</a>
      </p>
    </div>
  `,
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

    for (const schedule of schedules) {
      const user = schedule.user;
      if (user && user.email) {
        await sendReminderEmail(user, schedule.day);
      }
    }
  } catch (err) {
    console.error("❌ Error sending reminders:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

notifySchedulesInTwoDays();
