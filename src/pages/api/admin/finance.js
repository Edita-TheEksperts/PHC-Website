import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  try {
    // Income per Service
    const services = await prisma.service.findMany({
      include: {
        users: {
          select: { totalPayment: true }
        }
      }
    });

    const incomePerService = services.map(s => ({
      serviceName: s.name,
      amount: s.users.reduce((sum, u) => sum + (u.totalPayment || 0), 0)
    }));

    const totalIncome = incomePerService.reduce((sum, s) => sum + s.amount, 0);

    // Cost per Service (basic example: hours * 30, km * 0.5)
    const schedules = await prisma.schedule.findMany({
      include: { user: { include: { services: true } } }
    });

    const serviceCostMap = {};

    schedules.forEach(s => {
      const cost = (s.hours * 30) + ((s.kilometers || 0) * 0.5);
      s.user.services.forEach(service => {
        serviceCostMap[service.name] = (serviceCostMap[service.name] || 0) + cost;
      });
    });

    const costPerService = Object.entries(serviceCostMap).map(([serviceName, amount]) => ({
      serviceName,
      amount
    }));

    const totalCost = costPerService.reduce((sum, s) => sum + s.amount, 0);

    res.json({ incomePerService, totalIncome, costPerService, totalCost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
}