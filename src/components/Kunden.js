import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import ClientTable from "../components/ClientTable";
import DashboardCard from "../components/DashboardCard";
import ActiveClients from "../components/ActiveClients";

export default function AdminKundenPage() {
  const [clients, setClients] = useState([]);
  const [vacations, setVacations] = useState([]);

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

  return (
    <AdminLayout>
      <div className="p-6">
        {/* 🧭 Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#04436F]">Kunden Verwaltung</h1>
          <p className="text-gray-500 text-sm mt-1">
            Übersicht über Kunden, Urlaubsanfragen und Aktivitäten
          </p>
        </div>

        {/* 🧭 Top Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">
          {/* Left side — Aktive Kunden */}
          <DashboardCard title="Aktive Kunden">
            <ActiveClients clients={clients} />
          </DashboardCard>

          {/* Right side — Urlaub Anträge (New Design) */}
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

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {v.user?.phone && (
                          <button
                            onClick={() => window.open(`tel:${v.user.phone}`)}
                            className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
                          >
                            Anruf
                          </button>
                        )}

                        {v.status === "pending" && (
                          <>
                            <button
                              onClick={async () => {
                                await fetch("/api/employee/update-vacation", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({
                                    vacationId: v.id,
                                    action: "approve",
                                  }),
                                });
                                setVacations((prev) =>
                                  prev.map((x) =>
                                    x.id === v.id
                                      ? { ...x, status: "approved" }
                                      : x
                                  )
                                );
                              }}
                              className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700"
                            >
                              Genehmigen
                            </button>

                            <button
                              onClick={async () => {
                                await fetch("/api/employee/update-vacation", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({
                                    vacationId: v.id,
                                    action: "decline",
                                  }),
                                });
                                setVacations((prev) =>
                                  prev.map((x) =>
                                    x.id === v.id
                                      ? { ...x, status: "declined" }
                                      : x
                                  )
                                );
                              }}
                              className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600"
                            >
                              Ablehnen
                            </button>
                          </>
                        )}
                      </div>

                      {/* Status */}
                      <span
                        className={`mt-2 inline-block text-xs px-2 py-1 rounded ${
                          v.status === "approved"
                            ? "bg-green-100 text-green-600"
                            : v.status === "declined"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        Status: {v.status}
                      </span>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm italic">Keine Urlaubsanträge</p>
            )}
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
