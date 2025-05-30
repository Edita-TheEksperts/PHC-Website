// pages/api/updateUserData.js
import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Only PUT method is allowed" });
  }

  try {
    const { id, ...incomingData } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Missing user ID" });
    }

    // Optional: define allowed fields to avoid unwanted updates
    const allowedFields = [
      "fullName", "email", "phone", "address",
      "emergencyContactName", "emergencyContactPhone",
      "frequency", "duration", "firstDate",
      "languages", "pets",
      "mobility", "transport", "appointments",
      "appointmentsOther", "shoppingAssist", "shoppingType",
      "briefkasten", "postfach", "sonstige",
      "form4Completed"
    ];

    // Create filtered update object
    const safeData = {};
    for (const key of allowedFields) {
      if (key in incomingData) {
        safeData[key] = incomingData[key];
      }
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: safeData,
    });

    // Mask sensitive fields in the response
    const sanitizedUser = {
      ...updatedUser,
      passwordHash: undefined,
      cardNumber: updatedUser.cardNumber
        ? "************" + updatedUser.cardNumber.slice(-4)
        : undefined,
      expiryDate: updatedUser.expiryDate ? "**/**" : undefined,
      cvc: updatedUser.cvc ? "***" : undefined,
    };

    return res.status(200).json(sanitizedUser);
  } catch (err) {
    console.error("❌ Prisma update error:", err);
    res.status(500).json({
      message: "Failed to update user",
      error: err.message,
    });
  }
}
