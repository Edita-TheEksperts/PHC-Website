import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import EmployeeTable from "../../components/EmployeeTable";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    async function fetchEmployees() {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      setEmployees(data.employees || []);
    }
    fetchEmployees();
  }, []);

  async function handleApproval(emp) {
    await fetch("/api/approve-employee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emp.email }),
    });
    setEmployees((prev) => prev.map((e) => (e.id === emp.id ? { ...e, status: "approved" } : e)));
  }

  async function handleRejection(emp) {
    await fetch("/api/reject-employee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emp.email }),
    });
    setEmployees((prev) => prev.map((e) => (e.id === emp.id ? { ...e, status: "rejected" } : e)));
  }
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
    <h1 className="text-2xl sm:text-3xl font-bold text-[#04436F] mb-6">All Employees</h1>
    <EmployeeTable employees={employees} onApprove={handleApproval} onReject={handleRejection} onInvite={handleInvite} />
</AdminLayout>

  );
}
