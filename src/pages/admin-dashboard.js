import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import DashboardContent from "../components/DashboardContent";
import EmployeeTable from "../components/EmployeeTable";
import ClientTable from "../components/ClientTable";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardPage() {
  const [employees, setEmployees] = useState([]);
  const [approvedEmployees, setApprovedEmployees] = useState([]);
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState("");
  const [warnings, setWarnings] = useState([]);

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
      {/* 📊 Dashboard stats */}
      {stats && <DashboardContent stats={stats} />}

      {/* 🚫 Rejection warning emails */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-[#04436F] mb-4">🚫 Warnungen wegen mehrfacher Ablehnungen</h2>
        {warnings.length === 0 ? (
          <p className="text-gray-600">Keine Warnungen wurden gesendet.</p>
        ) : (
          <ul className="space-y-2">
            {warnings.map((w) => (
              <li key={w.id} className="border p-3 rounded bg-red-50">
                <p><strong>Name:</strong> {w.employee.firstName} {w.employee.lastName}</p>
                <p><strong>Email:</strong> {w.employee.email}</p>
                <p>
                  <strong>Gesendet am:</strong>{" "}
                  {new Date(w.sentAt).toLocaleDateString("de-DE")}{" "}
                  {new Date(w.sentAt).toLocaleTimeString("de-DE")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

     <EmployeeTable
  employees={employees}
  onApprove={handleApproval}
  onReject={handleRejection}
  onInvite={handleInvite} // ✅ This must be here
/>


      {/* 👩‍⚕️ Client Table */}
      <ClientTable clients={clients} employees={employees} />

      {/* ✅ Status message */}
      {message && (
        <p className="text-center text-lg mt-6 text-[#04436F]">{message}</p>
      )}
    </AdminLayout>
  );
}
