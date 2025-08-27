import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
if (req.method === "GET") {
  const schedules = await prisma.schedule.findMany({
    take: 10,
    orderBy: { date: "asc" },
  });
  return res.status(200).json(schedules);
}


  if (req.method === "PUT") {
    const { id, update } = req.body;
    const updated = await prisma.schedule.update({
      where: { id },
      data: update,
    });
    return res.status(200).json(updated);
  }

  if (req.method === "DELETE") {
    const { id } = req.body;
    // ✅ Instead of deleting, mark as cancelled
    const cancelled = await prisma.schedule.update({
      where: { id },
      data: { status: "cancelled" },
    });
    return res.status(200).json({ success: true, cancelled });
  }

  res.status(405).json({ error: "Method not allowed" });
}
