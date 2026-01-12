import { prisma } from "../../../../../lib/prisma";
import nodemailer from "nodemailer";

// =======================
// 📧 Email Transporter
// =======================
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465, // SSL vetëm për 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // shmang "greeting never received"
  },
});

export default async function handler(req, res) {
  // ✅ Vetëm PATCH
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.query;
    const cancelledBy = req.query.cancelledBy || "unbekannt";

    if (!id) {
      return res.status(400).json({ error: "Missing schedule ID" });
    }

    // =======================
    // 1️⃣ Fetch appointment
    // =======================
    const appt = await prisma.schedule.findUnique({
      where: { id: Number(id) },
      include: {
        user: true,
        employee: true,
      },
    });

    if (!appt) {
      return res.status(404).json({ error: "Termin nicht gefunden" });
    }

    // =======================
    // 2️⃣ Update → cancelled
    // =======================
    const updated = await prisma.schedule.update({
      where: { id: Number(id) },
      data: {
        status: "cancelled",
        // 👉 nëse më vonë shton cancelReason në model:
        // cancelReason: cancelledBy,
      },
    });

    // =======================
    // 3️⃣ Email receivers
    // =======================
    const clientEmail = appt.user?.email || null;
    const employeeEmail = appt.employee?.email || null;

    const receivers = [clientEmail, employeeEmail].filter(Boolean);

    // =======================
    // 4️⃣ Email content
    // =======================
const html = `
  <p>Guten Tag,</p>

  <p>Der folgende Termin wurde storniert.</p>

  <p><strong>Datum:</strong> ${
    appt.date ? appt.date.toLocaleDateString("de-DE") : "-"
  }</p>

  <p><strong>Zeit:</strong> ${appt.startTime || "-"}</p>

  <p><strong>Service:</strong> ${
    appt.serviceName || appt.subServiceName || "-"
  }</p>

  <p><strong>Grund:</strong> ${cancelledBy}</p>

  <br/>
  <p>Mit freundlichen Grüssen<br/>
  Prime Home Care AG</p>

  <!-- ADDED AT THE END -->

  <p>Freundliche Grüsse</p>  

  <p>
    Prime Home Care AG<br/>
    Birkenstrasse 49<br/>
    CH-6343 Rotkreuz<br/>
    info@phc.ch<br/>
    www.phc.ch
  </p>

  <p>
    <a
      href="https://phc-website-vert.vercel.app/AVB"
      target="_blank"
      rel="noopener noreferrer"
      style="text-decoration: underline; color: #04436F; font-weight: 500; cursor: pointer;"
    >
      AVB und Nutzungsbedingungen
    </a>
  </p>
`;


    // =======================
    // 5️⃣ Send email
    // =======================
    if (receivers.length > 0) {
      await transporter.sendMail({
        from: `"Prime Home Care AG" <${process.env.SMTP_USER}>`,
        to: receivers,
        subject: "Termin wurde storniert",
        html,
      });
    }

    // =======================
    // ✅ Success
    // =======================
    return res.status(200).json({
      success: true,
      message: "Termin storniert & Email gesendet",
      cancelledBy,
      updated,
    });

  } catch (err) {
    console.error("❌ Fehler bei Stornierung:", err);
    return res.status(500).json({
      error: "Fehler beim Stornieren des Termins",
    });
  }
}
