import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";

export default function FinanzenPage() {
  const [payments, setPayments] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (payment) => {
    setSelectedPayment(payment);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPayment(null);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/finances/list");
        const data = await res.json();
        setPayments(data);

        const voucherRes = await fetch("/api/finances/vouchers");
        const voucherJson = await voucherRes.json();
        setVouchers(voucherJson.vouchers || []);
      } catch (err) {
        console.error("Fehler beim Laden:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <AdminLayout>Finanzen werden geladen…</AdminLayout>;

  // GROUP PAYMENTS
  const bezahlt = payments.filter((p) => p.status === "bezahlt");
  const offen = payments.filter((p) => p.status === "offen");
  const fehler = payments.filter((p) => p.status === "fehler");

  // SECTION WRAPPER
  const renderSection = (title, children) => (
    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
      {children}
    </div>
  );

  // MODAL COMPONENT
  const PaymentModal = () => {
    if (!modalOpen || !selectedPayment) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
        <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl relative">
          {/* CLOSE BUTTON */}
          <button
            onClick={closeModal}
            className="absolute top-3 right-3 text-gray-600 hover:text-black"
          >
            ✖
          </button>

          <h2 className="text-2xl font-bold mb-4">Payment Details</h2>

          <div className="space-y-2">
            <p><strong>Name:</strong> {selectedPayment.name}</p>
            <p><strong>Email:</strong> {selectedPayment.email}</p>
            <p><strong>Amount:</strong> CHF {selectedPayment.amount.toFixed(2)}</p>
            <p><strong>Status:</strong> {selectedPayment.status}</p>
            <p><strong>Stripe Status:</strong> {selectedPayment.stripeStatus}</p>

            {selectedPayment.lastError && (
              <p className="text-red-500">
                <strong>Error:</strong> {selectedPayment.lastError}
              </p>
            )}

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Schedules</h3>

              <div className="max-h-40 overflow-y-auto border p-3 rounded-lg bg-gray-50">
                {selectedPayment.schedules.length === 0 ? (
                  <p className="text-gray-600 italic">
                    No schedules for this user.
                  </p>
                ) : (
                  selectedPayment.schedules.map((s, i) => (
                    <div key={i} className="border-b pb-2 mb-2">
                      <p><strong>Day:</strong> {s.day}</p>
                      <p><strong>Hours:</strong> {s.hours}</p>
                      <p><strong>Date:</strong> {s.date ? new Date(s.date).toLocaleDateString() : "Unknown"}</p>
                      <p><strong>Captured:</strong> {s.captured ? "Yes" : "No"}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="p-6">

        {/* MODAL */}
        <PaymentModal />

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Finanzübersicht
        </h1>

        {/* GRID: 2 SECTIONS TOP — 2 SECTIONS BOTTOM */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* 🟢 PAID */}
          {renderSection(
            "🟢 Bezahlte Zahlungen",
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {bezahlt.length === 0 ? (
                <p className="text-gray-500 italic">Keine bezahlten Zahlungen</p>
              ) : (
                bezahlt.map((p) => (
                  <div
                    key={p.userId + p.amount}
                    onClick={() => openModal(p)}
                    className="cursor-pointer hover:shadow-xl transition p-4 bg-green-50 border border-green-300 rounded-lg"
                  >
                    <p><strong>Kunde:</strong> {p.name}</p>
                    <p><strong>Betrag:</strong> CHF {p.amount.toFixed(2)}</p>
                    <p><strong>Status:</strong> bezahlt</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 🟡 OPEN */}
          {renderSection(
            "🟡 Ausstehende Zahlungen",
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {offen.length === 0 ? (
                <p className="text-gray-500 italic">Keine offenen Zahlungen</p>
              ) : (
                offen.map((p) => (
                  <div
                    key={p.userId + p.amount}
                    onClick={() => openModal(p)}
                    className="cursor-pointer hover:shadow-xl transition p-4 bg-yellow-50 border border-yellow-300 rounded-lg"
                  >
                    <p><strong>Kunde:</strong> {p.name}</p>
                    <p><strong>Betrag:</strong> CHF {p.amount.toFixed(2)}</p>
                    <p><strong>Status:</strong> offen</p>
                    {p.lastError && (
                      <p className="text-red-500 text-sm">⚠️ {p.lastError}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* 🔴 ERROR */}
          {renderSection(
            "🔴 Fehlgeschlagene / Stornierte Zahlungen",
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {fehler.length === 0 ? (
                <p className="text-gray-500 italic">Keine fehlerhaften Zahlungen</p>
              ) : (
                fehler.map((p) => (
                  <div
                    key={p.userId + p.amount}
                    onClick={() => openModal(p)}
                    className="cursor-pointer hover:shadow-xl transition p-4 bg-red-50 border border-red-300 rounded-lg"
                  >
                    <p><strong>Kunde:</strong> {p.name}</p>
                    <p><strong>Betrag:</strong> CHF {p.amount.toFixed(2)}</p>
                    <p><strong>Status:</strong> fehler</p>
                    {p.lastError && (
                      <p className="text-red-600 text-sm">Grund: {p.lastError}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* 🎟️ VOUCHERS */}
          {renderSection(
            "🎟️ Gutscheine",
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {vouchers.length === 0 ? (
                <p className="text-gray-500 italic">Keine Gutscheine vorhanden</p>
              ) : (
                vouchers.map((v) => (
                  <div
                    key={v.id}
                    className="p-4 border bg-gray-50 rounded-lg shadow-sm"
                  >
                    <p><strong>Code:</strong> {v.code}</p>
                    <p><strong>Status:</strong> {v.isActive ? "Aktiv" : "Inaktiv"}</p>
                    <p><strong>Verwendet:</strong> {v.usedCount}x</p>
                    <p>
                      <strong>Wert:</strong>{" "}
                      {v.discountType === "percentage"
                        ? `${v.discountValue}%`
                        : `CHF ${v.discountValue}`}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>
    </AdminLayout>
  );
}
