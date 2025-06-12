import { useRouter } from "next/router";

export default function ClientTable({ clients }) {
  const router = useRouter();

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#04436F] mb-4">Clients</h2>
      <div className="bg-white rounded-xl shadow overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-t">
                <td className="p-3">{client.firstName} {client.lastName}</td>
                <td className="p-3">{client.email}</td>
                <td className="p-3">{client.phone}</td>
                <td className="p-3">
                  <button onClick={() => router.push(`/clients/${client.id}`)} className="bg-blue-500 text-white px-3 py-1 rounded">Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
