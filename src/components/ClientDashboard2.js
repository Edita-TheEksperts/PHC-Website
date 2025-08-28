import useSWR from "swr";

// ✅ Simple Card components
function Card({ children, className }) {
  return (
    <div className={`rounded-xl border bg-white shadow p-4 ${className || ""}`}>
      {children}
    </div>
  );
}

function CardContent({ children, className }) {
  return <div className={`p-2 ${className || ""}`}>{children}</div>;
}

export default function ClientDashboard2({ userId }) {
  const { data, error } = useSWR(
    `/api/admin/finances?userId=${userId}`,
    (url) => fetch(url).then((r) => r.json())
  );

  if (error) return <p>❌ Failed to load</p>;
  if (!data) return <p>⏳ Loading...</p>;

  // ✅ Llogarisim totalin nga monthly
  const monthlyTotal = data.paymentHistory?.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* ✅ Monthly Overview */}
      <Card className="bg-white border border-gray-200 rounded-2xl">
        <CardContent className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">📅 Monthly Overview</h2>
          </div>

          {/* Monthly list */}
          <div className="divide-y text-sm text-gray-700">
            {data.paymentHistory && data.paymentHistory.length > 0 ? (
              data.paymentHistory.map((p, i) => (
                <div key={i} className="flex justify-between items-center py-3">
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
                No monthly payments available
              </p>
            )}
          </div>

          {/* ✅ Total in footer */}
          <div className="border-t mt-6 pt-4 text-center">
            <p className="uppercase text-sm text-gray-500">Monthly Total</p>
            <p className="text-3xl font-extrabold text-emerald-600">
              CHF {monthlyTotal?.toFixed(2) || "0.00"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
