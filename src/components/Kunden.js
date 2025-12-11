import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import ClientTable from "../components/ClientTable";
import DashboardCard from "../components/DashboardCard";
import ActiveClients from "../components/ActiveClients";

export default function AdminKundenPage() {
  const [clients, setClients] = useState([]);
  const [vacations, setVacations] = useState([]);
  const [schedules, setSchedules] = useState([]);
const [selectedSchedule, setSelectedSchedule] = useState(null);
const [editSchedule, setEditSchedule] = useState(null);
const [allServices, setAllServices] = useState([]);
const [cancelQuestion, setCancelQuestion] = useState(null);



  // ✅ Fetch clients
  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await fetch("/api/admin/dashboard");
        if (!res.ok) throw new Error("Failed to fetch clients");
        const data = await res.json();
        setClients(data.clients || []);
      } catch (err) {
        console.error("❌ Error fetching clients:", err);
      }
    }
    fetchClients();
  }, []);

  // ✅ Fetch vacations
  useEffect(() => {
    async function fetchVacations() {
      try {
        const res = await fetch("/api/admin/vacations");
        const data = await res.json();
        if (Array.isArray(data)) {
          setVacations(data);
        } else if (Array.isArray(data.vacations)) {
          setVacations(data.vacations);
        } else {
          setVacations([]);
        }
      } catch (err) {
        console.error("❌ Error fetching vacations:", err);
        setVacations([]);
      }
    }
    fetchVacations();
  }, []);

useEffect(() => {
  async function fetchServices() {
    const res = await fetch("/api/admin/services");
    const data = await res.json();
    setAllServices(Array.isArray(data) ? data : []); // SIGURIM që është array
  }
  fetchServices();
}, []);

  async function handleCancel(id) {
  await fetch(`/api/admin/schedules/${id}/cancel`, {
    method: "PATCH",
  });

  // refresh data
  fetchDashboardData?.();
}
async function saveEditedSchedule() {
  const res = await fetch(`/api/admin/schedules/${editSchedule.id}/edit`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(editSchedule),
  });

  const newSchedule = await res.json();

  setSchedules(prev => [
    // Shto termin e ri
    newSchedule,
    // Mbaji të tjerët, por termini i vjetër tani ka status cancelled
    ...prev.map(s =>
      s.id === editSchedule.id
        ? { ...s, status: "cancelled" }
        : s
    )
  ]);

  setEditSchedule(null);
}

async function handleCancelWithEmail(schedule, cancelledBy) {
  try {
    // 1) Anulo termin dhe dërgo automatikisht email
    await fetch(`/api/admin/schedules/${schedule.id}/cancel?cancelledBy=${cancelledBy}`, {
      method: "PATCH",
    });

    // 2) Mbyll modalin
    setCancelQuestion(null);

    // 3) Përditëso UI lokalisht
    setSchedules(prev =>
      prev.map(s =>
        s.id === schedule.id ? { ...s, status: "cancelled" } : s
      )
    );

  } catch (error) {
    console.error("❌ Fehler beim Stornieren:", error);
  }
}

