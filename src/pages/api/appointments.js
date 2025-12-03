import { prisma } from "../../lib/prisma";
import Stripe from "stripe";
import nodemailer from "nodemailer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default async function handler(req, res) {
  // ---------------- GET ----------------
if (req.method === "GET") {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const schedules = await prisma.schedule.findMany({
      where: { userId: String(userId) },
      orderBy: { date: "asc" },
      select: {
        id: true,
        day: true,
        startTime: true,
        hours: true,
        date: true,
        serviceName: true,
        subServiceName: true,
        status: true,
      },
    });

    const formatted = schedules.map((s) => ({
      ...s,
      date: s.date ? s.date.toISOString() : null,
    }));

    return res.status(200).json(formatted);
  } catch (err) {
    console.error("❌ Error fetching schedules:", err);
    return res.status(500).json({ error: "Failed to fetch schedules" });
  }
}

  // ---------------- POST ----------------
  if (req.method === "POST") {
    try {
      if (!req.body) {
        return res.status(400).json({ error: "Missing request body" });
      }
      console.log("📩 POST /appointments body:", req.body);

      const { date, time, service, subService, userId, hours } = req.body;

      const parsedDate = date ? new Date(date) : new Date();

      if (!userId || !time) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newAppt = await prisma.schedule.create({
        data: {
          day: parsedDate.toLocaleDateString("de-DE", { weekday: "long" }),
          date: parsedDate,
          startTime: time,
          hours: hours || 2,
          user: { connect: { id: userId } },
          serviceName: service || null,
          subServiceName: subService || null,
          status: "active",
        },
        include: { user: { select: { email: true, firstName: true, lastName: true } } },
      });

      try {
        await sendEmail({
          to: newAppt.user.email,
          subject: "Ihre Terminbestätigung bei Prime Home Care AG",
          html: `
            <p>Sehr geehrte/r ${newAppt.user.firstName} ${newAppt.user.lastName},</p>
            <p>Wir bestätigen Ihren Termin am <strong>${newAppt.day}, ${new Date(newAppt.date).toLocaleDateString("de-DE")}</strong> um <strong>${newAppt.startTime}</strong> Uhr.</p>
            <p>Dauer: ${newAppt.hours} Stunden</p>
            <p>Vielen Dank für Ihr Vertrauen.<br/>Prime Home Care AG</p>
          `,
        });
        console.log("✅ Termin-Email gesendet:", newAppt.user.email);
      } catch (err) {
        console.error("❌ Fehler beim Senden der Termin-Email:", err);
      }

      return res.status(201).json(newAppt);
    } catch (err) {
      console.error("Error creating appointment:", err);
      return res.status(500).json({ error: "Failed to create appointment" });
    }
  }


// ---------------- PUT ----------------
if (req.method === "PUT") {
  try {
    const { id, update } = req.body;

    let nextData = {
      startTime: update.startTime,
      hours: update.hours ? Number(update.hours) : undefined,
      serviceName: update.serviceName,
      subServiceName: update.subServiceName,
      status: "modified" // ✅ DOMOSDOSHEM!
    };

 if (update.date) {

  const d = new Date(update.date + "T12:00:00");

  nextData.date = d;
  nextData.day = d.toLocaleDateString("de-DE", { weekday: "long" });
}


    const updated = await prisma.schedule.update({
      where: { id: Number(id) },
      data: nextData,
      select: {
        id: true,
        day: true,
        date: true,
        startTime: true,
        hours: true,
        serviceName: true,
        subServiceName: true,
        status: true,
      },
    });

    return res.status(200).json({
      ...updated,
      date: updated.date ? updated.date.toISOString() : null,
    });
  } catch (err) {
    console.error("❌ Error updating appointment:", err);
    return res.status(500).json({ error: "Failed to update appointment" });
  }
}



