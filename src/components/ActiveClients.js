import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function ActiveClients({ clients }) {
  const [open, setOpen] = useState(true); // Default open

  const activeClients = clients.filter(
    (c) => c.assignments && c.assignments.length > 0
  );

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
        <div className="p-4 space-y-3">
          {activeClients.map((client) => {
            const initials = `${client.firstName?.[0] || ""}${client.lastName?.[0] || ""}`;

            return (
              <div
                key={client.id}
                className="flex items-center gap-4 p-4 rounded-xl border bg-gray-50 hover:bg-gray-100 transition-all shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm uppercase">
                  {initials || "?"}
                </div>
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
          })}
        </div>
      )}
    </div>
  );
}
