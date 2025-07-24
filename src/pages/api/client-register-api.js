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

    // 🧾 Log incoming body
    console.log("📨 Incoming request body:", req.body);

    // ✅ Basic validations
    if (!firstName || !lastName || !email || !password || !firstDate || !services?.length || !subServices?.length) {
      return res.status(400).json({ message: "❌ Missing required fields" });
    }

    // 🗓 Parse date
    const parsedDate = new Date(firstDate.split(".").reverse().join("-"));
    console.log("📆 Parsed date:", parsedDate);

    // 🔒 Hash password
    const passwordHash = await hash(password, 10);

    // 📦 Fetch services and subservices
    const serviceRecords = await prisma.service.findMany({
      where: { name: { in: services } },
    });
    const subServiceRecords = await prisma.subService.findMany({
      where: { name: { in: subServices } },
    });

    console.log("🔗 Matched services:", serviceRecords.map(s => s.name));
    console.log("🔗 Matched subservices:", subServiceRecords.map(s => s.name));

    if (serviceRecords.length !== services.length || subServiceRecords.length !== subServices.length) {
      return res.status(400).json({ message: "❌ Service or Subservice not found" });
    }

    // 📅 Prepare schedules
    const schedulesCreate = schedules.map((entry) => ({
      day: entry.day,
      startTime: entry.startTime,
      hours: parseFloat(entry.hours),
      date: parsedDate,
    }));

    console.log("📋 Final schedules to insert:", schedulesCreate);

    // 💰 Calculate total payment
    const totalHours = schedulesCreate.reduce((sum, item) => sum + item.hours, 0);
    const HOURLY_RATE = 1;
    const totalPayment = totalHours * HOURLY_RATE;
    console.log("🧮 Total hours:", totalHours, "→ Payment:", totalPayment);

    // 💾 Save user to DB
    const user = await prisma.user.create({
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

    console.log("✅ User created with ID:", user.id);

    // 📧 Send confirmation email
    await sendEmail({
      to: email,
      subject: "Willkommen bei Prime Home Care – Ihr Zugang ist aktiv",
      html: `
        <p>Guten Tag ${firstName} ${lastName},</p>
        <p>Vielen Dank für Ihre Registrierung bei Prime Home Care AG.<br/>
        Ihr persönlicher Zugang zum Kundenportal wurde erfolgreich eingerichtet. Ab sofort können Sie:</p>
        <ul>
          <li>Ihre Buchungen verwalten</li>
          <li>Rechnungen einsehen</li>
          <li>Betreuungspersonen kennenlernen</li>
          <li>Mit uns direkt kommunizieren</li>
          <li>u.v.m</li>
        </ul>
        <p><strong>Portal-Zugang:</strong> <a href="http://localhost:3000/login">Login-Link</a><br/>
        <strong>Benutzername:</strong> ${email}</p>
        <p>Bei Fragen zum Portal stehen wir Ihnen gerne zur Verfügung.</p>
        <p>Herzlich willkommen<br/>
        Ihr Prime Home Care Team</p>
      `,
    });

    // 🔔 Create reminders
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

    console.log("⏰ Reminders scheduled");

    return res.status(201).json({ message: "✅ User registered successfully", userId: user.id });
  } catch (error) {
    console.error("❌ Error during registration:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code,
      meta: error.meta,
    });

    // Prisma unique constraint violation (e.g., email already exists)
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "❌ Diese E-Mail-Adresse ist bereits registriert.",
        field: error.meta?.target,
      });
    }

    // Record not found
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
