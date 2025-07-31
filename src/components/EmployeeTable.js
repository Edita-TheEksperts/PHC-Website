import { useRouter } from "next/router";

export default function EmployeeTable({ employees, onApprove, onReject, onInvite }) {
  const router = useRouter();

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#04436F] mb-4">Employees</h2>

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
            {employees.map((emp) => (
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
        {employees.map((emp) => (
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
