import { prisma } from "../../../../lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
const employee = await prisma.employee.findUnique({
  where: { id },
  include: {
  schedules: {
    include: { user: true },
    orderBy: { date: "desc" },
  },
  assignments: {
    include: { user: true },
  },
  rejectionWarnings: true,
  vacations: true, // ✅ Add this line
},

});


    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // ==== Schedule Stats ====
    const scheduleStats = employee.schedules.reduce(
      (acc, sched) => {
        acc.totalHours += sched.hours || 0;
        acc.totalKilometers += sched.kilometers || 0;

        // Group by month
        const key = sched.date ? sched.date.toISOString().slice(0, 7) : "unknown";
        if (!acc.monthly[key]) {
          acc.monthly[key] = { hours: 0, count: 0 };
        }
        acc.monthly[key].hours += sched.hours || 0;
        acc.monthly[key].count += 1;

        return acc;
      },
      { totalHours: 0, totalKilometers: 0, monthly: {} }
    );

    res.status(200).json({
      ...employee,
      scheduleStats,
      registeredAt: employee.createdAt,
      inviteSentAt: employee.inviteSentAt,
      files: {
        cv: employee.cvFile,
        passport: employee.passportFile,
        visa: employee.visaFile,
        policeLetter: employee.policeLetterFile,
        certificate: employee.certificateFile,
        drivingLicence: employee.drivingLicenceFile,
        profilePhoto: employee.profilePhoto,
      },
    });
  } catch (error) {
    console.error("Failed to fetch employee:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
