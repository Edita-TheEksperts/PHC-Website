import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { sendApprovalEmail } from "../../lib/mailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Not allowed" });
  }

  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const employee = await prisma.employee.findUnique({
      where: { email },
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // TEMP: Allow re-sending approval email for testing
    // Commented out the check for 'invited' so you can always trigger the email
    // if (employee.invited) {
    //   return res.status(200).json({
    //     message: "Employee already approved and email already sent",
    //   });
    // }

    // 🔐 generate NEW password on approval
    const plainPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const updated = await prisma.employee.update({
      where: { email },
      data: {
        status: "approved",
        password: hashedPassword,
        invited: true,
        inviteSentAt: new Date(),
      },
    });

    // 📧 send email NOW
    await sendApprovalEmail(updated, plainPassword);

    return res.status(200).json({
      message: "Employee approved and email with password sent",
    });
  } catch (error) {
    console.error("❌ Approval error:", error);
    return res.status(500).json({ message: error.message });
  }
}
