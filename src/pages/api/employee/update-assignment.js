import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { assignmentId, scheduleId, workedHours, kilometers } = req.body;

  if (!assignmentId || !scheduleId) {
    return res.status(400).json({ message: "assignmentId und scheduleId erforderlich" });
  }

  try {
    // Update the schedule (hours + km)
    await prisma.schedule.update({
      where: { id: scheduleId },
      data: {
        hours: workedHours ?? 0,
        kilometers: kilometers ?? 0,
      },
    });

    // Optionally, mark assignment as "captured"
    await prisma.assignment.update({
      where: { id: assignmentId },
      data: { status: "active" }, // oder "completed", je nach Logik
    });

    res.status(200).json({ message: "✅ Schedule updated" });
  } catch (error) {
    console.error("❌ Error updating schedule:", error);
    res.status(500).json({ message: "Server error" });
  }
}
