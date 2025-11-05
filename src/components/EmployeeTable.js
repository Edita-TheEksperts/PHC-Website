import { useRouter } from "next/router";
import { useState } from "react";

export default function EmployeeTable({ employees, onApprove, onReject, onInvite }) {
  console.log("EMPLOYEES:", employees);

  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [inviteFilter, setInviteFilter] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const [sortOrder, setSortOrder] = useState("");

  const statusLabels = {
    approved: "Genehmigt",
    pending: "Ausstehend",
    rejected: "Abgelehnt",
  };

  const formatDate = (date) => {
    if (!date) return "—";
    const d = new Date(date);
    if (isNaN(d)) return "—";
    return d.toLocaleDateString("de-DE");
  };

  const handleSendDocument = (emp, type) => {
    console.log(`Send ${type} to`, emp.email);

    fetch("/api/send-documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employee: emp, documentType: type }),
    })
      .then((res) => res.json())
      .then(() => {
        alert(`📧 ${type} wurde an ${emp.email} gesendet.`);
      })
      .catch((err) => console.error(err));
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesName = `${emp.firstName} ${emp.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? emp.status === statusFilter : true;
    const matchesInvite =
      inviteFilter === "invited"
        ? emp.invited
        : inviteFilter === "not_invited"
        ? !emp.invited
        : true;

    return matchesName && matchesStatus && matchesInvite;
  });

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (!a.createdAt || !b.createdAt) return 0;
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    if (sortOrder === "newest") return dateB - dateA;
    if (sortOrder === "oldest") return dateA - dateB;
    return 0;
  });

  const visibleEmployees = sortedEmployees.slice(0, visibleCount);

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#04436F] mb-4">Mitarbeiter</h2>

      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Nach Name filtern</label>
          <input
            type="text"
            placeholder="e.g. John"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm w-60"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Nach Status filtern</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm w-44"
          >
            <option value="">Alle Status</option>
            <option value="approved">Genehmigt</option>
            <option value="pending">Ausstehend</option>
            <option value="rejected">Abgelehnt</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Nach Einladungsstatus filtern</label>
          <select
            value={inviteFilter}
            onChange={(e) => setInviteFilter(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm w-44"
          >
            <option value="">Alle</option>
            <option value="invited">Eingeladen</option>
            <option value="not_invited">Nicht eingeladen</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Sortieren nach Datum</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm w-44"
          >
            <option value="">Standard</option>
            <option value="newest">Neueste zuerst</option>
            <option value="oldest">Älteste zuerst</option>
          </select>
        </div>

        <button
          onClick={() => {
            setSearchTerm("");
            setStatusFilter("");
            setInviteFilter("");
            setSortOrder("");
          }}
          className="bg-gray-200 text-sm px-4 py-2 rounded-md hover:bg-gray-300"
        >
          Filter löschen
        </button>
      </div>

      {/* Desktop */}
<div className="hidden sm:block bg-white rounded-xl shadow overflow-x-auto max-w-[100%]">
        <table className="min-w-[900px] w-full text-sm text-gray-700">
          <thead className="bg-gray-100">
            <tr className="bg-gray-100 text-sm text-gray-700 uppercase tracking-wide">
              <th className="p-3 text-left">Erstellt am</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">E-Mail</th>
              <th className="p-3 text-left">Telefon</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Aktionen</th>
            </tr>
          </thead>

          <tbody className="text-sm text-gray-700">
            {visibleEmployees.map((emp) => (
              <tr key={emp.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{formatDate(emp.createdAt)}</td>
                <td className="p-3">{emp.firstName} {emp.lastName}</td>
                <td className="p-3">{emp.email}</td>
                <td className="p-3">{emp.phone || "—"}</td>
                <td className="p-3 capitalize font-semibold">
                  {statusLabels[emp.status] || emp.status}
                </td>
<td className="p-2">
  <div className="flex flex-wrap gap-1">
    {emp.status === "pending" && (
      <>
        <button
          onClick={() => onApprove(emp)}
          className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded-md text-xs font-medium shadow-sm"
        >
          ✓ Genehmigen
        </button>
        <button
          onClick={() => onReject(emp)}
          className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-md text-xs font-medium shadow-sm"
        >
          ✕ Ablehnen
        </button>
        {!emp.invited && (
          <button
            onClick={() => onInvite(emp)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded-md text-xs font-medium shadow-sm"
          >
            ✉ Einladen
          </button>
        )}
      </>
    )}

    <button
      onClick={() => router.push(`/admin/employees/${emp.id}`)}
      className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-md text-xs font-medium shadow-sm"
    >
      Details
    </button>
    <button
      onClick={() => handleSendDocument(emp, 'Auflösungschreiben')}
      className="bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded-md text-xs font-medium shadow-sm"
    >
      Auflösung
    </button>
    <button
      onClick={() => handleSendDocument(emp, 'KündigungMA')}
      className="bg-orange-600 hover:bg-orange-700 text-white px-2 py-1 rounded-md text-xs font-medium shadow-sm"
    >
      Kündigung MA
    </button>
    <button
      onClick={() => handleSendDocument(emp, 'KündigungMAFristlos')}
      className="bg-red-800 hover:bg-red-900 text-white px-2 py-1 rounded-md text-xs font-medium shadow-sm"
    >
      Fristlos
    </button>
  </div>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="sm:hidden flex flex-col gap-4">
        {visibleEmployees.map((emp) => (
          <div
            key={emp.id}
            className="bg-white p-4 rounded-xl shadow space-y-3 border border-gray-100"
          >
            <p className="font-semibold text-[#04436F] text-lg">
              {emp.firstName} {emp.lastName}
            </p>
            <p><span className="font-semibold">E-Mail:</span> {emp.email}</p>
            <p><span className="font-semibold">Telefon:</span> {emp.phone || "—"}</p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span className="capitalize font-semibold">
                {statusLabels[emp.status] || emp.status}
              </span>
            </p>
            <p>
              <span className="font-semibold">Erstellt am:</span>{" "}
              {formatDate(emp.createdAt)}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {emp.status === "pending" && (
                <>
                  <button
                    onClick={() => onApprove(emp)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm shadow-sm transition flex-1"
                  >
                    Genehmigen
                  </button>
                  <button
                    onClick={() => onReject(emp)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm shadow-sm transition flex-1"
                  >
                    Ablehnen
                  </button>
                  {!emp.invited && (
                    <button
                      onClick={() => onInvite(emp)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm shadow-sm transition flex-1"
                    >
                      Einladen
                    </button>
                  )}
                </>
              )}

              <button
                onClick={() => router.push(`/admin/employees/${emp.id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm shadow-sm transition flex-1"
              >
                Details
              </button>
              <button
                onClick={() => handleSendDocument(emp, "Auflösungschreiben")}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm shadow-sm transition flex-1"
              >
                Auflösung
              </button>
              <button
                onClick={() => handleSendDocument(emp, "KündigungMA")}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm shadow-sm transition flex-1"
              >
                Kündigung MA
              </button>
              <button
                onClick={() => handleSendDocument(emp, "KündigungMAFristlos")}
                className="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded-md text-sm shadow-sm transition flex-1"
              >
                Kündigung fristlos
              </button>
            </div>
          </div>
        ))}
      </div>

      {visibleCount < filteredEmployees.length && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 10)}
            className="px-5 py-2 bg-[#04436F] text-white font-semibold rounded-lg shadow hover:bg-[#033252] transition"
          >
            Mehr laden
          </button>
        </div>
      )}
    </div>
  );
}
