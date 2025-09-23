import Stripe from "stripe";
import { prisma } from "../lib/prisma.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function addBusinessHours(date, hours) {
  let result = new Date(date);
  let remaining = hours;

  while (remaining > 0) {
    result.setHours(result.getHours() + 1);
    const day = result.getDay(); // 0 = Sunday, 6 = Saturday
    if (day !== 0 && day !== 6) {
      remaining--;
    }
  }
  return result;
}

/**
 * 📌 Calculate the final deadline for payment collection
 */
function calcCaptureDeadline(schedule, logs) {
  // përdorim schedule.date si bazë
  let baseDate = schedule.date;

  if (!baseDate) {
    console.warn(`⚠️ Schedule ${schedule.id} nuk ka date — duke përdorur tani.`);
    baseDate = new Date();
  }

  // deadline default = 48h pas shërbimit
  let deadline = addBusinessHours(baseDate, 48);
  console.log(`⏱ Default deadline pas service: ${deadline}`);

  // gjej logun e fundit relevant (nga fundi mbrapa)
  const lastRelevantLog = [...logs]
    .reverse()
    .find((log) =>
      ["employee_update_hours", "employee_update_km", "client_reject"].includes(
        log.action
      )
    );

  if (lastRelevantLog) {
    const oldDeadline = deadline;
    deadline = addBusinessHours(lastRelevantLog.createdAt, 48);
    console.log(
      `🔄 Deadline updated nga log (${lastRelevantLog.action}) nga ${oldDeadline} → ${deadline}`
    );
  }

  return deadline;
}


export async function chargeUnpaidUsers() {
  const now = new Date();

  const schedules = await prisma.schedule.findMany({
    where: {
      captured: false,
      user: {
        paymentIntentId: { not: null }
      }
    },
    include: { user: true }
  });

  for (const schedule of schedules) {
    try {
      const logs = await prisma.activityLog.findMany({
        where: { targetId: String(schedule.id) },
        orderBy: { createdAt: "asc" }
      });

      const deadline = calcCaptureDeadline(schedule, logs);

      if (deadline && now >= deadline) {
        const intentId = schedule.user.paymentIntentId;

        const paymentIntent = await stripe.paymentIntents.retrieve(intentId);

        if (paymentIntent.status === "requires_capture") {
          await stripe.paymentIntents.capture(intentId);

          await prisma.schedule.update({
            where: { id: schedule.id },
            data: { captured: true }
          });

          console.log(`✅ Captured payment for schedule ${schedule.id}`);
        } else {
          console.log(
            `⚠️ Schedule ${schedule.id} nuk u kap sepse intent është në status: ${paymentIntent.status}`
          );
        }
      } else {
        console.log(
          `⏳ Schedule ${schedule.id} ende në pritje. Deadline: ${deadline}, Now: ${now}`
        );
      }
    } catch (err) {
      console.error(
        `❌ Error capturing for schedule ${schedule.id}:`,
        err.message
      );
    }
  }
}
