import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { form, totalAmount } = req.body;

  if (!form || !totalAmount || totalAmount <= 0) {
    return res.status(400).json({ error: 'Missing form data or invalid amount' });
  }

  try {
    // ✅ Step 1: Save user to DB
    const userRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/register-user-prepayment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ form }),
    });

    if (!userRes.ok) {
      const err = await userRes.json();
      return res.status(500).json({ error: "User could not be saved", details: err.message });
    }

    const { userId } = await userRes.json();

    // ✅ Step 2: Get full user with services
    const userDataRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/get-user-by-id?id=${userId}`);
    const user = await userDataRes.json();

    const service = user.services?.[0]?.name || 'allgemein';
    const postalCode = user.carePostalCode || user.postalCode || '';

    // ✅ Step 3: Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'chf',
            product_data: { name: 'PHC Dienstleistung' },
            unit_amount: Math.round(totalAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
success_url: `http://localhost:3000/register-client?service=${encodeURIComponent(service)}&postalCode=${postalCode}&step=4&session_id={CHECKOUT_SESSION_ID}`,
cancel_url: `http://localhost:3000/register-client?service=${encodeURIComponent(service)}&postalCode=${postalCode}&step=3`,



     metadata: {
  userId,
  email: form.email,
  firstName: form.firstName,
  lastName: form.lastName,
  service: form.service,
  postalCode: form.postalCode
}

    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("🔥 Fehler beim Stripe Checkout:", err);
    res.status(500).json({ error: err.message || "Stripe session creation failed" });
  }
}
