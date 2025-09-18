import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { scheduleId, hours, kilometers } = req.body;

    if (!scheduleId) {
      return res.status(400).json({ message: "ScheduleId is required" });
    }

    // get existing schedule values
    const existing = await prisma.schedule.findUnique({
      where: { id: scheduleId },
      select: { hours: true, kilometers: true },
    });

    if (!existing) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    const updated = await prisma.schedule.update({
      where: { id: scheduleId },
      data: {
        hours: (existing.hours || 0) + (Number(hours) || 0),
        kilometers: (existing.kilometers || 0) + (Number(kilometers) || 0),
        captured: true,
      },
    });

    res.status(200).json({ status: "ok", schedule: updated });
  } catch (err) {
    console.error("❌ Fehler beim Speichern:", err);
    res.status(500).json({ message: "Serverfehler" });
  }
}
