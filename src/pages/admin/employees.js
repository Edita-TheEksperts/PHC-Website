import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import EmployeeTable from "../../components/EmployeeTable";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  // Fetch all employees
  useEffect(() => {
    async function fetchEmployees() {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      setEmployees(data.employees || []);
    }
    fetchEmployees();
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

  // Add employee
  async function handleAddEmployee(e) {
    e.preventDefault();
    const res = await fetch("/api/admin/add-employee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEmployee),
    });

    const data = await res.json();
    if (data.success) {
      setEmployees((prev) => [...prev, data.employee]); // add to list
      setNewEmployee({ firstName: "", lastName: "", email: "" }); // reset
    } else {
      alert("Error adding employee");
    }
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl sm:text-3xl font-bold text-[#04436F] mb-6">
       Alle Mitarbeiter
      </h1>

      {/* Add Employee Form */}
      <form
        onSubmit={handleAddEmployee}
        className="mb-6 p-4 border rounded-lg bg-gray-50 flex flex-col sm:flex-row gap-4"
      >
        <input
          type="text"
          placeholder="Vorname"
          value={newEmployee.firstName}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, firstName: e.target.value })
          }
          className="border p-2 rounded flex-1"
          required
        />
        <input
          type="text"
          placeholder="Nachname"
          value={newEmployee.lastName}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, lastName: e.target.value })
          }
          className="border p-2 rounded flex-1"
          required
        />
        <input
          type="email"
          placeholder="E-Mail"
          value={newEmployee.email}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, email: e.target.value })
          }
          className="border p-2 rounded flex-1"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
        >
Mitarbeiter hinzufügen        </button>
      </form>

      {/* Employee Table */}
      <EmployeeTable
        employees={employees}
        onApprove={handleApproval}
        onReject={handleRejection}
        onInvite={handleInvite}
      />
    </AdminLayout>
  );
}
