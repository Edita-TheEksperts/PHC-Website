import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Not allowed" });
  }

  const { token, password } = req.body;

  // ✅ Kontrollet bazë
  if (!token) {
    return res
      .status(400)
      .json({ message: "Ungültiger oder abgelaufener Link." });
  }

  if (!password) {
    return res.status(400).json({ message: "Bitte geben Sie ein Passwort ein." });
  }

  try {
    // ✅ Gjej user sipas resetToken dhe sigurohu që nuk ka skaduar
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Ungültiger oder abgelaufener Token." });
    }

    // ✅ Bëj hash të password-it
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Ruaj passwordin dhe pastro tokenin
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return res
      .status(200)
      .json({ message: "Passwort erfolgreich gespeichert." });
  } catch (error) {
    console.error("❌ Fehler beim Speichern des Passworts:", error);
    return res.status(500).json({ message: "Fehler beim Speichern." });
  }
}
