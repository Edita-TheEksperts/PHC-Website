import { hash } from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { sendEmail } from "../../lib/emails";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  console.log("📦 Incoming Form Data:", JSON.stringify(req.body, null, 2));
 // Helper to convert null/undefined to empty string
  const safeString = (val) => (val == null ? "" : val);

  // Fix: define safeStringOrNull to avoid error
  const safeStringOrNull = (val) => (typeof val === "string" && val.trim() !== "" ? val : null);



  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      address,
      frequency,
      duration,
      firstDate,

      cardNumber,
      expiryDate,
      cvc,
      languages,

      hasPets,
      petDetails,

      services,
      subServices: subServicesRaw,
      allergies,
      specialRequests,
      schedules = [],

      paymentIntentId,

      street,
      entranceLocation,
      postalCode,
      city,
      arrivalConditions,
      hasParking,
      entranceDescription,

      mobilityAids,
      transportOption,
      appointmentTypes,
      appointmentOther,
      shoppingWithClient,
      shoppingItems,
      mailboxKeyLocation,
      mailboxDetails,
      additionalAccompaniment,

      companionship,
      cookingTogether,
      biographyWork,
      hasTech,
      reading,
      cardGames,
      hasAllergies,
      allergyDetails,
      trips,

      height,
      weight,
      careTools,
      careToolsOther,
      incontinence,
      vision,
      hearing,
      speaking,
      nutritionSupport,
      basicCare,
      basicCareOther,
      healthPromotion,
      healthPromotionOther,
      mentalSupportNeeded,
      diagnoses,
      behaviorTraits,
      healthFindings,

      roomCount,
      householdSize,
    } = req.body;

    if (!firstName || !lastName || !email || !password || !firstDate || !paymentIntentId) {
      return res.status(400).json({ message: "Required fields are missing (including paymentIntentId)" });
    }

    const parsedDate = new Date(firstDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid firstDate" });
    }
// ✅ Stripe Verification (only if not test mode)
if (paymentIntentId && paymentIntentId !== "TEST_MODE_NO_PAYMENT") {
  const Stripe = require('stripe');
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Make sure this is set in .env

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!["succeeded", "requires_capture", "requires_confirmation"].includes(paymentIntent.status)) {
      return res.status(402).json({
        message: "Zahlung wurde nicht erfolgreich verarbeitet.",
        stripeStatus: paymentIntent.status,
      });
    }
  } catch (stripeErr) {
    console.error("Stripe verification failed:", stripeErr);
    return res.status(500).json({ message: "Stripe PaymentIntent konnte nicht überprüft werden." });
  }
}

    const passwordHash = await hash(password, 10);

    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ message: "No services provided" });
    }

    const serviceRecords = await prisma.service.findMany({
      where: { name: { in: services } },
    });
    if (serviceRecords.length !== services.length) {
      return res.status(400).json({
        message: "One or more services not found",
        received: services,
        found: serviceRecords.map((s) => s.name),
      });
    }

    if (!Array.isArray(subServicesRaw) || subServicesRaw.length === 0) {
      return res.status(400).json({ message: "No subservices provided" });
    }

    const subServiceRecords = await prisma.subService.findMany({
      where: { name: { in: subServicesRaw } },
    });
    if (subServiceRecords.length !== subServicesRaw.length) {
      return res.status(400).json({
        message: "One or more subservices not found",
        received: subServicesRaw,
        found: subServiceRecords.map((s) => s.name),
      });
    }
