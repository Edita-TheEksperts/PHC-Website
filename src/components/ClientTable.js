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
  const [recommended, setRecommended] = useState({});
const [showModal, setShowModal] = useState(false);
const [modalRecs, setModalRecs] = useState([]);
useEffect(() => {
  async function fetchRecommendations() {
    for (const client of clients) {
      try {
        const res = await fetch(`/api/admin/matchmaking?clientId=${client.id}`);
        const data = await res.json();

        setRecommended(prev => ({
          ...prev,
          [client.id]: data,   // attach results to client
        }));
      } catch (err) {
        console.error("❌ Matchmaking error:", err);
      }
    }
  }
  if (clients.length > 0) {
    fetchRecommendations();
  }
}, [clients]);


function getStatus(client) {
  if (client.status === "canceled") return "Canceled";

  const now = new Date();
  const serviceDate = new Date(client.firstDate);
  return serviceDate < now ? "Done" : "Open";
}
function isCancelable(client) {
  const now = new Date();
  const serviceDate = new Date(client.firstDate);
  const diffHours = (serviceDate - now) / (1000 * 60 * 60);
  return diffHours >= 24;
}
async function handleCancel(clientId) {
  const confirmCancel = window.confirm("Are you sure you want to cancel this service?");
  if (!confirmCancel) return;

  try {
    const res = await fetch("/api/admin/cancel-service", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("❌ Service canceled.");
      router.reload(); // ← Refresh to reflect canceled status
    } else {
      setMessage(`❌ Failed to cancel: ${data.message}`);
    }
  } catch (err) {
    console.error("Cancel error:", err);
    setMessage("❌ Something went wrong.");
  }

  setTimeout(() => setMessage(""), 3000);
}


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

const safeClients = Array.isArray(clients) ? clients : [];

