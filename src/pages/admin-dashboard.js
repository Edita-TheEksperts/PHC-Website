import { useState, useEffect } from "react";
import DashboardCard from "../components/DashboardCard";
import AdminLayout from "../components/AdminLayout";
import DashboardContent from "../components/DashboardContent";
import EmployeeTable from "../components/EmployeeTable";
import ClientTable from "../components/ClientTable";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import ActiveClients from "../components/ActiveClients";
import EmployeesOnAssignment from "../components/EmployeesOnAssignment";
import AppointmentCalendar from "../components/AppointmentCalendar";
import ApplicationOverview from "../components/ApplicationOverview";
import WorkingTimeTracking from "../components/WorkingTimeTracking";
import OvertimeAlerts from "../components/OvertimeAlerts";
import EmployeeClientConnections from "../components/EmployeeClientConnections";
import CurrentRevenue from "../components/CurrentRevenue";

export default function DashboardPage() {
  const [employees, setEmployees] = useState([]);
  const [approvedEmployees, setApprovedEmployees] = useState([]);
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState("");
  const [warnings, setWarnings] = useState([]);
const [schedules, setSchedules] = useState([]);

  // 🚀 Initial load
  useEffect(() => {
    fetchData();
    fetchStats();
    fetchWarnings();
  }, []);

  // 📦 Load data
  async function fetchData() {
    const res = await fetch("/api/admin/dashboard");
    const data = await res.json();

    const allEmployees = data.employees || [];
    setEmployees(allEmployees);

    const approved = allEmployees.filter(emp => emp.status === "approved");
    setApprovedEmployees(approved);

    setClients(data.clients || []);
  }

  // 📊 Load stats
  async function fetchStats() {
    const res = await fetch("/api/admin/stats");
    const data = await res.json();
    setStats(data);
  }

  // 🚨 Load rejection warnings
  async function fetchWarnings() {
    try {
      const res = await fetch("/api/admin/rejection-warnings");
      const data = await res.json();
      setWarnings(data);
    } catch (err) {
      console.error("❌ Error loading warnings:", err);
    }
  }

  // ✅ Approve employee
  async function handleApproval(employee) {
    const res = await fetch("/api/approve-employee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: employee.email }),
    });
    if (res.ok) {
      setEmployees(prev =>
        prev.map(e => (e.id === employee.id ? { ...e, status: "approved" } : e))
      );
      setMessage(`✅ ${employee.firstName} wurde bestätigt`);
      fetchStats();
    } else {
      const err = await res.json();
      setMessage("❌ Fehler: " + err.message);
    }
  }

  // ❌ Reject employee
  async function handleRejection(employee) {
    const res = await fetch("/api/reject-employee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: employee.email }),
    });
    if (res.ok) {
      setEmployees(prev =>
        prev.map(e => (e.id === employee.id ? { ...e, status: "rejected" } : e))
      );
      setMessage(`❌ ${employee.firstName} wurde abgelehnt`);
      fetchStats();
    } else {
      const err = await res.json();
      setMessage("❌ Fehler: " + err.message);
    }
  }

async function handleInvite(employee) {
    console.log("Inviting", employee); // ✅ See if this prints

  const res = await fetch("/api/invite-employee", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: employee.email, firstName: employee.firstName }),
  });

  if (res.ok) {
    setMessage(`📧 Einladung an ${employee.firstName} gesendet`);

    // ✅ Update the invited status in the frontend
    setEmployees(prev =>
      prev.map(e =>
        e.id === employee.id ? { ...e, invited: true } : e
      )
    );
  } else {
    const err = await res.json();
    setMessage("❌ Fehler beim Einladen: " + err.message);
  }
}



  return (
     <AdminLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 px-4 pb-16">
        <DashboardCard title="Active Clients">
          <ActiveClients clients={clients} />
        </DashboardCard>

        <DashboardCard title="Assignments">
          <EmployeesOnAssignment employees={employees} />
        </DashboardCard>

        <DashboardCard title="Appointments" className="xl:col-span-1">
          <AppointmentCalendar schedules={schedules} />
        </DashboardCard>

        <DashboardCard title="Application Overview" className="xl:col-span-1">
          <ApplicationOverview employees={employees} />
        </DashboardCard>

        <DashboardCard title="Working Time Tracking" className="xl:col-span-2">
          <WorkingTimeTracking employees={employees} />
        </DashboardCard>

        <DashboardCard title="Overtime Alerts">
          <OvertimeAlerts employees={employees} />
        </DashboardCard>

        <DashboardCard title="Employee/Client Connections" className="xl:col-span-2">
          <EmployeeClientConnections employees={employees} />
        </DashboardCard>

        <DashboardCard title="Current Revenue">
          <CurrentRevenue clients={clients} />
        </DashboardCard>

        <DashboardCard title="Rejection Warnings" className="xl:col-span-2">
          {warnings.length === 0 ? (
            <p className="text-gray-600 text-sm">Keine Warnungen wurden gesendet.</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {warnings.map((w) => (
                <li key={w.id} className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
                  <div className="text-sm space-y-1 text-gray-700">
                    <p><span className="font-semibold text-red-800">👤 Name:</span> {w.employee.firstName} {w.employee.lastName}</p>
                    <p><span className="font-semibold text-red-800">✉️ Email:</span> {w.employee.email}</p>
                    <p>
                      <span className="font-semibold text-red-800">📅 Gesendet am:</span>{" "}
                      {new Date(w.sentAt).toLocaleDateString("de-DE")} um{" "}
                      {new Date(w.sentAt).toLocaleTimeString("de-DE")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>
      </div>

      {message && (
        <p className="text-center text-lg mt-6 text-[#04436F]">{message}</p>
      )}
    </AdminLayout>
  );
}
