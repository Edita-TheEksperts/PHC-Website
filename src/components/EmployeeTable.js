import { useRouter } from "next/router";

export default function EmployeeTable({ employees, onApprove, onReject, onInvite }) {
  const router = useRouter();
    // 🔍 Debug all function props
  console.log("🧩 Props Received in EmployeeTable:");
  console.log("employees:", employees);
  console.log("onApprove:", typeof onApprove);
  console.log("onReject:", typeof onReject);
  console.log("onInvite:", typeof onInvite);
 
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#04436F] mb-4">Employees</h2>
      <div className="bg-white rounded-xl shadow overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
        {employees.map((emp) => {
  console.log("🔎 Employee Row:", emp.firstName, emp.status, emp.invited);

  return (
    <tr key={emp.id} className="border-t">
      <td className="p-3">{emp.firstName} {emp.lastName}</td>
      <td className="p-3">{emp.email}</td>
      <td className="p-3">{emp.phone}</td>
      <td className="p-3">{emp.status}</td>
      <td className="p-3 flex gap-2 flex-wrap">

        {emp.status === "pending" && (
          <>
            <button
              onClick={() => onApprove(emp)}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Approve
            </button>

            <button
              onClick={() => onReject(emp)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Reject
            </button>

            {!emp.invited && (
              <button
               onClick={() => {
  console.log("📤 Invite button clicked for:", emp.email);
  onInvite(emp);
}}

                className="bg-indigo-500 text-white px-3 py-1 rounded"
              >
                Einladen
              </button>
            )}
          </>
        )}

        <button
          onClick={() => router.push(`/employees/${emp.id}`)}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Details
        </button>

      </td>
    </tr>
  );
})}

        </table>
      </div>
    </div>
  );
}
