import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { useRouter } from "next/router";

export default function Einsaetze() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("aktive");
  const [loading, setLoading] = useState(true);

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
  const applyFilter = (list, filter) => {
    if (!list) return [];

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return list.filter((item) => {
      const d = new Date(item.date);
      if (isNaN(d.getTime())) return false;

      switch (filter) {
        case "today":
          return d.toDateString() === today.toDateString();

        case "thisWeek": {
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          return d >= weekStart && d <= weekEnd;
        }

        case "thisMonth":
          return (
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear()
          );

        case "nextMonth": {
          const nextMonth = (today.getMonth() + 1) % 12;
          const year = nextMonth === 0 ? today.getFullYear() + 1 : today.getFullYear();
          return d.getMonth() === nextMonth && d.getFullYear() === year;
        }

        default:
          return true;
      }
    });
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
            onClick={() => console.log("Clicked item", item.id)}
            className="p-4 bg-white shadow rounded border border-gray-200 cursor-pointer hover:bg-blue-50 transition"
          >
            <p><strong>Datum:</strong> {formatDate(item.date)}</p>
            <p><strong>Zeit:</strong> {item.startTime || "Keine Zeit"}</p>
            <p><strong>Stunden:</strong> {item.hours || "—"}</p>

            {item.user && (
              <p>
                <strong>Kunde:</strong>{" "}
                {item.user.firstName} {item.user.lastName}
              </p>
            )}

            <p>
              <strong>Mitarbeiter:</strong>{" "}
              {item.employee
                ? `${item.employee.firstName} ${item.employee.lastName}`
                : "Kein Mitarbeiter zugewiesen"}
            </p>

            {item.status && (
              <p><strong>Status:</strong> {item.status}</p>
            )}

            {item.confirmationStatus && (
              <p><strong>Bestätigung:</strong> {item.confirmationStatus}</p>
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
    </AdminLayout>
  );
}
