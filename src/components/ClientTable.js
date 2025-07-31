import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function ClientTable({ clients }) {
  const router = useRouter();
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [assignedMap, setAssignedMap] = useState({});
  const [message, setMessage] = useState("");
  const [employees, setEmployees] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await fetch("/api/admin/employees");
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        console.error("❌ Error fetching employees:", err);
      }
    }
    fetchEmployees();
  }, []);

  // ✅ Handle employee assignment
  async function handleAssign(userId) {
    const employeeId = selectedEmployee[userId];
    if (!employeeId) return;

    const res = await fetch("/api/admin/assign-employee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, employeeId }),
    });

    const data = await res.json();

    if (res.ok) {
      setAssignedMap({ ...assignedMap, [userId]: employeeId });
      setMessage("✅ Employee assigned");
    } else {
      setMessage(`❌ Failed to assign: ${data.message}`);
    }

    setTimeout(() => setMessage(""), 3000);
  }

const uniqueServices = [
  ...new Set(clients.flatMap(c => c.services || []).map(s => s.name).filter(Boolean))
];


const filteredClients = clients
  .filter((client) => {
    const name = `${client.firstName || ""} ${client.lastName || ""}`.toLowerCase();
    const email = (client.email || "").toLowerCase();
    const phone = (client.phone || "").toLowerCase();
    const serviceNames = (client.services || []).map(s => s.name?.toLowerCase() || "");
    const firstDate = client.firstDate ? new Date(client.firstDate).toISOString().slice(0, 10) : "";

    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm.toLowerCase());

    const matchesService = selectedService
      ? serviceNames.includes(selectedService.toLowerCase())
      : true;

    const matchesDate = selectedDate
      ? firstDate === selectedDate
      : true;

    return matchesSearch && matchesService && matchesDate;
  })
  .sort((a, b) => {
    const nameA = (a.firstName || "").toLowerCase();
    const nameB = (b.firstName || "").toLowerCase();

    if (sortBy === "name") {
      return nameA.localeCompare(nameB);
    } else if (sortBy === "date") {
      return new Date(b.firstDate || 0) - new Date(a.firstDate || 0);
    }
    return 0;
  });

useEffect(() => {
  const initialMap = {};
  clients.forEach((client) => {
    const assigned = client.assignments?.[0]; // active assignment
    if (assigned?.employeeId) {
      initialMap[client.id] = assigned.employeeId;
    }
  });
  setSelectedEmployee(initialMap);
  setAssignedMap(initialMap); // optional: to show "Assigned ✔"
}, [clients]);


  return (
    <div>
      <h2 className="text-2xl font-bold text-[#04436F] mb-4">Clients</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Services</option>
          {uniqueServices.map((service) => (
            <option key={service} value={service}>{service}</option>
          ))}
        </select>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <button onClick={() => {
          setSearchTerm("");
          setSelectedService("");
          setSelectedDate("");
        }} className="bg-gray-200 px-3 py-2 rounded">
          Clear Filters
        </button>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="name">Sort by Name</option>
          <option value="date">Sort by Date</option>
        </select>
      </div>

      {/* Table */}
<div className="hidden sm:block bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Service</th>
              <th className="p-3">Date</th>
              <th className="p-3">Assign Employee</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{client.firstName} {client.lastName}</td>
                <td className="p-3">{client.email}</td>
                <td className="p-3">{client.phone}</td>
<td className="p-3">
  {(client.services && client.services.length > 0)
    ? client.services.map(s => s.name).join(", ")
    : "-"}
</td>

<td className="p-3">
  {client.firstDate
    ? new Date(client.firstDate).toISOString().slice(0, 10)
    : "-"}
</td>
                <td className="p-3">
                  {employees.length === 0 ? (
                    <span className="text-red-500">Loading...</span>
                  ) : (
                    <select
                      value={selectedEmployee[client.id] || ""}
                      onChange={(e) =>
                        setSelectedEmployee({
                          ...selectedEmployee,
                          [client.id]: e.target.value,
                        })
                      }
                      className="border px-2 py-1 rounded"
                    >
                      <option value="">Select</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.firstName} {emp.lastName} ({emp.status})
                        </option>
                      ))}
                    </select>
                  )}
                </td>
                <td className="p-3">
                  <button
                    disabled={!selectedEmployee[client.id]}
                    onClick={() => handleAssign(client.id)}
                    className={`px-3 py-1 rounded text-white ${
                      selectedEmployee[client.id]
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Assign
                  </button>
{client.assignments?.length > 0 && (() => {
  const latest = client.assignments[0]; // or find the latest by date if needed

  return (
    <div className="text-xs mt-1" style={{ color: "#2563eb" }}>
      Assigned to {latest.employee?.firstName || "—"} (
      {latest.confirmationStatus === "pending"
        ? "Pending"
        : latest.confirmationStatus === "confirmed"
        ? "Confirmed"
        : "Rejected"}
      )
    </div>
  );
})()}



                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredClients.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No clients found.</p>
        )}
      </div>
{/* 📱 Mobile Card View (only visible on small screens) */}
<div className="sm:hidden flex flex-col gap-4">
  {filteredClients.map((client) => (
    <div key={client.id} className="bg-white p-4 rounded-xl shadow space-y-2">
      <p><span className="font-semibold text-[#04436F]">Name:</span> {client.firstName} {client.lastName}</p>
      <p><span className="font-semibold text-[#04436F]">Email:</span> {client.email}</p>
      <p><span className="font-semibold text-[#04436F]">Phone:</span> {client.phone}</p>
      <p><span className="font-semibold text-[#04436F]">Service:</span> {(client.services || []).map(s => s.name).join(", ") || "-"}</p>
      <p><span className="font-semibold text-[#04436F]">Date:</span> {client.firstDate ? new Date(client.firstDate).toISOString().slice(0, 10) : "-"}</p>

      <div className="space-y-2">
        <select
          value={selectedEmployee[client.id] || ""}
          onChange={(e) =>
            setSelectedEmployee({ ...selectedEmployee, [client.id]: e.target.value })
          }
          className="border w-full px-3 py-2 rounded"
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.firstName} {emp.lastName} ({emp.status})
            </option>
          ))}
        </select>

        <button
          disabled={!selectedEmployee[client.id]}
          onClick={() => handleAssign(client.id)}
          className={`w-full px-3 py-2 rounded text-white ${
            selectedEmployee[client.id]
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Assign
        </button>

        {client.assignments?.length > 0 && (() => {
          const latest = client.assignments[0];
          return (
            <p className="text-xs text-blue-600">
              Assigned to {latest.employee?.firstName || "—"} (
              {latest.confirmationStatus === "pending"
                ? "Pending"
                : latest.confirmationStatus === "confirmed"
                ? "Confirmed"
                : "Rejected"}
              )
            </p>
          );
        })()}
      </div>
    </div>
  ))}
</div>

      {/* Assignment Message */}
      {message && (
        <p className="text-center text-sm mt-4 text-blue-700">{message}</p>
      )}
    </div>
  );
}
