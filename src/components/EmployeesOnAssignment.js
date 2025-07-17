import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function EmployeesOnAssignment({ employees }) {
  const [open, setOpen] = useState(false);

  // Filter only employees with active assignments
  const onAssignment = employees.filter((e) =>
    e.assignments?.some((a) => a.status === "active")
  );

  return (
    <div className="my-10">
      {/* Title Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left bg-white p-4 rounded-2xl shadow-md border hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-2 text-xl font-bold text-[#04436F]">
          Employees on Assignment
          <span className="text-sm text-gray-500">({onAssignment.length})</span>
        </div>
        {open ? (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {/* Dropdown Content - now one employee per row */}
      {open && (
        <div className="mt-4 flex flex-col gap-4">
          {onAssignment.map((emp) => (
            <div
              key={emp.id}
              className="bg-white p-4 rounded-2xl shadow-md border flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-semibold text-green-700">
                {emp.firstName?.[0] || "?"}
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  {emp.firstName} {emp.lastName}
                </p>
                <p className="text-sm text-gray-500">
                  Assignments:{" "}
                  {
                    emp.assignments?.filter((a) => a.status === "active")
                      .length
                  }
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