// ---------------- DELETE ----------------
if (req.method === "DELETE") {
  try {
    const { id, cancel, terminate, immediate } = req.query;
    if (!id) return res.status(400).json({ error: "Missing id" });

    const numericId = parseInt(id, 10);

    const appt = await prisma.schedule.findUnique({
      where: { id: numericId },
      include: {
        user: { select: { email: true, firstName: true, lastName: true } },
        transactions: true,
      },
    });

    if (!appt) return res.status(404).json({ error: "Appointment not found" });

    const transaction = appt.transactions?.[0];
    const totalAmount = transaction?.amountClient || 0;

    

    // === STORNIERUNG (Cancel) ===
    if (cancel) {
      const now = new Date();
      const apptDate = new Date(appt.date);
      const diffDays = Math.ceil((apptDate - now) / (1000 * 60 * 60 * 24));

      let refundPercent = 0;
      if (diffDays >= 14) refundPercent = 1;
      else if (diffDays >= 7) refundPercent = 0.5;
      else refundPercent = 0;

      const refundAmount = totalAmount * refundPercent;

      if (refundAmount > 0 && transaction?.paymentIntentId) {
        try {
          await stripe.refunds.create({
            payment_intent: transaction.paymentIntentId,
            amount: Math.round(refundAmount * 100),
          });
        } catch (err) {
          console.warn("⚠️ Stripe refund failed:", err.message);
        }
      }

      await prisma.schedule.update({
        where: { id: numericId },
        data: { status: "cancelled" },
      });

      if (transaction) {
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: refundAmount > 0 ? "refunded" : "cancelled" },
        });
      }

      // send cancel confirmation email
      await sendEmail({
        to: appt.user.email,
        subject: "Bestätigung Ihrer Stornierung",
        html: `
          <p>Sehr geehrte/r ${appt.user.firstName} ${appt.user.lastName},</p>
          <p>Ihr Termin am <strong>${appt.day}, ${appt.date.toLocaleDateString("de-DE")}</strong> um <strong>${appt.startTime}</strong> wurde erfolgreich storniert.</p>
          <p>Rückerstattung: ${refundPercent * 100}%</p>
          <p>Freundliche Grüsse<br/>Prime Home Care AG</p>
        `,
      });
    }

    // === KÜNDIGUNG (Terminate) ===
    if (terminate) {
      await prisma.schedule.update({
        where: { id: numericId },
        data: { status: "terminated" },
      });

      // send termination email (already handles immediate / normal case)
      await sendTerminateEmail(appt.user, appt, immediate === "true");
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Error cancelling/terminating appointment:", err);
    return res.status(500).json({ error: "Failed to cancel/terminate appointment" });
  }
}


  // ---------------- DEFAULT ----------------
  return res.status(405).json({ error: "Method not allowed" });
}
// ---------------- HELPERS ----------------
async function sendEmail({ to, subject, html }) {
  console.log("📧 Sende Mail an:", to);
  const info = await transporter.sendMail({
    from: `"Prime Home Care AG" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
  console.log("✅ Email sent:", info.messageId);
}

async function sendTerminateEmail(customer, booking, immediate = false) {
  let emailText = immediate
    ? `
      <p>Sehr geehrte/r ${customer.firstName} ${customer.lastName},</p>
      <p>Oh, schade! Wir bestätigen hiermit die fristlose Kündigung unserer Dienstleistung.</p>
      <p>Gemäss unseren AGBs wird eine Aufwandsentschädigung von <strong>CHF 300.- exkl. MwSt.</strong> berechnet.</p>
      <p>Falls Sie Fragen haben oder weitere Unterstützung benötigen, stehen wir Ihnen jederzeit gerne zur Verfügung.</p>
      <p>Wir würden uns freuen, Sie in Zukunft wieder als Kunden begrüssen zu dürfen.</p>
      <p>Freundliche Grüsse<br/>Prime Home Care AG</p>
    `
    : `
      <p>Sehr geehrte/r ${customer.firstName} ${customer.lastName},</p>
      <p>Oh, schade! Wir bestätigen hiermit die Kündigung unserer Dienstleistung.</p>
      <p>Der bereits gezahlte Betrag wird Ihnen innerhalb von <strong>48 Stunden</strong> über die ursprüngliche Zahlungsmethode zurückerstattet.</p>
      <p>Falls Sie Fragen haben oder weitere Unterstützung benötigen, stehen wir Ihnen jederzeit gerne zur Verfügung.</p>
      <p>Wir würden uns freuen, Sie in Zukunft wieder als Kunden begrüssen zu dürfen.</p>
      <p>Freundliche Grüsse<br/>Prime Home Care AG</p>
    `;

  const info = await transporter.sendMail({
    from: `"Prime Home Care AG" <${process.env.SMTP_USER}>`,
    to: customer.email,
    subject: "Bestätigung Ihrer Kündigung bei Prime Home Care AG",
    html: emailText,
  });

  console.log(`✅ Kündigungs-Email gesendet an ${customer.email} (immediate=${immediate})`, info.messageId);
}
