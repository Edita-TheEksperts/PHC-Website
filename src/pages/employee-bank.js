import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Menu, X } from "lucide-react";

export default function EmployeeBank() {
  const router = useRouter();

  const [employee, setEmployee] = useState(null);
  const [payment, setPayment] = useState({
    iban: "",
    accountHolder: "",
    bankName: "",
    bic: "",
  });
  const [paymentSaved, setPaymentSaved] = useState(false);
  const [paymentMsg, setPaymentMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  /* ================= FETCH EMPLOYEE ================= */
  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) {
      router.push("/login");
      return;
    }

    const fetchEmployee = async () => {
      try {
        const res = await fetch("/api/get-employee", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();
        setEmployee(data);

        setPayment({
          iban: data.iban || "",
          accountHolder: data.accountHolder || "",
          bankName: data.bankName || "",
          bic: data.bic || "",
        });

        if (data.iban && data.accountHolder && data.bankName) {
          setPaymentSaved(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [router]);

  /* ================= HANDLERS ================= */

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPayment((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentMsg("");

    try {
      const res = await fetch("/api/update-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: employee.email,
          ...payment,
        }),
      });

      if (!res.ok) throw new Error();

      setPaymentSaved(true);
      setPaymentMsg("✅ Bankdaten gespeichert");
    } catch (err) {
      console.error(err);
      setPaymentMsg("❌ Fehler beim Speichern");
    }
  };

  const handlePaymentEditRequest = async () => {
    try {
      const res = await fetch("/api/request-payment-change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: employee.email,
          name: `${employee.firstName} ${employee.lastName}`,
        }),
      });

      if (!res.ok) throw new Error();

      setPaymentMsg("Anfrage wurde an das Team gesendet.");
    } catch (err) {
      console.error(err);
      setPaymentMsg("❌ Fehler beim Senden der Anfrage");
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Lade Bankdaten…</div>;
  }

  if (!employee) {
    return <div className="p-6 text-red-500">Keine Daten gefunden.</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* ================= MOBILE TOP NAV ================= */}
      <div className="lg:hidden bg-[#04436F] text-white fixed top-0 left-0 w-full z-50">
        <div className="flex items-center justify-between p-4">
          <h1
            className="text-xl font-bold cursor-pointer"
            onClick={() => router.push("/employee-dashboard")}
          >
            PHC
          </h1>
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-[#04436F] text-white z-40 flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-white/20">
            <h1
              className="text-xl font-bold cursor-pointer"
              onClick={() => {
                router.push("/employee-dashboard");
                setIsOpen(false);
              }}
            >
              PHC
            </h1>
            <button onClick={() => setIsOpen(false)}>
              <X />
            </button>
          </div>

          <nav className="flex flex-col space-y-6 px-6 py-8 text-lg font-medium">
            <SidebarLink
              label="Dashboard"
              onClick={() => {
                router.push("/employee-dashboard");
                setIsOpen(false);
              }}
            />
            <SidebarLink
              label="Bankdetails"
              onClick={() => setIsOpen(false)}
            />
            <SidebarLink
              label="Logout"
              onClick={() => {
                localStorage.removeItem("email");
                router.push("/login");
              }}
            />
          </nav>
        </div>
      )}

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:flex w-64 bg-[#04436F] text-white p-6 space-y-8 shadow-xl flex-col">
        <h2 className="text-3xl font-extrabold text-center">PHC</h2>
        <nav className="space-y-2">
          <SidebarLink
            label="Dashboard"
            onClick={() => router.push("/employee-dashboard")}
          />
          <SidebarLink
            label="Bankdetails"
            onClick={() => router.push("/employee-bank")}
          />
          <SidebarLink
            label="Logout"
            onClick={() => {
              localStorage.removeItem("email");
              router.push("/login");
            }}
          />
        </nav>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
<main className="flex-1 mt-[64px] lg:mt-0 px-6 py-10 flex justify-center">
  <div className="w-full max-w-xl">
  <h1 className="text-2xl font-bold text-[#04436F] mb-6 text-center">
    💳 Bankdetails
  </h1>

  <div className="bg-white rounded-2xl shadow-md border p-6">


        <div className="bg-white rounded-2xl shadow-md border p-6 max-w-xl">
          {paymentSaved ? (
            <div className="space-y-3 text-sm">
              <Info label="IBAN" value={payment.iban} />
              <Info label="Kontoinhaber" value={payment.accountHolder} />
              <Info label="Bankname" value={payment.bankName} />
              <Info label="BIC" value={payment.bic || "—"} />

              <button
                onClick={handlePaymentEditRequest}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Änderung anfragen
              </button>

              {paymentMsg && (
                <p className="text-sm text-blue-700 mt-2">{paymentMsg}</p>
              )}
            </div>
          ) : (
            <form onSubmit={handlePaymentSubmit} className="space-y-3 text-sm">
              <input
                type="text"
                name="iban"
                placeholder="IBAN"
                value={payment.iban}
                onChange={handlePaymentChange}
                className="border w-full p-2 rounded"
                required
              />
              <input
                type="text"
                name="accountHolder"
                placeholder="Kontoinhaber"
                value={payment.accountHolder}
                onChange={handlePaymentChange}
                className="border w-full p-2 rounded"
                required
              />
              <input
                type="text"
                name="bankName"
                placeholder="Bankname"
                value={payment.bankName}
                onChange={handlePaymentChange}
                className="border w-full p-2 rounded"
              />
              <input
                type="text"
                name="bic"
                placeholder="BIC / SWIFT"
                value={payment.bic}
                onChange={handlePaymentChange}
                className="border w-full p-2 rounded"
              />

              <button
                type="submit"
                className="bg-[#04436F] text-white px-4 py-2 rounded w-full"
              >
                Speichern
              </button>

              {paymentMsg && (
                <p className="text-green-600 mt-2">{paymentMsg}</p>
              )}
            </form>
          )}
        </div>
        </div>
        </div>
      </main>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function SidebarLink({ label, onClick }) {
  return (
    <div
      onClick={onClick}
      className="px-4 py-2 rounded-lg cursor-pointer font-medium text-sm hover:bg-[#05507F] transition"
    >
      {label}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-1">
      <span className="text-gray-600 font-medium">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );
}
