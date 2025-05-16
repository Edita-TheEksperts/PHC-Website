import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [clients, setClients] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);  // Added loading state
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/admin/dashboard");
        if (!res.ok) {
          throw new Error("Error fetching data");
        }
        const data = await res.json();
        console.log(data); // Check if data is received properly
        setEmployees(data.employees);
        setClients(data.clients);
      } catch (error) {
        setMessage("Error fetching data.");
      } finally {
        setLoading(false);  // Stop loading after fetching data
      }
    }
    fetchData();
  }, []);

  const handleApproval = async (employeeId, action) => {
    try {
      const res = await fetch("/api/admin/approve-employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, action }),
      });

      if (res.ok) {
        setMessage(`Employee ${action}d successfully!`);
        // Optimistically update the employee state
        setEmployees((prevEmployees) =>
          prevEmployees.map((employee) =>
            employee.id === employeeId
              ? { ...employee, status: action === "approve" ? "approved" : "rejected" }
              : employee
          )
        );
      } else {
        setMessage("Error in approving employee.");
      }
    } catch (error) {
      setMessage("Error while communicating with the server.");
    }
  };

  if (loading) {
    return <p>Loading...</p>; // You can customize this loading indicator
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-3xl font-semibold text-[#04436F]">Admin Dashboard</h1>

      <h2 className="text-xl font-semibold text-[#04436F]">Employees</h2>
      <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
      <table className="min-w-full ">
  <thead className="">
    <tr>
      <th className="px-6 py-3 text-left">Name</th>
      <th className="px-6 py-3 text-left">Email</th>
      <th className="px-6 py-3 text-left">Phone</th>
      <th className="px-6 py-3 text-left">Address</th>
      <th className="px-6 py-3 text-left">Experience (Years)</th>
      <th className="px-6 py-3 text-left">Status</th>
      <th className="px-6 py-3 text-left">Action</th>
    </tr>
  </thead>
  <tbody className="text-gray-700">
    {employees.length > 0 ? (
      employees.map((employee, index) => (
        <tr key={employee.id} className={`border-t ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
          <td className="px-6 py-3">{employee.firstName} {employee.lastName}</td>
          <td className="px-6 py-3">{employee.email}</td>
          <td className="px-6 py-3">{employee.phone}</td>
          <td className="px-6 py-3">{employee.address}</td>
          <td className="px-6 py-3">{employee.experienceYears}</td>
          <td className="px-6 py-3">{employee.status}</td>
          <td className="px-6 py-3 flex space-x-2">
            {employee.status === 'pending' && (
              <>
                <button
                  onClick={() => handleApproval(employee.id, "approve")}
                  className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-md transition duration-300"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleApproval(employee.id, "reject")}
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md transition duration-300"
                >
                  Reject
                </button>
              </>
            )}
            <button
  onClick={() => router.push(`/employees/${employee.id}`)} // Navigate to employee details page
  className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md transition duration-300"
>
  View Details
</button>

          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="7" className="text-center py-4">No employees found</td>
      </tr>
    )}
  </tbody>
</table>
      </div>

      <h2 className="text-xl font-semibold text-[#04436F]">Clients</h2>
      <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Phone</th>
              <th className="px-6 py-3 text-left">Address</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {clients.length > 0 ? (
              clients.map((client) => (
                <tr key={client.id} className="border-t">
                  <td className="px-6 py-3">{client.firstName} {client.lastName}</td>
                  <td className="px-6 py-3">{client.email}</td>
                  <td className="px-6 py-3">{client.phone}</td>
                  <td className="px-6 py-3">{client.address}</td>
                  <td className="px-6 py-3">
                  <button
  onClick={() => router.push(`/clients/${client.id}`)} // This should be correct
  className="bg-blue-500 text-white py-1 px-3 rounded-md"
>
  View Details
</button>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No clients found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {message && <p className="mt-4 text-center text-[#04436F]">{message}</p>}
    </div>
  );
}
