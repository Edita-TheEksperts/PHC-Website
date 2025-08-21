import useSWR from "swr";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

// ✅ Simple Card components (no external library needed)
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

  return (
<div className="max-w-lg mx-auto">
  <Card className="bg-white border border-gray-200 rounded-2xl">
    <CardContent className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🧾 Invoice Summary</h2>
        <span className="text-sm text-gray-500">#{userId?.slice(0,6).toUpperCase()}</span>
      </div>

      {/* Amount */}
      <div className="text-center mb-6">
        <p className="text-gray-500 uppercase tracking-wider text-sm">
          Total Payment
        </p>
        <p className="text-5xl font-extrabold text-emerald-600">
          CHF {data.totalPayment?.toFixed(2) || "0.00"}
        </p>
      </div>

      {/* Breakdown */}
      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex justify-between">
          <span>Payment Method</span>
          <span className="font-medium">{data.paymentMethod || "Card"}</span>
        </div>
        <div className="flex justify-between">
          <span>Date</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t mt-6 pt-4 text-center text-sm text-gray-400">
        Thank you for your payment 💚
      </div>
    </CardContent>
  </Card>
</div>


  );
}


