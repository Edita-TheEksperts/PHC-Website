import { useState } from "react";
import { ChevronDown, ChevronRight, Search } from "lucide-react";

export default function ActiveClients({ clients }) {
  const [open, setOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

  const activeClients = clients.filter(
    (c) => c.assignments && c.assignments.length > 0
  );

  // Apply search filter
  const filteredClients = activeClients.filter((client) => {
    const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  // Limit number shown unless "showAll" is true
  const visibleClients = showAll ? filteredClients : filteredClients.slice(0, 5);

  return (
    <div className="my-6 bg-white rounded-2xl shadow-md border">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-[#04436F] font-bold text-lg border-b hover:bg-gray-50 rounded-t-2xl"
      >
        <div className="flex items-center gap-2">
          Active Clients
          <span className="text-sm font-medium text-gray-500">
            ({activeClients.length})
          </span>
        </div>
        {open ? (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {/* Content */}
      {open && (
        <div className="p-4 space-y-4">
          {/* Search Filter */}
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
          {visibleClients.length === 0 ? (
            <p className="text-sm text-gray-500">Keine passenden Clients gefunden.</p>
          ) : (
            visibleClients.map((client) => {
              const initials = `${client.firstName?.[0] || ""}${client.lastName?.[0] || ""}`;
              return (
                <div
                  key={client.id}
                  className="flex items-center gap-4 p-3 rounded-xl border bg-gray-50 hover:bg-gray-100 transition-all shadow-sm"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm uppercase shadow-inner">
                    {initials || "?"}
                  </div>
                  {/* Name + Info */}
                  <div>
                    <p className="text-base font-semibold text-gray-800">
                      {client.firstName || "—"} {client.lastName || ""}
                    </p>
                    <p className="text-sm text-gray-500">
                      Assignments: {client.assignments?.length}
                    </p>
                  </div>
                </div>
              );
            })
          )}

          {/* Show More / Less */}
          {filteredClients.length > 5 && (
            <div className="text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                {showAll ? "Weniger anzeigen" : `Mehr anzeigen (${filteredClients.length - 5})`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
