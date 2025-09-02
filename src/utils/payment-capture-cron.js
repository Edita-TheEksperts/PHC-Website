import Stripe from "stripe";
import { subHours } from "date-fns";
import { prisma } from "../lib/prisma.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function chargeUnpaidUsers() {
  const now = new Date();
  const compareTime = subHours(now, 24);

  const schedules = await prisma.schedule.findMany({
    where: {
      captured: false,
      date: { lte: compareTime },
      user: {
        paymentIntentId: { not: null }
      }
    },
    include: { user: true }
  });

for (const schedule of schedules) {
  try {
    const intentId = schedule.user.paymentIntentId;

    const capture = await stripe.paymentIntents.capture(intentId);

    await prisma.schedule.update({
      where: { id: schedule.id },
      data: { captured: true }
    });

  } catch (err) {
    console.error(`❌ Error capturing for schedule ${schedule.id}:`, err.message);
  }
}
}
