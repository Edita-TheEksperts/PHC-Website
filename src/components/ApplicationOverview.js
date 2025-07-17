import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const STATUS_COLORS = {
  approved: "#10B981", // green
  pending: "#F59E0B",  // yellow
  rejected: "#EF4444", // red
};

export default function ApplicationOverview({ employees }) {
  const [filter, setFilter] = useState("all");

  if (!employees || employees.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 my-6 max-w-3xl">
        <h2 className="text-xl font-bold text-[#04436F] mb-4">📋 Application Overview</h2>
        <p className="text-gray-500">No employee data available.</p>
      </div>
    );
  }

  // Count statuses
  const counts = {
    approved: 0,
    pending: 0,
    rejected: 0,
  };

  employees.forEach((e) => {
    const s = e.status || "pending";
    if (counts[s] !== undefined) counts[s]++;
  });

  const data = Object.entries(counts).map(([status, value]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value,
    fill: STATUS_COLORS[status],
  }));

  // Filtered employee list
  const filteredEmployees = employees.filter((e) =>
    filter === "all" ? true : (e.status || "pending") === filter
  );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 my-6 max-w-7xl">
      <h2 className="text-xl font-bold text-[#04436F] mb-4">📋 Application Overview</h2>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={90} label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {/* Status Count */}
      <div className="mt-4 space-y-1 text-[18px] text-center text-gray-700">
        <p><strong>🟢 Approved:</strong> {counts.approved}</p>
        <p><strong>🟡 Pending:</strong> {counts.pending}</p>
        <p><strong>🔴 Rejected:</strong> {counts.rejected}</p>
      </div>

      {/* Filter Dropdown */}
      <div className="mt-6 flex justify-center">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
        >
          <option value="all">Show All</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Filtered Employee List */}
      <ul className="mt-4 space-y-2 max-w-md mx-auto text-gray-700 text-sm">
        {filteredEmployees.length === 0 ? (
          <p className="text-center text-gray-400 italic">No employees found.</p>
        ) : (
          filteredEmployees.map((e) => (
            <li key={e.id} className="flex justify-between px-4 py-2 bg-gray-50 rounded-md border">
              <span>{e.firstName} {e.lastName}</span>
              <span className="capitalize text-gray-500">{e.status || "pending"}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
