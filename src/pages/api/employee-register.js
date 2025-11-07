import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  console.log("📩 API called!", req.body);

  try {
    const data = req.body;

    // ✅ Kontroll për fusha të domosdoshme
    if (!data.firstName || !data.lastName || !data.email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ Kontroll nëse ekziston emaili
    const existingEmployee = await prisma.employee.findUnique({
      where: { email: data.email },
    });

    if (existingEmployee) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // ✅ Gjenero password nëse mungon
    const plainPassword = data.password || Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // ✅ Normalizim për fushat që prisma i kërkon me tip specifik
    const normalizedAvailabilityDays = Array.isArray(data.availabilityDays)
      ? data.availabilityDays.map((d) =>
          typeof d === "object"
            ? `${d.day}: ${d.startTime}-${d.endTime}`
            : String(d)
        )
      : [];

    const employee = await prisma.employee.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || null,
        address: data.address || null,
        residencePermit: data.residencePermit || null,
        experienceYears: data.experienceYears || "0",
        experienceWhere: data.experienceWhere || null,
        hasLicense: Boolean(data.hasLicense),
        availabilityFrom: new Date(data.availabilityFrom),
        availabilityDays: normalizedAvailabilityDays,
        servicesOffered: data.servicesOffered || [],
        howFarCanYouTravel: data.howFarCanYouTravel || null,
        profilePhoto: data.profilePhoto || null,
        cvFile: data.cvFile || null,
        passportFile: data.passportFile || null,
        drivingLicenceFile: data.drivingLicenceFile || null,
        canton: data.canton || null,
        country: data.country || null,
        nationality: data.nationality || null,
        hasCar: data.hasCar || null,
        carAvailableForWork: data.carAvailableForWork || null,
        onCallAvailable: data.onCallAvailable || null,
        nightShifts: data.nightShifts || null,
        worksWithAnimals: data.worksWithAnimals || null,
        desiredWeeklyHours: data.desiredWeeklyHours || null,
        smoker: data.smoker || null,
        specialTrainings: data.specialTrainings || [],
        communicationTraits: data.communicationTraits || [],
        dietaryExperience: data.dietaryExperience || [],
        languages: data.languages || [],
        howDidYouHearAboutUs: data.howDidYouHearAboutUs || null,
        visaFile: data.visaFile || null,
        password: hashedPassword,
      },
    });

    console.log("✅ Employee saved:", employee.email);

    // ✅ Dërgo email pas regjistrimit
    await sendInterviewEmail(data.email, plainPassword);

    return res.status(201).json({
      message: "Employee registered successfully and email sent!",
    });
  } catch (error) {
    console.error("❌ Error saving employee:", error);
    return res
      .status(400)
      .json({ message: "Error saving employee", error: error.message });
  }
}

// ✅ Funksioni për dërgimin e emailit
async function sendInterviewEmail(userEmail, tempPassword) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Prime Home Care AG" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: "Ihre Bewerbung bei Prime Home Care AG",
      html: `
        <p>Sehr geehrte/r Bewerber/in,</p>
        <p>Vielen Dank für Ihre Bewerbung bei Prime Home Care AG.</p>
        <p>Wir haben Ihre Unterlagen erhalten und werden uns bald bei Ihnen melden.</p>
        <p>Ihr temporäres Passwort lautet: <strong>${tempPassword}</strong></p>
        <p>Freundliche Grüsse,<br>Ihr PHC-Team</p>
      `,
    });

    console.log("✅ Email sent successfully to:", userEmail);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
}
