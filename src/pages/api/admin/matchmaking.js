import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { clientId, startDate, endDate } = req.query;
    if (!clientId) {
      return res.status(400).json({ message: "clientId is required" });
    }

    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date(start.getTime() + 86400000);

    // Load client
    const client = await prisma.user.findUnique({
      where: { id: clientId },
      include: { services: true, subServices: true },
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // --- Normalize services ---
    const SERVICE_ALIASES = {
      "alltagsbegleitung und besorgungen": "alltagsbegleitung",
      "beleitung zu terminen": "terminbegleitung",
      "freizeit und soziale aktivitäten": "freizeit",
      "vorlesen": "freizeit",
      "ausflüge und reisebegleitung": "reisebegleitung",
      "einkäufe erledigen": "einkäufe",
      "haushaltshilfe und wohnpflege": "haushaltshilfe",
      "hauswirtschaft": "haushaltshilfe",
    };

    function unique(arr) {
      return [...new Set(arr)];
    }

    function normalizeNeeds(needs) {
      return unique(needs.map(n => SERVICE_ALIASES[n] || n.toLowerCase()));
    }

    let clientNeeds = [
      ...(client.services?.map(s => s.name) || []),
      ...(client.subServices?.map(ss => ss.name) || []),
    ].map(s => s.toLowerCase());

    if (clientNeeds.length === 0) {
      if (client.mobility) clientNeeds.push("mobility");
      if (client.companionship) clientNeeds.push("companionship");
      if (client.shoppingAssist) clientNeeds.push("shopping");
      if (client.basicCare) clientNeeds.push("care");
    }

    const finalNeeds = normalizeNeeds(clientNeeds);
    console.log("Client needs used for matching:", finalNeeds);

    // --- Location info ---
    const clientCity = client.careCity || client.city || null;
    const clientPostalCode = client.carePostalCode || client.postalCode || null;
    const clientCanton = client.canton || null;

    // --- Query employees ---
// --- Query employees (don't over-filter here) ---
let employees = await prisma.employee.findMany({
  where: {
    status: "available",
  },
  select: {
    id: true,
    firstName: true,
    lastName: true,
    phone: true,
    servicesOffered: true,
    city: true,
    zipCode: true,
    canton: true,
  },
});

    // --- Vacation + schedule filter ---
    const available = [];
    for (const emp of employees) {
      const onVacation = await prisma.vacation.findFirst({
        where: {
          employeeId: emp.id,
          startDate: { lte: end },
          endDate: { gte: start },
        },
      });

      const scheduled = await prisma.schedule.findFirst({
        where: {
          employeeId: emp.id,
          date: { gte: start, lte: end },
        },
      });

      if (!onVacation && !scheduled) {
        available.push(emp);
      }
    }

 // --- Build recommendations ---
const recommendations = available.map(emp => {
  let score = 0;
  let reasons = [];

  // Service match
  const matchedServices = emp.servicesOffered.filter(s =>
    finalNeeds.includes(s.toLowerCase())
  );
  if (matchedServices.length > 0) {
    score += matchedServices.length * 2;
    reasons.push(`Matches services: ${matchedServices.join(", ")}`);
  }

  // Location match
  if (clientCity && emp.city?.toLowerCase() === clientCity.toLowerCase()) {
    score += 1;
    reasons.push("Same city");
  } else if (clientCanton && emp.canton?.toLowerCase() === clientCanton.toLowerCase()) {
    score += 0.5;
    reasons.push("Same canton");
  }

  // Availability (already filtered)
  score += 1;

  // Fallback if no services matched at all
  if (matchedServices.length === 0) {
    reasons.push("No service match, but available nearby");
  }

  return { ...emp, employeeId: emp.id, score, reasons };
});

// Always sort
// After building recommendations
recommendations.sort((a, b) => b.score - a.score);

// ✅ Guarantee fallback (top 3 available employees if empty)
if (recommendations.length === 0) {
  recommendations.push(
    ...available.slice(0, 3).map(emp => ({
      ...emp,
      employeeId: emp.id,
      score: 0,
      reasons: ["Fallback: no strong match found, but available"],
    }))
  );
}

res.status(200).json(recommendations);

// ✅ Always respond with recommendations
res.status(200).json(recommendations);

  } catch (err) {
    console.error("❌ Matchmaking API error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
