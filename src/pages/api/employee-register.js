// pages/api/employee-register.js
import { PrismaClient } from "@prisma/client";
import { sendCalendlyInvite } from "../../lib/sendCalendlyInvite";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  console.log(">>> REQ.BODY:", JSON.stringify(req.body, null, 2));

  const {
    email,
    firstName,
    lastName,
    phone,
    address,
    residencePermit,
    experienceYears,
    experienceWhere,
    hasLicense,
    availabilityFrom,
    availabilityDays,
    servicesOffered,
    howFarCanYouTravel,
    resumeUrl,
    photoUrl,
  } = req.body;

  if (!email || !firstName || !lastName || !experienceYears || !availabilityFrom || !resumeUrl) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // default arrays
  const safeAvailabilityDays = Array.isArray(availabilityDays)
    ? availabilityDays
    : [];
  const safeServicesOffered = Array.isArray(servicesOffered)
    ? servicesOffered
    : [];

  // coerce date
  const startDate = new Date(availabilityFrom);

  try {
    await prisma.employee.create({
      data: {
        email,
        firstName,
        lastName,
        phone,
        address,
        residencePermit,
        experienceYears: parseInt(experienceYears, 10),
        experienceWhere,
        hasLicense: Boolean(hasLicense),
        availabilityFrom: startDate,
        availabilityDays: safeAvailabilityDays,
        servicesOffered: safeServicesOffered,
        howFarCanYouTravel,
        resumeUrl,
        photoUrl,
      },
    });
  } catch (dbError) {
    console.error(
      "Database error on employee.create:",
      dbError && typeof dbError === "object"
        ? dbError
        : { message: String(dbError) }
    );
    return res.status(500).json({ message: "Database error" });
  }

  try {
    await sendCalendlyInvite(email);
  } catch (mailError) {
    console.error("Failed to send Calendly invite:", mailError);
  }

  return res.status(201).json({
    message:
      "Registered successfully. Check your email for a Calendly link (if configured).",
  });
}
