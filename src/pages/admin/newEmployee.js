import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { useRouter } from "next/router";

export default function NewEmployeePage() {
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ firstName: "", lastName: "", email: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    async function fetchEmployees() {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      setEmployees(data.employees || []);
    }
    fetchEmployees();
  }, []);

  const handleApproval = async (emp) => {
    await fetch("/api/approve-employee", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: emp.email }) });
    setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, status: "approved" } : e));
  };

  const handleRejection = async (emp) => {
    await fetch("/api/reject-employee", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: emp.email }) });
    setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, status: "rejected" } : e));
  };

  const handleInvite = async (emp) => {
    await fetch("/api/invite-employee", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: emp.email, firstName: emp.firstName }) });
    setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, invited: true } : e));
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/admin/add-employee", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newEmployee) });
    const data = await res.json();
    if (data.success) {
      setEmployees(prev => [...prev, data.employee]);
      setNewEmployee({ firstName: "", lastName: "", email: "" });
    } else {
      alert("Fehler beim Hinzufügen des Mitarbeiters");
    }
  };

  const filteredEmployees = employees
    .filter(emp => emp.status !== "approved")
    .filter(emp => `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, visibleCount);

  const statusColors = {
    approved: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800"
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-[#04436F] mb-6">Bewerber</h1>
      {/* Search */}
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="mb-6 p-3 w-full border rounded-lg focus:ring-2 focus:ring-[#04436F]"
      />

      {/* Employees Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map(emp => (
          <div key={emp.id} className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition relative">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold text-[#04436F]">{emp.firstName} {emp.lastName}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[emp.status]}`}>
                {emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
              </span>
            </div>
            <p className="text-sm mb-1"><strong>E-Mail:</strong> {emp.email}</p>
            <p className="text-sm mb-1"><strong>Telefon:</strong> {emp.phone || "—"}</p>
            <p className="text-sm mb-3"><strong>Erstellt:</strong> {new Date(emp.createdAt).toLocaleDateString("de-DE")}</p>

            <div className="flex flex-wrap gap-2 mt-2">
              {emp.status === "pending" && (
                <>
                  <button onClick={() => handleApproval(emp)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm w-full">Genehmigen</button>
                  <button onClick={() => handleRejection(emp)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm w-full">Ablehnen</button>
                  {!emp.invited && <button onClick={() => handleInvite(emp)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm w-full">Einladen</button>}
                </>
              )}
              <button onClick={() => router.push(`/admin/employees/${emp.id}`)} className="bg-[#04436F] hover:bg-[#033252] text-white px-3 py-2 rounded-lg text-sm w-full">Details</button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {visibleCount < employees.filter(emp => emp.status !== "approved").length && (
        <div className="mt-6 text-center">
          <button onClick={() => setVisibleCount(prev => prev + 12)} className="px-5 py-2 bg-[#04436F] text-white rounded-full hover:bg-[#033252] transition font-semibold">
            Mehr laden
          </button>
        </div>
      )}
    </AdminLayout>
  );
}
