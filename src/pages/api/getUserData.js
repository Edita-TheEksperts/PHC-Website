import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Example: Find user by email
    const email = req.query.email;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { healthQuestion: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      fullName: user.name,
      email: user.email,
      phone: user.phone,
      service: user.service,
      subService: user.subService,
      frequency: user.frequency,
      timeWindow: user.timeWindow,
      address: user.address,
      healthQuestions: {
        allergies: user.healthQuestion?.allergies || "",
        specialRequests: user.healthQuestion?.specialRequests || "",
      },
    });

  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