const schedulesCreate = schedules
  .filter((item) => item.day && item.startTime && item.hours && item.date)
  .map((item) => ({
    day: item.day,
    startTime: item.startTime,
    hours: parseInt(item.hours, 10) || 0,
    date: new Date(item.date),
  }));




    const HOURLY_RATE = 1;
    const totalHours = schedulesCreate.reduce((sum, item) => sum + item.hours, 0);
    const totalPayment = totalHours * HOURLY_RATE;

    const pets = hasPets === "Ja" ? safeString(petDetails) : "";

    const joinOrEmpty = (val) =>
      Array.isArray(val) ? val.join(", ") : safeString(val);

    const userData = {
  // Basic fields
  firstName,
  lastName,
  email,
phone: safeString(phone),
address: safeString(address),
frequency: safeString(frequency),
  passwordHash,
  duration: typeof duration === "number" ? duration : parseInt(duration, 10) || null,
  firstDate: parsedDate,
  cardNumber: safeStringOrNull(cardNumber),
  expiryDate: safeStringOrNull(expiryDate),
  cvc: safeStringOrNull(cvc),
  languages: safeStringOrNull(languages),
  pets: hasPets === "Ja" ? safeStringOrNull(petDetails) : null,
  allergies: safeStringOrNull(allergies),
  specialRequests: safeStringOrNull(specialRequests),
  totalPayment,
  paymentIntentId,

  postalCode: safeStringOrNull(postalCode),
  careCity: safeStringOrNull(city),
  careStreet: safeStringOrNull(street),
  careEntrance: safeStringOrNull(entranceLocation),
  careArrivalConditions: safeStringOrNull(arrivalConditions),
  careHasParking: safeStringOrNull(hasParking),
  careEntranceDetails: safeStringOrNull(entranceDescription),

  height: height ? String(height) : null,
  weight: weight ? String(weight) : null,

  mobilityAids: safeStringOrNull(mobilityAids),
  transportOption: safeStringOrNull(transportOption),

  appointmentTypes: safeStringOrNull(appointmentTypes),
  appointmentOther: safeStringOrNull(appointmentOther),
  shoppingWithClient: safeStringOrNull(shoppingWithClient),
  shoppingItems: safeStringOrNull(shoppingItems),
  mailboxKeyLocation: safeStringOrNull(mailboxKeyLocation),
  mailboxDetails: safeStringOrNull(mailboxDetails),
  additionalAccompaniment: safeStringOrNull(additionalAccompaniment),

companionship: safeStringOrNull(companionship),
cooking: safeStringOrNull(cookingTogether),
biographyWork: safeStringOrNull(biographyWork),
hasTech: safeStringOrNull(hasTech),
reads: safeStringOrNull(reading),
playsCards: safeStringOrNull(cardGames),
hasAllergies: safeStringOrNull(hasAllergies),
allergyDetails: safeStringOrNull(allergyDetails),
outings: safeStringOrNull(trips),

aids: safeStringOrNull(careTools),
aidsOther: safeStringOrNull(careToolsOther),
incontinence: safeStringOrNull(incontinence),

communicationSehen: safeStringOrNull(vision),
communicationHören: safeStringOrNull(hearing),
communicationSprechen: safeStringOrNull(speaking),

foodSupport: safeStringOrNull(nutritionSupport),
basicCare: safeStringOrNull(basicCare),
basicCareOther: safeStringOrNull(basicCareOther),

healthActivities: safeStringOrNull(healthPromotion),
healthActivitiesOther: safeStringOrNull(healthPromotionOther),

mentalSupport: safeStringOrNull(mentalSupportNeeded),
mentalConditions: safeStringOrNull(diagnoses),


  behaviorTraits: safeStringOrNull(behaviorTraits), // if your model supports this, else omit or store elsewhere
  medicalFindings: safeStringOrNull(healthFindings),

  householdRooms: roomCount ? parseInt(roomCount, 10) : null,
  householdPeople: householdSize ? parseInt(householdSize, 10) : null,

  services: {
    connect: services.map((name) => ({ name })),
  },
  subServices: {
    connect: subServiceRecords.map((record) => ({ id: record.id })),
  },
  schedules: {
    create: schedulesCreate,
  },
};


    console.log("🧪 Final Prisma Payload:", JSON.stringify(userData, null, 2));

    const user = await prisma.user.create({ data: userData });

    await sendEmail({
      to: email,
      subject: "Willkommen bei Prime Home Care – Ihr Zugang ist aktiv",
      html: `
        <p>Guten Tag ${firstName} ${lastName},</p>
        <p>Vielen Dank für Ihre Registrierung bei Prime Home Care AG.<br/>
        Ihr persönlicher Zugang zum Kundenportal wurde erfolgreich eingerichtet. Ab sofort können Sie:</p>
        <ul>
          <li>Ihre Buchungen verwalten</li>
          <li>Rechnungen einsehen</li>
          <li>Betreuungspersonen kennenlernen</li>
          <li>Mit uns direkt kommunizieren</li>
          <li>u.v.m</li>
        </ul>
        <p><strong>Portal-Zugang:</strong> <a href="http://localhost:3000/login">Login-Link</a><br/>
        <strong>Benutzername:</strong> ${email}</p>
        <p>Bei Fragen zum Portal stehen wir Ihnen gerne zur Verfügung.</p>
        <p>Herzlich willkommen<br/>
        Ihr Prime Home Care Team</p>
      `,
    });

    await prisma.reminder.createMany({
      data: [
        {
          userId: user.id,
          type: "4h_reminder",
          scheduledAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
          sent: false,
        },
        {
          userId: user.id,
          type: "48h_reminder",
          scheduledAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
          sent: false,
        },
      ],
    });

    return res.status(201).json({ message: "User registered successfully", userId: user.id });
} catch (error) {
  console.error("❌ Error during registration:", error?.stack || error);
  return res.status(500).json({
    message: "Internal server error",
    error: error?.message || String(error)
  });
}


}
