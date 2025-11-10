import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import EmployeesOnAssignment from "../components/EmployeesOnAssignment";
import AppointmentCalendar from "../components/AppointmentCalendar";
import EmployeeTable from "../components/EmployeeTable";

import { useRouter } from "next/router";

export default function MitarbeiterVerwaltungPage() {
  const [employees, setEmployees] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [vacations, setVacations] = useState([]);
  const [approvedEmployees, setApprovedEmployees] = useState([]);
  const [clients, setClients] = useState([]);
  const employeeVacations = vacations.filter((v) => v.employee);

  async function fetchVacations() {
    try {
      const res = await fetch("/api/admin/vacations");
      const data = await res.json();
      if (Array.isArray(data)) setVacations(data);
      else if (Array.isArray(data.vacations)) setVacations(data.vacations);
      else setVacations([]);
    } catch (err) {
      console.error("Error fetching vacations:", err);
      setVacations([]);
    }
  }

  async function fetchData() {
    const res = await fetch("/api/admin/dashboard");
    const data = await res.json();

    const allEmployees = data.employees || [];
    setEmployees(allEmployees);
    setApprovedEmployees(allEmployees.filter((emp) => emp.status === "approved"));
    setClients(data.clients || []);
    setSchedules(data.schedules || []);
  }

  useEffect(() => {
    fetchData();
    fetchVacations();
  }, []);

  async function handleApproval(emp) {
    await fetch("/api/approve-employee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emp.email }),
    });
    setEmployees((prev) =>
      prev.map((e) => (e.id === emp.id ? { ...e, status: "approved" } : e))
    );
  }

  async function handleRejection(emp) {
    await fetch("/api/reject-employee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emp.email }),
    });
    setEmployees((prev) =>
      prev.map((e) => (e.id === emp.id ? { ...e, status: "rejected" } : e))
    );
  }

  async function handleInvite(emp) {
    await fetch("/api/invite-employee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emp.email, firstName: emp.firstName }),
    });
    setEmployees((prev) =>
      prev.map((e) => (e.id === emp.id ? { ...e, invited: true } : e))
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-[#04436F]">Mitarbeiter Verwaltung</h1>
          <p className="text-gray-500 text-sm mt-1">
            Übersicht über Mitarbeiter, Einsätze und Termine
          </p>
        </div>

        {/* --- TOP SECTION (3 CARDS) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Urlaub Anträge */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border">
            <h2 className="text-lg font-semibold text-[#04436F] mb-4 flex items-center gap-2">
              Urlaub Anträge
            </h2>

            {vacations?.length > 0 ? (
              <ul className="space-y-3 max-h-[260px] overflow-auto pr-2">
                {employeeVacations.map((v) => (
                  <li key={v.id} className="p-4 border rounded-xl bg-white shadow-sm">
                    <p className="font-semibold text-gray-800">
                      {v.employee?.firstName} {v.employee?.lastName}
                    </p>
                    <p className="text-xs text-gray-600 mb-2">
                      {new Date(v.startDate).toLocaleDateString()} →{" "}
                      {new Date(v.endDate).toLocaleDateString()}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-2">
                      {v.employee?.phone && (
                        <button
                          onClick={() => window.open(`tel:${v.employee.phone}`)}
                          className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
                        >
                          Anruf
                        </button>
                      )}

                      <button
                        onClick={async () => {
                          const res = await fetch(
                            `/api/admin/vacations/suggestions?vacationId=${v.id}`
                          );
                          const data = await res.json();
                          v.suggestions = data;
                          setVacations([...vacations]);
                        }}
                        className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600"
                      >
                        Vorschläge
                      </button>

                      {v.status === "pending" && (
                        <>
                          <button
                            onClick={async () => {
                              await fetch("/api/employee/update-vacation", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  vacationId: v.id,
                                  action: "approve",
                                }),
                              });
                              setVacations((prev) =>
                                prev.map((x) =>
                                  x.id === v.id
                                    ? { ...x, status: "approved" }
                                    : x
                                )
                              );
                            }}
                            className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700"
                          >
                            Genehmigen
                          </button>

                          <button
                            onClick={async () => {
                              await fetch("/api/employee/update-vacation", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  vacationId: v.id,
                                  action: "decline",
                                }),
                              });
                              setVacations((prev) =>
                                prev.map((x) =>
                                  x.id === v.id
                                    ? { ...x, status: "declined" }
                                    : x
                                )
                              );
                            }}
                            className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600"
                          >
                            Ablehnen
                          </button>
                        </>
                      )}
                    </div>

                    {v.suggestions && v.suggestions.length > 0 && (
                      <div className="bg-gray-50 p-2 rounded-lg border text-xs">
                        <p className="font-semibold text-gray-700 mb-1">
                          💡 Alternativen:
                        </p>
                        <ul className="space-y-2">
                          {v.suggestions.map((s, i) => (
                            <li
                              key={i}
                              className="flex justify-between items-center p-2 bg-white border rounded-lg"
                            >
                              <div>
                                <p>
                                  {new Date(s.startDate).toLocaleDateString()} →{" "}
                                  {new Date(s.endDate).toLocaleDateString()}
                                </p>
                                <p className="font-medium">
                                  👷 {s.employee.firstName} {s.employee.lastName}
                                </p>
                              </div>

                              <div className="flex gap-2">
                                {s.employee.phone && (
                                  <button
                                    onClick={() =>
                                      window.open(`tel:${s.employee.phone}`)
                                    }
                                    className="px-2 py-1 bg-blue-500 text-white text-[10px] rounded-lg hover:bg-blue-600"
                                  >
                                    📞
                                  </button>
                                )}

                                <button
                                  onClick={async () => {
                                    await fetch("/api/admin/vacation/assign", {
                                      method: "PATCH",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify({
                                        vacationId: v.id,
                                        newEmployeeId: s.employee.id,
                                      }),
                                    });
                                    setVacations((prev) =>
                                      prev.map((x) =>
                                        x.id === v.id
                                          ? { ...x, employee: s.employee }
                                          : x
                                      )
                                    );
                                    alert(" Mitarbeiter zugewiesen!");
                                  }}
                                  className="px-2 py-1 bg-green-600 text-white text-[10px] rounded-lg hover:bg-green-700"
                                >
                                  ✅
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <span
                      className={`mt-2 inline-block text-xs px-2 py-1 rounded ${
                        v.status === "approved"
                          ? "bg-green-100 text-green-600"
                          : v.status === "declined"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      Status: {v.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm italic">
                Keine Urlaubsanträge
              </p>
            )}
          </div>

          {/* Termine */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border">
            <h2 className="text-lg font-semibold text-[#04436F] mb-4 flex items-center gap-2">
              Termine
            </h2>
            <AppointmentCalendar schedules={schedules} />
          </div>

          {/* Mitarbeiter Zuweisung */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border">
            <EmployeesOnAssignment employees={employees} />
          </div>
        </div>

        {/* --- EMPLOYEE TABLE (BOTTOM FULL WIDTH) --- */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border">
          <EmployeeTable
            employees={employees}
            onApprove={handleApproval}
            onReject={handleRejection}
            onInvite={handleInvite}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
