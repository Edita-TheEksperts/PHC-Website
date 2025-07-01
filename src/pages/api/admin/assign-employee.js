import { prisma } from "../../../lib/prisma";
import nodemailer from "nodemailer";

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
    const { userId, employeeId } = req.body;

    if (!userId || !employeeId) {
      return res.status(400).json({ message: "Missing userId or employeeId" });
    }

    // Complete old assignments
    await prisma.assignment.updateMany({
      where: { userId, status: "active" },
      data: { status: "completed" },
    });

    // Create new one
  const assignment = await prisma.assignment.create({
  data: {
    userId,
    employeeId,
    status: "active",
    confirmationStatus: "pending",
    serviceName: req.body.serviceName,
    firstDate: req.body.firstDate ? new Date(req.body.firstDate) : null,
  },
});


    // Fetch employee details
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    // ✅ Send email to employee
    await transporter.sendMail({
      from: `"PHC Admin" <${process.env.SMTP_USER}>`,
      to: employee.email,
      subject: "Neue Zuweisung erhalten",
      html: `
        <p>Hallo ${employee.firstName},</p>
        <p>Sie wurden einem neuen Kunden zugewiesen.</p>
        <p>Bitte loggen Sie sich in Ihr Dashboard ein, um die Zuweisung zu bestätigen oder abzulehnen.</p>
        <p>Mit freundlichen Grüßen,<br/>Ihr PHC Team</p>
      `,
    });

    res.status(200).json({ assignment });
  } catch (err) {
    console.error("Error assigning employee:", err);
    res.status(500).json({ message: "Failed to assign employee" });
  }
}
