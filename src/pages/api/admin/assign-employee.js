import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { userId, employeeId } = req.body;

  if (!userId || !employeeId) {
    return res.status(400).json({ message: "Missing userId or employeeId" });
  }

  try {
    const assignment = await prisma.assignment.create({
      data: {
        userId,
        employeeId,
      },
    });

    res.status(200).json({ assignment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to assign employee" });
  }
}
