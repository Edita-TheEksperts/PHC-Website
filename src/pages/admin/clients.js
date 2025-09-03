import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import ClientTable from "../../components/ClientTable";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    async function fetchClients() {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      setClients(data.clients || []);
    }
    fetchClients();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-[#04436F] mb-6">Alle Kunden</h1>
      <ClientTable clients={clients} />
    </AdminLayout>
  );
}
