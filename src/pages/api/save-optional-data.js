import { prisma } from '../../lib/prisma';

// Remove null, undefined, or empty string values
function cleanData(obj) {
  const cleaned = {};
  for (const key in obj) {
    const val = obj[key];
    if (val !== null && val !== undefined && !(typeof val === "string" && val.trim() === "")) {
      cleaned[key] = val;
    }
  }
  return cleaned;
}

function serializeArrays(data) {
  const stringOnlyFields = [
    "postalCode", "carePostalCode", "cardNumber", "cvc", "expiryDate",
    "cooking", "jointCooking", "height", "weight"
  ];

  const numberFields = ["householdRooms", "householdPeople", "totalPayment", "duration"];

  const result = {};
  for (const key in data) {
    const val = data[key];

    if (Array.isArray(val)) {
      result[key] = val.join(', ');
    } else if (numberFields.includes(key)) {
      result[key] = Number(val);
    } else if (stringOnlyFields.includes(key)) {
      result[key] = String(val);
    } else {
      result[key] = val;
    }
  }

  return result;
}





const allowedUserFields = new Set([
  "frequency", "duration", "firstDate", "email", "address",
  "mobilityAids", "transportOption", "careFirstName", "careLastName", "carePhone",
  "careStreet", "careEntrance", "carePostalCode", "careCity", "careEntranceDetails",
  "careArrivalConditions", "careHasParking", "appointmentTypes", "appointmentOther",
  "shoppingWithClient", "shoppingItems", "mailboxKeyLocation", "mailboxDetails",
  "additionalAccompaniment", "companionshipSupport", "jointCooking", "biographyWork",
  "techAvailable", "allergyCheck", "allergyWhich", "reading", "cardGames", "trips",
  "height", "weight", "physicalState", "toolsAvailable", "toolsOther", "incontinenceTypes",
  "communicationVision", "communicationHearing", "communicationSpeech", "foodSupportTypes",
  "basicCareNeeds", "basicCareOtherField", "healthPromotions", "healthPromotionOther",
  "mentalSupportNeeded", "mentalDiagnoses", "behaviorTraits", "healthFindings",
  "languages", "pets",  "paymentIntentId", "totalPayment",
  "householdRooms", "householdPeople", "householdTasks", "cooking",
]);

function filterValidFields(data) {
  const filtered = {};
  for (const key in data) {
    if (allowedUserFields.has(key)) {
      filtered[key] = data[key];
    }
  }
  return filtered;
}

function mapFrontendToBackend(formData) {
  const mapping = {
    firstName: "careFirstName",
    lastName: "careLastName",
    phone: "carePhone",
    street: "careStreet",
    entranceLocation: "careEntrance",
    postalCode: "carePostalCode",
    city: "careCity",
    entranceDescription: "careEntranceDetails",
    arrivalConditions: "careArrivalConditions",
    hasParking: "careHasParking",

    mobilityAids: "mobilityAids",
    transportOption: "transportOption",

    accompanimentAppointments: "appointmentTypes",
    accompanimentOther: "appointmentOther",

    shoppingWithClient: "shoppingWithClient",
    shoppingItems: "shoppingItems",

    mailboxKeyLocation: "mailboxKeyLocation",
    mailboxDetails: "mailboxDetails",
    additionalAccompaniment: "additionalAccompaniment",

    companionship: "companionshipSupport",
    cookingTogether: "jointCooking",
    hasAllergies: "allergyCheck",
    allergyDetails: "allergyWhich",
    biographyWork: "biographyWork",
    hasTech: "techAvailable",
    reading: "reading",
    cardGames: "cardGames",
    trips: "trips",

    height: "height",
    weight: "weight",
    physicalCondition: "physicalState",
    careTools: "toolsAvailable",
    careToolsOther: "toolsOther",
    incontinence: "incontinenceTypes",

    Sehen: "communicationVision",
    Hören: "communicationHearing",
    Sprechen: "communicationSpeech",

    nutritionSupport: "foodSupportTypes",
    basicCare: "basicCareNeeds",
    basicCareOther: "basicCareOtherField",
    healthPromotion: "healthPromotions",
    healthPromotionOther: "healthPromotionOther",
    mentalSupportNeeded: "mentalSupportNeeded",
    diagnoses: "mentalDiagnoses",
    behaviorTraits: "behaviorTraits",
    healthFindings: "healthFindings",

    roomCount: "householdRooms",
    householdSize: "householdPeople",
    householdTasks: "householdTasks",
    cookingForPeople: "cooking",
    languages: "languages",
    hasPets: "pets",
  };

  const result = {};
  for (const key in formData) {
    const backendKey = mapping[key] || key;
    result[backendKey] = formData[key];
  }

  return result;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userId, optionalData } = req.body;

  console.log("📥 Incoming data:", JSON.stringify(req.body, null, 2));

  if (!userId || !optionalData) {
    console.error("❌ Missing userId or optionalData");
    return res.status(400).json({ error: 'Missing userId or optionalData' });
  }

  if (typeof optionalData !== 'object' || optionalData === null) {
    console.error("❌ optionalData is not a valid object:", optionalData);
    return res.status(400).json({ error: 'Invalid optionalData structure' });
  }

  const nullFields = Object.entries(optionalData)
    .filter(([_, value]) => value === null)
    .map(([key]) => key);

  if (nullFields.length > 0) {
    console.warn("⚠️ These fields are null in optionalData:", nullFields);
  }

  const {
    services,
    subServices,
    schedules,
    ...restData
  } = optionalData;

  // 🧼 Clean + map + serialize
const mappedData = mapFrontendToBackend(restData);
const cleanedData = filterValidFields(serializeArrays(cleanData(mappedData)));
  console.log("🧼 Cleaned flat data to save:", cleanedData);

  try {
    // 🔄 Update flat fields
    await prisma.user.update({
      where: { id: userId },
      data: cleanedData,
    });
    console.log("✅ Flat user fields updated");
  } catch (error) {
    console.error("❌ Failed to update flat fields:", error.message);
    return res.status(500).json({ error: 'Failed to update user data' });
  }

  // 🔗 Update services
  if (services?.length) {
    console.log("🔗 Connecting services:", services);
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          services: {
            set: [],
            connect: services.map((s) => ({ name: typeof s === 'string' ? s : s.name })),
          },
        },
      });
    } catch (error) {
      console.error("❌ Failed to update services:", error.message);
    }
  } else {
    console.warn("⚠️ No services provided");
  }

  // 🔗 Update subServices
  if (subServices?.length) {
    console.log("🔗 Connecting subServices:", subServices);
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          subServices: {
            set: [],
            connect: subServices.map((s) => ({ name: typeof s === 'string' ? s : s.name })),
          },
        },
      });
    } catch (error) {
      console.error("❌ Failed to update subServices:", error.message);
    }
  } else {
    console.warn("⚠️ No subServices provided");
  }

  // 🕓 Update schedules
  if (schedules?.length) {
    console.log("🕓 Replacing schedules:", schedules);
    try {
      await prisma.schedule.deleteMany({ where: { userId } });
      await prisma.schedule.createMany({
        data: schedules.map((s) => ({
          userId,
          day: s.day,
          startTime: s.startTime,
          hours: Number(s.hours),
        })),
      });
    } catch (error) {
      console.error("❌ Failed to update schedules:", error.message);
    }
  } else {
    console.warn("⚠️ No schedules provided");
  }

  return res.status(200).json({ success: true });
}
