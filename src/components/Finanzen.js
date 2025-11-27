import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";

export default function FinanzenPage() {
  const [payments, setPayments] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voucherFilter, setVoucherFilter] = useState("all");
const [voucherDateFrom, setVoucherDateFrom] = useState("");
const [voucherDateTo, setVoucherDateTo] = useState("");
const [voucherClient, setVoucherClient] = useState("");


  // ⭐ Filter state
  const [filter, setFilter] = useState("all");

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (payment) => {
    setSelectedPayment(payment);
    setModalOpen(true);
  };

const clientList = Object.values(
  vouchers
    .flatMap((v) => v.usedBy || [])
    .reduce((map, user) => {
      map[user.id] = user;
      return map;
    }, {})
);

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPayment(null);
  };
  

  // ⭐ Load data
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

  if (loading)
    return <AdminLayout>Finanzen werden geladen…</AdminLayout>;

const filterPaymentsByDate = (list) => {
  if (filter === "all") return list;

  const now = new Date();

  return list.filter((p) => {
    if (!p.paymentDate) return false;

    const d = new Date(p.paymentDate);

    if (filter === "week") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      return d >= startOfWeek;
    }

    if (filter === "month") {
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    }

    if (filter === "year") {
      return d.getFullYear() === now.getFullYear();
    }

    return true;
  });
};

const filterVouchers = (list) => {
  const now = new Date();

  return list.filter((v) => {
    const start = new Date(v.validFrom);
    const end = new Date(v.validUntil);

    // 🔸 FILTER BY QUICK RANGE
    if (voucherFilter === "today") {
      const today = new Date().toDateString();
      if (start.toDateString() !== today && end.toDateString() !== today) return false;
    }

    if (voucherFilter === "week") {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      if (end < weekStart) return false;
    }

    if (voucherFilter === "month") {
      if (
        start.getMonth() !== now.getMonth() ||
        start.getFullYear() !== now.getFullYear()
      )
        return false;
    }

    if (voucherFilter === "nextMonth") {
      const next = new Date(now.getFullYear(), now.getMonth() + 1);
      if (
        start.getMonth() !== next.getMonth() ||
        start.getFullYear() !== next.getFullYear()
      )
        return false;
    }

    // 🔸 CUSTOM DATE RANGE
    if (voucherDateFrom) {
      if (new Date(v.validFrom) < new Date(voucherDateFrom)) return false;
    }

    if (voucherDateTo) {
      if (new Date(v.validUntil) > new Date(voucherDateTo)) return false;
    }

    // 🔸 FILTER BY CLIENT
    if (voucherClient) {
      const usedByIds = v.usedBy?.map((u) => u.id) || [];
if (!usedByIds.includes(String(voucherClient))) return false;
    }

    return true;
  });
};



  // ⭐ GROUP PAYMENTS WITH FILTER APPLIED
const bezahlt = filterPaymentsByDate(
  payments.filter((p) => p.status === "bezahlt" || p.status === "manuell")
);


  const offen = filterPaymentsByDate(
    payments.filter((p) => p.status === "offen")
  );

  const fehler = filterPaymentsByDate(
    payments.filter((p) => p.status === "fehler")
  );

  // SECTION WRAPPER
  const renderSection = (title, children) => (
    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
      {children}
    </div>
  );

