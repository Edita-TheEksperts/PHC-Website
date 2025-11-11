import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ClientDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchClient() {
      try {
        const res = await fetch(`/api/clients/${id}`);
        const data = await res.json();
        setClient(data);
      } catch (err) {
        console.error("Failed to fetch client:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchClient();
  }, [id]);

  if (loading) return <p className="p-6 text-gray-600">Loading client data...</p>;
  if (!client) return <p className="p-6 text-red-600">Client not found</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 bg-white rounded-xl shadow-lg space-y-10">
      {/* Heading */}
      <div className="border-b pb-4">
        <h1 className="text-4xl font-bold text-[#04436F]">Kundenprofil</h1>
        <p className="text-lg text-gray-600 mt-1">
          {client.firstName} {client.lastName}
        </p>
      </div>

      {/* Details Grid */}
      <div className="grid md:grid-cols-2 gap-10">
        {/* Personal Info */}
 <section>
  <h2 className="text-xl font-semibold text-gray-700 mb-3">👤 Persönliche Infos</h2>
  <ul className="space-y-1 text-gray-800">
    <li><strong>E-Mail:</strong> {client.email}</li>
    <li><strong>Telefon:</strong> {client.phone}</li>
    <li><strong>Sprachen:</strong> {client.languages || "—"}</li>
  </ul>
</section>


        {/* Address */}
     <section>
  <h2 className="text-xl font-semibold text-gray-700 mb-3">📍 Adresse</h2>
  <ul className="space-y-1 text-gray-800">
    <li><strong>Strasse:</strong> {client.address}</li>
    <li><strong>PLZ:</strong> {client.postalCode || "—"}</li>
  </ul>
</section>


        {/* Emergency Contact */}
        <section>
  <h2 className="text-xl font-semibold text-gray-700 mb-3">🚨 Notfallkontakt</h2>
  <ul className="space-y-1 text-gray-800">
    <li><strong>Name:</strong> {client.emergencyContactName || "—"}</li>
    <li><strong>Telefon:</strong> {client.emergencyContactPhone || "—"}</li>
  </ul>
</section>


        {/* Services */}
       <section>
  <h2 className="text-xl font-semibold text-gray-700 mb-3">🧾 Dienstleistungen</h2>
  <ul className="space-y-1 text-gray-800">
    <li><strong>Hauptdienstleistungen:</strong> {(client.services || []).map(s => s.name).join(", ") || "—"}</li>
    <li><strong>Nebendienstleistungen:</strong> {(client.subServices || []).map(s => s.name).join(", ") || "—"}</li>
  </ul>
</section>


        {/* Service Preferences */}
        <section>
  <h2 className="text-xl font-semibold text-gray-700 mb-3">🧽 Service Präferenzen</h2>
  <ul className="space-y-1 text-gray-800">
    <li><strong>Erstes Datum:</strong> {client.firstDate ? new Date(client.firstDate).toLocaleDateString() : "—"}</li>
    <li><strong>Häufigkeit:</strong> {client.frequency || "—"}</li>
    <li><strong>Dauer:</strong> {client.duration ? `${client.duration} Stunde(n)` : "—"}</li>
  </ul>
</section>

        {/* Assignment */}
        {client.assignments?.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">👥 Zuegteilti</h2>
            <p className="text-gray-800">
              <strong>Assigned To:</strong> {client.assignments[0]?.employee?.firstName || "—"}{" "}
              <span className="text-sm text-blue-600">
                ({client.assignments[0]?.confirmationStatus || "—"})
              </span>
            </p>
          </section>
        )}

        {/* Meta Info */}
      <section>
  <h2 className="text-xl font-semibold text-gray-700 mb-3">📂 Meta-Info</h2>
  <ul className="space-y-1 text-gray-800">
    <li>
      <strong>Status:</strong>{" "}
      <span
        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium 
          ${client.status === "canceled" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
      >
        {client.status || "offe"}
      </span>
    </li>
    <li>
      <strong>Rolle:</strong>{" "}
      <span className="inline-block px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
        {client.role}
      </span>
    </li>
    <li><strong>Aaglegt:</strong> {new Date(client.createdAt).toLocaleString()}</li>
    <li><strong>Aktualisiert:</strong> {new Date(client.updatedAt).toLocaleString()}</li>
  </ul>
</section>

      </div>

      {/* Schedule */}
      {client.schedules?.length > 0 && (
       <div className="pt-4">
  <h2 className="text-xl font-semibold text-gray-700 mb-3">🗓️ Iplanti Bsüech</h2>
  <div className="overflow-x-auto">
<table className="min-w-full border border-gray-200 text-sm">
  <thead className="bg-gray-100 text-gray-700">
    <tr>
      <th className="px-4 py-2 text-left">Tag</th>
      <th className="px-4 py-2 text-left">Datum</th>
      <th className="px-4 py-2 text-left">Startzit</th>
      <th className="px-4 py-2 text-left">Stunde</th>
      <th className="px-4 py-2 text-left">KM</th>
      <th className="px-4 py-2 text-left">Klient</th>
      <th className="px-4 py-2 text-left">Adresse</th>
      <th className="px-4 py-2 text-left">Ufnah</th>
    </tr>
  </thead>

  <tbody>
    {client.schedules.map((sched) => (
      <tr key={sched.id} className="border-t hover:bg-gray-50">
        <td className="px-4 py-2">{sched.day}</td>
        <td className="px-4 py-2">
          {sched.date ? new Date(sched.date).toLocaleDateString("de-CH") : "—"}
        </td>
        <td className="px-4 py-2">{sched.startTime}</td>
        <td className="px-4 py-2">{sched.hours}h</td>
        <td className="px-4 py-2">{sched.kilometers ?? "—"}</td>
        <td className="px-4 py-2">
          {sched.user
            ? `${sched.user.firstName} ${sched.user.lastName}`
            : "—"}
        </td>
        <td className="px-4 py-2">{sched.user?.address || "—"}</td>
        <td className="px-4 py-2">
          {sched.captured ? (
            <span className="text-green-600 font-medium">✔ Ufnah</span>
          ) : (
            <span className="text-red-500">✖ No nid</span>
          )}
        </td>
      </tr>
    ))}
  </tbody>
</table>

  </div>
</div>

      )}

      {/* Back Button */}
      <div className="pt-8">
        <button
          onClick={() => router.push("/admin/clients")}
          className="px-6 py-2 bg-[#04436F] text-white rounded hover:bg-[#033350] transition"
        >
       ← Zurück zu Kunden
        </button>
      </div>
    </div>
  );
}
