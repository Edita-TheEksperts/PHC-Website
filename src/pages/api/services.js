import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
  try {
    const services = await prisma.service.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    res.status(200).json(services);
  } catch (error) {
    console.error("Error loading services:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
