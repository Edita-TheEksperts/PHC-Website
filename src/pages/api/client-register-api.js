import { hash } from "bcryptjs";
import { prisma } from "../../lib/prisma";
import crypto from "crypto";
import { sendEmail } from "../../lib/emails";
import { createOrUpdateSalesforceAccount } from "../../lib/salesforce";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      street,
      postalCode,
      city,
      frequency,
      duration,
      firstDate,
      services,
       anrede, 
  kanton,
      subServices,
      schedules = [],
      paymentIntentId,
    } = req.body;

    // ✅ Required field check
    if (!firstName || !lastName || !email || !firstDate || !services?.length) {
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

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    // ✅ Validate services
    const serviceRecords = await prisma.service.findMany({
      where: { name: { in: services } },
    });
    const subServiceRecords = await prisma.subService.findMany({
      where: { name: { in: subServices } },
    });

    if (
      serviceRecords.length !== services.length ||
      subServiceRecords.length !== subServices.length
    ) {
      return res
        .status(400)
        .json({ message: "❌ Service or Subservice not found" });
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
          address,
          careStreet: street,
          carePostalCode: postalCode,
          careCity: city,
          frequency,
          duration,
          firstDate: parsedDate,
          paymentIntentId,
          totalPayment,
          resetToken,
          resetTokenExpiry,
           anrede, 
  kanton,
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

      // ✅ Email confirmation (send only for new user)
      const template = await prisma.emailTemplate.findUnique({
        where: { name: "welcomeEmail" },
      });

      if (template) {
        let body = template.body;
        body = body.replace(/{{firstName}}/g, firstName || "");
        body = body.replace(/{{lastName}}/g, lastName || "");
        body = body.replace(
          /{{resetLink}}/g,
          `${process.env.NEXT_PUBLIC_BASE_URL}/setpassword?token=${resetToken}`
        );

        await sendEmail({
          to: email,
          subject: template.subject,
          html: body,
        });
      }
    }

    // ✅ Push new client into Salesforce
    if (!user.salesforceId) {
      try {
        const sfId = await createOrUpdateSalesforceAccount(user);

        await prisma.user.update({
          where: { id: user.id },
          data: { salesforceId: sfId },
        });
      } catch (error) {
        console.error("❌ Salesforce sync failed:", error);
      }
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

    return res
      .status(201)
      .json({ message: "✅ Registration complete", userId: user.id });
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
