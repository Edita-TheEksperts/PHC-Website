import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { fullName, email, phone, password, service, subService, frequency, timeWindow, address, role } = req.body;

  if (!fullName || !email || !password || !service || !subService || !frequency || !timeWindow || !address) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: fullName,
        email,
        phone: phone || '',
        passwordHash: hashedPassword,
        role: role || 'client',
        service,
        subService,
        frequency,
        timeWindow,
        address,
        healthQuestion: {
          create: {
            allergies: '',
            specialRequests: '',
          },
        },
      },
    });

    return res.status(201).json({ message: "Registration successful!" });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
