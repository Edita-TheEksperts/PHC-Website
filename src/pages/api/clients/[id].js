import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  // =====================================================
  // ✅ GET – Fetch client details
  // =====================================================
  if (req.method === "GET") {
    try {
      const client = await prisma.user.findUnique({
        where: { id: String(id) },
        include: {
          assignments: {
            include: {
              employee: true,
            },
          },
          schedules: {
            include: {
              employee: true,
              user: true,
            },
          },
          services: true,
          subServices: true,
        },
      });

      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      // ✅ SAFE extras (nuk prish punë nëse s’janë në DB)
      const schedulesWithExtras = (client.schedules || []).map((s) => ({
        ...s,
        baseHours: s.baseHours || 0,
        baseKm: s.baseKm || 0,
        extraHours: (s.hours || 0) - (s.baseHours || 0),
        extraKm: (s.kilometers || 0) - (s.baseKm || 0),
      }));

      return res.status(200).json({
        ...client,
        schedules: schedulesWithExtras,
      });
    } catch (error) {
      console.error("❌ Error fetching client details:", error);
      return res.status(500).json({ message: "Failed to fetch client details" });
    }
  }

  // =====================================================
  // ✅ PUT – Update client (Bearbeiten / Speichern)
  // =====================================================
  if (req.method === "PUT") {
    try {
      const data = req.body;

      /**
       * 🔒 SECURITY NOTE
       * Ruajmë vetëm field-at primitive që lejojmë të editohen
       * (jo relations, jo password, jo stripe, etj.)
       */
      const ALLOWED_FIELDS = [
        "anrede",
        "firstName",
        "lastName",
        "email",
        "phone",
        "languages",

        "careStreet",
        "carePostalCode",
        "careCity",

        "frequency",
        "duration",

        "emergencyContactName",
        "emergencyContactPhone",

        // Fragebogen (nëse do t’i editosh)
        "hasAllergies",
        "allergyDetails",
        "healthFindings",
        "medicalFindings",
        "mobility",
        "mobilityAids",
        "householdRooms",
        "householdPeople",
        "cooking",
        "jointCooking",
        "shoppingType",
        "shoppingWithClient",
        "communicationVision",
        "communicationSehen",
        "communicationHearing",
        "communicationHören",
        "communicationSpeech",
        "communicationSprechen",
      ];

      // 👉 Marrim vetëm field-at e lejuara
      const updateData = {};
      for (const key of ALLOWED_FIELDS) {
        if (key in data) {
          updateData[key] = data[key];
        }
      }

      const updatedClient = await prisma.user.update({
        where: { id: String(id) },
        data: updateData,
      });

      return res.status(200).json(updatedClient);
    } catch (error) {
      console.error("❌ Error updating client:", error);
      return res.status(500).json({ message: "Failed to update client" });
    }
  }

  // =====================================================
  // ❌ Method not allowed
  // =====================================================
  return res.status(405).json({ message: "Method Not Allowed" });
}
