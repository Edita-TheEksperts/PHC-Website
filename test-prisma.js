import { prisma } from "./src/lib/prisma.js";

const employeeId = "84ea45e8-95f4-43e7-ac5a-123dfbd7d619"; // Edita’s id

const schedules = await prisma.schedule.findMany({
  where: { employeeId },
  select: { id: true, day: true, startTime: true, employeeId: true },
});
