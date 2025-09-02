import { hash } from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { sendEmail } from "../../lib/emails";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      address,
      street,
      postalCode,
      city,
      frequency,
      duration,
      firstDate,
      services,
      subServices,
      schedules = [],
      paymentIntentId,
    } = req.body;

    // ✅ Required field check
    if (!firstName || !lastName || !email || !password || !firstDate || !services?.length) {
      return res.status(400).json({ message: "❌ Missing required fields" });
    }

    // ✅ Check for missing paymentIntentId
    if (!paymentIntentId) {
      return res.status(400).json({ message: "❌ paymentIntentId is missing!" });
    }

    // ✅ Date parsing
    const parsedDate =
      typeof firstDate === "string" && firstDate.includes(".")
        ? new Date(firstDate.split(".").reverse().join("-"))
        : new Date(firstDate);

    // ✅ Hash password
    const passwordHash = await hash(password, 10);

    // ✅ Validate services
    const serviceRecords = await prisma.service.findMany({
      where: { name: { in: services } },
    });
    const subServiceRecords = await prisma.subService.findMany({
      where: { name: { in: subServices } },
    });

    if (serviceRecords.length !== services.length || subServiceRecords.length !== subServices.length) {
      return res.status(400).json({ message: "❌ Service or Subservice not found" });
    }

    // ✅ Build individual schedule entries
    const schedulesCreate = schedules.map((entry) => ({
      day: entry.day,
      startTime: entry.startTime,
      hours: parseFloat(entry.hours),
      date: new Date(entry.date),
    }));

    // ✅ Payment calculation
    const totalHours = schedulesCreate.reduce((sum, s) => sum + s.hours, 0);
    const HOURLY_RATE = 1;
    const totalPayment = totalHours * HOURLY_RATE;

    // ✅ Create or update user
    let user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      user = await prisma.user.update({
        where: { email },
        data: {
          paymentIntentId,
          totalPayment,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
          passwordHash,
          address,
          careStreet: street,
          carePostalCode: postalCode,
          careCity: city,
          frequency,
          duration,
          firstDate: parsedDate,
          paymentIntentId,
          totalPayment,
          services: {
            connect: services.map((name) => ({ name })),
          },
          subServices: {
            connect: subServiceRecords.map((s) => ({ id: s.id })),
          },
          schedules: {
            create: schedulesCreate,
          },
        },
      });
    }

    // ✅ Email confirmation (template just for this handler)
    const template = await prisma.emailTemplate.findUnique({
      where: { name: "welcomeEmail" },
    });

    if (template) {
      let body = template.body;
      body = body.replace(/{{firstName}}/g, firstName || "");
      body = body.replace(/{{lastName}}/g, lastName || "");
      body = body.replace(/{{email}}/g, email || "");

      await sendEmail({
        to: email,
        subject: template.subject,
        html: body,
      });
    }

    // ✅ Create reminders
    await prisma.reminder.createMany({
      data: [
        {
          userId: user.id,
          type: "4h_reminder",
          scheduledAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
          sent: false,
        },
        {
          userId: user.id,
          type: "48h_reminder",
          scheduledAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
          sent: false,
        },
      ],
    });

    return res.status(201).json({ message: "✅ Registration complete", userId: user.id });
  } catch (error) {
    console.error("❌ Error during registration:", error);

    if (error.code === "P2002") {
      return res.status(409).json({
        message: "❌ Diese E-Mail-Adresse ist bereits registriert.",
        field: error.meta?.target,
      });
    }

    if (error.code === "P2025") {
      return res.status(400).json({
        message: "❌ Ein erforderlicher Datensatz konnte nicht gefunden werden.",
      });
    }

    return res.status(500).json({
      message: "❌ Interner Serverfehler",
      error: error.message || "Unbekannter Fehler",
    });
  }
}
