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

// 🔹 Helper to load template and replace {{variables}}
async function getTemplate(name, variables) {
  const template = await prisma.emailTemplate.findUnique({ where: { name } });
  if (!template) throw new Error(`Template ${name} not found`);

  let body = template.body;
  for (const key in variables) {
    body = body.replace(new RegExp(`{{${key}}}`, "g"), variables[key] || "");
  }

  return { subject: template.subject, body };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { assignmentId, action } = req.body;

if (!assignmentId || !["confirmed", "rejected"].includes(action)) {
  return res.status(400).json({ message: "Invalid input" });
}


    // Update confirmation status
    const updated = await prisma.assignment.update({
      where: { id: assignmentId },
      data: { confirmationStatus: action },
      include: {
        user: { include: { services: true } },
        employee: true,
      },
    });

    // ✉️ If accepted: notify client
    if (action === "accepted") {
      const { user, employee, serviceName } = updated;

      const { subject, body } = await getTemplate("assignmentAccepted", {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        employeeName: `${employee.firstName} ${employee.lastName}`,
        employeeEmail: employee.email,
        employeePhone: employee.phone || "",
        serviceName: serviceName || (user.services?.map(s => s.name).join(", ") || "—"),
        startDate: new Date(updated.createdAt).toLocaleDateString("de-DE"),
      });

      await transporter.sendMail({
        from: `"PHC Team" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject,
        html: body,
      });
    }

    // ❗ If rejected: count how many and warn if needed
    if (action === "rejected") {
      const employeeId = updated.employee.id;

      const rejectedCount = await prisma.assignment.count({
        where: { employeeId, confirmationStatus: "rejected" },
      });

      const warningSent = await prisma.rejectionWarning.findFirst({
        where: { employeeId },
      });

      if (rejectedCount >= 5 && !warningSent) {
        const { subject, body } = await getTemplate("rejectionWarning", {
          employeeFirstName: updated.employee.firstName,
        });

        await transporter.sendMail({
          from: `"Prime Home Care AG" <${process.env.SMTP_USER}>`,
          to: updated.employee.email,
          subject,
          html: body,
        });

        await prisma.rejectionWarning.create({
          data: { employeeId, sentAt: new Date() },
        });
      }
    }

    res.status(200).json({ status: "updated" });
  } catch (err) {
    console.error("❌ Fehler bei der Bestätigung:", err);
    res.status(500).json({ message: "Serverfehler" });
  }
}
