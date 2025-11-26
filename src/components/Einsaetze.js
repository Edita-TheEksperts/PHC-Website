import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { useRouter } from "next/router";

export default function Einsaetze() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("aktive");
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);   // modal details
const [editItem, setEditItem] = useState(null);           // modal edit
const [allServices, setAllServices] = useState([]);       // services list

const [dateFrom, setDateFrom] = useState("");
const [dateTo, setDateTo] = useState("");

const [clientSearch, setClientSearch] = useState("");
const [employeeSearch, setEmployeeSearch] = useState("");

  const [filter, setFilter] = useState("all"); // <= FILTER STATE

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

    // ----------- TIME FILTERS -----------
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

    // ----------- DATE RANGE FILTER -----------
    if (dateFrom && d < new Date(dateFrom)) return false;
    if (dateTo && d > new Date(dateTo)) return false;

    // ----------- CLIENT FILTER -----------
    if (clientSearch) {
      const fullName =
        `${item.user?.firstName || ""} ${item.user?.lastName || ""}`
          .toLowerCase()
          .trim();

      if (!fullName.includes(clientSearch.toLowerCase().trim())) return false;
    }

    // ----------- EMPLOYEE FILTER -----------
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

const saveEditedEinsatz = async () => {
  try {
    console.log("🟦 SENDING EDIT REQUEST...");
    console.log("🟦 editItem BEFORE SEND:", editItem);

    const res = await fetch(`/api/admin/schedules/${editItem.id}/edit`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editItem),
    });

    console.log("🟩 SERVER RESPONSE STATUS:", res.status);

    const updated = await res.json();

    console.log("🟩 UPDATED RESPONSE:", updated);

    if (!updated || updated.error) {
      console.log("❌ SERVER REPORTED ERROR:", updated);
    }
