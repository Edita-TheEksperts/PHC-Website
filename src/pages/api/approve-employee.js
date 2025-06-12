import { prisma } from "../../lib/prisma";
import sendApprovalEmail from "../../pages/api/sendApprovalEmail"; // create this function

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Not allowed" });

  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const updated = await prisma.employee.update({
      where: { email },
      data: { status: "approved" },
    });

    await sendApprovalEmail(updated.email); // Send email with link

    res.status(200).json({ message: "Employee approved and email sent" });
  } catch (error) {
    console.error("❌ Approval error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
