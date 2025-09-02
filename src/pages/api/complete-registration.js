import Stripe from 'stripe';
import { prisma } from "../../lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: "❌ Missing session_id" });
  }

  try {
    // ✅ Get Stripe session
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session || session.payment_status !== 'paid') {
      return res.status(400).json({ error: "❌ Payment not completed" });
    }

    const userId = session.metadata?.userId;
    const paymentIntentId = session.payment_intent;

    if (!userId) {
      return res.status(400).json({ error: "❌ userId missing in metadata" });
    }

    // ✅ Update the user with paymentIntentId
    await prisma.user.update({
      where: { id: userId },
      data: { paymentIntentId },
    });

    // ✅ Return userId for frontend to fetch user data
    res.status(200).json({ success: true, userId });
  } catch (err) {
    console.error("❌ Error in complete-registration:", err);
    res.status(500).json({ error: "❌ Internal server error" });
  }
}
