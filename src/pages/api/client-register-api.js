import { hash } from "bcryptjs";
import { prisma } from "../../lib/prisma";

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
      service,
      subService,
      allergies,
      specialRequests,
      schedules = [],
      paymentIntentId // <-- Add this here


    } = req.body;

    // ✅ Basic validations
   if (!firstName || !lastName || !email || !password || !firstDate || !paymentIntentId) {
      return res.status(400).json({ message: "Required fields are missing (including paymentIntentId)" });
    }

    const parsedDate = new Date(firstDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid firstDate" });
    }

    const passwordHash = await hash(password, 10);

    // ✅ Validate service + subService from DB
    const serviceRecord = await prisma.service.findUnique({ where: { name: service }  });
    if (!serviceRecord) {
      return res.status(400).json({ message: `Service '${service}' not found` });
    }

    const subServiceRecord = await prisma.subService.findUnique({ where: { name: subService } });
    if (!subServiceRecord) {
      return res.status(400).json({ message: `SubService '${subService}' not found` });
    }

    // ✅ Prepare schedule data
    const schedulesCreate = Array.isArray(schedules)
      ? schedules
          .filter(item => item.day && item.startTime && item.hours)
          .map(item => ({
            day: item.day,
            startTime: item.startTime,
            hours: parseInt(item.hours)
          }))
      : [];
    // Calculate total payment
    const HOURLY_RATE = 1; // 1 CHF per hour
    const totalHours = schedulesCreate.reduce((sum, item) => sum + item.hours, 0);
    const totalPayment = totalHours * HOURLY_RATE;

    console.log(`💰 Calculated total payment: ${totalPayment} CHF`);
    // ✅ Prepare Prisma user data
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
      service: { connect: { id: serviceRecord.id } },
      subService: { connect: { id: subServiceRecord.id } },
      schedules: { create: schedulesCreate },
        totalPayment,
              paymentIntentId,  // <--- save it here


    };

    console.log("🧪 Final Prisma Payload:", JSON.stringify(userData, null, 2));

    // ✅ Create user
    try {
      const user = await prisma.user.create({
        data: userData
      });

      return res.status(201).json({ message: "User registered successfully", userId: user.id });
    } catch (dbError) {
console.error("❌ Prisma create() failed:", dbError?.message || dbError || "Unknown error");
      return res.status(500).json({ message: "Database error", detail: dbError.message });
    }
  } catch (error) {
    console.error("❌ Register error:", error);
    return res.status(500).json({ message: "Server error", detail: error.message });
  }
}
