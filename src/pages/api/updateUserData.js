// /pages/api/updateUserData.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const {
      fullName,
      email,
      phone,
      emergencyContact,
      allergies,
      specialRequests,
      service,
      frequency,
      timeWindow,
      address,
    } = req.body;

    // Validate if necessary data is provided
    if (!email) {
      return res.status(400).json({ message: "Email is required to update the user" });
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          name: fullName,
          phone,
          service,
          frequency,
          timeWindow,
          address,
          healthQuestions: {
            upsert: {
              update: {
                allergies,
                specialRequests,
              },
              create: {
                allergies,
                specialRequests,
              },
            },
          },
        },
        include: { healthQuestions: true },
      });
      

      // Return a success response
      return res.status(200).json({
        message: "User data updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      console.error("Error updating user data:", error);
      // Return a detailed error message
      return res.status(500).json({ message: "Error updating user data", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
