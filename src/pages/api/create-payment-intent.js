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
         capture_method: 'manual', // <-- manual capture for delayed payment
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
