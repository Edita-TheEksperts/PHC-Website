import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";

export default function WorkingTimeTracking({ employees }) {
  const [openIndex, setOpenIndex] = useState(null);
  const [showAssignedOnly, setShowAssignedOnly] = useState(false);

  useEffect(() => {
    console.log("Employees prop:", employees);
  }, [employees]);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredEmployees = showAssignedOnly
    ? employees.filter((e) =>
        e.assignments?.some((a) => a.user?.schedules?.length > 0)
      )
    : employees;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border my-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#04436F] flex items-center gap-2">
          Working Time Tracking
        </h2>

        <button
          onClick={() => setShowAssignedOnly((prev) => !prev)}
          className="flex items-center text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-100 transition"
        >
          <Filter size={16} className="mr-1" />
          {showAssignedOnly ? "Show All" : "Show Assigned Only"}
        </button>
      </div>

      {filteredEmployees.length === 0 ? (
        <p className="text-gray-500 text-sm italic">
          No employees found for this filter.
        </p>
      ) : (
        <div className="space-y-4">
          {filteredEmployees.map((e, index) => {
            const isOpen = openIndex === index;

        
            const allSchedules =
              e.assignments?.flatMap((a) => {
                console.log("➡️ Assignment user:", a.user?.firstName);
                console.log("📅 Schedules:", a.user?.schedules);
                return a.user?.schedules || [];
              }) || [];

            const totalHours = allSchedules.reduce(
              (sum, s) => sum + (s.hours || 0),
              0
            );

            console.log(`✅ Total hours for ${e.firstName}:`, totalHours);

            return (
              <div
                key={e.id}
                className="border rounded-xl p-4 shadow-sm bg-gray-50 transition-all"
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggle(index)}
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {e.firstName} {e.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      Total Hours:{" "}
                      <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {totalHours} hrs/week
                      </span>
                    </p>
                  </div>
                  {isOpen ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </div>

                {isOpen && (
                  <ul className="mt-4 space-y-2 text-sm text-gray-700 pl-2">
                    {allSchedules.length > 0 ? (
                      allSchedules.map((s) => (
                        <li
                          key={s.id}
                          className="flex justify-between border rounded-md px-3 py-2 bg-white"
                        >
                          <span>📅 {s.day}</span>
                          <span>
                            {s.startTime} → {s.hours}h
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-400 italic">
                        No schedule assigned
                      </li>
                    )}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
