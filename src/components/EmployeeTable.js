import { useRouter } from "next/router";

export default function EmployeeTable({ employees, onApprove, onReject, onInvite }) {
  const router = useRouter();

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#04436F] mb-4">Employees</h2>

      {/* 🖥 Desktop Table View */}
      <div className="hidden sm:block bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-[800px] w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-t">
                <td className="p-3">{emp.firstName} {emp.lastName}</td>
                <td className="p-3">{emp.email}</td>
                <td className="p-3">{emp.phone}</td>
                <td className="p-3 capitalize">{emp.status}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    {emp.status === "pending" && (
                      <>
                        <button onClick={() => onApprove(emp)} className="bg-green-500 text-white px-3 py-1 rounded text-sm">Approve</button>
                        <button onClick={() => onReject(emp)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Reject</button>
                        {!emp.invited && (
                          <button onClick={() => onInvite(emp)} className="bg-indigo-500 text-white px-3 py-1 rounded text-sm">Einladen</button>
                        )}
                      </>
                    )}
                    <button onClick={() => router.push(`/employees/${emp.id}`)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Details</button>
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
          <div key={emp.id} className="bg-white p-4 rounded-xl shadow space-y-2">
            <p><span className="font-semibold text-[#04436F]">Name:</span> {emp.firstName} {emp.lastName}</p>
            <p><span className="font-semibold text-[#04436F]">Email:</span> {emp.email}</p>
            <p><span className="font-semibold text-[#04436F]">Phone:</span> {emp.phone}</p>
            <p><span className="font-semibold text-[#04436F]">Status:</span> {emp.status}</p>

            <div className="flex flex-wrap gap-2 pt-2">
              {emp.status === "pending" && (
                <>
                  <button onClick={() => onApprove(emp)} className="bg-green-500 text-white px-3 py-1 rounded text-sm">Approve</button>
                  <button onClick={() => onReject(emp)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Reject</button>
                  {!emp.invited && (
                    <button onClick={() => onInvite(emp)} className="bg-indigo-500 text-white px-3 py-1 rounded text-sm">Einladen</button>
                  )}
                </>
              )}
              <button onClick={() => router.push(`/employees/${emp.id}`)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
