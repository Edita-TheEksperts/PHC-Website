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
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
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

        {/* PERSONAL INFO */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-3"> Persönliche Infos</h2>
          <ul className="space-y-1 text-gray-800">
            <li><strong>E-Mail:</strong> {client.email}</li>
            <li><strong>Telefon:</strong> {client.phone}</li>
            <li><strong>Sprachen:</strong> {client.languages || "—"}</li>
          </ul>
        </section>

        {/* ADDRESS */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-3">🏡 Adresse</h2>
          <ul className="space-y-1 text-gray-800">
            <li><strong>Strasse:</strong> {client.address}</li>
            <li><strong>PLZ:</strong> {client.postalCode || "—"}</li>
          </ul>
        </section>

        {/* EMERGENCY CONTACT */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-3"> Notfallkontakt</h2>
          <ul className="space-y-1 text-gray-800">
            <li><strong>Name:</strong> {client.emergencyContactName || "—"}</li>
            <li><strong>Telefon:</strong> {client.emergencyContactPhone || "—"}</li>
          </ul>
        </section>

        {/* SERVICES */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-3"> Dienstleistungen</h2>
          <ul className="space-y-1 text-gray-800">
            <li><strong>Hauptdienstleistungen:</strong> {(client.services || []).map(s => s.name).join(", ") || "—"}</li>
            <li><strong>Nebendienstleistungen:</strong> {(client.subServices || []).map(s => s.name).join(", ") || "—"}</li>
          </ul>
        </section>

        {/* SERVICE PREFERENCES */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-3"> Service Präferenzen</h2>
          <ul className="space-y-1 text-gray-800">
            <li><strong>Erstes Datum:</strong> {formatDate(client.firstDate)}</li>
            <li><strong>Häufigkeit:</strong> {client.frequency || "—"}</li>
            <li><strong>Dauer:</strong> {client.duration ? `${client.duration} Stunde(n)` : "—"}</li>
          </ul>
        </section>

        {/* ASSIGNMENT */}
        {client.assignments?.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-3"> Zuteilung</h2>
            <p className="text-gray-800">
              <strong>Assigned To:</strong> {client.assignments[0]?.employee?.firstName || "—"}{" "}
              <span className="text-sm text-blue-600">
                ({client.assignments[0]?.confirmationStatus || "—"})
              </span>
            </p>
          </section>
        )}

        {/* META */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-3"> Meta-Info</h2>
          <ul className="space-y-1 text-gray-800">
            <li>
              <strong>Status:</strong>{" "}
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium 
                  ${client.status === "canceled" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
              >
                {client.status || "open"}
              </span>
            </li>
            <li><strong>Rolle:</strong> {client.role}</li>
            <li><strong>Angelegt:</strong> {new Date(client.createdAt).toLocaleString()}</li>
            <li><strong>Aktualisiert:</strong> {new Date(client.updatedAt).toLocaleString()}</li>
          </ul>
        </section>
      </div>

      {/* FUNNEL SECTION */}
      <section className="col-span-2">
        <h2 className="text-2xl font-bold text-[#04436F] mb-4"> Fragebogen </h2>

        <div className="grid md:grid-cols-2 gap-8 bg-gray-50 p-6 rounded-xl border">

          {/* Allergies & Health */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Allergien & Gesundheit</h3>
            <ul className="space-y-1 text-gray-800">
              <li><strong>Allergien:</strong> {client.hasAllergies || "—"}</li>
              <li><strong>Allergie Details:</strong> {client.allergyDetails || "—"}</li>
              <li><strong>Gesundheitsbefunde:</strong> {client.healthFindings || "—"}</li>
              <li><strong>Medizinische Befunde:</strong> {client.medicalFindings || "—"}</li>
              <li><strong>Diagnosen:</strong> {client.mentalDiagnoses || "—"}</li>
            </ul>
          </div>

          {/* Mobility & Household */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Mobilität & Haushalt</h3>
            <ul className="space-y-1 text-gray-800">
              <li><strong>Mobilität:</strong> {client.mobility || "—"}</li>
              <li><strong>Hilfsmittel:</strong> {client.mobilityAids || "—"}</li>
              <li><strong>Zimmer:</strong> {client.householdRooms || "—"}</li>
              <li><strong>Personen im Haushalt:</strong> {client.householdPeople || "—"}</li>
              <li><strong>Aufgaben:</strong> {client.householdTasks ? JSON.stringify(client.householdTasks) : "—"}</li>
            </ul>
          </div>

          {/* Daily Support */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Alltag & Unterstützung</h3>
            <ul className="space-y-1 text-gray-800">
              <li><strong>Kochen:</strong> {client.cooking || "—"}</li>
              <li><strong>Einkauf:</strong> {client.shoppingType || "—"}</li>
              <li><strong>Einkaufsitems:</strong> {client.shoppingItems || "—"}</li>
              <li><strong>Begleitung:</strong> {client.companionship || "—"}</li>
              <li><strong>Ausflüge:</strong> {client.outings || "—"}</li>
            </ul>
          </div>

          {/* Communication */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Kommunikation</h3>
            <ul className="space-y-1 text-gray-800">
              <li><strong>Sehen:</strong> {client.communicationVision || "—"}</li>
              <li><strong>Hören:</strong> {client.communicationHearing || "—"}</li>
              <li><strong>Sprechen:</strong> {client.communicationSpeech || "—"}</li>
            </ul>
          </div>

          {/* Basic Care */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Grundpflege</h3>
            <ul className="space-y-1 text-gray-800">
              <li><strong>Bedarf:</strong> {client.basicCare || "—"}</li>
              <li><strong>Sonstiges:</strong> {client.basicCareOther || "—"}</li>
            </ul>
          </div>

          {/* Technical */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Technik & Haushalt</h3>
            <ul className="space-y-1 text-gray-800">
              <li><strong>Technische Geräte:</strong> {client.techAvailable || client.hasTech || "—"}</li>
              <li><strong>Werkzeuge:</strong> {client.toolsAvailable || "—"}</li>
              <li><strong>Briefkasten:</strong> {client.mailboxDetails || client.briefkasten || "—"}</li>
              <li><strong>Postfach:</strong> {client.postfach || "—"}</li>
            </ul>
          </div>

        </div>
      </section>

      {/* SCHEDULE TABLE */}
      {client.schedules?.length > 0 && (
        <div className="pt-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-3"> Eingeplante Einsätze</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2">Tag</th>
                  <th className="px-4 py-2">Datum</th>
                  <th className="px-4 py-2">Zeit</th>
                  <th className="px-4 py-2">Stunden</th>
                  <th className="px-4 py-2">KM</th>
                  <th className="px-4 py-2">Adresse</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {client.schedules.map((sched) => (
                  <tr key={sched.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{sched.day}</td>
                    <td className="px-4 py-2">{formatDate(sched.date)}</td>
                    <td className="px-4 py-2">{sched.startTime}</td>
                    <td className="px-4 py-2">{sched.hours}h</td>
                    <td className="px-4 py-2">{sched.kilometers ?? "—"}</td>
                    <td className="px-4 py-2">{sched.user?.address || "—"}</td>
                    <td className="px-4 py-2">
                      {sched.captured ? (
                        <span className="text-green-600 font-medium">Offen</span>
                      ) : (
                        <span className="text-red-500">Noch offen</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
