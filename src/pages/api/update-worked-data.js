import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { scheduleId, workedHours, kilometers, employeeId } = req.body;

  // ✅ Validate input types
  if (
    typeof scheduleId !== "number" ||
    typeof workedHours !== "number" ||
    typeof kilometers !== "number" ||
    typeof employeeId !== "string"
  ) {
    console.error("❌ Invalid input types", { scheduleId, workedHours, kilometers, employeeId });
    return res.status(400).json({ error: "Invalid input. Must be correct types." });
  }

  try {
    const updated = await prisma.schedule.update({
      where: { id: scheduleId },
      data: {
        hours: workedHours,
        kilometers: kilometers,
        employeeId: employeeId, // ✅ Save which employee did this
      },
    });

    console.log("✅ Updated schedule:", updated);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ DB update failed", error);
    res.status(500).json({ error: "Update failed" });
  }
}
