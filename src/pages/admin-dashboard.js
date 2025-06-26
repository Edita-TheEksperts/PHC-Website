import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import DashboardContent from "../components/DashboardContent";
import EmployeeTable from "../components/EmployeeTable";
import ClientTable from "../components/ClientTable";
import SystemMaintenanceEmail from "../components/SystemMaintenanceEmail"; // adjust path
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardPage() {
  const [employees, setEmployees] = useState([]);
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState("");

useEffect(() => {
  fetchData();
  fetchStats();
}, []);

async function fetchData() {
  const res = await fetch("/api/admin/dashboard");
  const data = await res.json();

const allEmployees = data.employees || [];
setEmployees(allEmployees); // ✅ this has ALL employees (approved + pending + rejected)

  // 🛠️ Only send approved employees to dropdown
const approvedEmployees = allEmployees.filter(emp => emp.status === "approved");
setApprovedEmployees(approvedEmployees);

  setClients(data.clients || []);
}



  async function fetchStats() {
    const res = await fetch("/api/admin/stats");
    const data = await res.json();
    setStats(data);
  }

  async function handleApproval(employee) {
    const res = await fetch("/api/approve-employee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: employee.email }),
    });
    if (res.ok) {
      setEmployees((prev) =>
        prev.map((e) => (e.id === employee.id ? { ...e, status: "approved" } : e))
      );
      setMessage(`✅ ${employee.firstName} approved`);
      fetchStats();
    } else {
      const err = await res.json();
      setMessage("❌ Error: " + err.message);
    }
  }

  async function handleRejection(employee) {
    const res = await fetch("/api/reject-employee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: employee.email }),
    });
    if (res.ok) {
      setEmployees((prev) =>
        prev.map((e) => (e.id === employee.id ? { ...e, status: "rejected" } : e))
      );
      setMessage(`❌ ${employee.firstName} rejected`);
      fetchStats();
    } else {
      const err = await res.json();
      setMessage("❌ Error: " + err.message);
    }
  }
const [approvedEmployees, setApprovedEmployees] = useState([]);

  return (
    <AdminLayout>
      {stats && <DashboardContent stats={stats} />}
      <EmployeeTable employees={employees} onApprove={handleApproval} onReject={handleRejection} />
<ClientTable clients={clients} employees={employees} />
      {message && <p className="text-center text-lg mt-6 text-[#04436F]">{message}</p>}
    </AdminLayout>
  );
}
