import Stripe from "stripe";
import { prisma } from "../../../lib/prisma"; 

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    // get users who have a payment intent
    const users = await prisma.user.findMany({
      where: { paymentIntentId: { not: null } },
      include: { schedules: true }
    });

    const results = [];

    for (const user of users) {
      const intent = await stripe.paymentIntents.retrieve(
        user.paymentIntentId
      );

      const status =
        intent.status === "succeeded"
          ? "bezahlt"
          : intent.status === "requires_payment_method"
          ? "offen"
          : intent.status === "requires_capture"
          ? "offen"
          : "fehler";

      const amount =
        intent.status === "succeeded"
          ? intent.amount_received / 100
          : intent.amount / 100;

      results.push({
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        amount,
        status,
        schedules: user.schedules.map(s => ({
          day: s.day,
          hours: s.hours,
          captured: s.captured,
          date: s.date
        })),
        stripeStatus: intent.status,
        lastError: intent.last_payment_error?.message || null,
      });
    }

    res.json(results);
  } catch (err) {
    console.error("❌ Error fetching finances:", err);
    res.status(500).json({ message: "Server error" });
  }
  
}
