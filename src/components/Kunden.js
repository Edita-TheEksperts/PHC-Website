import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import ClientTable from "../components/ClientTable";
import DashboardCard from "../components/DashboardCard";
import ActiveClients from "../components/ActiveClients";

export default function AdminKundenPage() {
  const [clients, setClients] = useState([]);
  const [vacations, setVacations] = useState([]);
  const [schedules, setSchedules] = useState([]);

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

    {/* 📅 Buchungen (NEW) */}
<DashboardCard title=" Buchungen">
  <div className="p-4">
    {schedules.length > 0 ? (
      <ul className="divide-y divide-gray-200 max-h-[400px] overflow-auto pr-2">
        {schedules.slice(0, 10).map((s) => (
          <li
            key={s.id}
            className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              {/* 👤 Client Name */}
      <p
  onClick={() => window.open(`/admin/clients/${s.user?.id}`, "_blank")}
  className="font-semibold text-gray-800 hover:text-[#04436F] hover:underline cursor-pointer"
>
  {s.user
    ? `${s.user.firstName} ${s.user.lastName}`
    : "— Kein Kunde —"}
</p>


              {/* 🛠 Service & Date */}
              <p className="text-gray-600 text-xs">
                {s.serviceName || s.subServiceName || "Service"} –{" "}
                {s.date
                  ? new Date(s.date).toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : `${s.day || ""} ${s.startTime || ""}`}
              </p>

              {/* 👨‍💼 Optional: Employee Name */}
              {s.employee && (
                <p className="text-xs text-gray-500">
                  Mitarbeiter: {s.employee.firstName} {s.employee.lastName}
                </p>
              )}
            </div>

            {/* 🟢 Status */}
            <span
              className={`mt-2 sm:mt-0 px-2 py-1 text-xs rounded self-start sm:self-center ${
                s.status === "active"
                  ? "bg-blue-100 text-blue-700"
                  : s.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : s.status === "cancelled"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {s.status || "pending"}
            </span>
          </li>
        ))}
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
    </AdminLayout>
  );
}
