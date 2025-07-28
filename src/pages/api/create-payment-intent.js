// pages/api/create-payment-intent.js

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { amount } = req.body;

  try {
const paymentIntent = await stripe.paymentIntents.create({
  amount,
  currency: 'chf',
  capture_method: 'manual',
});

// ✅ This is what Stripe sends you
res.status(200).json({
  clientSecret: paymentIntent.client_secret,     // for frontend use
  paymentIntentId: paymentIntent.id,             // THIS is the "fucking number"
});

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
