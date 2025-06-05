import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  console.log("🛬 Incoming request body:", req.body);

  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ message: "Invalid JSON payload" });
  }

  const data = req.body;

  // Helpers
  const safeString = (val) => (typeof val === "string" && val.trim() ? val.trim() : undefined);
  const safeArray = (val) => (Array.isArray(val) ? val : []);
  const safeBool = (val) => val === true || val === "ja";

  const startDate = new Date(data.availabilityFrom);
  if (isNaN(startDate.getTime())) {
    return res.status(400).json({ message: "Invalid date format" });
  }

  const days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
  let availabilityDays = [];

  try {
    availabilityDays = days
      .filter((day) => data[`available_${day}`] === true)
      .map((day) => {
        const hours = parseFloat(data[`availabilityHours_${day}`]) || 0;
        return `${day} (${hours} Std)`;
      });
  } catch (e) {
    console.warn("⚠️ Could not compute availabilityDays:", e);
  }

  // Required field validation
  if (
    !safeString(data.email) ||
    !safeString(data.firstName) ||
    !safeString(data.lastName) ||
    !safeString(data.experienceYears)
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const employeeData = {
  email: data.email.trim(),
  firstName: data.firstName.trim(),
  lastName: data.lastName.trim(),
  experienceYears: data.experienceYears.trim(),
  hasLicense: data.hasLicense === true || data.hasLicense === "ja",
  availabilityFrom: new Date(data.availabilityFrom),
  status: "pending",

  // Optional fields – only include them if defined
  ...(data.salutation && { salutation: data.salutation.trim() }),
  ...(data.phone && { phone: data.phone.trim() }),
  ...(data.address && { address: data.address.trim() }),
  ...(data.houseNumber && { houseNumber: data.houseNumber.trim() }),
  ...(data.zipCode && { zipCode: data.zipCode.trim() }),
  ...(data.city && { city: data.city.trim() }),
  ...(data.country && { country: data.country.trim() }),
  ...(data.residencePermit && { residencePermit: data.residencePermit.trim() }),
  ...(data.experienceWhere && { experienceWhere: data.experienceWhere.trim() }),
  ...(data.experienceCompany && { experienceCompany: data.experienceCompany.trim() }),
  ...(data.licenseType && { licenseType: data.licenseType.trim() }),
  ...(data.hasCar && { hasCar: data.hasCar.trim() }),
  ...(data.carAvailableForWork && { carAvailableForWork: data.carAvailableForWork.trim() }),
  ...(data.smoker && { smoker: data.smoker.trim() }),
  ...(data.onCallAvailable && { onCallAvailable: data.onCallAvailable.trim() }),
  ...(data.languageOther && { languageOther: data.languageOther.trim() }),
  ...(data.travelSupport && { travelSupport: data.travelSupport.trim() }),
  ...(data.bodyCareSupport && { bodyCareSupport: data.bodyCareSupport.trim() }),
  ...(data.hasAllergies && { hasAllergies: data.hasAllergies.trim() }),
  ...(data.worksWithAnimals && { worksWithAnimals: data.worksWithAnimals.trim() }),
  ...(data.howFarCanYouTravel && { howFarCanYouTravel: data.howFarCanYouTravel.trim() }),
  ...(data.howDidYouHearAboutUs && { howDidYouHearAboutUs: data.howDidYouHearAboutUs.trim() }),
  ...(data.desiredWeeklyHours && { desiredWeeklyHours: data.desiredWeeklyHours.trim() }),

  // Arrays
  specialTrainings: Array.isArray(data.specialTrainings) ? data.specialTrainings : [],
  communicationTraits: Array.isArray(data.communicationTraits) ? data.communicationTraits : [],
  languages: Array.isArray(data.languages) ? data.languages : [],
  dietaryExperience: Array.isArray(data.dietaryExperience) ? data.dietaryExperience : [],
  availabilityDays: Array.isArray(data.availabilityDays) ? data.availabilityDays : [],
  servicesOffered: Array.isArray(data.servicesOffered) ? data.servicesOffered : []
};

  // Remove undefined/null/empty string fields
  Object.keys(employeeData).forEach((key) => {
    if (
      employeeData[key] === undefined ||
      employeeData[key] === null ||
      employeeData[key] === ""
    ) {
      delete employeeData[key];
    }
  });
const existing = await prisma.employee.findUnique({
  where: { email: employeeData.email },
});

if (existing) {
  return res.status(409).json({  // 409 Conflict is more specific than 400
    message: "Diese E-Mail-Adresse ist bereits registriert.",
  });
}


  // Log before insert
  console.log("🗃️ Final employeeData:", employeeData);

  try {
    const saved = await prisma.employee.create({
      data: employeeData,
    });

    console.log("✅ Saved to DB:", saved?.id || "No ID returned");

    return res.status(201).json({
      message: "Registered successfully.",
    });
  } catch (error) {
console.error("❌ Prisma insert failed:");
console.dir(error, { depth: null });
    return res.status(500).json({
  message: "Database error",
  error: error.message
});


  }
}
