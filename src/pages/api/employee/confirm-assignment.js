import { prisma } from "../../../lib/prisma";
import nodemailer from "nodemailer";

// Email transport setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { assignmentId, action } = req.body;

    if (!assignmentId || !["accepted", "rejected"].includes(action)) {
      return res.status(400).json({ message: "Invalid input" });
    }

    // Update confirmation status
    const updated = await prisma.assignment.update({
      where: { id: assignmentId },
      data: {
        confirmationStatus: action,
      },
      include: {
        user: { include: { services: true } },
        employee: true,
      },
    });

    // ✉️ If accepted: notify client
    if (action === "accepted") {
      const { user, employee, serviceName, firstDate } = updated;

      await transporter.sendMail({
        from: `"PHC Team" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: "Ihr Einsatz wurde bestätigt",
        html: `
          <p>Hallo ${user.firstName || ""} ${user.lastName || ""},</p>
          <p>Ihr Einsatz wurde erfolgreich bestätigt!</p>
          <p><strong>Betreuer:</strong> ${employee.firstName} ${employee.lastName}</p>
          <p><strong>Kontakt:</strong> ${employee.email} ${employee.phone ? ` | ${employee.phone}` : ""}</p>
          <p><strong>Service:</strong> ${serviceName || (user.services?.map(s => s.name).join(", ") || "—")}</p>
          <p><strong>Startdatum:</strong> ${new Date(updated.createdAt).toLocaleDateString("de-DE")}</p>
          <p>Wir danken Ihnen für Ihr Vertrauen.<br/>Ihr PHC Team</p>
        `,
      });
    }

    // ❗ If rejected: count how many and warn if needed
    if (action === "rejected") {
      const employeeId = updated.employee.id;

      const rejectedCount = await prisma.assignment.count({
        where: {
          employeeId,
          confirmationStatus: "rejected",
        },
      });

      const warningSent = await prisma.rejectionWarning.findFirst({
        where: { employeeId },
      });

      if (rejectedCount >= 5 && !warningSent) {
        await transporter.sendMail({
          from: `"Prime Home Care AG" <${process.env.SMTP_USER}>`,
          to: updated.employee.email,
          subject: "Rückmeldung zu Ihren Einsatzentscheidungen",
          html: `
            <p>Liebe ${updated.employee.firstName},</p>
            <p>Uns ist aufgefallen, dass Sie in letzter Zeit mehrere Einsatzvorschläge abgelehnt haben.</p>
            <p>Bitte beachten Sie, dass eine regelmässige Ablehnung von Einsätzen unsere Einsatzplanung erschwert.</p>
            <p>Gerne möchten wir mit Ihnen besprechen, ob es bestimmte Gründe gibt und wie wir Sie besser unterstützen können.</p>
            <p><a href="https://calendly.com/your-link">Jetzt Termin buchen</a></p>
            <p>Freundliche Grüsse<br/>Prime Home Care AG</p>
          `,
        });

        await prisma.rejectionWarning.create({
          data: {
            employeeId,
            sentAt: new Date(),
          },
        });
      }
    }

    res.status(200).json({ status: "updated" });
  } catch (err) {
    console.error("❌ Fehler bei der Bestätigung:", err);
    res.status(500).json({ message: "Serverfehler" });
  }
}