const uniqueServices = [
  ...new Set(
    safeClients
      .flatMap(c => c.services || [])
      .map(s => s.name)
      .filter(Boolean)
  )
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
      <h2 className="text-2xl font-bold text-[#04436F] mb-4">Kunden</h2>

      {/* Filter Labels and Controls */}
  <div className="flex flex-wrap gap-4 mb-4">
    
    {/* 🔍 Search by Name */}
    <div className="flex flex-col text-sm">
      <label className="mb-1 text-gray-600 font-medium">Suche nach Name</label>
      <input
        type="text"
        placeholder="e.g. John"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border px-3 py-2 rounded w-64"
      />
    </div>

    {/* 🧾 Filter by Service */}
    <div className="flex flex-col text-sm">
      <label className="mb-1 text-gray-600 font-medium">Nach Dienstleistung filtern</label>
      <select
        value={selectedService}
        onChange={(e) => setSelectedService(e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="">Alle Dienstleistungen</option>
        {uniqueServices.map((service) => (
          <option key={service} value={service}>{service}</option>
        ))}
      </select>
    </div>

    {/* 📅 Filter by Date */}
    <div className="flex flex-col text-sm">
      <label className="mb-1 text-gray-600 font-medium">Nach Leistungsdatum filtern</label>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="border px-3 py-2 rounded"
      />
    </div>

    {/* 🔄 Sort Options */}
    <div className="flex flex-col text-sm">
      <label className="mb-1 text-gray-600 font-medium">Kunden sortieren</label>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="name">Nach Name sortieren</option>
<option value="date">Nach Datum sortieren</option>

      </select>
    </div>

    {/* 🧹 Clear Button */}
    <div className="flex flex-col justify-end">
      <button
        onClick={() => {
          setSearchTerm("");
          setSelectedService("");
          setSelectedDate("");
        }}
        className="bg-gray-200 px-3 py-2 rounded text-sm hover:bg-gray-300"
      >
        Filter löschen
      </button>
    </div>
  </div>

      {/* Table */}
<div className="hidden sm:block bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
        <tr className="bg-gray-100 text-sm text-gray-700 uppercase tracking-wide">
  <th className="px-4 py-2 text-left">Name</th>
  <th className="px-4 py-2 text-left">E-Mail</th>
  <th className="px-4 py-2 text-left">Service</th>
  <th className="px-4 py-2 text-left">Datum</th>
  <th className="px-4 py-2 text-left">Mitarbeiter zuweisen</th>
  <th className="px-4 py-2 text-left">Aktion</th>
  <th className="px-4 py-2 text-left">Status</th>
</tr>

          </thead>
<tbody className="text-sm text-gray-700">
            {filteredClients.map((client) => (
              <tr key={client.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{client.firstName} {client.lastName}</td>
                <td className="p-3">{client.email}</td>
<td className="p-3">
  {(client.services && client.services.length > 0)
    ? client.services.map(s => s.name).join(", ")
    : "-"}
</td>

<td className="p-3">
{client.firstDate
  ? new Date(client.firstDate).toLocaleDateString("de-DE")
  : "-"}

</td>
               <td className="p-3">
<td className="p-3">
  {/* Strong Match Recommendations */}
{/* ✅ Show Strong Matches only (>=70% and no allergy) */}
{recommended[client.id]
  ?.filter(rec => rec.score >= 70 && !rec.hasAllergy)
  .slice(0, 2)
  .map((rec) => (
  <div
  key={rec.employeeId}
  className="flex items-center justify-between mb-2 p-2 rounded-lg border border-green-300 bg-green-50"
>
  <span className="text-green-800 text-sm font-semibold flex items-center gap-1">
    ⭐ {rec.firstName} {rec.lastName}
    <span className="ml-1 text-xs font-medium text-green-600">
      ({rec.score}% match)
    </span>
  </span>
  <button
    className="text-blue-600 text-xs underline"
    onClick={() => {
      setModalRecs(recommended[client.id]);
      setShowModal(true);
    }}
  >
    Warum?
  </button>
</div>

  ))}

  
  {/* ✅ Single Dropdown only */}
<select
  value={selectedEmployee[client.id] || ""}
  onChange={(e) =>
    setSelectedEmployee({
      ...selectedEmployee,
      [client.id]: e.target.value,
    })
  }
  className="border px-2 py-1 rounded min-w-[200px]"
>
  <option value="">Mitarbeiter auswählen</option>

  {/* === 1. STRONG MATCHES (score ≥ 70) === */}
  {recommended[client.id]
    ?.filter(rec => rec.score >= 70 && !rec.hasAllergy)
    .sort((a, b) => b.score - a.score)
    .map(rec => {
      const emp = employees.find(e => e.id === rec.employeeId);
      if (!emp) return null;
      return (
        <option
          key={rec.employeeId}
          value={rec.employeeId}
          style={{
            backgroundColor: "#E8FDD8", // green soft
            fontWeight: "600",
          }}
        >
          ⭐ {emp.firstName} {emp.lastName} — {rec.score}% Match
        </option>
      );
    })}

  {/* === 2. NORMAL MATCHES (score 30–69) === */}
  {recommended[client.id]
    ?.filter(rec => rec.score < 70 && rec.score >= 30 && !rec.hasAllergy)
    .sort((a, b) => b.score - a.score)
    .map(rec => {
      const emp = employees.find(e => e.id === rec.employeeId);
      if (!emp) return null;
      return (
        <option
          key={rec.employeeId}
          value={rec.employeeId}
          style={{
            backgroundColor: "#F5FDD8", // yellow soft
          }}
        >
          ⚡ {emp.firstName} {emp.lastName} — {rec.score}%
        </option>
      );
    })}

  {/* === 3. EMPLOYEES NOT MATCHING (fallback) === */}
  {employees
    .filter(emp => !recommended[client.id]?.some(r => r.employeeId === emp.id))
    .map(emp => (
      <option key={emp.id} value={emp.id}>
        👤 {emp.firstName} {emp.lastName}
      </option>
    ))}
</select>

</td>


</td>

           <td className="p-3">
  <div className="flex flex-col gap-2 w-36">
    {/* Assign Button */}
    <button
      disabled={!selectedEmployee[client.id]}
      onClick={() => handleAssign(client.id)}
      className={`px-3 py-1 rounded text-sm font-medium shadow-sm transition ${
        selectedEmployee[client.id]
          ? "bg-green-600 hover:bg-green-700 text-white"
          : "bg-gray-200 text-gray-400 cursor-not-allowed"
      }`}
    >
      Zuordnen
    </button>

    {/* View Details Button */}
    <button
      onClick={() => router.push(`/admin/clients/${client.id}`)}
      className="px-3 py-1 rounded text-sm font-medium shadow-sm bg-blue-600 text-white hover:bg-blue-700 transition"
    >
      Details anzeigen
    </button>

    {/* Assigned info */}
    {client.assignments?.length > 0 && (() => {
      const latest = client.assignments[0];
      return (
        <p className="text-xs text-blue-600">
         Zugewiesen an <span className="font-semibold">{latest.employee?.firstName || "—"}{" "}
          ({latest.confirmationStatus || "Pending"})</span>
        </p>
      );
    })()}

    {/* Cancel Button */}
    {getStatus(client) === "Open" && (
      <button
        onClick={() => handleCancel(client.id)}
        disabled={!isCancelable(client)}
        className={`px-3 py-1 rounded text-sm font-medium shadow-sm transition ${
          isCancelable(client)
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        Stornieren
      </button>
    )}
  </div>
</td>



           <td className="p-3">
  {getStatus(client) === "Open" && (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
      <span className="w-2 h-2 bg-green-500 rounded-full"></span> Offen
    </span>
  )}
  {getStatus(client) === "Done" && (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
      <span className="w-2 h-2 bg-gray-500 rounded-full"></span> Erledigt
    </span>
  )}
  {getStatus(client) === "Canceled" && (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
      <span className="w-2 h-2 bg-red-500 rounded-full"></span> Abgesagt
    </span>
  )}
</td>


              </tr>
            ))}
          </tbody>
        </table>

        {filteredClients.length === 0 && (
          <p className="text-center text-gray-500 mt-4">Keine Kunden gefunden.</p>
        )}
      </div>
{/* 📱 Mobile Card View (only visible on small screens) */}
<div className="sm:hidden flex flex-col gap-4">
  {filteredClients.map((client) => (
<div key={client.id} className="bg-white p-4 rounded-xl shadow-md border border-gray-100 space-y-2">
  <div className="flex justify-between items-center">
    <p className="font-semibold text-[#04436F]">{client.firstName} {client.lastName}</p>
    <div>
      {getStatus(client) === "Open" && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span> Offen
        </span>
      )}
      {getStatus(client) === "Done" && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
          <span className="w-2 h-2 bg-gray-500 rounded-full"></span> Erledigt
        </span>
      )}
      {getStatus(client) === "Canceled" && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
          <span className="w-2 h-2 bg-red-500 rounded-full"></span> Abgesagt
        </span>
      )}
    </div>
  </div>

  <p><span className="text-sm text-gray-500">Email:</span> {client.email}</p>
  <p><span className="text-sm text-gray-500">Phone:</span> {client.phone}</p>
  <p><span className="text-sm text-gray-500">Service:</span> {(client.services || []).map(s => s.name).join(", ") || "-"}</p>
  <p><span className="text-sm text-gray-500">Date:</span> {client.firstDate ? new Date(client.firstDate).toISOString().slice(0, 10) : "-"}</p>

  <div className="space-y-2">
    <select
      value={selectedEmployee[client.id] || ""}
      onChange={(e) =>
        setSelectedEmployee({ ...selectedEmployee, [client.id]: e.target.value })
      }
      className="border w-full px-3 py-2 rounded"
    >
      <option value="">Mitarbeiter auswählen</option>
      {employees.map((emp) => (
        <option key={emp.id} value={emp.id}>
          {emp.firstName} {emp.lastName} ({emp.status})
        </option>
      ))}
    </select>

    <button
      disabled={!selectedEmployee[client.id]}
      onClick={() => handleAssign(client.id)}
      className={`w-full px-3 py-2 rounded-md text-sm font-medium shadow-sm ${
        selectedEmployee[client.id]
          ? "bg-green-500 hover:bg-green-600 text-white"
          : "bg-gray-200 text-gray-400 cursor-not-allowed"
      }`}
    >
      Zuordnen
    </button>
<div className="flex flex-col gap-2">
  {/* Existing Assign and Cancel buttons */}

  {/* View Details Button */}
  <button
    onClick={() => router.push(`/admin/clients/${client.id}`)}
    className="w-full px-3 py-1 rounded-md text-sm font-medium shadow-sm bg-blue-600 text-white hover:bg-blue-700 transition"
  >
   Details anzeigen
  </button>
</div>

    {getStatus(client) === "Open" && (
      <button
        onClick={() => handleCancel(client.id)}
        disabled={!isCancelable(client)}
        className={`w-full px-3 py-2 rounded-md text-sm font-medium shadow-sm ${
          isCancelable(client)
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        Stornieren
      </button>
    )}

    {client.assignments?.length > 0 && (() => {
      const latest = client.assignments[0];
      return (
        <p className="text-xs text-blue-600">
          Zugewiesen an {latest.employee?.firstName || "—"} (
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

      {showModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div className="bg-white p-6 rounded-xl shadow-lg w-[400px]">
      <h3 className="text-lg font-bold mb-4">Warum empfohlen?</h3>
      <ul className="space-y-3">
        {modalRecs.map((rec) => (
          <li key={rec.employeeId} className="p-3 border rounded">
            <p className="font-medium">
              ⭐ {rec.firstName} {rec.lastName} (Punktzahl: {rec.score})
            </p>
            <ul className="list-disc ml-5 text-sm text-gray-600">
              {rec.reasons.map((reason, i) => (
                <li key={i}>{reason}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <div className="mt-4 text-right">
        <button
          onClick={() => setShowModal(false)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Schliessen
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
