import { prisma } from "../../lib/prisma";
import { sendApprovalEmail } from "../../lib/mailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // ✅ Update status in database
    const updated = await prisma.employee.update({
      where: { email },
      data: { status: "approved" },
    });

    // ✅ Send email from the helper
    await sendApprovalEmail(updated.email);

    return res.status(200).json({
      message: "Employee approved and email sent",
    });
  } catch (error) {
    console.error("❌ Approval error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}
