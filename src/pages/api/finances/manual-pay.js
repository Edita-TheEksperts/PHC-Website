// pages/api/finances/manual-pay.js
import Stripe from "stripe";
import { prisma } from "../../../lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { paymentIntentId, userId } = req.body;

  try {
    await stripe.paymentIntents.update(paymentIntentId, {
      metadata: { manualPaid: "true" }
    });


    return res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error" });
  }
}