const PaymentModal = () => {
  if (!modalOpen || !selectedPayment) return null;

  const {
    name,
    email,
    amount,
    status,
    stripeStatus,
    schedules,
    lastError,
    manualPaid,
    id: transactionId,
  } = selectedPayment;

  // 🔍 Inteligjenca e statusit
  const isPaid = status === "bezahlt" || stripeStatus === "succeeded";
  const isFailed = stripeStatus === "failed" || stripeStatus === "canceled";
  const isOpen = status === "offen" || stripeStatus === "requires_payment_method" || stripeStatus === "requires_capture";

  // 🧠 Vendos ngjyrën e badge
const statusColor =
  manualPaid
    ? "bg-blue-100 text-blue-700 border-blue-300"
    : isPaid
    ? "bg-green-100 text-green-700 border-green-300"
    : isFailed
    ? "bg-red-100 text-red-700 border-red-300"
    : isOpen
    ? "bg-yellow-100 text-yellow-700 border-yellow-300"
    : "bg-gray-100 text-gray-700 border-gray-300";


const handleManualPay = async () => {
  const res = await fetch("/api/finances/manual-pay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      paymentIntentId: selectedPayment.paymentIntentId,
      userId: selectedPayment.userId
    })
  });

  if (res.ok) {
    alert("Zahlung wurde manuell als bezahlt markiert!");
    closeModal();
    window.location.reload();
  } else {
    alert("Fehler beim Aktualisieren der Zahlung.");
  }
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl relative">

        {/* CLOSE BUTTON */}
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-4">Payment Details</h2>

        {/* 🔰 STATUS BADGE */}
        <div className={`inline-block px-3 py-1 rounded-full border text-sm mb-4 ${statusColor}`}>
          {manualPaid ? "Manuell Bezahlt" :
           isPaid ? "Bezahlt" :
           isFailed ? "Fehlgeschlagen / Storniert" :
           isOpen ? "Offen" :
           stripeStatus}
        </div>

        <div className="space-y-2">
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Amount:</strong> CHF {amount.toFixed(2)}</p>

          {lastError && (
            <p className="text-red-500 text-sm"><strong>Error:</strong> {lastError}</p>
          )}

          {/* Schedules */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Schedules</h3>

            <div className="max-h-40 overflow-y-auto border p-3 rounded-lg bg-gray-50">
              {schedules.length === 0 ? (
                <p className="text-gray-600 italic">No schedules for this user.</p>
              ) : (
                schedules.map((s, i) => (
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

          {/* 🧠 BUTTON LOGIC E PLOTË */}

          {/* ⭐ Already Paid */}
          {isPaid && !manualPaid && (
            <p className="mt-4 text-green-600 font-semibold">
              ✔ Zahlung wurde automatisch bezahlt
            </p>
          )}

          {/* ⭐ Already Manually Paid */}
          {manualPaid && (
            <p className="mt-4 text-green-600 font-semibold">
              ✔ Zahlung ist manuell bezahlt
            </p>
          )}

          {/* ⭐ Manual Payment Enabled ONLY for failed or open payments */}
          {!isPaid && !manualPaid && (isOpen || isFailed) && (
            <button
              onClick={handleManualPay}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Manuell bezahlt markieren
            </button>
          )}

        </div>

      </div>
    </div>
  );
};

  // ⭐ Umsatz calculations
  const now = new Date();

  // 1️⃣ Umsatz total per Monat
  const totalMonth = bezahlt.reduce((sum, p) => {
const d = new Date(p.paymentDate);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      ? sum + p.amount
      : sum;
  }, 0);

  // 2️⃣ Umsatz total per Jahr
  const totalYear = bezahlt.reduce((sum, p) => {
const d = new Date(p.paymentDate);
    return d.getFullYear() === now.getFullYear()
      ? sum + p.amount
      : sum;
  }, 0);

  // 3️⃣ Umsatz pro Quartal
  const currentQuarter = Math.floor(now.getMonth() / 3);

  const totalQuarter = bezahlt.reduce((sum, p) => {
const d = new Date(p.paymentDate);
    return d.getFullYear() === now.getFullYear() &&
      Math.floor(d.getMonth() / 3) === currentQuarter
      ? sum + p.amount
      : sum;
  }, 0);

  // 4️⃣ Umsatz per Kunde
  const umsatzProKunde = bezahlt.reduce((map, p) => {
    if (!map[p.userId]) {
      map[p.userId] = { name: p.name, total: 0 };
    }
    map[p.userId].total += p.amount;
    return map;
  }, {});

  return (
    <AdminLayout>
      <div className="p-6">

        {/* MODAL */}
        <PaymentModal />

        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Finanzübersicht
        </h1>
{/* ⭐ Umsatz Dashboard */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
    <p className="text-sm font-medium text-blue-800">Umsatz (Dieser Monat)</p>
    <p className="text-2xl font-bold text-blue-900">
      CHF {totalMonth.toFixed(2)}
    </p>
  </div>

  <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
    <p className="text-sm font-medium text-purple-800">Umsatz (Quarter)</p>
    <p className="text-2xl font-bold text-purple-900">
      CHF {totalQuarter.toFixed(2)}
    </p>
  </div>

  <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
    <p className="text-sm font-medium text-green-800">Umsatz (Jahr)</p>
    <p className="text-2xl font-bold text-green-900">
      CHF {totalYear.toFixed(2)}
    </p>
  </div>

</div>

{/* ⭐ Umsatz per Kunde */}
<div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 mb-10">
  <h2 className="text-xl font-bold text-gray-800 mb-4">Umsatz pro Kunde</h2>

  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
    {Object.values(umsatzProKunde).map((k, index) => (
      <div key={index} className="p-3 bg-gray-50 border rounded-lg">
        <p><strong>Kunde:</strong> {k.name}</p>
        <p><strong>Umsatz:</strong> CHF {k.total.toFixed(2)}</p>
      </div>
    ))}
  </div>
</div>

        {/* ⭐ FILTER DROPDOWN */}
        <div className="flex gap-3 mb-8">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border px-3 py-2 rounded-lg shadow-sm"
          >
            <option value="week">Diese Woche</option>
            <option value="month">Dieser Monat</option>
            <option value="all">Alle Zeiten</option>
          </select>
        </div>

        {/* GRID STRUCTURE */}
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
                 <p><strong>Status:</strong> {p.status === "manuell" ? "manuell bezahlt" : "bezahlt"}</p>

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

{renderSection(
  "🎟️ Gutscheine (mit Nutzung)",
  <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
<div className="mb-4 flex flex-wrap gap-3 items-center">

  {/* QUICK FILTERS */}
  <select
    value={voucherFilter}
    onChange={(e) => setVoucherFilter(e.target.value)}
    className="border px-3 py-2 rounded-lg"
  >
    <option value="all">Alle Zeiten</option>
    <option value="today">Heute</option>
    <option value="week">Diese Woche</option>
    <option value="month">Dieser Monat</option>
    <option value="nextMonth">Nächster Monat</option>
  </select>

  {/* DATE FROM */}
  <input
    type="date"
    value={voucherDateFrom}
    onChange={(e) => setVoucherDateFrom(e.target.value)}
    className="border px-3 py-2 rounded-lg"
  />

  {/* DATE TO */}
  <input
    type="date"
    value={voucherDateTo}
    onChange={(e) => setVoucherDateTo(e.target.value)}
    className="border px-3 py-2 rounded-lg"
  />

  {/* CLIENT FILTER */}
  <select
    value={voucherClient}
    onChange={(e) => setVoucherClient(e.target.value)}
    className="border px-3 py-2 rounded-lg"
  >
    <option value="">Alle Kunden</option>
    {clientList.map((c) => (
      <option key={c.id} value={c.id}>
        {c.firstName} {c.lastName}
      </option>
    ))}
  </select>

</div>

    {vouchers.length === 0 ? (
      <p className="text-gray-500 italic">Keine Gutscheine vorhanden</p>
    ) : (
filterVouchers(vouchers).map((v) => (
        <div
          key={v.id}
          className="p-4 border bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition"
        >
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">{v.code}</p>

            <span
              className={`px-3 py-1 text-sm rounded-full border ${
                v.isActive
                  ? "bg-green-100 text-green-700 border-green-300"
                  : "bg-red-100 text-red-700 border-red-300"
              }`}
            >
              {v.isActive ? "Aktiv" : "Inaktiv"}
            </span>
          </div>

          <p>
            <strong>Wert:</strong>{" "}
            {v.discountType === "percentage"
              ? `${v.discountValue}%`
              : `CHF ${v.discountValue}`}
          </p>

          <p>
            <strong>Gültig von:</strong>{" "}
            {new Date(v.validFrom).toLocaleDateString()}
          </p>
          <p>
            <strong>Gültig bis:</strong>{" "}
            {new Date(v.validUntil).toLocaleDateString()}
          </p>

          <p>
            <strong>Verwendet:</strong> {v.usedBy?.length || 0} / {v.maxUses} mal
          </p>

          {/* 🧍 Clients who used the voucher */}
          {v.usedBy?.length > 0 && (
            <div className="mt-3 border-t pt-3">
              <p className="font-semibold mb-2">Benutzt von:</p>
              {v.usedBy.map((u) => (
                <div
                  key={u.id}
                  className="bg-white p-2 rounded-md border flex flex-col"
                >
                  <span className="font-medium">
                    {u.firstName} {u.lastName}
                  </span>
                  <span className="text-sm text-gray-600">{u.email}</span>
                </div>
              ))}
            </div>
          )}
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
