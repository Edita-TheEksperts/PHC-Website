import { hash } from "bcryptjs";
import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { form } = req.body;
    if (!form) return res.status(400).json({ message: "Form data missing" });

    const {
      firstName, lastName, email, password, phone,
      frequency, address, duration, firstDate,
      postalCode, city, street,
      services = [], subServices = [], schedules = []
    } = form;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: "User already exists" });

    const parsedDate = new Date(firstDate.split(".").reverse().join("-"));
    const passwordHash = await hash(password, 10);

    const totalHours = schedules.reduce((sum, s) => sum + (parseFloat(s.hours) || 0), 0);
    const totalPayment = totalHours * 1;

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
        phone,
        address,
        careStreet: street,
        carePostalCode: postalCode,
        careCity: city,
        frequency,
        duration: parseInt(duration, 10),
        firstDate: parsedDate,
        totalPayment,

        services: services?.length
          ? {
              connect: services.map(name => ({ name }))
            }
          : undefined,

        subServices: subServices?.length
          ? {
              connectOrCreate: subServices.map(name => ({
                where: { name },
                create: { name },
              }))
            }
          : undefined,

        schedules: {
          create: schedules.map(s => ({
            day: s.day,
            startTime: s.startTime,
            hours: parseFloat(s.hours),
            date: parsedDate,
          }))
        }
      }
    });

    res.status(200).json({ userId: user.id });
  } catch (err) {
    console.error("❌ Error saving user:", err);
    res.status(500).json({ message: "Internal error", error: err.message });
  }
}
