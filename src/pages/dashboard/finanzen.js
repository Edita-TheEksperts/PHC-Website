import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ClientDashboard2 from "../../components/ClientDashboard2";
import { ChevronDown, ChevronUp, Menu, X } from "lucide-react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function FinanzenPage() {
  const router = useRouter();

  // UI
  const [isOpen, setIsOpen] = useState(false);
  const [showPaymentBox, setShowPaymentBox] = useState(true);
  const [editingCard, setEditingCard] = useState(false);
  const [cardLoading, setCardLoading] = useState(false);

  // User
  const [userData, setUserData] = useState(null);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState(null);

  // Stripe (ONLY ONCE ✅)
  const stripe = useStripe();
  const elements = useElements();

  /* =========================
     AUTH + USER LOAD
  ========================= */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("userToken");
    if (!token) {
      router.replace("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/getUserData", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Unauthorized");

        const user = await res.json();
        setUserData(user);
      } catch (err) {
        console.error("❌ User load error:", err);
        localStorage.removeItem("userToken");
        router.replace("/login");
      }
    };

    fetchUser();
  }, [router]);

  /* =========================
     FETCH PAYMENT METHOD
  ========================= */
  const fetchPaymentMethod = async () => {
    if (!userData?.stripeCustomerId) return;

    try {
      const res = await fetch(
        `/api/get-payment-method?customerId=${userData.stripeCustomerId}`
      );
      const data = await res.json();
      setPaymentMethod(data.paymentMethod || null);
    } catch (err) {
      console.error("❌ Payment load error:", err);
    }
  };

  useEffect(() => {
    if (userData?.stripeCustomerId) {
      fetchPaymentMethod();
    }
  }, [userData]);

  /* =========================
     UPDATE CARD
  ========================= */
  const handleUpdateCard = async () => {
    if (!stripe || !elements) return;

    setCardLoading(true);

    const { paymentMethod: pm, error } =
      await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });

    if (error) {
      alert(error.message);
      setCardLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/update-payment-method", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userData.id,
          customerId: userData.stripeCustomerId,
          newPaymentMethodId: pm.id,
        }),
      });

      const data = await res.json();
      setCardLoading(false);

      if (data.success) {
        alert("Zahlungsmethode erfolgreich aktualisiert!");
        setEditingCard(false);
        fetchPaymentMethod(); // 🔄 refresh
      } else {
        alert("Fehler beim Speichern der Zahlungsmethode.");
      }
    } catch (err) {
      console.error(err);
      alert("Serverfehler bei Zahlungsupdate");
      setCardLoading(false);
    }
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* MOBILE NAV */}
      <div className="lg:hidden bg-[#B99B5F] text-white fixed top-0 left-0 w-full z-50">
        <div className="flex items-center justify-between p-4">
          <h1
            className="text-xl font-bold cursor-pointer"
            onClick={() => router.push("/client-dashboard")}
          >
            PHC
          </h1>
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-72 bg-[#B99B5F] text-white flex-col p-6">
        <h1
          className="text-4xl font-bold text-center mb-12 cursor-pointer"
          onClick={() => router.push("/client-dashboard")}
        >
          PHC
        </h1>
        <ul className="space-y-6 text-lg">
          <li onClick={() => router.push("/client-dashboard")}>Dashboard</li>
          <li onClick={() => router.push("/dashboard/formular")}>
            Persönliche Informationen
          </li>
          <li onClick={() => router.push("/dashboard/finanzen")}>
            Finanzen
          </li>
                                   <li
                onClick={() => {
                  router.push("/dashboard/kundigung");
                  setIsOpen(false);
                }}
                className="cursor-pointer hover:text-red-400"
              >
                Kündigung
              </li>
        </ul>
      </aside>
<main className="flex-1 pt-24 lg:pt-12 px-6">
  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

    {/* LEFT: MONATSÜBERSICHT */}
    <section className=" flex flex-col">
      <ClientDashboard2 userId={userData?.id} />
    </section>

    {/* RIGHT: PAYMENT METHOD */}
    <section className="bg-white border rounded-3xl shadow-2xl flex flex-col">
      <header
        onClick={() => setShowPaymentBox((p) => !p)}
        className="flex justify-between items-center px-6 py-4 cursor-pointer border-b"
      >
        <h3 className="text-2xl font-semibold text-[#B99B5F]">
          Zahlungsmethode
        </h3>
        {showPaymentBox ? <ChevronUp /> : <ChevronDown />}
      </header>

      {showPaymentBox && (
        <div className="p-6 space-y-4 flex-1">
          {!paymentMethod && (
            <p className="italic text-gray-500">
              Keine Zahlungsmethode gespeichert.
            </p>
          )}

          {paymentMethod && (
            <>
              <p>
                <strong>Kartentyp:</strong> {paymentMethod.brand}
              </p>
              <p>
                <strong>Nummer:</strong> **** **** **** {paymentMethod.last4}
              </p>
              <p>
                <strong>Ablaufdatum:</strong>{" "}
                {paymentMethod.exp_month}/{paymentMethod.exp_year}
              </p>
            </>
          )}

          <button
            onClick={() => setEditingCard(true)}
            className="mt-auto bg-[#B99B5F] text-white py-2 px-4 rounded-lg"
          >
            Zahlungsmethode ändern
          </button>
        </div>
      )}
    </section>

  </div>
</main>


      {/* CARD MODAL */}
      {editingCard && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <button
              onClick={() => setEditingCard(false)}
              className="float-right"
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold text-[#B99B5F] mb-4">
              Neue Zahlungsmethode
            </h3>

            <CardElement className="border px-3 py-3 rounded-lg" />

            <button
              disabled={cardLoading}
              onClick={handleUpdateCard}
              className="w-full bg-[#04436F] text-white py-3 rounded-lg mt-6"
            >
              {cardLoading
                ? "Wird gespeichert…"
                : "Zahlungsmethode aktualisieren"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
