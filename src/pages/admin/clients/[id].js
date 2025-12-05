import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ClientDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  function formatDate(dateString) {
    if (!dateString) return "—";
    const d = new Date(dateString);
    return `${String(d.getDate()).padStart(2, "0")}.${String(
      d.getMonth() + 1
    ).padStart(2, "0")}.${d.getFullYear()}`;
  }

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
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

      {/* Heading */}
      <div className="border-b pb-4">
        <h1 className="text-4xl font-bold text-[#04436F]">Kundenprofil</h1>
        <p className="text-lg text-gray-600 mt-1">
          {client.firstName} {client.lastName}
        </p>
      </div>

      {/*  =================  TWO COLUMN LAYOUT  ================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* ================= LEFT COLUMN ================= */}
        <div className="bg-white rounded-xl shadow p-8 border space-y-10">

          <h2 className="text-2xl font-bold text-[#04436F]">Funnel & Persönliche Infos</h2>

          {/* DETAILS GRID */}
          <div className="grid md:grid-cols-2 gap-10">

            {/* PERSONAL INFO */}
            <section>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Persönliche Infos</h3>
              <ul className="space-y-1 text-gray-800">
                <li><strong>E-Mail:</strong> {client.email}</li>
                <li><strong>Telefon:</strong> {client.phone}</li>
                <li><strong>Sprachen:</strong> {client.languages || "—"}</li>
              </ul>
            </section>

            {/* ADDRESS */}
            <section>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Adresse</h3>
              <ul className="space-y-1 text-gray-800">
                <li><strong>Strasse:</strong> {client.address}</li>
                <li><strong>PLZ:</strong> {client.postalCode || "—"}</li>
              </ul>
            </section>

            {/* EMERGENCY CONTACT */}
            <section>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Notfallkontakt</h3>
              <ul className="space-y-1 text-gray-800">
                <li><strong>Name:</strong> {client.emergencyContactName || "—"}</li>
                <li><strong>Telefon:</strong> {client.emergencyContactPhone || "—"}</li>
              </ul>
            </section>

            {/* SERVICES */}
            <section>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Dienstleistungen</h3>
              <ul className="space-y-1 text-gray-800">
                <li><strong>Hauptdienstleistungen:</strong> {(client.services || []).map(s => s.name).join(", ") || "—"}</li>
                <li><strong>Nebendienstleistungen:</strong> {(client.subServices || []).map(s => s.name).join(", ") || "—"}</li>
              </ul>
            </section>

            {/* SERVICE PREFS */}
            <section>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Service Präferenzen</h3>
              <ul className="space-y-1 text-gray-800">
                <li><strong>Erstes Datum:</strong> {formatDate(client.firstDate)}</li>
                <li><strong>Häufigkeit:</strong> {client.frequency || "—"}</li>
                <li><strong>Dauer:</strong> {client.duration ? `${client.duration} Std` : "—"}</li>
              </ul>
            </section>

            {/* META */}
            <section>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Meta</h3>
              <ul className="space-y-1 text-gray-800">
                <li>
                  <strong>Status:</strong>{" "}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium 
                    ${client.status === "canceled" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                    {client.status || "open"}
                  </span>
                </li>
                <li><strong>Rolle:</strong> {client.role}</li>
                <li><strong>Angelegt:</strong> {new Date(client.createdAt).toLocaleString()}</li>
                <li><strong>Aktualisiert:</strong> {new Date(client.updatedAt).toLocaleString()}</li>
              </ul>
            </section>
          </div>

          {/* FUNNEL QUESTIONNAIRE */}
          <section>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Fragebogen</h3>

            <div className="grid md:grid-cols-2 gap-8 bg-gray-50 p-6 rounded-xl border">

              {/* Allergies */}
              <div>
                <h4 className="font-semibold mb-2">Allergien & Gesundheit</h4>
                <ul className="space-y-1 text-gray-800">
                  <li><strong>Allergien:</strong> {client.hasAllergies || "—"}</li>
                  <li><strong>Details:</strong> {client.allergyDetails || "—"}</li>
                  <li><strong>Gesundheit:</strong> {client.healthFindings || "—"}</li>
                  <li><strong>Med. Befunde:</strong> {client.medicalFindings || "—"}</li>
                </ul>
              </div>

              {/* Mobility */}
              <div>
                <h4 className="font-semibold mb-2">Mobilität & Haushalt</h4>
                <ul className="space-y-1 text-gray-800">
                  <li><strong>Mobilität:</strong> {client.mobility || "—"}</li>
                  <li><strong>Zimmer:</strong> {client.householdRooms || "—"}</li>
                  <li><strong>Personen:</strong> {client.householdPeople || "—"}</li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="font-semibold mb-2">Alltag & Unterstützung</h4>
                <ul className="space-y-1 text-gray-800">
                  <li><strong>Kochen:</strong> {client.cooking || "—"}</li>
                  <li><strong>Einkauf:</strong> {client.shoppingType || "—"}</li>
                </ul>
              </div>

              {/* Communication */}
              <div>
                <h4 className="font-semibold mb-2">Kommunikation</h4>
                <ul className="space-y-1 text-gray-800">
                  <li><strong>Sehen:</strong> {client.communicationVision || "—"}</li>
                  <li><strong>Hören:</strong> {client.communicationHearing || "—"}</li>
                  <li><strong>Sprechen:</strong> {client.communicationSpeech || "—"}</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="bg-white rounded-xl shadow p-8 border space-y-10">

          <h2 className="text-2xl font-bold text-[#04436F]">Einsatzinformationen</h2>

          {/* ASSIGNMENTS */}
          <div className="bg-gray-50 p-6 rounded-xl border">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Zuweisungen</h3>

            {client.assignments?.length > 0 ? (
              <ul className="space-y-3">
                {client.assignments.map(a => (
                  <li key={a.id} className="p-4 bg-white border rounded shadow-sm">
                    <p><strong>Mitarbeiter:</strong> {a.employee?.firstName} {a.employee?.lastName}</p>
                    <p><strong>Status:</strong> {a.status}</p>
                    <p><strong>Zugewiesen am:</strong> {formatDate(a.createdAt)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">Keine Einsätze gefunden</p>
            )}
          </div>

          {/* TERMINLISTE */}
          {client.schedules?.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Termine (Einsätze)</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 text-sm">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="px-4 py-2">Datum</th>
                      <th className="px-4 py-2">Zeit</th>
                      <th className="px-4 py-2">Stunden</th>
                      <th className="px-4 py-2">Mitarbeiter</th>
                      <th className="px-4 py-2">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {client.schedules.map(sched => (
                      <tr key={sched.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2">{sched.date ? new Date(sched.date).toLocaleDateString("de-DE") : "—"}</td>
                        <td className="px-4 py-2">{sched.startTime || "—"}</td>
                        <td className="px-4 py-2">{sched.hours}h</td>
                        <td className="px-4 py-2">
                          {sched.employee
                            ? `${sched.employee.firstName} ${sched.employee.lastName}`
                            : "Kein Mitarbeiter zugewiesen"}
                        </td>
                        <td className="px-4 py-2">
                          {sched.status === "cancelled" ? (
                            <span className="text-red-600 font-medium">Storniert</span>
                          ) : sched.status === "completed" ? (
                            <span className="text-green-600 font-medium">Abgeschlossen</span>
                          ) : (
                            <span className="text-yellow-600 font-medium">Offen</span>
                          )}
                        </td>
                      </tr>
                   ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* BACK BUTTON */}
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
