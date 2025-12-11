import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import EmployeesOnAssignment from "../components/EmployeesOnAssignment";
import AppointmentCalendar from "../components/AppointmentCalendar";
import EmployeeTable from "../components/EmployeeTable";

import DashboardCard from "../components/DashboardCard";

import { useRouter } from "next/router";

export default function MitarbeiterVerwaltungPage() {
  const [employees, setEmployees] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [vacations, setVacations] = useState([]);
  const [approvedEmployees, setApprovedEmployees] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
const [editSchedule, setEditSchedule] = useState(null);
const [allServices, setAllServices] = useState([]);
const [cancelQuestion, setCancelQuestion] = useState(null);
  const employeeVacations = vacations.filter((v) => v.employee);
  const [bookingFilter, setBookingFilter] = useState("");


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
function matchesBookingFilter(schedule) {
  if (!bookingFilter) return true;
  if (!schedule.date) return false;

  const date = new Date(schedule.date);
  const today = new Date();

  // TODAY
  if (bookingFilter === "today") {
    return date.toDateString() === today.toDateString();
  }

  // THIS WEEK
  if (bookingFilter === "week") {
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay()); // Sunday
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    return date >= start && date < end;
  }

  // CURRENT MONTH
  if (bookingFilter === "month") {
    return (
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  // NEXT MONTH
  if (bookingFilter === "next_month") {
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    return (
      date.getMonth() === nextMonth.getMonth() &&
      date.getFullYear() === nextMonth.getFullYear()
    );
  }

  return true;
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
  useEffect(() => {
  async function fetchServices() {
    const res = await fetch("/api/admin/services");
    const data = await res.json();
    setAllServices(Array.isArray(data) ? data : []); // SIGURIM që është array
  }
  fetchServices();
}, []);

  async function handleCancel(id) {
  await fetch(`/api/admin/schedules/${id}/cancel`, {
    method: "PATCH",
  });

  // refresh data
  fetchDashboardData?.();
}
async function saveEditedSchedule() {
  const res = await fetch(`/api/admin/schedules/${editSchedule.id}/edit`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(editSchedule),
  });

  const newSchedule = await res.json();

  setSchedules(prev => [
    // Shto termin e ri
    newSchedule,
    // Mbaji të tjerët, por termini i vjetër tani ka status cancelled
    ...prev.map(s =>
      s.id === editSchedule.id
        ? { ...s, status: "cancelled" }
        : s
    )
  ]);

  setEditSchedule(null);
}

async function handleCancelWithEmail(schedule, cancelledBy) {
  try {
    // 1) Anulo termin dhe dërgo automatikisht email
    await fetch(`/api/admin/schedules/${schedule.id}/cancel?cancelledBy=${cancelledBy}`, {
      method: "PATCH",
    });

    // 2) Mbyll modalin
    setCancelQuestion(null);

    // 3) Përditëso UI lokalisht
    setSchedules(prev =>
      prev.map(s =>
        s.id === schedule.id ? { ...s, status: "cancelled" } : s
      )
    );

  } catch (error) {
    console.error("❌ Fehler beim Stornieren:", error);
  }
}



// ✅ Fetch schedules nga i njëjti API si DashboardPage
useEffect(() => {
  async function fetchSchedules() {
    try {
      const res = await fetch("/api/admin/dashboard");
      if (!res.ok) throw new Error(`Failed to fetch schedules: ${res.status}`);
      const data = await res.json();

      // në DashboardPage, schedules vijnë brenda objektit kryesor
      setSchedules(data.schedules || []);
    } catch (err) {
      console.error("❌ Error fetching schedules:", err);
      setSchedules([]);
    }
  }

  fetchSchedules();
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Urlaub Anträge */}
<div className="bg-white rounded-2xl shadow-sm p-6 border h-[680px] flex flex-col">
  <h2 className="text-lg font-semibold text-[#04436F] mb-4">
    Urlaub Anträge
  </h2>

  {vacations?.length > 0 ? (
    <ul className="space-y-3 overflow-auto pr-2 flex-grow">
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
<DashboardCard title="📅 Buchungen">
{/* FILTER BUTTONS */}
<div className="flex items-center gap-3 mb-4">

  <button
    onClick={() => setBookingFilter("today")}
    className={`px-4 py-2 rounded-lg text-sm font-medium border 
      ${bookingFilter === "today" 
        ? "bg-blue-600 text-white border-blue-600" 
        : "bg-white text-gray-700 border-gray-300"}`}
  >
    Heute
  </button>

  <button
    onClick={() => setBookingFilter("week")}
    className={`px-4 py-2 rounded-lg text-sm font-medium border 
      ${bookingFilter === "week"
        ? "bg-blue-600 text-white border-blue-600"
        : "bg-white text-gray-700 border-gray-300"}`}
  >
    Diese Woche
  </button>

  <button
    onClick={() => setBookingFilter("month")}
    className={`px-4 py-2 rounded-lg text-sm font-medium border 
      ${bookingFilter === "month"
        ? "bg-blue-600 text-white border-blue-600"
        : "bg-white text-gray-700 border-gray-300"}`}
  >
    Dieser Monat
  </button>

  <button
    onClick={() => setBookingFilter("next_month")}
    className={`px-4 py-2 rounded-lg text-sm font-medium border 
      ${bookingFilter === "next_month"
        ? "bg-blue-600 text-white border-blue-600"
        : "bg-white text-gray-700 border-gray-300"}`}
  >
    Nächster Monat
  </button>

  <button
    onClick={() => setBookingFilter("")}
    className="px-4 py-2 rounded-lg text-sm font-medium border bg-gray-100 text-gray-700 hover:bg-gray-200"
  >
    Filter zurücksetzen
  </button>
</div>


  <div className="p-4">
    {schedules.length > 0 ? (
      <ul className="max-h-[550px] overflow-auto pr-2 space-y-3">
{schedules
  .filter(matchesBookingFilter)
  .slice(0, 10)
  .map((s) => {
  console.log("🔍 Schedule object:", s);
  console.log("👤 s.user:", s.user);
  console.log("📌 s.userId:", s.userId);

  return (
    <li
      key={s.id}
      className="p-4 bg-white rounded-xl border shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
    >
      {/* LEFT INFO */}
      <div className="flex-1">
        {/* Client Name */}
        <p
          onClick={() => window.open(`/admin/clients/${s.user?.id}`, "_blank")}
          className="font-semibold text-gray-800 hover:text-[#04436F] hover:underline cursor-pointer text-sm"
        >
          {s.user
            ? `${s.user.firstName} ${s.user.lastName}`
            : "— Kein Kunde —"}
        </p>

        {/* Service + Date */}
        <p className="text-gray-600 text-xs mt-1">
          {s.serviceName || s.subServiceName || "Service"} ·{" "}
          {s.date
            ? new Date(s.date).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : `${s.day || ""} ${s.startTime || ""}`}
        </p>

        {s.employee && (
          <p className="text-xs text-gray-500 mt-1">
            Mitarbeiter: {s.employee.firstName} {s.employee.lastName}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <span
          className={`px-3 py-1 text-xs rounded-full border font-medium
            ${
              s.status === "active"
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : s.status === "completed"
                ? "bg-green-50 text-green-700 border-green-200"
                : s.status === "cancelled"
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-gray-50 text-gray-700 border-gray-200"
            }
          `}
        >
          {s.status || "pending"}
        </span>

        <button
          onClick={() => setSelectedSchedule(s)}
          className="px-3 py-1.5 text-xs bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 shadow-sm"
        >
          Stornieren
        </button>


      </div>
    </li>
  );
})}

      </ul>
    ) : (
      <p className="text-gray-500 italic">Keine Buchungen verfügbar</p>
    )}
  </div>
</DashboardCard>

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
              {selectedSchedule && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl">
      <h3 className="text-lg font-semibold mb-4 text-[#04436F]">
        Was möchten Sie tun?
      </h3>

      <p className="text-gray-700 mb-6">
        Möchten Sie diesen Termin stornieren oder einen neuen Termin erstellen?
      </p>

      <div className="flex justify-between gap-4">
  <button
  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full"
  onClick={() => {
    setCancelQuestion(selectedSchedule); // hap modalin e pyetjes
    setSelectedSchedule(null);
  }}
>
  Termin stornieren
</button>


 <button
  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full"
  onClick={() => {
    setSelectedSchedule(null);
    setEditSchedule({ ...selectedSchedule, createNew: true });
  }}
>
  Neuen Termin erstellen
</button>

      </div>

      <button
        className="mt-4 w-full py-2 bg-gray-300 rounded hover:bg-gray-400"
        onClick={() => setSelectedSchedule(null)}
      >
        Abbrechen
      </button>
    </div>
  </div>
)}
{editSchedule && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
      <h3 className="text-lg font-semibold text-[#04436F] mb-4">
        Termin bearbeiten
      </h3>

      <div className="space-y-3">

        {/* DATE */}
        <input
          className="border p-2 rounded w-full"
          type="date"
          value={editSchedule.date?.split("T")[0] || ""}
          onChange={(e) =>
            setEditSchedule({
              ...editSchedule,
              date: e.target.value
            })
          }
        />

        {/* TIME */}
        <input
          className="border p-2 rounded w-full"
          type="time"
          value={editSchedule.startTime || ""}
          onChange={(e) =>
            setEditSchedule({
              ...editSchedule,
              startTime: e.target.value
            })
          }
        />

        {/* HOURS */}
        <input
          className="border p-2 rounded w-full"
          type="number"
          placeholder="Stunden"
          value={editSchedule.hours || ""}
          onChange={(e) =>
            setEditSchedule({
              ...editSchedule,
              hours: e.target.value
            })
          }
        />

        {/* SERVICE */}
        <select
          className="border p-2 rounded w-full"
          value={editSchedule.serviceName || ""}
          onChange={(e) => {
            setEditSchedule({
              ...editSchedule,
              serviceName: e.target.value,
              subServiceName: "" // reset subservice kur ndryshon service
            });
          }}
        >
          <option value="">Service auswählen</option>
          {allServices.map((service) => (
            <option key={service.id} value={service.name}>
              {service.name}
            </option>
          ))}
        </select>

        {/* SUBSERVICE */}
        <select
          className="border p-2 rounded w-full"
          value={editSchedule.subServiceName || ""}
          onChange={(e) =>
            setEditSchedule({
              ...editSchedule,
              subServiceName: e.target.value
            })
          }
        >
          <option value="">Unterdienst auswählen</option>

          {allServices
            .find((s) => s.name === editSchedule.serviceName)
            ?.subServices?.map((sub) => (
              <option key={sub.id} value={sub.name}>
                {sub.name}
              </option>
            ))}
        </select>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setEditSchedule(null)}
          className="px-4 py-2 bg-gray-300 rounded w-full"
        >
          Abbrechen
        </button>

        <button
          onClick={saveEditedSchedule}
          className="px-4 py-2 bg-green-600 text-white rounded w-full"
        >
          Speichern
        </button>
      </div>
    </div>
  </div>
)}
{cancelQuestion && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl">

      <h3 className="text-lg font-semibold mb-4 text-[#04436F]">
        Wer storniert diesen Termin?
      </h3>

      <p className="text-gray-700 mb-4">
        Bitte wählen Sie, wer die Stornierung durchführt.
      </p>

      <div className="flex gap-3">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded w-full hover:bg-blue-700"
          onClick={() => handleCancelWithEmail(cancelQuestion, "kunde")}
        >
          Kunde
        </button>

        <button
          className="px-4 py-2 bg-green-600 text-white rounded w-full hover:bg-green-700"
          onClick={() => handleCancelWithEmail(cancelQuestion, "employee")}
        >
          Mitarbeiter
        </button>
      </div>

      <button
        className="mt-4 w-full py-2 bg-gray-300 rounded hover:bg-gray-400"
        onClick={() => setCancelQuestion(null)}
      >
        Abbrechen
      </button>
    </div>
  </div>
)}

    </AdminLayout>
  );
}
