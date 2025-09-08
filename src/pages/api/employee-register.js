import { prisma } from "../../lib/prisma";
import { createOrUpdateSalesforceCaregiver } from "../../lib/salesforce"; 

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ message: "Invalid JSON payload" });
  }

  const data = req.body;

  // ✅ Required field validation
  if (!data.email || !data.firstName || !data.lastName || !data.experienceYears) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // ✅ Build employeeData (same as you already have)
  const employeeData = {
    email: data.email.trim(),
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    experienceYears: data.experienceYears.trim(),
    hasLicense: data.hasLicense === true || data.hasLicense === "ja",
    availabilityFrom: new Date(data.availabilityFrom),
    status: "pending",

    // Optional fields
    ...(data.salutation && { salutation: data.salutation.trim() }),
    ...(data.phone && { phone: data.phone.trim() }),
    ...(data.address && { address: data.address.trim() }),
    ...(data.houseNumber && { houseNumber: data.houseNumber.trim() }),
    ...(data.zipCode && { zipCode: data.zipCode.trim() }),
    ...(data.city && { city: data.city.trim() }),
    ...(data.country && { country: data.country.trim() }),
    ...(data.canton && { canton: data.canton.trim() }),
    ...(data.nationality && { nationality: data.nationality.trim() }),
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
    ...(data.passportFile && { passportFile: data.passportFile }),
    ...(data.visaFile && { visaFile: data.visaFile }),
    ...(data.policeLetterFile && { policeLetterFile: data.policeLetterFile }),
    ...(data.cvFile && { cvFile: data.cvFile }),
    ...(data.certificateFile && { certificateFile: data.certificateFile }),
    ...(data.drivingLicenceFile && { drivingLicenceFile: data.drivingLicenceFile }),
    ...(data.profilePhoto && { profilePhoto: data.profilePhoto }),

    // Arrays
    specialTrainings: Array.isArray(data.specialTrainings) ? data.specialTrainings : [],
    communicationTraits: Array.isArray(data.communicationTraits) ? data.communicationTraits : [],
    languages: Array.isArray(data.languages) ? data.languages : [],
    dietaryExperience: Array.isArray(data.dietaryExperience) ? data.dietaryExperience : [],
    availabilityDays: Array.isArray(data.availabilityDays)
      ? data.availabilityDays.map(
          (entry) => `${entry.day} ${entry.startTime}-${entry.endTime}`
        )
      : [],
    servicesOffered: Array.isArray(data.servicesOffered) ? data.servicesOffered : [],
  };

  // ✅ Clean empty fields
  Object.keys(employeeData).forEach((key) => {
    if (
      employeeData[key] === undefined ||
      employeeData[key] === null ||
      employeeData[key] === ""
    ) {
      delete employeeData[key];
    }
  });

  try {
    // ✅ Check if already exists in DB
    const existing = await prisma.employee.findUnique({
      where: { email: employeeData.email },
    });

    if (existing) {
      return res.status(409).json({
        message: "Diese E-Mail-Adresse ist bereits registriert.",
      });
    }

    // ✅ Save employee in Prisma
    const saved = await prisma.employee.create({
      data: employeeData,
    });

    // ✅ Push to Salesforce
    let sfId = null;
    try {
      sfId = await createOrUpdateSalesforceCaregiver(saved);

      // Save Salesforce Id in Prisma (make sure `salesforceId` exists in schema!)
      await prisma.employee.update({
        where: { id: saved.id },
        data: { salesforceId: sfId },
      });
    } catch (sfError) {
      console.error("❌ Salesforce sync failed:", sfError);
    }

    return res.status(201).json({
      message: "Registered successfully.",
      employeeId: saved.id,
      salesforceId: sfId,
    });
  } catch (error) {
    console.error("❌ Prisma insert failed:", error);
    return res.status(500).json({
      message: "Database error",
      error: error.message,
    });
  }
}
