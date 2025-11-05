import { useState } from "react";
import { ChevronDown, ChevronRight, Search } from "lucide-react";

export default function EmployeesOnAssignment({ employees }) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("assigned"); // ✅ default assigned
  const [showAll, setShowAll] = useState(false);

  const assignedEmployees = employees.filter((e) =>
    e.assignments?.some((a) => a.status === "active")
  );

  const freeEmployees = employees.filter(
    (e) => !e.assignments?.some((a) => a.status === "active")
  );

  // Pick list based on filter
  const list = filter === "assigned" ? assignedEmployees : freeEmployees;

  const filtered = list.filter((emp) => {
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const visible = showAll ? filtered : filtered.slice(0, 5);

  return (
    <div className="my-10">
      {/* Title */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left bg-white p-4 rounded-2xl shadow-md border hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-2 text-xl font-bold text-[#04436F]">
          Mitarbeiter Zuweisung
          <span className="text-sm text-gray-500">({assignedEmployees.length})</span>
        </div>
        {open ? <ChevronDown className="h-5 w-5 text-gray-500" /> : <ChevronRight className="h-5 w-5 text-gray-500" />}
      </button>

      {open && (
        <div className="mt-4 flex flex-col gap-4">

          {/* Filter buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("assigned")}
              className={`px-3 py-1 rounded-lg text-xs ${
                filter === "assigned"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              🟢 Zugewiesen ({assignedEmployees.length})
            </button>

            <button
              onClick={() => setFilter("free")}
              className={`px-3 py-1 rounded-lg text-xs ${
                filter === "free"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              ⚪ Nicht zugewiesen ({freeEmployees.length})
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Suche nach Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm pl-10 pr-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          {/* List */}
          {visible.length === 0 ? (
            <p className="text-sm text-gray-500">Keine Mitarbeiter gefunden.</p>
          ) : (
            visible.map((emp) => {
              const initials = `${emp.firstName?.[0]}${emp.lastName?.[0]}`;
              const activeCount = emp.assignments?.filter((a) => a.status === "active").length;

              return (
                <div key={emp.id} className="bg-white p-4 rounded-2xl shadow-md border flex items-center gap-4 hover:bg-gray-50">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-semibold text-green-700 uppercase text-sm">
                    {initials}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {emp.firstName} {emp.lastName}
                    </p>
                    {filter === "assigned" && (
                      <p className="text-sm text-gray-500">Aktive Einsätze: {activeCount}</p>
                    )}
                    {filter === "free" && (
                      <p className="text-sm text-gray-500">Noch nicht zugewiesen</p>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* Show more */}
          {filtered.length > 5 && (
            <div className="text-center">
              <button onClick={() => setShowAll(!showAll)} className="text-sm text-blue-600 hover:underline font-medium">
                {showAll ? "Weniger anzeigen" : `Mehr anzeigen (${filtered.length - 5})`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
