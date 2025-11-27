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
      services = [],
      subServices = [],
      anrede,
      kanton,
      schedules = [],
      paymentIntentId,
    } = req.body;

    // ------------------------------
    // 1️⃣ Required field checks
    // ------------------------------
    if (!firstName || !lastName || !email || !firstDate) {
      return res.status(400).json({ message: "❌ Missing required fields" });
    }

    if (!services.length) {
      return res.status(400).json({ message: "❌ No services selected" });
    }

    if (!paymentIntentId) {
      return res.status(400).json({ message: "❌ paymentIntentId is missing!" });
    }

    // ------------------------------
    // 2️⃣ Parse date formats
    // ------------------------------
    const parsedDate =
      typeof firstDate === "string" && firstDate.includes(".")
        ? new Date(firstDate.split(".").reverse().join("-"))
        : new Date(firstDate);

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // ------------------------------
    // 3️⃣ AUTO-MATCH Services & Subservices
    // ------------------------------

    // Fetch all from DB
    const allServices = await prisma.service.findMany();
    const allSubServices = await prisma.subService.findMany();

    // Map input → DB records by partial match
    const serviceRecords = allServices.filter((s) =>
      services.some((input) =>
        input.toLowerCase().trim().includes(s.name.toLowerCase().trim())
      )
    );

    const subServiceRecords = allSubServices.filter((s) =>
      subServices.some((input) =>
        input.toLowerCase().trim().includes(s.name.toLowerCase().trim())
      )
    );

    // Validate mapped values
    if (serviceRecords.length === 0) {
      return res.status(400).json({
        message: "❌ No matching services found.",
        received: services,
        dbServices: allServices.map((s) => s.name),
      });
    }

    // ------------------------------
    // 4️⃣ Build all schedule entries
    // ------------------------------
    const schedulesCreate = schedules.map((entry) => ({
      day: entry.day,
      startTime: entry.startTime,
      hours: parseFloat(entry.hours),
      date: new Date(entry.date),
    }));

    // ------------------------------
    // 5️⃣ Payment calculation
    // ------------------------------
    const totalHours = schedulesCreate.reduce((sum, s) => sum + s.hours, 0);
    const HOURLY_RATE = 1; // your rate
    const totalPayment = totalHours * HOURLY_RATE;

    // ------------------------------
    // 6️⃣ Create or update user
    // ------------------------------
    let user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      // Update existing user
      user = await prisma.user.update({
        where: { email },
        data: {
          paymentIntentId,
          totalPayment,
        },
      });
    } else {
      // Create a new user
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
            connect: serviceRecords.map((s) => ({ id: s.id })),
          },
          subServices: {
            connect: subServiceRecords.map((s) => ({ id: s.id })),
          },
          schedules: {
            create: schedulesCreate,
          },
        },
      });

      // ------------------------------
      // 7️⃣ Send welcome email
      // ------------------------------
      const template = await prisma.emailTemplate.findUnique({
        where: { name: "welcomeEmail" },
      });

      if (template) {
        let body = template.body;
        body = body.replace(/{{firstName}}/g, firstName);
        body = body.replace(/{{lastName}}/g, lastName);
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

    // ------------------------------
    // 8️⃣ Sync with Salesforce
    // ------------------------------
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

    // ------------------------------
    // 9️⃣ Create reminders
    // ------------------------------
    await prisma.reminder.createMany({
      data: [
        {
          userId: user.id,
          type: "4h_reminder",
          scheduledAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
        },
        {
          userId: user.id,
          type: "48h_reminder",
          scheduledAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
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
      });
    }

    return res.status(500).json({
      message: "❌ Interner Serverfehler",
      error: error.message,
    });
  }
}
