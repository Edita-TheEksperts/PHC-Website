import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Get all schedules (appointments)
    const schedules = await prisma.schedule.findMany({
      take: 10, // limit to 10 for dashboard
      orderBy: { date: "asc" },
    })
    return res.status(200).json(schedules)
  }

  if (req.method === "PUT") {
    const { id, update } = req.body
    const updated = await prisma.schedule.update({
      where: { id },
      data: update,
    })
    return res.status(200).json(updated)
  }

  if (req.method === "DELETE") {
    const { id } = req.body
    await prisma.schedule.delete({ where: { id } })
    return res.status(200).json({ success: true })
  }

  res.status(405).json({ error: "Method not allowed" })
}
