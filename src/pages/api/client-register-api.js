import { hash } from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { sendEmail } from "../../lib/emails";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  console.log("📦 Incoming Form Data:", JSON.stringify(req.body, null, 2));

  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      address,
      frequency,
      duration,
      firstDate,
      emergencyContactName,
      emergencyContactPhone,
      cardNumber,
      expiryDate,
      cvc,
      languages,
      pets,
      services,
      subServices: subServicesRaw, // fix name to match frontend payload
      allergies,
      specialRequests,
      schedules = [],
      paymentIntentId
    } = req.body;

    // Basic validations
    if (!firstName || !lastName || !email || !password || !firstDate || !paymentIntentId) {
      return res.status(400).json({ message: "Required fields are missing (including paymentIntentId)" });
    }

    const parsedDate = new Date(firstDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid firstDate" });
    }

    const passwordHash = await hash(password, 10);

    // Validate services
    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ message: "No services provided" });
    }

    const serviceRecords = await prisma.service.findMany({
      where: { name: { in: services } }
    });

    if (serviceRecords.length !== services.length) {
      return res.status(400).json({
        message: "One or more services not found",
        received: services,
        found: serviceRecords.map(s => s.name)
      });
    }

    // Validate subservices
    if (!Array.isArray(subServicesRaw) || subServicesRaw.length === 0) {
      return res.status(400).json({ message: "No subservices provided" });
    }

    const subServiceRecords = await prisma.subService.findMany({
      where: {
        name: { in: subServicesRaw }
      }
    });

    if (subServiceRecords.length !== subServicesRaw.length) {
      return res.status(400).json({
        message: "One or more subservices not found",
        received: subServicesRaw,
        found: subServiceRecords.map((s) => s.name)
      });
    }

    // Prepare schedule data
    const schedulesCreate = schedules
      .filter(item => item.day && item.startTime && item.hours)
      .map(item => ({
        day: item.day,
        startTime: item.startTime,
        hours: parseInt(item.hours)
      }));

    // Calculate payment
    const HOURLY_RATE = 1;
    const totalHours = schedulesCreate.reduce((sum, item) => sum + item.hours, 0);
    const totalPayment = totalHours * HOURLY_RATE;
    console.log(`💰 Calculated total payment: ${totalPayment} CHF`);

    // Create user data
    const userData = {
      firstName,
      lastName,
      email,
      phone,
      passwordHash,
      address,
      frequency,
      duration: typeof duration === "number" ? duration : parseInt(duration),
      firstDate: parsedDate,
      emergencyContactName,
      emergencyContactPhone,
      cardNumber,
      expiryDate,
      cvc,
      languages: Array.isArray(languages) ? languages.join(", ") : languages || "",
      pets,
      allergies,
      specialRequests,
      services: {
        connect: services.map((name) => ({ name }))
      },
      subServices: {
        connect: subServiceRecords.map((record) => ({ id: record.id }))
      },
      schedules: {
        create: schedulesCreate
      },
      totalPayment,
      paymentIntentId
    };

    console.log("🧪 Final Prisma Payload:", JSON.stringify(userData, null, 2));

    // Save user
    const user = await prisma.user.create({ data: userData });

    // Send welcome email immediately after registration
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
  `
    });

    // Create reminders (4h and 48h later)
    const fourHoursLater = new Date(Date.now() + 4 * 60 * 60 * 1000);
    const fortyEightHoursLater = new Date(Date.now() + 48 * 60 * 60 * 1000);

    await prisma.reminder.createMany({
      data: [
        {
          userId: user.id,
          type: "4h_reminder",
          scheduledAt: fourHoursLater,
          sent: false,
        },
        {
          userId: user.id,
          type: "48h_reminder",
          scheduledAt: fortyEightHoursLater,
          sent: false,
        }
      ],
    });

    return res.status(201).json({ message: "User registered successfully", userId: user.id });
  } catch (error) {
    console.error("❌ Register error:", error);
    return res.status(500).json({ message: "Server error", detail: error.message });
  }
}
