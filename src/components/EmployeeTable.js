import { useRouter } from "next/router";
import { useState } from "react";

export default function EmployeeTable({ employees, onApprove, onReject, onInvite }) {
  const router = useRouter();
const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("");
const [inviteFilter, setInviteFilter] = useState("");

const filteredEmployees = employees.filter((emp) => {
  const matchesName = `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesStatus = statusFilter ? emp.status === statusFilter : true;
  const matchesInvite =
    inviteFilter === "invited"
      ? emp.invited
      : inviteFilter === "not_invited"
      ? !emp.invited
      : true;

  return matchesName && matchesStatus && matchesInvite;
});
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#04436F] mb-4">Employees</h2>
{/* 🔍 Filters */}
<div className="flex flex-wrap gap-4 mb-4 items-end">
  <div className="flex flex-col">
    <label className="text-sm text-gray-600 mb-1">Filter by Name</label>
    <input
      type="text"
      placeholder="e.g. John"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="border px-3 py-2 rounded-md text-sm w-60"
    />
  </div>

  <div className="flex flex-col">
    <label className="text-sm text-gray-600 mb-1">Filter by Status</label>
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="border px-3 py-2 rounded-md text-sm w-44"
    >
      <option value="">All Statuses</option>
      <option value="approved">Approved</option>
      <option value="pending">Pending</option>
      <option value="rejected">Rejected</option>
    </select>
  </div>

  <div className="flex flex-col">
    <label className="text-sm text-gray-600 mb-1">Filter by Invite Status</label>
    <select
      value={inviteFilter}
      onChange={(e) => setInviteFilter(e.target.value)}
      className="border px-3 py-2 rounded-md text-sm w-44"
    >
      <option value="">All</option>
      <option value="invited">Invited</option>
      <option value="not_invited">Not Invited</option>
    </select>
  </div>

  <button
    onClick={() => {
      setSearchTerm("");
      setStatusFilter("");
      setInviteFilter("");
    }}
    className="bg-gray-200 text-sm px-4 py-2 rounded-md hover:bg-gray-300"
  >
    Clear Filters
  </button>
</div>

      {/* 🖥 Desktop Table View */}
      <div className="hidden sm:block bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-[800px] w-full text-sm text-gray-700">
          <thead className="bg-gray-100">
        <tr className="bg-gray-100 text-sm text-gray-700 uppercase tracking-wide">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
<tbody className="text-sm text-gray-700">
  {filteredEmployees.map((emp) => (
              <tr key={emp.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{emp.firstName} {emp.lastName}</td>
                <td className="p-3">{emp.email}</td>
                <td className="p-3">{emp.phone || "—"}</td>
                <td className="p-3 capitalize font-semibold">{emp.status}</td>
               <td className="p-3">
  <div className="flex flex-wrap gap-2 items-center">
    {emp.status === "pending" && (
      <>
        <button
          onClick={() => onApprove(emp)}
          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-[16px] font-semibold shadow-sm transition duration-150 ease-in-out"
          title="Approve"
          aria-label="Approve"
        >
          <span>✓</span> Approve
        </button>
        <button
          onClick={() => onReject(emp)}
          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-[16px] font-semibold shadow-sm transition duration-150 ease-in-out"
          title="Reject"
          aria-label="Reject"
        >
          <span>✕</span> Reject
        </button>
        {!emp.invited && (
          <button
            onClick={() => onInvite(emp)}
            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-full text-[16px] font-semibold shadow-sm transition duration-150 ease-in-out"
            title="Invite"
            aria-label="Invite"
          >
            <span>✉</span> Invite
          </button>
        )}
      </>
    )}
    <button
      onClick={() => router.push(`/admin/employees/${emp.id}`)}
      className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full text-[16px] font-semibold shadow-sm transition duration-150 ease-in-out"
      title="Details"
      aria-label="Details"
    >
      <span>ℹ</span> Details
    </button>
  </div>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📱 Mobile Card View */}
      <div className="sm:hidden flex flex-col gap-4">
  {filteredEmployees.map((emp) => (
          <div
            key={emp.id}
            className="bg-white p-4 rounded-xl shadow space-y-3 border border-gray-100"
          >
            <p className="font-semibold text-[#04436F] text-lg">{emp.firstName} {emp.lastName}</p>
            <p><span className="font-semibold">Email:</span> {emp.email}</p>
            <p><span className="font-semibold">Phone:</span> {emp.phone || "—"}</p>
            <p><span className="font-semibold">Status:</span> <span className="capitalize font-semibold">{emp.status}</span></p>

            <div className="flex flex-wrap gap-2 pt-2">
              {emp.status === "pending" && (
                <>
                  <button
                    onClick={() => onApprove(emp)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm shadow-sm transition flex-1"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onReject(emp)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm shadow-sm transition flex-1"
                  >
                    Reject
                  </button>
                  {!emp.invited && (
                    <button
                      onClick={() => onInvite(emp)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm shadow-sm transition flex-1"
                    >
                      Invite
                    </button>
                  )}
                </>
              )}
              <button
                onClick={() => router.push(`/admin/employees/${emp.id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm shadow-sm transition flex-1"
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
