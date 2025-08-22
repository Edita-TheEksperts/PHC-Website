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
    totalIncome: 0,
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
useEffect(() => {
  async function fetchConflicts() {
    const res = await fetch("/api/admin/vacations/conflicts");
    const data = await res.json();
    console.log("⚠ Conflicts:", data);
  }
  fetchConflicts();
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



  {/* 📅 Appointments */}
  <DashboardCard title="📅 Appointments">
    <div className="text-2xl font-bold text-[#04436F]">{schedules.length}</div>
    <p className="text-sm text-gray-500 mt-1">Geplante Termine</p>
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
                {new Date(log.timestamp).toLocaleString("de-DE", {
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

 <DashboardCard title="💰 Total Income">
        <p className="text-2xl font-bold text-green-600">
          CHF {data.totalIncome.toFixed(2)}
        </p>
      </DashboardCard>

 

      {/* Income per Service */}
      <DashboardCard title="💰 Income per Service">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.incomePerService}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="serviceName" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#22C55E" />
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
            <Tooltip />
            <Bar dataKey="amount" fill="#EF4444" />
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
    "Warnings",
    "Application Overview",
    "OvertimeAlerts",
    "Working Time Tracking",

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
  <DashboardCard title="🔍 Breakdown by Source">
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
<DashboardCard title="🌴 Vacations">
  <div className="bg-white rounded-xl shadow-md p-4">
    {Array.isArray(vacations) && vacations.length > 0 ? (
      <ul className="space-y-3">
        {vacations.map((v) => (
          <li key={v.id} className="p-3 border rounded-lg">
            <div>
              <p className="font-medium text-gray-800">
                {v.employee ? `👷 Employee: ${v.employee.firstName} ${v.employee.lastName}` : ""}
                {v.user ? ` 🙋 Client: ${v.user.firstName} ${v.user.lastName}` : ""}
              </p>
              <p className="text-sm text-gray-600">
                {new Date(v.startDate).toLocaleDateString()} →{" "}
                {new Date(v.endDate).toLocaleDateString()}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 mt-2">
              {/* Call button for employee */}
              {v.employee?.phone && (
                <button
                  onClick={() => window.open(`tel:${v.employee.phone}`)}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
                >
                  📞 Call
                </button>
              )}

              {/* Call button for client */}
              {v.user?.phone && (
                <button
                  onClick={() => window.open(`tel:${v.user.phone}`)}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
                >
                  📞 Call Client
                </button>
              )}

              {/* Suggestions button (only for employees) */}
              {v.employee && (
                <button
                  onClick={async () => {
                    const res = await fetch(`/api/admin/vacations/suggestions?vacationId=${v.id}`);
                    const data = await res.json();
                    v.suggestions = data;
                    setVacations([...vacations]); // trigger re-render
                  }}
                  className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600"
                >
                  💡 Suggestions
                </button>
              )}
            </div>

            {/* Suggestions list (only for employees) */}
            {v.employee && v.suggestions && v.suggestions.length > 0 && (
              <div className="mt-3 bg-gray-50 p-2 rounded-lg border text-sm">
                <p className="font-semibold text-gray-700">💡 Suggested Alternatives:</p>
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
                          📞 Call
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500 italic">No vacations found</p>
    )}
  </div>
</DashboardCard>



  </Tab.Panel>

          <Tab.Panel>
            <DashboardCard title="Rejection Warnings">
              {warnings.length === 0 ? (
                <p className="text-gray-600 text-sm">Keine Warnungen wurden gesendet.</p>
              ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {warnings.map(w => (
                    <li key={w.id} className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
                      <div className="text-sm space-y-1 text-gray-700">
                        <p><strong>👤 Name:</strong> {w.employee.firstName} {w.employee.lastName}</p>
                        <p><strong>✉️ Email:</strong> {w.employee.email}</p>
                        <p><strong>📅 Gesendet am:</strong> {new Date(w.sentAt).toLocaleDateString("de-DE")} um {new Date(w.sentAt).toLocaleTimeString("de-DE")} </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </DashboardCard>
          </Tab.Panel>
          <Tab.Panel>
  <DashboardCard title="Application Overview">
                <ApplicationOverview employees={employees} />
                   <DashboardCard title="Revenue">
              <CurrentRevenue clients={clients} />
            </DashboardCard>
  </DashboardCard>
</Tab.Panel>
<Tab.Panel>
  <DashboardCard title="Overtime Alerts">
                <OvertimeAlerts employees={employees} />
  </DashboardCard>
</Tab.Panel>
<Tab.Panel>
  <DashboardCard title="Working Time Tracking">
                <WorkingTimeTracking employees={employees} />

  </DashboardCard>
</Tab.Panel>
              

        </Tab.Panels>
      </Tab.Group>
    </AdminLayout>
  );
}