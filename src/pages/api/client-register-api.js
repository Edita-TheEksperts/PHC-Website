import { hash } from "bcryptjs";
import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const {
      fullName, email, phone, password, address,
      frequency, duration, firstDate,
      emergencyContactName, emergencyContactPhone,
      cardNumber, expiryDate, cvc,
      languages, pets,
      service, subService,
      allergies, specialRequests,
    } = req.body;

    if (!firstDate || isNaN(new Date(firstDate).getTime())) {
      return res.status(400).json({ message: "Invalid or missing firstDate" });
    }

    const passwordHash = await hash(password, 10);

    const serviceRecord = await prisma.service.findUnique({ where: { name: service } });
    const subServiceRecord = await prisma.subService.findUnique({ where: { name: subService } });

    if (!serviceRecord) {
      return res.status(400).json({ message: `Service '${service}' not found` });
    }
    if (!subServiceRecord) {
      return res.status(400).json({ message: `SubService '${subService}' not found` });
    }

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        phone,
        passwordHash,
        address,
        frequency,
        duration: parseInt(duration),
        firstDate: new Date(firstDate),
        emergencyContactName,
        emergencyContactPhone,
        cardNumber,
        expiryDate,
        cvc,
        languages: Array.isArray(languages) ? languages.join(", ") : languages,
        pets,
        service: { connect: { id: serviceRecord.id } },
        subService: { connect: { id: subServiceRecord.id } },
        healthQuestion: {
          create: {
            allergies,
            specialRequests
          }
        }
      }
    });

    return res.status(201).json({ message: "User registered successfully", userId: user.id });

  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
