import { prisma } from "../../lib/prisma";
import crypto from "crypto";
import { sendEmail } from "../../lib/emails";
import { createOrUpdateSalesforceAccount } from "../../lib/salesforce";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      street,
      postalCode,
      city,
      frequency,
      duration,
      firstDate,
      services = [],
      subServices = [],
      anrede,
      kanton,
      schedules = [],
      paymentIntentId,

      // Fragebogen
      languages,
      emergencyContactName,
      emergencyContactPhone,

      hasAllergies,
      allergyCheck,
      allergies,
      allergyDetails,
      allergyWhich,
      healthFindings,
      medicalFindings,

      mobility,
      mobilityAids,
      householdRooms,
      householdPeople,

      cooking,
      jointCooking,
      shoppingType,
      shoppingWithClient,

      communicationVision,
      communicationSehen,
      communicationHearing,
      communicationHören,
      communicationSpeech,
      communicationSprechen,
    } = req.body;

    /* --------------------------------------------------
       1️⃣ BASIC VALIDATION (STRIPE SAFE)
    -------------------------------------------------- */

    if (!email) {
      return res.status(400).json({ message: "❌ Email missing" });
    }

    if (!paymentIntentId) {
      return res.status(400).json({ message: "❌ paymentIntentId missing" });
    }

    /* --------------------------------------------------
       2️⃣ HELPERS
    -------------------------------------------------- */

    const clean = (v) => {
      if (v === undefined || v === null) return null;
      if (typeof v === "string") {
        const t = v.trim();
        return t === "" || t === "—" ? null : t;
      }
      return v;
    };

    const cleanInt = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    const removeNulls = (obj) =>
      Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null));

    /* --------------------------------------------------
       3️⃣ DATE PARSE (SAFE)
    -------------------------------------------------- */

    let parsedDate = null;
    if (firstDate) {
      parsedDate =
        typeof firstDate === "string" && firstDate.includes(".")
          ? new Date(firstDate.split(".").reverse().join("-"))
          : new Date(firstDate);
    }

    /* --------------------------------------------------
       4️⃣ SERVICES (TOLERANT)
    -------------------------------------------------- */

    const allServices = await prisma.service.findMany();
    const allSubServices = await prisma.subService.findMany();

    const normalize = (x) => String(x ?? "").toLowerCase().trim();

    const serviceRecords = allServices.filter((s) =>
      services.some((i) => normalize(i).includes(normalize(s.name)))
    );

    const subServiceRecords = allSubServices.filter((s) =>
      subServices.some((i) => normalize(i).includes(normalize(s.name)))
    );

    /* --------------------------------------------------
       5️⃣ SCHEDULES
    -------------------------------------------------- */

    const schedulesCreate = (schedules || []).map((s) => ({
      day: s.day,
      startTime: s.startTime,
      hours: cleanInt(s.hours) ?? 0,
      date: s.date ? new Date(s.date) : null,
    }));

    const totalHours = schedulesCreate.reduce(
      (sum, s) => sum + (s.hours || 0),
      0
    );

    const HOURLY_RATE = 1;
    const totalPayment = totalHours * HOURLY_RATE;

    /* --------------------------------------------------
       6️⃣ QUESTIONNAIRE
    -------------------------------------------------- */
const questionnaireData = removeNulls({
  languages: toString(languages),

  shoppingItems: toString(shoppingItems),
  shoppingWithClient: shoppingWithClient,

  householdTasks: toJson(householdTasks),
  householdRooms: cleanInt(householdRooms),
  householdPeople: cleanInt(householdPeople),

  mobilityAids: toString(mobilityAids),
  physicalState: toString(physicalCondition),

  foodSupportTypes: toString(nutritionSupport),
  basicCare: toString(basicCare),
  basicCareOther: basicCareOther,

  mentalDiagnoses: toString(diagnoses),
  behaviorTraits: toString(behaviorTraits),

  healthFindings,
  medicalFindings,

  hasAllergies,
  allergyDetails,
});

    /* --------------------------------------------------
       7️⃣ CREATE OR UPDATE USER
    -------------------------------------------------- */

    let user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      user = await prisma.user.update({
        where: { email },
        data: {
          paymentIntentId,
          totalPayment,
          ...questionnaireData,
        },
      });
    } else {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

      user = await prisma.user.create({
        data: {
          firstName: clean(firstName),
          lastName: clean(lastName),
          email,
          phone: clean(phone),
          address: clean(address) ?? "—",
          frequency: clean(frequency) ?? "einmalig",
          duration: cleanInt(duration),
          firstDate: parsedDate,

          careStreet: clean(street),
          carePostalCode: clean(postalCode),
          careCity: clean(city),

          paymentIntentId,
          totalPayment,
          resetToken,
          resetTokenExpiry,
          anrede: clean(anrede),
          kanton: clean(kanton),

          ...questionnaireData,

          services: {
            connect: serviceRecords.map((s) => ({ id: s.id })),
          },
          subServices: {
            connect: subServiceRecords.map((s) => ({ id: s.id })),
          },
          schedules: {
            create: schedulesCreate,
          },
        },
      });

      /* -------- SEND EMAIL -------- */

      const template = await prisma.emailTemplate.findUnique({
        where: { name: "welcomeEmail" },
      });

      if (template) {
        let body = template.body
          .replace(/{{firstName}}/g, firstName ?? "")
          .replace(/{{lastName}}/g, lastName ?? "")
          .replace(
            /{{resetLink}}/g,
            `${process.env.NEXT_PUBLIC_BASE_URL}/setpassword?token=${resetToken}`
          );

        await sendEmail({
          to: email,
          subject: template.subject,
          html: body,
        });
      }
    }

    /* --------------------------------------------------
       8️⃣ SALESFORCE
    -------------------------------------------------- */

    if (user && !user.salesforceId) {
      try {
        const sfId = await createOrUpdateSalesforceAccount(user);
        await prisma.user.update({
          where: { id: user.id },
          data: { salesforceId: sfId },
        });
      } catch (e) {
        console.error("Salesforce error:", e);
      }
    }

    /* --------------------------------------------------
       9️⃣ REMINDERS
    -------------------------------------------------- */

    await prisma.reminder.createMany({
      data: [
        {
          userId: user.id,
          type: "4h_reminder",
          scheduledAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
        },
        {
          userId: user.id,
          type: "48h_reminder",
          scheduledAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
        },
      ],
    });

    return res.status(201).json({
      message: "✅ Registration complete",
      userId: user.id,
    });
  } catch (error) {
    console.error("❌ Register error:", error);

    return res.status(500).json({
      message: "❌ Internal server error",
      error: error?.message || String(error),
    });
  }
}
