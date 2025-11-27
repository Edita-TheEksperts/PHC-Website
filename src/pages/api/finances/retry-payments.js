// pages/api/finances/retry-payments.js
import Stripe from "stripe";
import { prisma } from "../../../lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {

  if (req.headers.authorization !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "GET") return res.status(405).end();

  const now = new Date();

  try {
    const users = await prisma.user.findMany({
      where: {
        paymentIntentId: { not: null },
        manualPaid: false,
        phc: false,
        nextAttempt: { lte: now },
        attempts: { lt: 3 }
      }
    });

    for (const user of users) {
      try {
        const intent = await stripe.paymentIntents.retrieve(user.paymentIntentId);

        if (intent.status !== "requires_capture") {
          throw new Error("Not capturable");
        }

        await stripe.paymentIntents.capture(user.paymentIntentId);

        await prisma.user.update({
          where: { id: user.id },
          data: {
            paymentCaptured: true,
            attempts: user.attempts + 1,
            nextAttempt: null,
            reminderCount: user.reminderCount + 1
          }
        });

      } catch (err) {
        const attempts = user.attempts + 1;

        if (attempts >= 3) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              phc: true,
              nextAttempt: null,
              attempts
            }
          });

        } else {
          const next = new Date();
          next.setHours(next.getHours() + 48);

          await prisma.user.update({
            where: { id: user.id },
            data: {
              attempts,
              reminderCount: user.reminderCount + 1,
              nextAttempt: next
            }
          });
        }
      }
    }

    res.status(200).json({ ok: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
