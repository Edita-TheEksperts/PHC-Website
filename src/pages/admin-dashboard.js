import { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import { Ticket, CheckCircle, PauseCircle, Clock } from "lucide-react"

import AdminLayout from "../components/AdminLayout";
import DashboardCard from "../components/DashboardCard";
import ActiveClients from "../components/ActiveClients";
import EmployeesOnAssignment from "../components/EmployeesOnAssignment";
import AppointmentCalendar from "../components/AppointmentCalendar";
import ApplicationOverview from "../components/ApplicationOverview";
import WorkingTimeTracking from "../components/WorkingTimeTracking";
import OvertimeAlerts from "../components/OvertimeAlerts";
import EmployeeClientConnections from "../components/EmployeeClientConnections";
import CurrentRevenue from "../components/CurrentRevenue";
import EmployeeTable from "../components/EmployeeTable";
import ClientTable from "../components/ClientTable";
import { useRouter } from "next/router";

import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
    Legend, 
} from "recharts";

export default function DashboardPage() {
  const [employees, setEmployees] = useState([]);
  const [approvedEmployees, setApprovedEmployees] = useState([]);
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState("");
  const [warnings, setWarnings] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [sourceData, setSourceData] = useState([]);
  const [andereDetails, setAndereDetails] = useState([]);
  const [vacations, setVacations] = useState([]);

const [activity, setActivity] = useState([
  {
    actor: "Admin",
    action: "approved John Doe",
    timestamp: "2025-08-01T10:00:00Z",
  },
  {
    actor: "System",
    action: "sent reminder to Anna",
    timestamp: "2025-08-01T08:30:00Z",
  },
]);

  useEffect(() => {
    fetchData();
    fetchStats();
    fetchWarnings();
      fetchVacations();   // 👈 add this

  }, []);
useEffect(() => {
  fetchData();
  fetchStats();
  fetchWarnings();
  fetchVacations();   // 👈 add this
}, []);

const [voucherStats, setVoucherStats] = useState({});


useEffect(() => {
  async function fetchVoucherStats() {
    try {
      const res = await fetch("/api/admin/vouchers/status");
      const data = await res.json();
      setVoucherStats(data);
    } catch (err) {
      console.error("❌ Error fetching voucher stats:", err);
    }
  }

  fetchVoucherStats();
}, []);




async function fetchVacations() {
  try {
    const res = await fetch("/api/admin/vacations");
    const data = await res.json();

    // Check if backend wraps in { vacations: [...] }
    if (Array.isArray(data)) {
      setVacations(data);
    } else if (Array.isArray(data.vacations)) {
      setVacations(data.vacations);
    } else {
      setVacations([]);
    }
  } catch (err) {
    console.error("Error fetching vacations:", err);
    setVacations([]);
  }
}

const router = useRouter();
const { tab, create } = router.query;

const [data, setData] = useState({
  totalIncomeAllTime: 0,
  totalIncomeThisMonth: 0,
  totalCost: 0,
  incomePerService: [],
  costPerService: [],
});

useEffect(() => {
  axios.get("/api/admin/finance").then((res) => {
    setData(res.data);
  });
}, []);


  async function fetchData() {
    const res = await fetch("/api/admin/dashboard");
    const data = await res.json();

    const allEmployees = data.employees || [];
    setEmployees(allEmployees);

    const approved = allEmployees.filter(emp => emp.status === "approved");
    setApprovedEmployees(approved);

    setClients(data.clients || []);
    setSchedules(data.schedules || []);

    const sourceStats = {};
    const andereItems = [];
    allEmployees.forEach(emp => {
      const raw = emp.howDidYouHearAboutUs || "Unbekannt";
      if (raw.startsWith("Andere:")) {
        sourceStats["Andere"] = (sourceStats["Andere"] || 0) + 1;
        andereItems.push(raw.replace("Andere:", "").trim());
      } else {
        const key = raw || "Unbekannt";
        sourceStats[key] = (sourceStats[key] || 0) + 1;
      }
    });
    const chartData = Object.entries(sourceStats).map(([name, value]) => ({ name, value }));
    setSourceData(chartData);
    setAndereDetails(andereItems);
  }


useEffect(() => {
  async function fetchStats() {
    const res = await fetch("/api/admin/vouchers/status");
    const data = await res.json();
    setStats(data);
  }
  fetchStats();
}, []);


  async function fetchWarnings() {
    try {
      const res = await fetch("/api/admin/rejection-warnings");
      const data = await res.json();
      setWarnings(data);
    } catch (err) {
      console.error("Error loading warnings:", err);
    }
  }

  async function cancelVacation(id) {
  const res = await fetch(`/api/admin/vacations/cancel`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  const data = await res.json();
  alert(data.message || "Vacation cancelled");
}

async function reassignVacation(id) {
  const res = await fetch(`/api/admin/vacations/reassign`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  const data = await res.json();
  alert(data.message || "Vacation reassigned");
}

async function getSuggestions(id) {
  const res = await fetch(`/api/admin/vacations/suggestions?vacationId=${id}`);
  const data = await res.json();
  alert("Suggested dates: " + JSON.stringify(data));
}
useEffect(() => {
  async function fetchConflicts() {
    const res = await fetch("/api/admin/vacations/conflicts");
    const data = await res.json();
    console.log("⚠ Conflicts:", data);
  }
  fetchConflicts();
}, []);

async function fetchData() {
  const res = await fetch("/api/admin/dashboard");
  const data = await res.json();

  setEmployees(data.employees || []);
  setClients(data.clients || []);
  setSchedules(data.schedules || []); // 👈 këtu vjen schedulesWithService
}
const [cancelledAppointments, setCancelledAppointments] = useState([]);
useEffect(() => {
  async function fetchCancelledAppointments() {
    try {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      const cancelled = (data.schedules || []).filter(
        (s) => s.status === "cancelled"
      );
      setCancelledAppointments(cancelled);
    } catch (err) {
      console.error("❌ Error fetching cancelled appointments:", err);
    }
  }
  fetchCancelledAppointments();
}, []);


function ReassignModal({ vacation }) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetch(`/api/admin/vacations/suggestions?clientId=${vacation.assignments[0].client.id}&date=${vacation.startDate}&serviceId=${vacation.assignments[0].serviceId}`)
      .then(res => res.json())
      .then(setSuggestions);
  }, [vacation]);

  if (tab === "gutscheine" && create === "true") {
  return (
    <AdminLayout>
      <div className="p-8 max-w-2xl mx-auto bg-white shadow-lg rounded-lg mt-10">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          🎟 Gutschein erstellen
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Voucher created successfully!");
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gutschein-Code
            </label>
            <input
              type="text"
              name="code"
              placeholder="WELCOME10"
              className="mt-1 p-2 border w-full rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rabatt-Typ
            </label>
            <select
              name="type"
              className="mt-1 p-2 border w-full rounded-lg"
              required
            >
              <option value="percent">Prozent</option>
              <option value="fixed">Fixbetrag</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Wert
            </label>
            <input
              type="number"
              name="value"
              placeholder="10"
              className="mt-1 p-2 border w-full rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Speichern
          </button>
        </form>

        <button
          onClick={() => router.push("/admin-dashboard")}
          className="mt-6 text-blue-500 underline text-sm"
        >
          ← Zurück zum Dashboard
        </button>
      </div>
    </AdminLayout>
  );
}


  return (
    <div className="modal">
      <h2 className="text-lg font-bold">Reassign {vacation.employee.firstName}</h2>
      <ul className="space-y-2 mt-3">
        {suggestions.map(s => (
          <li key={s.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span>{s.firstName} {s.lastName} ({s.zip})</span>
            <button className="btn-green">Assign</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function isThisWeek(date) {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1); // e hënë
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return date >= startOfWeek && date <= endOfWeek;
}

function isThisMonth(date) {
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}

function isNextMonth(date) {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return date.getMonth() === nextMonth.getMonth() && date.getFullYear() === nextMonth.getFullYear();
}
// ✅ Move this near your other top-level async functions
async function fetchStats() {
  try {
    const res = await fetch("/api/admin/vouchers/status");
    if (!res.ok) throw new Error("Failed to fetch voucher stats");
    const data = await res.json();
    setStats(data);
  } catch (err) {
    console.error("Error fetching voucher stats:", err);
    setStats(null);
  }
}

useEffect(() => {
  fetchData();
  fetchStats();
  fetchWarnings();
  fetchVacations();
}, []);

function isThisYear(date) {
  const now = new Date();
  return date.getFullYear() === now.getFullYear();
}

  const appointmentsThisWeek = schedules.filter(
    (s) => s.date && isThisWeek(new Date(s.date))
  ).length;

  const appointmentsThisMonth = schedules.filter(
    (s) => s.date && isThisMonth(new Date(s.date))
  ).length;

  const appointmentsNextMonth = schedules.filter(
    (s) => s.date && isNextMonth(new Date(s.date))
  ).length;

  const appointmentsThisYear = schedules.filter(
    (s) => s.date && isThisYear(new Date(s.date))
  ).length;

 useEffect(() => {
    async function fetchApproved() {
      try {
        const res = await fetch("/api/employees/approved");
        if (!res.ok) throw new Error("Failed to fetch approved employees");
        const data = await res.json();
        setApprovedEmployees(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchApproved();
  }, []);
  
const [activityLogs, setActivityLogs] = useState([]);
useEffect(() => {
  fetch("/api/admin/activity?limit=20")
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data)) {
        setActivityLogs(data);
      } else if (Array.isArray(data.activity)) {
        setActivityLogs(data.activity);
      } else {
        setActivityLogs([]); // fallback bosh
      }
    })
    .catch((err) => console.error("❌ Error loading activity logs:", err));
}, []);
// Approve employee
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

// Reject employee
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

// Invite employee
async function handleInvite(emp) {
  await fetch("/api/invite-employee", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: emp.email, firstName: emp.firstName }),
  });

  setEmployees((prev) =>
    prev.map((e) =>
      e.id === emp.id ? { ...e, invited: true } : e
    )
  );
}


  return (
    <AdminLayout>
      {message && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white py-2 px-4 rounded shadow-lg z-50">
          {message}
        </div>
      )}

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
  {/* 👥 Employees */}

  {/* ✅ Approved */}
<DashboardCard title="Genehmigt">
      <div className="text-2xl font-bold text-green-600">
        {approvedEmployees.length}
      </div>
      <p className="text-sm text-gray-500 mt-1">Bestätigte Mitarbeiter</p>
    </DashboardCard>

{/* 📅 Appointments Overview */}
<DashboardCard title="Termine">
  <div className="grid grid-cols-2 gap-4">
    <div className="p-3 bg-blue-50 rounded-lg shadow-sm text-center">
      <p className="text-2xl font-bold text-blue-700">{appointmentsThisWeek}</p>
      <p className="text-xs text-gray-500 mt-1">Diese Woche</p>
    </div>
    <div className="p-3 bg-green-50 rounded-lg shadow-sm text-center">
      <p className="text-2xl font-bold text-green-700">{appointmentsThisMonth}</p>
      <p className="text-xs text-gray-500 mt-1">Diesen Monat</p>
    </div>
    <div className="p-3 bg-yellow-50 rounded-lg shadow-sm text-center">
      <p className="text-2xl font-bold text-yellow-700">{appointmentsNextMonth}</p>
      <p className="text-xs text-gray-500 mt-1">Nächsten Monat</p>
    </div>
    <div className="p-3 bg-purple-50 rounded-lg shadow-sm text-center">
      <p className="text-2xl font-bold text-purple-700">{appointmentsThisYear}</p>
      <p className="text-xs text-gray-500 mt-1">Dieses Jahr</p>
    </div>
  </div>
</DashboardCard>



<DashboardCard title="Aktivitätsprotokoll">
  <div className="overflow-y-auto max-h-72 pr-1">
    <ul className="space-y-4 text-sm text-gray-700">
      {activityLogs.map((log) => (
        <li
          key={log.id}
          className="flex items-start gap-3 border-b pb-3 last:border-none"
        >
          {/* Avatar with initials */}
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase shadow-inner">
            {log.actorUser
              ? log.actorUser.firstName?.[0]
              : log.actorEmployee
              ? log.actorEmployee.firstName?.[0]
              : "?"}
          </div>

          {/* Log content */}
          <div className="flex-1">
            <p className="text-sm leading-tight">
              <span className="font-medium text-[#04436F]">
                {log.actorUser
                  ? `${log.actorUser.firstName} ${log.actorUser.lastName}`
                  : log.actorEmployee
                  ? `${log.actorEmployee.firstName} ${log.actorEmployee.lastName}`
                  : "System"}
              </span>{" "}
              <span className="text-gray-600">{log.action}</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(log.createdAt).toLocaleString("de-DE", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </p>
          </div>
        </li>
      ))}
    </ul>
  </div>
</DashboardCard>


<DashboardCard title="Finanzübersicht">
  <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
    {/* Total Income This Month */}
    <div className="p-4 bg-green-50 rounded-lg text-center shadow-sm">
      <p className="text-2xl font-bold text-green-700">
        CHF {data.totalIncomeThisMonth.toFixed(2)}
      </p>
      <p className="text-sm text-gray-600 mt-1">Einnahmen diesen Monat</p>
    </div>

    {/* Total Income All Time */}
    <div className="p-4 bg-blue-50 rounded-lg text-center shadow-sm">
      <p className="text-2xl font-bold text-blue-700">
        CHF {data.totalIncomeAllTime.toFixed(2)}
      </p>
      <p className="text-sm text-gray-600 mt-1">Einkommen Total</p>
    </div>


  </div>
</DashboardCard>
<DashboardCard title="Einnahmen pro Dienstleistung">
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data.incomePerService}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="serviceName" />
      <YAxis />
      <Tooltip
        content={({ active, payload, label }) => {
          if (active && payload && payload.length) {
            const service = data.incomePerService.find(
              (s) => s.serviceName === label
            );
            return (
              <div className="bg-white p-3 border rounded shadow text-sm">
                <p className="font-bold">{label}</p>
                <p>💰 Diesen Monat: CHF {service.thisMonth.toFixed(2)}</p>
                <p>💰 Gesamte Zeit: CHF {service.allTime.toFixed(2)}</p>
                {service?.subserviceSplit?.length > 0 && (
                  <div className="mt-2">
                    <p className="font-semibold">Subservices:</p>
                    <ul className="list-disc ml-4">
                      {service.subserviceSplit.map((sub, i) => (
                        <li key={i}>
                          {sub.subServiceName}: CHF {sub.allTime.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          }
          return null;
        }}
      />
      <Legend />
      <Bar dataKey="thisMonth" fill="#22C55E" name="Diesen Monat" />
      <Bar dataKey="allTime" fill="#3B82F6" name="Gesamte Zeit" />
    </BarChart>
  </ResponsiveContainer>
</DashboardCard>


{/* Cost per Service */}
<DashboardCard title="Kosten pro Dienstleistung">
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data.costPerService}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="serviceName" />
      <YAxis />
      <Tooltip
        content={({ active, payload, label }) => {
          if (active && payload && payload.length) {
            const service = data.costPerService.find(
              (s) => s.serviceName === label
            );
            return (
              <div className="bg-white p-3 border rounded shadow text-sm">
                <p className="font-bold">{label}</p>
                <p>💸 Diesen Monat: CHF {service.thisMonth.toFixed(2)}</p>
                <p>💸 Gesamte Zeit: CHF {service.allTime.toFixed(2)}</p>
                {service?.subserviceSplit?.length > 0 && (
                  <div className="mt-2">
                    <p className="font-semibold">Subservices:</p>
                    <ul className="list-disc ml-4">
                      {service.subserviceSplit.map((sub, i) => (
                        <li key={i}>
                          {sub.subServiceName}: CHF {sub.allTime.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          }
          return null;
        }}
      />
      {/* 2 bars: thisMonth vs allTime */}
      <Bar dataKey="thisMonth" fill="#FBBF24" name="Diesen Monat" />
      <Bar dataKey="allTime" fill="#EF4444" name="Gesamte Zeit" />
      <Legend />
    </BarChart>
  </ResponsiveContainer>
</DashboardCard>


</div>


      <Tab.Group>
    <Tab.List className="flex flex-wrap gap-2 mb-4">
  {[
    "Überblick",
    "Mitarbeiter",
    "Kunden",
    "Urlaub",
    "Terminabsage",
    "Terminübersicht",
    "Bewerbungsstatus", 
    "Arbeitszeiterfassung",
    "Buchungen",            
    "Buchungsstatus",
     "Gutscheine",

  ].map((tab) => (
    <Tab
      key={tab}
      className={({ selected }) =>
        `px-4 py-2 rounded-lg text-sm ${
          selected
            ? "bg-blue-600 text-white"
            : "bg-gray-100 hover:bg-gray-200"
        }`
      }
    >
      {tab}
    </Tab>
  ))}
</Tab.List>

        <Tab.Panels>
          <Tab.Panel>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <DashboardCard title="Aktive Kunden">
                <ActiveClients clients={clients} />
              </DashboardCard>
              <DashboardCard title="Zuweisungen">
                <EmployeesOnAssignment employees={employees} />
              </DashboardCard>
              <DashboardCard title="Termine">
                <AppointmentCalendar schedules={schedules} />
              </DashboardCard>
    
   
            </div>
          </Tab.Panel>

        <Tab.Panel>
  <EmployeeTable
    employees={employees}
    onApprove={handleApproval}
    onReject={handleRejection}
    onInvite={handleInvite}
  />
</Tab.Panel>


          <Tab.Panel>
            <ClientTable clients={clients} />
         
          </Tab.Panel>

  
<Tab.Panel>
  <DashboardCard title="🌴 Urlaub">
    <div className="bg-white rounded-xl shadow-md p-4">
      {Array.isArray(vacations) && vacations.length > 0 ? (
        <ul className="space-y-3">
          {vacations.map((v) => (
            <li key={v.id} className="p-3 border rounded-lg">
              <div>
                <p className="font-medium text-gray-800">
                  {v.employee
                    ? `👷 Mitarbeiter: ${v.employee.firstName} ${v.employee.lastName}`
                    : ""}
                  {v.user
                    ? ` 🙋 Kunde: ${v.user.firstName} ${v.user.lastName}`
                    : ""}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(v.startDate).toLocaleDateString()} →{" "}
                  {new Date(v.endDate).toLocaleDateString()}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 mt-2">
                {/* Call employee */}
                {v.employee?.phone && (
                  <button
                    onClick={() => window.open(`tel:${v.employee.phone}`)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
                  >
                    📞 Anruf
                  </button>
                )}

                {/* Call client */}
                {v.user?.phone && (
                  <button
                    onClick={() => window.open(`tel:${v.user.phone}`)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
                  >
                    📞 Client anrufen
                  </button>
                )}

                {/* Suggestions */}
                {v.employee && (
                  <button
                    onClick={async () => {
                      const res = await fetch(
                        `/api/admin/vacations/suggestions?vacationId=${v.id}`
                      );
                      const data = await res.json();
                      v.suggestions = data;
                      setVacations([...vacations]); // trigger re-render
                    }}
                    className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600"
                  >
                    💡 Vorschläge
                  </button>
                )}

                {/* Approve */}
                {v.status === "pending" && (
                  <button
                    onClick={async () => {
                      const res = await fetch(
                        "/api/employee/update-vacation",
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            vacationId: v.id,
                            action: "approve",
                          }),
                        }
                      );
                      if (res.ok) {
                        setVacations((prev) =>
                          prev.map((x) =>
                            x.id === v.id ? { ...x, status: "approved" } : x
                          )
                        );
                      }
                    }}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                  >
                    ✅ Genehmigen
                  </button>
                )}

                {/* Decline */}
                {v.status === "pending" && (
                  <button
                    onClick={async () => {
                      const res = await fetch(
                        "/api/employee/update-vacation",
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            vacationId: v.id,
                            action: "decline",
                          }),
                        }
                      );
                      if (res.ok) {
                        setVacations((prev) =>
                          prev.map((x) =>
                            x.id === v.id ? { ...x, status: "declined" } : x
                          )
                        );
                      }
                    }}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                  >
                    ❌ Abfall
                  </button>
                )}
              </div>

              {/* Suggestions list */}
              {v.employee && v.suggestions && v.suggestions.length > 0 && (
                <div className="mt-3 bg-gray-50 p-2 rounded-lg border text-sm">
                  <p className="font-semibold text-gray-700">
                    💡 Vorgeschlagene Alternativen:
                  </p>
                  <ul className="mt-2 space-y-2 text-sm text-gray-700">
                    {v.suggestions.map((s, i) => (
                      <li
                        key={i}
                        className="flex justify-between items-center p-2 border rounded-lg bg-gray-50"
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
                        {s.employee.phone && (
                          <button
                            onClick={() => window.open(`tel:${s.employee.phone}`)}
                            className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
                          >
                            📞 Anruf
                          </button>
                        )}
                         {/* ✅ Assign button (👉 ADD IT HERE) */}
            <button
              onClick={async () => {
                const res = await fetch("/api/admin/vacation/assign", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    vacationId: v.id,
                    newEmployeeId: s.employee.id,
                  }),
                });

                const result = await res.json();
                alert(result.message || "Reassigned successfully");

                // Refresh vacations state
                setVacations((prev) =>
                  prev.map((x) =>
                    x.id === v.id ? { ...x, employee: s.employee } : x
                  )
                );
              }}
              className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700"
            >
              ✅ Zuordnen
            </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Status at the end */}
              <div className="mt-3">
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    v.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : v.status === "declined"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  Status: {v.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">Keine Urlaube gefunden</p>
      )}
    </div>
  </DashboardCard>
</Tab.Panel>


          <Tab.Panel>
  <DashboardCard title="📅 Terminabsage">
  {warnings.length === 0 && cancelledAppointments.length === 0 ? (
    <p className="text-gray-600 text-sm">
      Keine abgesagten Termine.
    </p>
  ) : (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Rejection warnings */}
      {warnings.map((w) => (
        <li
          key={`warning-${w.id}`}
          className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 shadow-sm"
        >
          <div className="text-sm space-y-1 text-gray-700">
            <p><strong>⚠️ Warnung:</strong> Mitarbeiter-Ablehnungswarnung</p>
            <p><strong>👤 Mitarbeiter:</strong> {w.employee.firstName} {w.employee.lastName}</p>
            <p><strong>✉️ E-Mail:</strong> {w.employee.email}</p>
            {w.schedule && (
              <>
                <p><strong>📅 Termin:</strong> {new Date(w.schedule.date).toLocaleDateString("de-DE")}</p>
                <p><strong>⏰ Start:</strong> {w.schedule.startTime} | <strong>Dauer:</strong> {w.schedule.hours}h</p>
                <p><strong>🧑 Kunden:</strong> {w.schedule.user?.firstName} {w.schedule.user?.lastName}</p>
              </>
            )}
            <p>
              <strong>📌 Abgesagt am:</strong>{" "}
              {new Date(w.sentAt).toLocaleDateString("de-DE")}{" "}
              {new Date(w.sentAt).toLocaleTimeString("de-DE")}
            </p>
          </div>
        </li>
      ))}

      {/* Cancelled appointments */}
      {cancelledAppointments.map((a) => (
        <li
          key={`cancelled-${a.id}`}
          className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm"
        >
          <div className="text-sm space-y-1 text-gray-700">
            <p><strong>👤 Mitarbeiter:</strong> {a.employee?.firstName} {a.employee?.lastName}</p>
            <p><strong>✉️ E-Mail:</strong> {a.employee?.email}</p>
            <p><strong>📅 Termin:</strong> {a.date ? new Date(a.date).toLocaleDateString("de-DE") : "–"}</p>
            <p><strong>⏰ Start:</strong> {a.startTime} | <strong>Dauer:</strong> {a.hours}h</p>
            <p><strong>🧑 Kunden:</strong> {a.user?.firstName} {a.user?.lastName}</p>
            <p>
              <strong>📌 Status:</strong>{" "}
              <span className="text-red-600 font-semibold">Cancelled</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  )}
</DashboardCard>


          </Tab.Panel>
          <Tab.Panel>
  <DashboardCard title="Terminübersicht">
                <ApplicationOverview employees={employees} />
                   <DashboardCard title="Revenue">
              <CurrentRevenue clients={clients} />
            </DashboardCard>
  </DashboardCard>
</Tab.Panel>
<Tab.Panel>
  <DashboardCard title="Bewerbungsstatus">
                <OvertimeAlerts employees={employees} />
  </DashboardCard>
</Tab.Panel>
<Tab.Panel>
  <DashboardCard title="Arbeitszeiterfassung">
                <WorkingTimeTracking employees={employees} />

  </DashboardCard>
</Tab.Panel>
{/* Application Status */}
<Tab.Panel>
  <DashboardCard title="📊 Bewerbungsstatus">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-4 bg-yellow-50 rounded-lg text-center">
        <p className="text-2xl font-bold text-yellow-700">
          {employees.filter(e => e.status === "pending").length}
        </p>
        <p className="text-xs text-gray-600 mt-1">Ausstehend</p>
      </div>
      <div className="p-4 bg-green-50 rounded-lg text-center">
        <p className="text-2xl font-bold text-green-700">
          {employees.filter(e => e.status === "approved").length}
        </p>
        <p className="text-xs text-gray-600 mt-1">Genehmigt</p>
      </div>
      <div className="p-4 bg-red-50 rounded-lg text-center">
        <p className="text-2xl font-bold text-red-700">
          {employees.filter(e => e.status === "declined").length}
        </p>
        <p className="text-xs text-gray-600 mt-1">Abgelehnt</p>
      </div>
      <div className="p-4 bg-blue-50 rounded-lg text-center">
        <p className="text-2xl font-bold text-blue-700">{employees.length}</p>
        <p className="text-xs text-gray-600 mt-1">Total</p>
      </div>
    </div>
  </DashboardCard>
</Tab.Panel>
<Tab.Panel>
  <DashboardCard title="📅 Buchungen">
    <div className="p-4">
      {schedules.length > 0 ? (
        <ul className="divide-y divide-gray-200">
   { schedules.slice(0, 10).map((s) => (
<li key={s.id} className="py-2 flex justify-between text-sm">
  <span>
    {s.serviceName || s.subServiceName || s.user?.services?.[0]?.name || "Service"} –{" "}
    {s.date
      ? new Date(s.date).toLocaleDateString("de-DE")
      : `${s.day || ""} ${s.startTime || ""}`}
  </span>
  <span
    className={`px-2 py-1 text-xs rounded ${
      s.status === "active"
        ? "bg-blue-100 text-blue-700"
        : s.status === "completed"
        ? "bg-green-100 text-green-700"
        : s.status === "cancelled"
        ? "bg-red-100 text-red-700"
        : "bg-yellow-100 text-yellow-700"
    }`}
  >
    {s.status || "pending"}
  </span>
</li>

))}

        </ul>
      ) : (
        <p className="text-gray-500 italic">No bookings available</p>
      )}
    </div>
  </DashboardCard>
</Tab.Panel>
<Tab.Panel>
{/* 🎟️ Gutscheinstatus */}
{/* 🎟️ Gutscheinstatus */}
<DashboardCard title="🎟️ Gutscheinstatus">
  <div className="flex flex-col lg:flex-row justify-between items-center gap-10 px-6 py-8">

    {/* Left side: Stats */}
    <div className="grid grid-cols-2 gap-6 w-full lg:w-1/2">
      {[
        {
          label: "Active",
          value: voucherStats?.active || 0,
          color: "text-blue-600",
          bg: "from-blue-50 to-blue-100",
          icon: <Ticket size={24} strokeWidth={2.2} />,
        },
        {
          label: "Used",
          value: voucherStats?.used || 0,
          color: "text-green-600",
          bg: "from-emerald-50 to-emerald-100",
          icon: <CheckCircle size={24} strokeWidth={2.2} />,
        },
        {
          label: "Inactive",
          value: voucherStats?.inactive || 0,
          color: "text-amber-600",
          bg: "from-amber-50 to-amber-100",
          icon: <PauseCircle size={24} strokeWidth={2.2} />,
        },
        {
          label: "Expired",
          value: voucherStats?.expired || 0,
          color: "text-rose-600",
          bg: "from-rose-50 to-rose-100",
          icon: <Clock size={24} strokeWidth={2.2} />,
        },
      ].map((stat, index) => (
        <div
          key={index}
          className={`flex items-center gap-4 bg-gradient-to-br ${stat.bg} border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300`}
        >
          <div
            className={`bg-white w-12 h-12 flex items-center justify-center rounded-xl shadow-inner ${stat.color} hover:scale-110 transition-transform duration-200`}
          >
            {stat.icon}
          </div>
          <div>
            <p className={`text-3xl font-bold ${stat.color} leading-none`}>
              {stat.value}
            </p>
            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Right side: Chart */}
    <div className="flex justify-center w-full lg:w-1/2">
      <div className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm p-6 w-[340px] flex flex-col items-center hover:shadow-md transition-all duration-300">
        <h3 className="text-base font-semibold text-gray-700 mb-4 tracking-tight">
          Voucher Distribution
        </h3>

        <PieChart width={260} height={260}>
          <defs>
            <radialGradient id="gradActive" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#2563EB" stopOpacity={0.9} />
            </radialGradient>
            <radialGradient id="gradUsed" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#6EE7B7" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#059669" stopOpacity={0.9} />
            </radialGradient>
            <radialGradient id="gradInactive" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FDE68A" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#CA8A04" stopOpacity={0.9} />
            </radialGradient>
            <radialGradient id="gradExpired" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FCA5A5" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#DC2626" stopOpacity={0.9} />
            </radialGradient>
          </defs>

          <Pie
            data={[
              { name: "Active", value: voucherStats?.active || 0 },
              { name: "Used", value: voucherStats?.used || 0 },
              { name: "Inactive", value: voucherStats?.inactive || 0 },
              { name: "Expired", value: voucherStats?.expired || 0 },
            ]}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={90}
            paddingAngle={2}
            cornerRadius={8}
            dataKey="value"
            isAnimationActive={true}
            animationDuration={1000}
          >
            <Cell fill="url(#gradActive)" />
            <Cell fill="url(#gradUsed)" />
            <Cell fill="url(#gradInactive)" />
            <Cell fill="url(#gradExpired)" />
          </Pie>

          <Tooltip
            formatter={(value, name) => [`${value}`, `${name}`]}
            contentStyle={{
              borderRadius: "10px",
              backgroundColor: "rgba(255,255,255,0.95)",
              border: "1px solid #eee",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          />
        </PieChart>

        {/* Legend */}
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-gray-600">
          {[
            { label: "Active", color: "bg-blue-500" },
            { label: "Used", color: "bg-emerald-500" },
            { label: "Inactive", color: "bg-amber-400" },
            { label: "Expired", color: "bg-rose-500" },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-2 justify-center">
              <span className={`w-3 h-3 rounded-full ${item.color}`}></span>
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</DashboardCard>

</Tab.Panel>


        </Tab.Panels>
      </Tab.Group>
    </AdminLayout>
  );
}