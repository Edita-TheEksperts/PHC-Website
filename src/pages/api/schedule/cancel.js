import { prisma } from "../../../lib/prisma";
import { sendAssignmentCancelledEmail } from "../../../lib/mailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { scheduleId, reason } = req.body;
  if (!scheduleId) return res.status(400).json({ error: "Missing scheduleId" });

  try {
    // 1. Update schedule status to cancelled
    const schedule = await prisma.schedule.update({
      where: { id: scheduleId },
      data: { status: "cancelled" },
      include: {
        user: true,
        employee: true,
      },
    });

    // 2. Send notification emails (client, admin, employee)
    await sendAssignmentCancelledEmail({
      schedule,
      reason: reason || "-",
    });

    return res.status(200).json({ success: true, schedule });
  } catch (error) {
    console.error("❌ Error cancelling schedule:", error);
    return res.status(500).json({ error: "Failed to cancel schedule" });
  }
}
