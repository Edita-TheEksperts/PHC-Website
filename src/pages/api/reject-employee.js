// pages/api/reject-employee.js
import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  const { email } = req.body;

  try {
    // Update status
    const updated = await prisma.employee.update({
      where: { email },
      data: { status: "rejected" },
    });

    // Send rejection email
    await sendMail({
      to: email,
      subject: "PHC Application Rejected",
      text: `Dear ${updated.firstName},\n\nWe regret to inform you that your application has been rejected.\n\nBest regards,\nPrime Home Care`,
    });

    res.status(200).json({ message: "Rejected and email sent." });
  } catch (error) {
    console.error("❌ Reject error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
