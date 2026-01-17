import { prisma } from "../../../lib/prisma";
import nodemailer from "nodemailer";
import { sendApprovalEmail } from "../../../lib/emailHelpers";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
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

    // ✅ Always update assignment first
    const updated = await prisma.assignment.update({
      where: { id: assignmentId },
      data: {
        confirmationStatus: action,
        status: "active",
      },
      include: {
        user: {
          include: {
            services: true,
            schedules: true,
          },
        },
        employee: true,
      },
    });

    // =========================
    // 📧 EMAILS (SAFE MODE)
    // =========================
    if (action === "confirmed") {
      try {
        const { sendAssignmentContractEmail } = await import("../../../lib/emailHelpers.js");
        await sendAssignmentContractEmail(updated);
      } catch (emailError) {
        console.error("⚠️ Assignment contract email failed:", emailError);
      }
    }

    if (action === "rejected") {
      try {
        const employeeId = updated.employee.id;

        const rejectedCount = await prisma.assignment.count({
          where: { employeeId, confirmationStatus: "rejected" },
        });

        const warningSent = await prisma.rejectionWarning.findFirst({
          where: { employeeId },
        });

        if (rejectedCount >= 3 && !warningSent) {
          const { subject, body } = await getTemplate("rejectionWarning", {
            employeeFirstName: updated.employee.firstName,
          });

          await transporter.sendMail({
            from: `"Prime Home Care AG" <${process.env.SMTP_USER}>`,
            to: updated.employee.email,
            cc: "admin@phc.ch",
            subject,
            html: body,
          });

          await prisma.rejectionWarning.create({
            data: { employeeId, sentAt: new Date() },
          });
        }

      } catch (emailError) {
        console.error("⚠️ Rejection email failed:", emailError);
      }
    }

    // ✅ Always return success
    res.status(200).json({ status: "updated", assignment: updated });

  } catch (err) {
    console.error("❌ Fehler bei der Bestätigung:", err);
    res.status(500).json({ message: "Serverfehler" });
  }
}

