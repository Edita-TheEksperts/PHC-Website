import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { useRouter } from "next/router";

export default function Einsaetze() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("aktive");
  const [loading, setLoading] = useState(true);

  const [selectedItem, setSelectedItem] = useState(null); // details modal
  const [editItem, setEditItem] = useState(null); // edit modal

  const [allServices, setAllServices] = useState([]); // services list
  const [allEmployees, setAllEmployees] = useState([]); // employees for assign

  // ✅ modal messages (NO alert)
  const [assignMsg, setAssignMsg] = useState({ type: "", text: "" });
  const [assignLoading, setAssignLoading] = useState(false);

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const [employeeSearch, setEmployeeSearch] = useState("");

  const [filter, setFilter] = useState("all");
  const router = useRouter();

  const formatDate = (dateValue) => {
    if (!dateValue) return "Kein Datum";
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return "Kein Datum";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // helper: accept only approved/accepted employees
  const isAcceptedStatus = (status) => {
    const s = (status || "").toLowerCase();
    return s === "approved" || s === "accepted";
  };

  // -----------------------------
  // FILTER FUNCTION
  // -----------------------------
  const applyFilter = (list) => {
    if (!list) return [];

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return list.filter((item) => {
      if (!item.date) return false;
      const d = new Date(item.date);

      // TIME FILTERS
      switch (filter) {
        case "today":
          if (d.toDateString() !== today.toDateString()) return false;
          break;

        case "thisWeek": {
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          if (d < weekStart || d > weekEnd) return false;
          break;
        }

        case "thisMonth":
          if (
            d.getMonth() !== today.getMonth() ||
            d.getFullYear() !== today.getFullYear()
          )
            return false;
          break;

        case "nextMonth": {
          const nextMonth = (today.getMonth() + 1) % 12;
          const nextYear =
            nextMonth === 0 ? today.getFullYear() + 1 : today.getFullYear();

          if (d.getMonth() !== nextMonth || d.getFullYear() !== nextYear)
            return false;
          break;
        }

        case "all":
        default:
          break;
      }

      // DATE RANGE
      if (dateFrom && d < new Date(dateFrom)) return false;
      if (dateTo && d > new Date(dateTo)) return false;

      // CLIENT SEARCH
      if (clientSearch) {
        const fullName =
          `${item.user?.firstName || ""} ${item.user?.lastName || ""}`
            .toLowerCase()
            .trim();
        if (!fullName.includes(clientSearch.toLowerCase().trim())) return false;
      }

      // EMPLOYEE SEARCH
      if (employeeSearch) {
        const empName =
          `${item.employee?.firstName || ""} ${item.employee?.lastName || ""}`
            .toLowerCase()
            .trim();
        if (!empName.includes(employeeSearch.toLowerCase().trim())) return false;
      }

      return true;
    });
  };

  // -----------------------------
  // SAVE EDIT
  // -----------------------------
  const saveEditedEinsatz = async () => {
    try {
      const res = await fetch(`/api/admin/schedules/${editItem.id}/edit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editItem),
      });

      const updated = await res.json();

      if (!res.ok || !updated || updated.error) {
        console.error("❌ Update error:", updated);
        return;
      }

      setData((prev) => {
        const newData = { ...prev };

        // mark old as storniert
        for (const key of Object.keys(newData)) {
          if (Array.isArray(newData[key])) {
            newData[key] = newData[key].map((e) =>
              e.id === editItem.id ? { ...e, status: "storniert" } : e
            );
          }
        }

        // push new to aktive
        newData.aktive = [updated, ...(newData.aktive || [])];
        newData.aktive.sort((a, b) => new Date(a.date) - new Date(b.date));

        return newData;
      });

      setEditItem(null);
    } catch (err) {
      console.error("❌ Fehler beim Speichern:", err);
    }
  };

  // -----------------------------
  // ✅ ASSIGN EMPLOYEE (NO refresh + message inside modal)
  // -----------------------------
  const assignEmployeeToSchedule = async () => {
    if (!selectedItem?.id || !selectedItem?.employeeId) {
      setAssignMsg({ type: "error", text: "Bitte Mitarbeiter auswählen!" });
      return;
    }

    setAssignLoading(true);
    setAssignMsg({ type: "", text: "" });

    try {
      const res = await fetch("/api/admin/assign-employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: selectedItem.id,
          userId: selectedItem.user?.id,
          employeeId: selectedItem.employeeId,
        }),
      });

      const updatedSchedule = await res.json();

      if (!res.ok) {
        console.error("❌ Assign failed:", updatedSchedule);
        setAssignMsg({
          type: "error",
          text: updatedSchedule.message || "Assign fehlgeschlagen",
        });
        return;
      }

      // ✅ 1) Update ALL LISTS
      setData((prev) => {
        const newData = { ...prev };

        for (const key of Object.keys(newData)) {
          if (Array.isArray(newData[key])) {
            newData[key] = newData[key].map((s) =>
              s.id === updatedSchedule.id ? updatedSchedule : s
            );
          }
        }

        return newData;
      });

      // ✅ 2) Update selectedItem (modal) -> show employee immediately
      setSelectedItem(updatedSchedule);

      // ✅ success message inside modal
      setAssignMsg({ type: "success", text: "✅ Mitarbeiter wurde zugewiesen." });
    } catch (err) {
      console.error("❌ Assign error:", err);
      setAssignMsg({ type: "error", text: "Serverfehler beim Zuweisen." });
    } finally {
      setAssignLoading(false);
    }
  };

  // -----------------------------
  // LOAD DATA
  // -----------------------------
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/einsaetze");
        const json = await res.json();
        setData(json);
        setLoading(false);
      } catch (err) {
        console.error("Error loading einsaetze:", err);
      }
    };
    load();
  }, []);

  // Load services
  useEffect(() => {
    async function fetchServices() {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      setAllServices(Array.isArray(data) ? data : []);
    }
    fetchServices();
  }, []);

  // Load employees for dropdown
  useEffect(() => {
    async function fetchEmployees() {
      const res = await fetch("/api/admin/employees");
      const employees = await res.json();
      const safe = Array.isArray(employees) ? employees : [];
      setAllEmployees(safe.filter((e) => isAcceptedStatus(e.status)));
    }
    fetchEmployees();
  }, []);

  if (loading) return <AdminLayout>Loading…</AdminLayout>;
  if (!data) return <AdminLayout>No data found.</AdminLayout>;

  // -----------------------------
  // RENDER LIST FUNCTION
  // -----------------------------
const renderList = (list) => {
  if (!list || list.length === 0)
    return <p className="text-gray-500 mt-4">Nothing to show.</p>;

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-sm text-gray-700">
          <tr>
            <th className="px-4 py-3 text-left">Erstellt am</th>
            <th className="px-4 py-3 text-left">Zeit</th>
            <th className="px-4 py-3 text-left">Stunden</th>
            <th className="px-4 py-3 text-left">Kunde</th>
            <th className="px-4 py-3 text-left">Mitarbeiter</th>
            <th className="px-4 py-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody className="divide-y text-sm">
          {list.map((item) => (
            <tr
              key={item.id}
              onClick={() => {
                setSelectedItem(item);
                setAssignMsg({ type: "", text: "" });
                setAssignLoading(false);
              }}
              className={`
                cursor-pointer transition
                ${
                  item.status === "storniert" || item.status === "cancelled"
                    ? "bg-red-50 hover:bg-red-100"
                    : "hover:bg-blue-50"
                }
              `}
            >
              <td className="px-4 py-3">{formatDate(item.date)}</td>
              <td className="px-4 py-3">{item.startTime || "—"}</td>
              <td className="px-4 py-3">{item.hours || "—"}</td>

              <td className="px-4 py-3">
                {item.user
                  ? `${item.user.firstName} ${item.user.lastName}`
                  : "—"}
              </td>

              <td className="px-4 py-3">
                {item.employee
                  ? `${item.employee.firstName} ${item.employee.lastName}`
                  : "Nicht zugewiesen"}
              </td>

              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${
                      item.status === "storniert" ||
                      item.status === "cancelled"
                        ? "bg-red-200 text-red-800"
                        : "bg-green-100 text-green-800"
                    }
                  `}
                >
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


  // -----------------------------
  // PAGE UI
  // -----------------------------
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-5">Einsätze Übersicht</h1>

        {/* FILTER BAR */}
        <div className="flex flex-wrap gap-3 mb-6 mt-1">
          {[
            { id: "all", label: "Alle" },
            { id: "today", label: "Heute" },
            { id: "thisWeek", label: "Diese Woche" },
            { id: "thisMonth", label: "Dieser Monat" },
            { id: "nextMonth", label: "Nächster Monat" },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              className={`
                px-4 py-2 rounded-full font-medium transition-all duration-200
                border shadow-sm 
                ${
                  filter === btn.id
                    ? "bg-blue-600 text-white shadow-md scale-105"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400"
                }
              `}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* SEARCH + DATE FILTERS */}
        <div className="flex flex-wrap gap-3 mb-4">
          <input
            type="text"
            placeholder="Kunde suchen..."
            className="border p-2 rounded"
            value={clientSearch}
            onChange={(e) => setClientSearch(e.target.value)}
          />

          <input
            type="text"
            placeholder="Mitarbeiter suchen..."
            className="border p-2 rounded"
            value={employeeSearch}
            onChange={(e) => setEmployeeSearch(e.target.value)}
          />

          <input
            type="date"
            className="border p-2 rounded"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />

          <input
            type="date"
            className="border p-2 rounded"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>

        {/* TABS */}
        <div className="flex gap-2 border-b pb-2">
          {[
            { id: "aktive", label: "Aktive Einsätze" },
            { id: "vergangene", label: "Vergangene Einsätze" },
            { id: "stornierte", label: "Stornierte Einsätze" },
            { id: "abgeänderte", label: "Abgeänderte Einsätze" },
            { id: "offeneZuweisungen", label: "Offene Zuweisungen" },
            { id: "rejected", label: "Abgelehnte Einsätze" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t font-medium ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="mt-4">
          {activeTab === "aktive" && renderList(applyFilter(data.aktive))}
          {activeTab === "vergangene" && renderList(applyFilter(data.vergangene))}
          {activeTab === "stornierte" && renderList(applyFilter(data.stornierte))}
          {activeTab === "abgeänderte" && renderList(applyFilter(data.abgeänderte))}
          {activeTab === "offeneZuweisungen" &&
            renderList(applyFilter(data.offeneZuweisungen))}
          {activeTab === "rejected" && renderList(applyFilter(data.rejected))}
        </div>
      </div>

      {/* DETAILS MODAL + ASSIGN */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl">
            <h2 className="text-xl font-semibold text-[#04436F] mb-4">
              Einsatz Details
            </h2>

            <div className="space-y-2 text-sm">
              <p>
                <strong>Datum:</strong> {formatDate(selectedItem.date)}
              </p>
              <p>
                <strong>Zeit:</strong> {selectedItem.startTime}
              </p>
              <p>
                <strong>Stunden:</strong> {selectedItem.hours}
              </p>

              {selectedItem.user && (
                <p>
                  <strong>Kunde:</strong> {selectedItem.user.firstName}{" "}
                  {selectedItem.user.lastName}
                </p>
              )}

              <p>
                <strong>Mitarbeiter:</strong>{" "}
                {selectedItem.employee
                  ? `${selectedItem.employee.firstName} ${selectedItem.employee.lastName}`
                  : "Kein Mitarbeiter zugewiesen"}
              </p>

              <p>
                <strong>Status:</strong> {selectedItem.status}
              </p>
            </div>

            {/* ✅ Message inside modal */}
            {assignMsg.text && (
              <div
                className={`mt-4 p-3 rounded border text-sm ${
                  assignMsg.type === "success"
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}
              >
                {assignMsg.text}
              </div>
            )}

            {/* ASSIGN FORM only if none assigned */}
            {!selectedItem.employee && (
              <div className="mt-5 border-t pt-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Mitarbeiter zuweisen
                </p>

                <select
                  className="w-full border rounded-lg p-2"
                  value={selectedItem.employeeId || ""}
                  onChange={(e) => {
                    setAssignMsg({ type: "", text: "" });
                    setSelectedItem((prev) => ({
                      ...prev,
                      employeeId: e.target.value,
                    }));
                  }}
                >
                  <option value="" disabled>
                    -- Mitarbeiter auswählen --
                  </option>

                  {allEmployees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName}
                    </option>
                  ))}
                </select>

                <button
                  onClick={assignEmployeeToSchedule}
                  disabled={!selectedItem.employeeId || assignLoading}
                  className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm disabled:bg-gray-300"
                >
                  {assignLoading ? "Zuweisen..." : "Mitarbeiter zuweisen"}
                </button>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setSelectedItem(null);
                  setAssignMsg({ type: "", text: "" });
                  setAssignLoading(false);
                }}
                className="px-4 py-2 bg-gray-300 rounded w-full"
              >
                Schliessen
              </button>

              <button
                onClick={() => {
                  setEditItem({
                    ...selectedItem,
                    userId: selectedItem.user?.id,
                    employeeId: selectedItem.employee?.id || null,
                  });
                  setSelectedItem(null);
                  setAssignMsg({ type: "", text: "" });
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded w-full"
              >
                Bearbeiten
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-[#04436F] mb-4">
              Einsatz bearbeiten
            </h3>

            <div className="space-y-3">
              <input
                className="border p-2 rounded w-full"
                type="date"
                value={editItem.date?.split("T")[0] || ""}
                onChange={(e) =>
                  setEditItem({ ...editItem, date: e.target.value })
                }
              />

              <input
                className="border p-2 rounded w-full"
                type="time"
                value={editItem.startTime || ""}
                onChange={(e) =>
                  setEditItem({ ...editItem, startTime: e.target.value })
                }
              />

              <input
                className="border p-2 rounded w-full"
                type="number"
                placeholder="Stunden"
                value={editItem.hours || ""}
                onChange={(e) =>
                  setEditItem({ ...editItem, hours: e.target.value })
                }
              />

              <select
                className="border p-2 rounded w-full"
                value={editItem.serviceName || ""}
                onChange={(e) =>
                  setEditItem({
                    ...editItem,
                    serviceName: e.target.value,
                    subServiceName: "",
                  })
                }
              >
                <option value="">Service auswählen</option>
                {allServices.map((service) => (
                  <option key={service.id} value={service.name}>
                    {service.name}
                  </option>
                ))}
              </select>

              <select
                className="border p-2 rounded w-full"
                value={editItem.subServiceName || ""}
                onChange={(e) =>
                  setEditItem({ ...editItem, subServiceName: e.target.value })
                }
              >
                <option value="">Unterdienst auswählen</option>
                {allServices
                  .find((s) => s.name === editItem.serviceName)
                  ?.subServices?.map((sub) => (
                    <option key={sub.id} value={sub.name}>
                      {sub.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditItem(null)}
                className="px-4 py-2 bg-gray-300 rounded w-full"
              >
                Abbrechen
              </button>

              <button
                onClick={saveEditedEinsatz}
                className="px-4 py-2 bg-green-600 text-white rounded w-full"
              >
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
