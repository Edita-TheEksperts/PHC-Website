import { useState } from "react";
import useSWR from "swr";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ClientDashboard2({ userId }) {
  const { data, error } = useSWR(
    `/api/admin/finances?userId=${userId}`,
    (url) => fetch(url).then((r) => r.json())
  );

  const [open, setOpen] = useState(true);

  if (error) return <p>❌ Failed to load</p>;
  if (!data) return <p>⏳ Loading...</p>;

  const monthlyTotal = data.paymentHistory?.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  return (
 <section
  className={`bg-white border border-gray-200 transition-all duration-500 ease-in-out overflow-hidden
    ${open
      ? "scale-100 opacity-100 rounded-3xl shadow-2xl"
      : "scale-95 opacity-90 rounded-xl shadow-md"
    }`}
>

      {/* Header */}
     {/* Header */}
<div
  className="flex items-center justify-between px-6 py-4 cursor-pointer select-none border-b border-gray-100"
  onClick={() => setOpen(!open)}
>
  <h3 className="text-2xl font-semibold text-[#B99B5F]">
          Monatsübersicht
    </h3>
  {open ? (
    <ChevronUp className="w-6 h-6 text-gray-500" />
  ) : (
    <ChevronDown className="w-6 h-6 text-gray-500" />
  )}
</div>


      {!open && (
  <p className="px-6 py-4 text-sm text-gray-500 italic text-left">
          Hier finden Sie Ihre monatlichen Zahlungen und Rechnungen.
        </p>
      )}

      {/* Content kur hapet */}
      {open && (
        <div className="mt-4">
          <div className="divide-y text-sm text-gray-700">
            {data.paymentHistory && data.paymentHistory.length > 0 ? (
              data.paymentHistory.map((p, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-3"
                >
                  <span className="font-medium">
                    {new Date(p.month + "-01").toLocaleDateString("de-DE", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="font-bold text-emerald-600">
                    CHF {p.amount.toFixed(2)}
                  </span>
                  <button className="ml-4 px-3 py-1 text-sm rounded-lg bg-[#B99B5F] text-white hover:bg-[#a7894f] transition">
                    📄 Invoice
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-6">
                Keine monatlichen Zahlungen verfügbar
              </p>
            )}
          </div>

          {/* Total */}
          <div className="border-t mt-6 pt-4 text-center">
            <p className="uppercase text-sm text-gray-500">Monatstotal</p>
            <p className="text-3xl font-extrabold text-emerald-600">
              CHF {monthlyTotal?.toFixed(2) || "0.00"}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
