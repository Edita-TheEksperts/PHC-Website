import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId, startDate, endDate } = req.body
    try {
      const vacation = await prisma.vacation.create({
        data: {
          userId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        },
      })
      res.status(200).json(vacation)
    } catch (err) {
      res.status(500).json({ error: "Could not save vacation" })
    }
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}
