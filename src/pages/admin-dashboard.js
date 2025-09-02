import { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
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
  let raw = emp.howDidYouHearAboutUs || "Unbekannt";

  // 🚫 Skip "no strong match"
  if (raw.toLowerCase().includes("no strong match")) {
    return;
  }

  if (raw.startsWith("Andere:")) {
    sourceStats["Andere"] = (sourceStats["Andere"] || 0) + 1;
    andereItems.push(raw.replace("Andere:", "").trim());
  } else {
    const key = raw || "Unbekannt";
    sourceStats[key] = (sourceStats[key] || 0) + 1;
  }
});

const chartData = Object.entries(sourceStats).map(([name, value]) => ({
  name,
  value,
}));
setSourceData(chartData);
setAndereDetails(andereItems);
  }

  async function fetchStats() {
    const res = await fetch("/api/admin/stats");
    const data = await res.json();
    setStats(data);
  }

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

function EmployeeVacationItem({ vacation: v, vacations, setVacations }) {
  const hasConflicts = v.conflicts && v.conflicts.length > 0;

  return (
    <li key={v.id} className="p-3 border rounded-lg">
      <div>
        <p className="font-medium text-gray-800">
          👷 Employee: {v.employee.firstName} {v.employee.lastName}
        </p>
        <p className="text-sm text-gray-600">
          {formatDate(v.startDate)} → {formatDate(v.endDate)}
        </p>
      </div>

      {/* Butonat */}
      <div className="flex flex-wrap gap-2 mt-2">
        {/* 📞 Call */}
        {v.employee?.phone && (
          <button
            onClick={() => window.open(`tel:${v.employee.phone}`)}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
          >
            📞 Call
          </button>
        )}

        {/* 💡 Suggestions */}
        <button
          onClick={async () => {
            const res = await fetch(`/api/admin/vacations/suggestions?vacationId=${v.id}`);
            const data = await res.json();
            v.suggestions = data;
            setVacations([...vacations]);
          }}
          className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600"
        >
          💡 Suggestions
        </button>

        {/* ⚠️ Conflicts (vetëm kur ka) */}
        {hasConflicts && (
          <button
            onClick={async () => {
              const res = await fetch(`/api/admin/vacations/conflicts?vacationId=${v.id}`);
              const data = await res.json();
              v.conflicts = data.conflicts || [];
              setVacations([...vacations]);
            }}
            className="px-3 py-1 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600"
          >
            ⚠️ Conflicts
          </button>
        )}

        {/* ✅ Approve */}
        {v.status === "pending" && (
          <button
            onClick={async () => {
              const res = await fetch("/api/employee/update-vacation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ vacationId: v.id, action: "approve" }),
              });
              if (res.ok) {
                setVacations(prev =>
                  prev.map(x => (x.id === v.id ? { ...x, status: "approved" } : x))
                );
              }
            }}
            className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
          >
            ✅ Approve
          </button>
        )}

        {/* ❌ Decline */}
        {v.status === "pending" && (
          <button
            onClick={async () => {
              const res = await fetch("/api/employee/update-vacation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ vacationId: v.id, action: "decline" }),
              });
              if (res.ok) {
                setVacations(prev =>
                  prev.map(x => (x.id === v.id ? { ...x, status: "declined" } : x))
                );
              }
            }}
            className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
          >
            ❌ Decline
          </button>
        )}
      </div>

      {/* Lista e konflikteve */}
      {hasConflicts && (
        <div className="mt-3 bg-red-50 p-2 rounded-lg border text-sm">
          <p className="font-semibold text-red-700">⚠️ Conflicting Assignments:</p>
          <ul className="mt-2 space-y-2">
            {v.conflicts.map(c => (
              <li key={c.id} className="p-2 border rounded-lg bg-white shadow-sm">
                <p>📅 {formatDate(c.date)}</p>
                <p>👤 Client: {c.user?.firstName} {c.user?.lastName}</p>
                <p>🛠 Service: {c.serviceName || c.subServiceName || "N/A"}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

function ClientVacationItem({ vacation: v, vacations, setVacations }) {
  const hasConflicts = v.conflicts && v.conflicts.length > 0;

  return (
    <li key={v.id} className="p-3 border rounded-lg">
      <div>
        <p className="font-medium text-gray-800">
          🙋 Client: {v.user.firstName} {v.user.lastName}
        </p>
        <p className="text-sm text-gray-600">
          {formatDate(v.startDate)} → {formatDate(v.endDate)}
        </p>
      </div>

      {/* ⚠️ Conflicts button vetëm nëse ka */}
      {hasConflicts && (
        <div className="flex flex-wrap gap-2 mt-2">
          <button
            onClick={async () => {
              const res = await fetch(`/api/admin/vacations/conflicts?vacationId=${v.id}`);
              const data = await res.json();
              v.conflicts = data.conflicts || [];
              setVacations([...vacations]);
            }}
            className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
          >
            ⚠️ Check Conflicts
          </button>
        </div>
      )}

      {/* Lista e konflikteve */}
      {hasConflicts && (
        <div className="mt-3 bg-yellow-50 p-2 rounded-lg border text-sm">
          <p className="font-semibold text-yellow-700">⚠️ Client Cancelled Appointments:</p>
          <ul className="mt-2 space-y-2">
            {v.conflicts.map(c => (
              <li key={c.id} className="p-2 border rounded-lg bg-white flex justify-between items-center">
                <div>
                  <p>📅 {formatDate(c.date)}</p>
                  <p>👷 Employee: {c.employee?.firstName} {c.employee?.lastName}</p>
                  <p className="text-red-600 font-medium">❌ Cancelled</p>
                </div>
                {c.employee?.phone && (
                  <button
                    onClick={() => window.open(`tel:${c.employee.phone}`)}
                    className="px-2 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600"
                  >
                    📞 Lajmëro Punëtorin
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

function formatDate(date) {
  if (!date) return "–";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

function formatDateTime(date) {
  if (!date) return "–";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}.${month}.${year} ${hours}:${minutes}`;
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
  <DashboardCard title="✅ Approved">
    <div className="text-2xl font-bold text-green-600">{approvedEmployees.length}</div>
    <p className="text-sm text-gray-500 mt-1">Bestätigte Mitarbeiter</p>
  </DashboardCard>


{/* 📅 Appointments Overview */}
<DashboardCard title="📅 Appointments">
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



  {/* 📝 Activity Log */}
  <DashboardCard title="📝 Activity Log">
    <div className="overflow-y-auto max-h-72 pr-1">
      <ul className="space-y-4 text-sm text-gray-700">
        {activity.map((log, i) => (
          <li
            key={i}
            className="flex items-start gap-3 border-b pb-3 last:border-none"
          >
            {/* Avatar with initials */}
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase shadow-inner">
              {log.actor?.[0] || "?"}
            </div>

            {/* Log content */}
            <div className="flex-1">
              <p className="text-sm leading-tight">
                <span className="font-medium text-[#04436F]">{log.actor}</span>{" "}
                <span className="text-gray-600">{log.action}</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
           {formatDateTime(log.timestamp)}

              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </DashboardCard>


<DashboardCard title="💰 Financial Overview">
  <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
    {/* Total Income This Month */}
    <div className="p-4 bg-green-50 rounded-lg text-center shadow-sm">
      <p className="text-2xl font-bold text-green-700">
        CHF {data.totalIncomeThisMonth.toFixed(2)}
      </p>
      <p className="text-sm text-gray-600 mt-1">Income this month</p>
    </div>

    {/* Total Income All Time */}
    <div className="p-4 bg-blue-50 rounded-lg text-center shadow-sm">
      <p className="text-2xl font-bold text-blue-700">
        CHF {data.totalIncomeAllTime.toFixed(2)}
      </p>
      <p className="text-sm text-gray-600 mt-1">Income all time</p>
    </div>


  </div>
</DashboardCard>
<DashboardCard title="💰 Income per Service">
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
                <p>💰 This Month: CHF {service.thisMonth.toFixed(2)}</p>
                <p>💰 All Time: CHF {service.allTime.toFixed(2)}</p>
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
      <Bar dataKey="thisMonth" fill="#22C55E" name="This Month" />
      <Bar dataKey="allTime" fill="#3B82F6" name="All Time" />
    </BarChart>
  </ResponsiveContainer>
</DashboardCard>


{/* Cost per Service */}
<DashboardCard title="💸 Cost per Service">
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
                <p>💸 This Month: CHF {service.thisMonth.toFixed(2)}</p>
                <p>💸 All Time: CHF {service.allTime.toFixed(2)}</p>
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
      <Bar dataKey="thisMonth" fill="#FBBF24" name="This Month" />
      <Bar dataKey="allTime" fill="#EF4444" name="All Time" />
      <Legend />
    </BarChart>
  </ResponsiveContainer>
</DashboardCard>


</div>


      <Tab.Group>
    <Tab.List className="flex flex-wrap gap-2 mb-4">
  {[
    "Overview",
    "Employees",
    "Clients",
    "Analytics",
    "Urlaub",
    "Appointment Cancelation",
    "Application Overview",
    "Working Time Tracking",
       "Application Status",   // NEW
    "Bookings",            // NEW
    "Booking Status",

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
              <DashboardCard title="Active Clients">
                <ActiveClients clients={clients} />
              </DashboardCard>
              <DashboardCard title="Assignments">
                <EmployeesOnAssignment employees={employees} />
              </DashboardCard>
              <DashboardCard title="Appointments">
                <AppointmentCalendar schedules={schedules} />
              </DashboardCard>
    
   
            </div>
          </Tab.Panel>

          <Tab.Panel>
            <EmployeeTable employees={employees} />
          </Tab.Panel>

          <Tab.Panel>
            <ClientTable clients={clients} />
         
          </Tab.Panel>

    <Tab.Panel>
      
  <DashboardCard title="Analytics">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

      {/* Donut Chart Section */}
      <div className="w-full">
     
        <div className="bg-white rounded-xl p-6 border shadow-sm">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="value"
                data={sourceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {sourceData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={[
                      "#4F46E5",
                      "#22C55E",
                      "#F59E0B",
                      "#EF4444",
                      "#8B5CF6",
                      "#06B6D4",
                    ][index % 6]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* Custom Legend */}
          <ul className="mt-4 space-y-2 text-sm text-gray-700">
            {sourceData.map((entry, index) => (
              <li key={index} className="flex items-center gap-2">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: [
                      "#4F46E5",
                      "#22C55E",
                      "#F59E0B",
                      "#EF4444",
                      "#8B5CF6",
                      "#06B6D4",
                    ][index % 6],
                  }}
                ></span>
                <span className="capitalize">{entry.name}</span>
                <span className="ml-auto font-medium">{entry.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* "Andere" Details Section */}
      {andereDetails.length > 0 && (
        <div className="w-full bg-gray-50 rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            🧾 Custom “Andere” Entries ({andereDetails.length})
          </h3>
          <div className="flex flex-wrap gap-3">
            {andereDetails.map((entry, i) => (
              <span
                key={i}
                className="bg-[#04436F] text-white text-xs font-medium px-3 py-1 rounded-full shadow"
              >
                {entry}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  </DashboardCard>
</Tab.Panel>
<Tab.Panel>
<DashboardCard title="🌴 Urlaub">
  <Tab.Group>
    <Tab.List className="flex gap-2 mb-4">
      <Tab
        className={({ selected }) =>
          `px-4 py-2 rounded-lg text-sm ${
            selected ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
          }`
        }
      >
        Employees
      </Tab>
      <Tab
        className={({ selected }) =>
          `px-4 py-2 rounded-lg text-sm ${
            selected ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
          }`
        }
      >
        Clients
      </Tab>
    </Tab.List>

    <Tab.Panels>
      {/* Employee Vacations */}
      <Tab.Panel>
        <div className="bg-white rounded-xl shadow-md p-4">
          {vacations.filter(v => v.employee).length > 0 ? (
            <ul className="space-y-3">
              {vacations.filter(v => v.employee).map((v) => (
                <EmployeeVacationItem
                  key={v.id}
                  vacation={v}
                  vacations={vacations}
                  setVacations={setVacations}
                />
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No employee vacations found</p>
          )}
        </div>
      </Tab.Panel>

      {/* Client Vacations */}
      <Tab.Panel>
        <div className="bg-white rounded-xl shadow-md p-4">
          {vacations.filter(v => v.user).length > 0 ? (
            <ul className="space-y-3">
              {vacations.filter(v => v.user).map((v) => (
                <ClientVacationItem
                  key={v.id}
                  vacation={v}
                  vacations={vacations}
                  setVacations={setVacations}
                />
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No client vacations found</p>
          )}
        </div>
      </Tab.Panel>
    </Tab.Panels>
  </Tab.Group>
</DashboardCard>

</Tab.Panel>



          <Tab.Panel>
  <DashboardCard title="📅 Appointment Cancelation">
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
            <p><strong>⚠️ Warning:</strong> Employee rejection warning</p>
            <p><strong>👤 Employee:</strong> {w.employee.firstName} {w.employee.lastName}</p>
            <p><strong>✉️ Email:</strong> {w.employee.email}</p>
            {w.schedule && (
              <>
<p><strong>📅 Appointment Date:</strong> {formatDate(w.schedule.date)}</p>
                <p><strong>⏰ Start:</strong> {w.schedule.startTime} | <strong>Dauer:</strong> {w.schedule.hours}h</p>
                <p><strong>🧑 Client:</strong> {w.schedule.user?.firstName} {w.schedule.user?.lastName}</p>
              </>
            )}
            <p>
            <p><strong>📌 Canceled at:</strong> {formatDateTime(w.sentAt)}</p>
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
            <p><strong>👤 Employee:</strong> {a.employee?.firstName} {a.employee?.lastName}</p>
            <p><strong>✉️ Email:</strong> {a.employee?.email}</p>
 <p><strong>📅 Appointment Date:</strong> {formatDate(a.date)}</p>
            <p><strong>⏰ Start:</strong> {a.startTime} | <strong>Dauer:</strong> {a.hours}h</p>
            <p><strong>🧑 Client:</strong> {a.user?.firstName} {a.user?.lastName}</p>
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
  <DashboardCard title="Appointment Overview">
                <ApplicationOverview employees={employees} />
                   <DashboardCard title="Revenue">
              <CurrentRevenue clients={clients} />
            </DashboardCard>
  </DashboardCard>
</Tab.Panel>
<Tab.Panel>
  <DashboardCard title="Application Overview">
                <OvertimeAlerts employees={employees} />
  </DashboardCard>
</Tab.Panel>
<Tab.Panel>
  <DashboardCard title="Working Time Tracking">
                <WorkingTimeTracking employees={employees} />

  </DashboardCard>
</Tab.Panel>
{/* Application Status */}
<Tab.Panel>
  <DashboardCard title="📊 Application Status">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-4 bg-yellow-50 rounded-lg text-center">
        <p className="text-2xl font-bold text-yellow-700">
          {employees.filter(e => e.status === "pending").length}
        </p>
        <p className="text-xs text-gray-600 mt-1">Pending</p>
      </div>
      <div className="p-4 bg-green-50 rounded-lg text-center">
        <p className="text-2xl font-bold text-green-700">
          {employees.filter(e => e.status === "approved").length}
        </p>
        <p className="text-xs text-gray-600 mt-1">Approved</p>
      </div>
      <div className="p-4 bg-red-50 rounded-lg text-center">
        <p className="text-2xl font-bold text-red-700">
          {employees.filter(e => e.status === "declined").length}
        </p>
        <p className="text-xs text-gray-600 mt-1">Declined</p>
      </div>
      <div className="p-4 bg-blue-50 rounded-lg text-center">
        <p className="text-2xl font-bold text-blue-700">{employees.length}</p>
        <p className="text-xs text-gray-600 mt-1">Total</p>
      </div>
    </div>
  </DashboardCard>
</Tab.Panel>
<Tab.Panel>
  <DashboardCard title="📅 Bookings">
    <div className="p-4">
      {schedules.length > 0 ? (
        <ul className="divide-y divide-gray-200">
   { schedules.slice(0, 10).map((s) => (
<li key={s.id} className="py-2 flex justify-between text-sm">
  <span>
    {s.serviceName || s.subServiceName || s.user?.services?.[0]?.name || "Service"} –{" "}
  {s.date ? formatDate(s.date) : `${s.day || ""} ${s.startTime || ""}`}
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
  <DashboardCard title="📌 Booking Status">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        <div className="p-3 bg-blue-50 rounded-lg text-center">
          <p className="text-2xl font-bold text-blue-700">
            {schedules.filter(s => s.status === "active").length}
          </p>
          <p className="text-xs text-gray-600 mt-1">Active</p>
        </div>
        <div className="p-3 bg-green-50 rounded-lg text-center">
          <p className="text-2xl font-bold text-green-700">
            {schedules.filter(s => s.status === "completed").length}
          </p>
          <p className="text-xs text-gray-600 mt-1">Completed</p>
        </div>
        <div className="p-3 bg-yellow-50 rounded-lg text-center">
          <p className="text-2xl font-bold text-yellow-700">
            {schedules.filter(s => s.status === "pending").length}
          </p>
          <p className="text-xs text-gray-600 mt-1">Pending</p>
        </div>
        <div className="p-3 bg-red-50 rounded-lg text-center">
          <p className="text-2xl font-bold text-red-700">
            {schedules.filter(s => s.status === "cancelled").length}
          </p>
          <p className="text-xs text-gray-600 mt-1">Cancelled</p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={[
                { name: "Active", value: schedules.filter(s => s.status === "active").length },
                { name: "Completed", value: schedules.filter(s => s.status === "completed").length },
                { name: "Pending", value: schedules.filter(s => s.status === "pending").length },
                { name: "Cancelled", value: schedules.filter(s => s.status === "cancelled").length },
              ]}
              cx="50%"
              cy="50%"
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              <Cell fill="#3B82F6" />
              <Cell fill="#22C55E" />
              <Cell fill="#FACC15" />
              <Cell fill="#EF4444" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  </DashboardCard>
</Tab.Panel>



        </Tab.Panels>
      </Tab.Group>
    </AdminLayout>
  );
}