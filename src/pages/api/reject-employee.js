import { prisma } from "../../lib/prisma";
import { sendEmail } from "../../lib/emails";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  const { email } = req.body;

  try {
    const updated = await prisma.employee.update({
      where: { email },
      data: { status: "rejected" },
    });

    // 🔎 get rejection template
    const template = await prisma.emailTemplate.findUnique({
      where: { name: "rejectionEmail" },
    });

    if (!template) {
      return res.status(404).json({ message: "❌ rejectionEmail template not found" });
    }

    // 📝 replace placeholders
    let body = template.body;
    body = body.replace(/{{firstName}}/g, updated.firstName || "");

    await sendEmail({
      to: email,
      subject: template.subject,
      html: body,
    });

    res.status(200).json({ message: "Rejected and email sent." });
  } catch (error) {
    console.error("❌ Reject error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
