import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";

export default function FinanzenPage() {
  const [invoices, setInvoices] = useState([]);
  const [revenue, setRevenue] = useState({});
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/finanzen");
        const json = await res.json();

        setInvoices(json.invoices || []);
        setRevenue(json.revenue || {});
        setVouchers(json.vouchers || []);
      } catch (err) {
        console.error("Fehler beim Laden:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <AdminLayout>Finanzen werden geladen…</AdminLayout>;

  const renderSection = (title, children) => (
    <div className="bg-white shadow-lg rounded-xl p-6 mb-10 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
      {children}
    </div>
  );

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Finanzübersicht</h1>

        {renderSection("💳 Rechnungen", (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {invoices.length === 0 ? (
              <p className="text-gray-500 italic">Keine Rechnungen vorhanden</p>
            ) : (
              invoices.map((inv) => (
                <div key={inv.id} className="p-4 bg-gray-50 border rounded-lg">
                  <p><strong>Kunde:</strong> {inv.customer}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={
                        inv.status === "offen"
                          ? "text-yellow-600"
                          : inv.status === "bezahlt"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {inv.status}
                    </span>
                  </p>
                  <p><strong>Betrag:</strong> €{Number(inv.amount).toFixed(2)}</p>
                </div>
              ))
            )}
          </div>
        ))}

        {renderSection("📈 Umsatz", (
          <div className="space-y-6">

            <div className="bg-purple-50 border border-purple-300 rounded-xl p-6 text-center min-h-[140px] flex flex-col items-center justify-center">
              <h3 className="text-purple-700 font-bold text-lg mb-2">Umsatz (Gesamt)</h3>
              <p className="text-4xl font-extrabold text-gray-900">
                €{Number(revenue.revenueAllTime).toLocaleString("de-DE", {
                  minimumFractionDigits: 2
                })}
              </p>
              <p className="text-sm text-gray-500">
                Gesamter Nettoumsatz (Einnahmen – Kosten) seit Systemstart
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <h3 className="text-green-700 font-semibold text-lg mb-1">
                  💰 Umsatz dieses Monats
                </h3>
                <p className="text-3xl font-bold text-gray-800">
                  €{Number(revenue.revenueThisMonth).toLocaleString("de-DE", {
                    minimumFractionDigits: 2
                  })}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Einnahmen: €{Number(revenue.totalIncomeThisMonth).toLocaleString("de-DE", { minimumFractionDigits: 2 })} – 
                  Ausgaben: €{Number(revenue.totalCostThisMonth).toLocaleString("de-DE", { minimumFractionDigits: 2 })} = Gewinn
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h3 className="text-blue-700 font-semibold text-lg mb-1">
                  💰 Umsatz aller Zeiten
                </h3>
                <p className="text-3xl font-bold text-gray-800">
                  €{Number(revenue?.revenueAllTime || 0).toLocaleString("de-DE", {
                    minimumFractionDigits: 2
                  })}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Einnahmen: €{Number(revenue.totalIncomeAllTime).toLocaleString("de-DE", { minimumFractionDigits: 2 })} – 
                  Ausgaben: €{Number(revenue.totalCostAllTime).toLocaleString("de-DE", { minimumFractionDigits: 2 })} = Gewinn
                </p>
              </div>

            </div>
          </div>
        ))}

        {renderSection("🎟️ Gutscheine", (
          <>
            {vouchers.length === 0 ? (
              <p className="text-gray-500 italic">Keine Gutscheine vorhanden</p>
            ) : (
              <div className="space-y-3">
                {vouchers.map((v) => (
                  <div key={v.id} className="p-4 border bg-gray-50 rounded-lg">
                    <p><strong>Code:</strong> {v.code}</p>
                    <p>
                      <strong>Status:</strong>{" "}
                      {v.isActive ? (
                        <span className="text-green-600">Aktiv</span>
                      ) : (
                        <span className="text-red-600">Inaktiv</span>
                      )}
                    </p>
                    <p><strong>Verwendet:</strong> {v.usedCount}x</p>
                    <p><strong>Wert:</strong> 
                      {v.discountType === "percent"
                        ? v.value + "%"
                        : "€" + v.value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        ))}

      </div>
    </AdminLayout>
  );
}