const [filter, setFilter] = useState("today");
const filteredSchedules = schedules.filter((s) => {
  const d = new Date(s.date);
  const now = new Date();

  if (filter === "today") {
    return d.toDateString() === now.toDateString();
  }

  if (filter === "thisWeek") {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    return d >= weekStart && d < weekEnd;
  }

  if (filter === "thisMonth") {
    return (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  }

  if (filter === "nextMonth") {
    return (
      d.getMonth() === now.getMonth() + 1 &&
      d.getFullYear() === now.getFullYear()
    );
  }

  return true;
});


// ✅ Fetch schedules nga i njëjti API si DashboardPage
useEffect(() => {
  async function fetchSchedules() {
    try {
      const res = await fetch("/api/admin/dashboard");
      if (!res.ok) throw new Error(`Failed to fetch schedules: ${res.status}`);
      const data = await res.json();

      // në DashboardPage, schedules vijnë brenda objektit kryesor
      setSchedules(data.schedules || []);
    } catch (err) {
      console.error("❌ Error fetching schedules:", err);
      setSchedules([]);
    }
  }

  fetchSchedules();
}, []);

  return (
    <AdminLayout>
      <div className="p-6">
        {/* 🧭 Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#04436F]">Kunden Verwaltung</h1>
          <p className="text-gray-500 text-sm mt-1">
            Übersicht über Kunden, Urlaubsanfragen, Buchungen und Aktivitäten
          </p>
        </div>

        {/* 🧭 Top Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">
          {/* Left side — Aktive Kunden */}
          <DashboardCard title="Aktive Kunden">
            <ActiveClients clients={clients} />
          </DashboardCard>

          {/* Right side — Urlaub Anträge */}
          <DashboardCard title="Urlaub Anträge">
            {vacations?.length > 0 ? (
              <ul className="space-y-3 max-h-[400px] overflow-auto pr-2">
                {vacations
                  .filter((v) => v.user)
                  .map((v) => (
                    <li
                      key={v.id}
                      className="p-4 border rounded-2xl bg-white shadow-sm hover:shadow-md transition"
                    >
                      {/* Client info */}
                      <p className="font-semibold text-gray-800">
                        {v.user.firstName} {v.user.lastName}
                      </p>
                      <p className="text-xs text-gray-600 mb-2">
                        {new Date(v.startDate).toLocaleDateString()} →{" "}
                        {new Date(v.endDate).toLocaleDateString()}
                      </p>
{/* Action button */}
<div className="flex flex-wrap gap-2 mb-2">
  {v.user?.phone && (
    <button
      onClick={() => window.open(`tel:${v.user.phone}`)}
      className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
    >
      Anruf
    </button>
  )}
</div>

                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm italic">Keine Urlaubsanträge</p>
            )}
          </DashboardCard>

<DashboardCard title="📅 Buchungen">
  <div className="p-4">
    {/* FILTER BUTTONS */}
<div className="flex items-center gap-2 mb-4">
  {[
    ["today", "Heute"],
    ["thisWeek", "Diese Woche"],
    ["thisMonth", "Diesen Monat"],
    ["nextMonth", "Nächsten Monat"],
  ].map(([key, label]) => (
    <button
      key={key}
      onClick={() => setFilter(key)}
      className={`
        px-3 py-1.5 text-xs rounded-full border font-medium transition
        ${
          filter === key
            ? "bg-[#04436F] text-white border-[#04436F]"
            : "bg-white text-[#04436F] border-[#04436F]/40 hover:bg-[#04436F]/10"
        }
      `}
    >
      {label}
    </button>
  ))}
</div>

    {schedules.length > 0 ? (
      <ul className="max-h-[400px] overflow-auto pr-2 space-y-3">
{filteredSchedules.slice(0, 20).map((s) => {
  console.log("🔍 Schedule object:", s);
  console.log("👤 s.user:", s.user);
  console.log("📌 s.userId:", s.userId);

  return (
    <li
      key={s.id}
      className="p-4 bg-white rounded-xl border shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
    >
      {/* LEFT INFO */}
      <div className="flex-1">
        {/* Client Name */}
        <p
          onClick={() => window.open(`/admin/clients/${s.user?.id}`, "_blank")}
          className="font-semibold text-gray-800 hover:text-[#04436F] hover:underline cursor-pointer text-sm"
        >
          {s.user
            ? `${s.user.firstName} ${s.user.lastName}`
            : "— Kein Kunde —"}
        </p>

        {/* Service + Date */}
        <p className="text-gray-600 text-xs mt-1">
          {s.serviceName || s.subServiceName || "Service"} ·{" "}
          {s.date
            ? new Date(s.date).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : `${s.day || ""} ${s.startTime || ""}`}
        </p>

        {s.employee && (
          <p className="text-xs text-gray-500 mt-1">
            Mitarbeiter: {s.employee.firstName} {s.employee.lastName}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <span
          className={`px-3 py-1 text-xs rounded-full border font-medium
            ${
              s.status === "active"
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : s.status === "completed"
                ? "bg-green-50 text-green-700 border-green-200"
                : s.status === "cancelled"
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-gray-50 text-gray-700 border-gray-200"
            }
          `}
        >
          {s.status || "pending"}
        </span>

        <button
          onClick={() => setSelectedSchedule(s)}
          className="px-3 py-1.5 text-xs bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 shadow-sm"
        >
         Stornieren
        </button>


      </div>
    </li>
  );
})}

      </ul>
    ) : (
      <p className="text-gray-500 italic">Keine Buchungen verfügbar</p>
    )}
  </div>
  
</DashboardCard>


        </div>

        {/* 👥 Kundenübersicht — full width */}
        <DashboardCard title="Kundenübersicht">
          <ClientTable clients={clients} />
        </DashboardCard>
      </div>
        {selectedSchedule && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl">
      <h3 className="text-lg font-semibold mb-4 text-[#04436F]">
        Was möchten Sie tun?
      </h3>

      <p className="text-gray-700 mb-6">
        Möchten Sie diesen Termin stornieren oder einen neuen Termin erstellen?
      </p>

      <div className="flex justify-between gap-4">
  <button
  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full"
  onClick={() => {
    setCancelQuestion(selectedSchedule); // hap modalin e pyetjes
    setSelectedSchedule(null);
  }}
>
  Termin stornieren
</button>


 <button
  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full"
  onClick={() => {
    setSelectedSchedule(null);
    setEditSchedule({ ...selectedSchedule, createNew: true });
  }}
>
  Neuen Termin erstellen
</button>

      </div>

      <button
        className="mt-4 w-full py-2 bg-gray-300 rounded hover:bg-gray-400"
        onClick={() => setSelectedSchedule(null)}
      >
        Abbrechen
      </button>
    </div>
  </div>
)}
{editSchedule && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
      <h3 className="text-lg font-semibold text-[#04436F] mb-4">
        Termin bearbeiten
      </h3>

      <div className="space-y-3">

        {/* DATE */}
        <input
          className="border p-2 rounded w-full"
          type="date"
          value={editSchedule.date?.split("T")[0] || ""}
          onChange={(e) =>
            setEditSchedule({
              ...editSchedule,
              date: e.target.value
            })
          }
        />

        {/* TIME */}
        <input
          className="border p-2 rounded w-full"
          type="time"
          value={editSchedule.startTime || ""}
          onChange={(e) =>
            setEditSchedule({
              ...editSchedule,
              startTime: e.target.value
            })
          }
        />

        {/* HOURS */}
        <input
          className="border p-2 rounded w-full"
          type="number"
          placeholder="Stunden"
          value={editSchedule.hours || ""}
          onChange={(e) =>
            setEditSchedule({
              ...editSchedule,
              hours: e.target.value
            })
          }
        />

        {/* SERVICE */}
        <select
          className="border p-2 rounded w-full"
          value={editSchedule.serviceName || ""}
          onChange={(e) => {
            setEditSchedule({
              ...editSchedule,
              serviceName: e.target.value,
              subServiceName: "" // reset subservice kur ndryshon service
            });
          }}
        >
          <option value="">Service auswählen</option>
          {allServices.map((service) => (
            <option key={service.id} value={service.name}>
              {service.name}
            </option>
          ))}
        </select>

        {/* SUBSERVICE */}
        <select
          className="border p-2 rounded w-full"
          value={editSchedule.subServiceName || ""}
          onChange={(e) =>
            setEditSchedule({
              ...editSchedule,
              subServiceName: e.target.value
            })
          }
        >
          <option value="">Unterdienst auswählen</option>

          {allServices
            .find((s) => s.name === editSchedule.serviceName)
            ?.subServices?.map((sub) => (
              <option key={sub.id} value={sub.name}>
                {sub.name}
              </option>
            ))}
        </select>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setEditSchedule(null)}
          className="px-4 py-2 bg-gray-300 rounded w-full"
        >
          Abbrechen
        </button>

        <button
          onClick={saveEditedSchedule}
          className="px-4 py-2 bg-green-600 text-white rounded w-full"
        >
          Speichern
        </button>
      </div>
    </div>
  </div>
)}
{cancelQuestion && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl">

      <h3 className="text-lg font-semibold mb-4 text-[#04436F]">
        Wer storniert diesen Termin?
      </h3>

      <p className="text-gray-700 mb-4">
        Bitte wählen Sie, wer die Stornierung durchführt.
      </p>

      <div className="flex gap-3">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded w-full hover:bg-blue-700"
          onClick={() => handleCancelWithEmail(cancelQuestion, "kunde")}
        >
          Kunde
        </button>

        <button
          className="px-4 py-2 bg-green-600 text-white rounded w-full hover:bg-green-700"
          onClick={() => handleCancelWithEmail(cancelQuestion, "employee")}
        >
          Mitarbeiter
        </button>
      </div>

      <button
        className="mt-4 w-full py-2 bg-gray-300 rounded hover:bg-gray-400"
        onClick={() => setCancelQuestion(null)}
      >
        Abbrechen
      </button>
    </div>
  </div>
)}

    </AdminLayout>

    
  );


}