setData((prev) => {
  const newData = { ...prev };

  // 1️⃣ Ndrysho statusin e terminit të vjetër në "storniert"
  for (const key of Object.keys(newData)) {
    if (Array.isArray(newData[key])) {
      newData[key] = newData[key].map((e) =>
        e.id === editItem.id ? { ...e, status: "storniert" } : e
      );
    }
  }

  // 2️⃣ Shto NEW schedule tek aktive
  newData.aktive = [updated, ...newData.aktive];

  // 3️⃣ (Opsionale) Rendit sipas datës
  newData.aktive.sort((a, b) => new Date(a.date) - new Date(b.date));

  return newData;
});


    setEditItem(null);
    console.log("✅ Modal closed");
  } catch (err) {
    console.error("❌ Fehler beim Speichern:", err);
  }
};

  // LOAD DATA
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

  useEffect(() => {
  async function fetchServices() {
    const res = await fetch("/api/admin/services");
    const data = await res.json();
    setAllServices(Array.isArray(data) ? data : []);
  }
  fetchServices();
}, []);


  if (loading) return <AdminLayout>Loading…</AdminLayout>;
  if (!data) return <AdminLayout>No data found.</AdminLayout>;

  // -----------------------------
  // RENDER LIST FUNCTION
  // -----------------------------
  const renderList = (list) => {
    if (!list || list.length === 0)
      return <p className="text-gray-500">Nothing to show.</p>;


    return (
      <div className="space-y-3 mt-4">
        {list.map((item) => (
<div
  key={item.id}
  onClick={() => setSelectedItem(item)}
  className={`
    p-4 shadow rounded border cursor-pointer transition
    ${item.status === "storniert" || item.status === "cancelled"
      ? "bg-red-100 border-red-300 hover:bg-red-200"
      : "bg-white border-gray-200 hover:bg-blue-50"
    }
  `}
>
  <p><strong>Datum:</strong> {formatDate(item.date)}</p>
  <p><strong>Zeit:</strong> {item.startTime || "Keine Zeit"}</p>
  <p><strong>Stunden:</strong> {item.hours || "—"}</p>

  {item.user && (
    <p>
      <strong>Kunde:</strong> {item.user.firstName} {item.user.lastName}
    </p>
  )}

  <p>
    <strong>Mitarbeiter:</strong>{" "}
    {item.employee
      ? `${item.employee.firstName} ${item.employee.lastName}`
      : "Kein Mitarbeiter zugewiesen"}
  </p>

  <p><strong>Status:</strong> {item.status}</p>

  {(item.status === "storniert" || item.status === "cancelled") && (
    <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold bg-red-200 text-red-700 rounded">
      Storniert
    </span>
  )}
</div>

        ))}
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

        {/* FILTER BUTTONS */}
{/* FILTER BAR — Redesigned */}
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
        ${filter === btn.id
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

  {/* CLIENT SEARCH */}
  <input
    type="text"
    placeholder="Kunde suchen..."
    className="border p-2 rounded"
    value={clientSearch}
    onChange={(e) => setClientSearch(e.target.value)}
  />

  {/* EMPLOYEE SEARCH */}
  <input
    type="text"
    placeholder="Mitarbeiter suchen..."
    className="border p-2 rounded"
    value={employeeSearch}
    onChange={(e) => setEmployeeSearch(e.target.value)}
  />

  {/* DATE FROM */}
  <input
    type="date"
    className="border p-2 rounded"
    value={dateFrom}
    onChange={(e) => setDateFrom(e.target.value)}
  />

  {/* DATE TO */}
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
          {activeTab === "aktive" && renderList(applyFilter(data.aktive, filter))}
          {activeTab === "vergangene" && renderList(applyFilter(data.vergangene, filter))}
          {activeTab === "stornierte" && renderList(applyFilter(data.stornierte, filter))}
          {activeTab === "abgeänderte" && renderList(applyFilter(data.abgeänderte, filter))}
          {activeTab === "offeneZuweisungen" &&
            renderList(applyFilter(data.offeneZuweisungen, filter))}
          {activeTab === "rejected" && renderList(applyFilter(data.rejected, filter))}
        </div>
      </div>
      {selectedItem && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl">

      <h2 className="text-xl font-semibold text-[#04436F] mb-4">
        Einsatz Details
      </h2>

      <div className="space-y-2 text-sm">
        <p><strong>Datum:</strong> {formatDate(selectedItem.date)}</p>
        <p><strong>Zeit:</strong> {selectedItem.startTime}</p>
        <p><strong>Stunden:</strong> {selectedItem.hours}</p>

        <p><strong>Service:</strong> {selectedItem.serviceName || "—"}</p>
        <p><strong>Subservice:</strong> {selectedItem.subServiceName || "—"}</p>

        {selectedItem.user && (
          <p>
            <strong>Kunde:</strong> {selectedItem.user.firstName}{" "}
            {selectedItem.user.lastName}
          </p>
        )}

        {selectedItem.employee && (
          <p>
            <strong>Mitarbeiter:</strong> {selectedItem.employee.firstName}{" "}
            {selectedItem.employee.lastName}
          </p>
        )}

        <p><strong>Status:</strong> {selectedItem.status}</p>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setSelectedItem(null)}
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
}}


          className="px-4 py-2 bg-blue-600 text-white rounded w-full"
        >
          Bearbeiten
        </button>
      </div>
    </div>
  </div>
)}
{editItem && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
      <h3 className="text-lg font-semibold text-[#04436F] mb-4">
        Einsatz bearbeiten
      </h3>

      <div className="space-y-3">

        {/* DATE */}
        <input
          className="border p-2 rounded w-full"
          type="date"
          value={editItem.date?.split("T")[0] || ""}
          onChange={(e) =>
            setEditItem({ ...editItem, date: e.target.value })
          }
        />

        {/* TIME */}
        <input
          className="border p-2 rounded w-full"
          type="time"
          value={editItem.startTime || ""}
          onChange={(e) =>
            setEditItem({ ...editItem, startTime: e.target.value })
          }
        />

        {/* HOURS */}
        <input
          className="border p-2 rounded w-full"
          type="number"
          placeholder="Stunden"
          value={editItem.hours || ""}
          onChange={(e) =>
            setEditItem({ ...editItem, hours: e.target.value })
          }
        />

        {/* SERVICE */}
        <select
          className="border p-2 rounded w-full"
          value={editItem.serviceName || ""}
          onChange={(e) => {
            setEditItem({
              ...editItem,
              serviceName: e.target.value,
              subServiceName: "",
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
