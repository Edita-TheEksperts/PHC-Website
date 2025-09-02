import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
  // ---------------- GET ----------------
  if (req.method === "GET") {
    try {
      const { userId, employeeId } = req.query;

      const schedules = await prisma.schedule.findMany({
        where: userId
          ? { userId }
          : employeeId
          ? { employeeId }
          : {}, // fallback all if nothing passed
        orderBy: { date: "asc" },
        take: 10,
        select: {
          id: true,
          day: true,
          startTime: true,
          hours: true,
          date: true,
          serviceName: true,
          subServiceName: true,
          status: true,
        },
      });

      return res.status(200).json(schedules);
    } catch (err) {
      console.error("❌ Error fetching schedules:", JSON.stringify(err, null, 2));
      return res.status(500).json({ error: "Failed to fetch schedules" });
    }
  }

  // ---------------- POST ----------------
  if (req.method === "POST") {
    try {
      if (!req.body) {
        return res.status(400).json({ error: "Missing request body" });
      }

      const { date, time, service, subService, userId, hours } = req.body;

      if (!userId || !date || !time) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const parsedDate = new Date(date);
      if (isNaN(parsedDate)) {
        return res.status(400).json({ error: "Invalid date format" });
      }

      const newAppt = await prisma.schedule.create({
        data: {
          day: parsedDate.toLocaleDateString("de-DE", { weekday: "long" }),
          date: parsedDate,
          startTime: time,
          hours: hours || 2,
          user: { connect: { id: userId } },
          serviceName: service || null,
          subServiceName: subService || null,
          status: "active",
        },
      });

      return res.status(201).json(newAppt);
    } catch (err) {
      console.error("Error creating appointment:", err);
      return res.status(500).json({ error: "Failed to create appointment" });
    }
  }

  // ---------------- PUT ----------------
  if (req.method === "PUT") {
    try {
      const { id, update } = req.body;
      const updated = await prisma.schedule.update({
        where: { id },
        data: update,
      });
      return res.status(200).json(updated);
    } catch (err) {
      console.error("Error updating appointment:", err);
      return res.status(500).json({ error: "Failed to update appointment" });
    }
  }

  // ---------------- DELETE ----------------
  if (req.method === "DELETE") {
    try {
      const { id, cancel } = req.body;

      if (cancel) {
        // ✅ Soft cancel
        const cancelled = await prisma.schedule.update({
          where: { id },
          data: { status: "cancelled" },
        });
        return res.status(200).json({ success: true, cancelled });
      }

      // ✅ Hard delete
      await prisma.schedule.delete({ where: { id } });
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("Error deleting appointment:", err);
      return res.status(500).json({ error: "Failed to delete appointment" });
    }
  }

  // ---------------- Default ----------------
  return res.status(405).json({ error: "Method not allowed" });
}
