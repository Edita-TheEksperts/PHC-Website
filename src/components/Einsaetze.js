import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { useRouter } from "next/router";

export default function Einsaetze() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("aktive");
  const [loading, setLoading] = useState(true);

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
  // RENDER LIST FUNCTION — UPDATED
  // -----------------------------
  const renderList = (list) => {
    if (!list || list.length === 0)
      return <p className="text-gray-500">Nothing to show.</p>;

    return (
      <div className="space-y-3 mt-4">
        {list.map((item) => (
          <div
            key={item.id}
onClick={() => router.push(`/admin/einsaetze/${item.id}`)}
            className="p-4 bg-white shadow rounded border border-gray-200 cursor-pointer hover:bg-blue-50 transition"
          >
            {/* DATE */}
            <p>
              <strong>Datum:</strong> {formatDate(item.date)}
            </p>

            {/* FALLBACK TIME */}
            <p>
              <strong>Zeit:</strong> {item.startTime || "Keine Zeit"}
            </p>

            {/* FALLBACK HOURS */}
            <p>
              <strong>Stunden:</strong> {item.hours || "—"}
            </p>

            {/* USER / CLIENT */}
            {item.user && (
              <p>
                <strong>Kunde:</strong>{" "}
                {item.user.firstName} {item.user.lastName}
              </p>
            )}

            {/* EMPLOYEE */}
            <p>
              <strong>Mitarbeiter:</strong>{" "}
              {item.employee
                ? `${item.employee.firstName} ${item.employee.lastName}`
                : "Kein Mitarbeiter zugewiesen"}
            </p>

            {/* STATUS */}
            {item.status && (
              <p>
                <strong>Status:</strong> {item.status}
              </p>
            )}

            {/* CONFIRMATION */}
            {item.confirmationStatus && (
              <p>
                <strong>Bestätigung:</strong> {item.confirmationStatus}
              </p>
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
          {activeTab === "aktive" && renderList(data.aktive)}
          {activeTab === "vergangene" && renderList(data.vergangene)}
          {activeTab === "stornierte" && renderList(data.stornierte)}
          {activeTab === "abgeänderte" && renderList(data.abgeänderte)}
          {activeTab === "offeneZuweisungen" &&
            renderList(data.offeneZuweisungen)}
          {activeTab === "rejected" && renderList(data.rejected)}
        </div>
      </div>
    </AdminLayout>
  );
}
