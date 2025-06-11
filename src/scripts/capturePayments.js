import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function capturePendingPayments() {
  try {
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

    // Find users with firstDate older than 24h, have paymentIntentId, and payment not captured
    const usersToCharge = await prisma.user.findMany({
      where: {
        firstDate: { lte: cutoffDate },
        paymentIntentId: { not: null },
        paymentCaptured: false,
      },
    });

    console.log(`Found ${usersToCharge.length} users to capture payment for.`);

    for (const user of usersToCharge) {
      try {
        // Capture payment intent on Stripe
        const paymentIntent = await stripe.paymentIntents.capture(user.paymentIntentId);

        if (paymentIntent.status === "succeeded") {
          // Update user in DB to mark payment as captured
          await prisma.user.update({
            where: { id: user.id },
            data: { paymentCaptured: true },
          });
          console.log(`Payment captured for user ${user.id} (${user.email})`);
        } else {
          console.warn(`Payment not captured for user ${user.id}, status: ${paymentIntent.status}`);
        }
      } catch (stripeError) {
        console.error(`Stripe capture error for user ${user.id}:`, stripeError.message);
      }
    }
  } catch (error) {
    console.error("Error in capturePendingPayments:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function once
capturePendingPayments();
