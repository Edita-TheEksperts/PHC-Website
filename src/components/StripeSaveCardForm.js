import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";

export default function SaveCardForm({ userId, customerId, form }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSaveCard = async () => {
    setLoading(true);

    // Step 1: Create SetupIntent on backend
    const res = await fetch('/api/create-setup-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId }),
    });

    const { clientSecret } = await res.json();

    // Step 2: Confirm card on frontend
    const result = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
        },
      },
    });

    if (result.error) {
      console.error("❌ Error saving card:", result.error.message);
      alert("Card could not be saved. " + result.error.message);
    } else {
      const paymentMethodId = result.setupIntent.payment_method;
      console.log("✅ Saved payment method:", paymentMethodId);

      // Step 3: Save paymentMethodId to your DB
      await fetch("/api/save-payment-method", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, paymentMethodId }),
      });

      alert("✅ Card saved for future use.");
    }

    setLoading(false);
  };

  return (
    <div>
      <CardElement />
      <button onClick={handleSaveCard} disabled={!stripe || loading}>
        {loading ? "Saving..." : "Save Card"}
      </button>
    </div>
  );
}
