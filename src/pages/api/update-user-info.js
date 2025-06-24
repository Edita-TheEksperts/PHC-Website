import { prisma } from "../../lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET; // Make sure this is defined

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  console.log("📨 Authorization Header:", authHeader);
  console.log("🔑 Extracted Token:", token);

  if (!token) {
    console.log("❌ Token missing");
    return res.status(401).json({ message: "Token missing" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
    console.log("✅ Decoded JWT:", decoded);
  } catch (err) {
    console.error("❌ JWT verification error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  const email = decoded.email;
  console.log("📧 Email from token:", email);

  if (!email) {
    console.log("❌ Email missing in token payload");
    return res.status(400).json({ message: "Invalid token payload" });
  }

  const {
    languages,
    otherLanguage,
    pets,
    allergies,
    specialRequests,
    emergencyContactName,
    emergencyContactPhone,
  } = req.body;

  console.log("📦 Incoming data:", {
    languages,
    pets,
    allergies,
    specialRequests,
    emergencyContactName,
    emergencyContactPhone,
  });

  try {
    const result = await prisma.user.update({
      where: { email },
    data: {
  languages: Array.isArray(languages) ? languages.join(", ") : (languages || ""),
  ...(pets !== undefined && { pets }),
  ...(allergies !== undefined && { allergies }),
  ...(specialRequests !== undefined && { specialRequests }),
  ...(emergencyContactName !== undefined && { emergencyContactName }),
  ...(emergencyContactPhone !== undefined && { emergencyContactPhone }),
}

    });

    console.log("✅ Prisma update success:", result);

    return res.status(200).json({ message: "User info updated" });
  } catch (error) {
    console.error("❌ Prisma update error:", error);
    return res.status(500).json({
      message: "Error updating info",
      error: error.message,
    });
  }
}
