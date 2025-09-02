import { useEffect, useState } from "react";

export default function EmployeeScheduleList({ email }) {
  const [employeeId, setEmployeeId] = useState(null);
  const [schedules, setSchedules] = useState([]);

  // Step 1: get employeeId by email
  useEffect(() => {
    async function fetchEmployee() {
      const res = await fetch(`/api/auth/getEmployeeId?email=${email}`);
      const data = await res.json();
      setEmployeeId(data.id);
    }
    if (email) fetchEmployee();
  }, [email]);

  // Step 2: fetch schedules
  useEffect(() => {
    async function fetchSchedules() {
      if (!employeeId) return;
      const res = await fetch(`/api/employee/schedules?employeeId=${employeeId}`);
      const data = await res.json();
      setSchedules(data);
    }
    fetchSchedules();
  }, [employeeId]);

  return (
    <section className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-semibold text-[#04436F] mb-6">
        Meine Einsätze
      </h2>

      {schedules.length > 0 ? (
        <ul className="space-y-3">
          {schedules.map((s) => (
            <li
              key={s.id}
              className="flex justify-between items-center border p-4 rounded-lg"
            >
              <div>
                <p className="font-medium">
                  {s.day} – {s.startTime} – {s.hours} Std
                </p>

                {/* Client info */}
                {s.user ? (
                  <p className="text-sm text-gray-500">
                    Kunde: {s.user.firstName} {s.user.lastName}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">Kein Kunde zugeordnet</p>
                )}

                {/* Employee info */}
                {s.employee ? (
                  <p className="text-sm text-gray-400">
                    Mitarbeiter: {s.employee.firstName} {s.employee.lastName}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400">
                    Kein Mitarbeiter zugeordnet
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Keine Einsätze gefunden</p>
      )}
    </section>
  );
}
