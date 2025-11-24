import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EmployeeDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [employee, setEmployee] = useState(null);
const [termineFilter, setTermineFilter] = useState("all"); // ✅ default


  useEffect(() => {
    if (!id) return;
    async function fetchEmployee() {
      const res = await fetch(`/api/admin/employee/${id}`);
      const data = await res.json();
      setEmployee(data);
    }
    fetchEmployee();
  }, [id]);

  if (!employee) return <p className="p-6 text-gray-600">Loading...</p>;
// === AFTER employee is loaded ===
if (!employee) return <p className="p-6 text-gray-600">Loading...</p>;

// Filtered Termine now computed safely
const filteredTermine =
  termineFilter === "all"
    ? employee.schedules
    : employee.schedules?.filter((t) => t.status === termineFilter);

  const formatDate = (d) => {
    if (!d) return "—";
    const date = new Date(d);
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatUrl = (file, label) =>
    file ? (
      <a
        className="text-blue-600 underline"
        href={file}
        target="_blank"
        rel="noreferrer"
      >
        {label}
      </a>
    ) : (
      "—"
    );

  const STATUS_LABELS = {
    approved: "Genehmigt",
    pending: "Ausstehend",
    rejected: "Abgelehnt",
  };

  const fileLinks = [
    { key: "passportFile", label: "Reisepass" },
    { key: "visaFile", label: "Visum" },
    { key: "policeLetterFile", label: "Polizeiliches Führungszeugnis" },
    { key: "cvFile", label: "Lebenslauf" },
    { key: "certificateFile", label: "Zertifikat" },
    { key: "drivingLicenceFile", label: "Führerschein" },
    { key: "profilePhoto", label: "Profilfoto" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#04436F] mb-6">
        Mitarbeiterprofil: {employee.firstName} {employee.lastName}
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* === LEFT COLUMN: Personal Info, Documents, Licenses, Trainings === */}
        <div className="space-y-6">
          <Section title="👤 Persönliche Informationen">
            <Item label="E-Mail" value={employee.email} />
            <Item label="Telefon" value={employee.phone} />
            <Item label="Status" value={STATUS_LABELS[employee.status] || employee.status} />
            <Item label="Erstellt am" value={formatDate(employee.createdAt)} />
          </Section>

          <Section title="📍 Adresse & Nationalität">
            <Item label="Adresse" value={`${employee.address || "—"} ${employee.houseNumber || ""}`} />
            <Item label="Stadt/PLZ" value={`${employee.city || "—"}, ${employee.zipCode || "—"}`} />
            <Item label="Land" value={`${employee.country || "—"} (${employee.canton || "—"})`} />
            <Item label="Nationalität" value={employee.nationality} />
          </Section>

          <Section title="📅 Verfügbarkeit & Erfahrung">
            <Item label="Ab" value={formatDate(employee.availabilityFrom)} />
            <Item label="Tage" value={(employee.availabilityDays || []).join(", ")} />
            <Item label="Erfahrung (Jahre)" value={employee.experienceYears} />
            <Item label="Erfahrungsort" value={employee.experienceWhere} />
            <Item label="Unternehmen" value={employee.experienceCompany} />
          </Section>

          <Section title="🗂 Hochgeladene Dateien">
            {fileLinks.map((f) => (
              <Item key={f.key} label={f.label} value={formatUrl(employee[f.key], f.label)} />
            ))}
          </Section>

          <Section title="🚘 Führerschein & Fahrzeug">
            <Item label="Hat Lizenz" value={employee.hasLicense ? "Ja" : "Nein"} />
            <Item label="Typ" value={employee.licenseType} />
            <Item label="Hat Auto" value={employee.hasCar ? "Ja" : "Nein"} />
            <Item label="Auto für Arbeit" value={employee.carAvailableForWork ? "Ja" : "Nein"} />
          </Section>

          <Section title="⚙️ Schulungen & Sprachen">
            <Item label="Schulungen" value={(employee.specialTrainings || []).join(", ")} />
            <Item label="Sprachen" value={(employee.languages || []).join(", ")} />
            <Item label="Kommunikation" value={(employee.communicationTraits || []).join(", ")} />
            <Item label="Ernährungserfahrung" value={(employee.dietaryExperience || []).join(", ")} />
          </Section>
        </div>

        {/* === RIGHT COLUMN: Vacations, Assignments, Appointments === */}
        <div className="space-y-6">
          <Section title="🏖️ Urlaube">
            {employee.vacations?.length > 0 ? (
              <ul className="space-y-2 max-h-64 overflow-y-auto">
                {employee.vacations.map((v) => (
                  <li
                    key={v.id}
                    className="border p-3 rounded-lg bg-gray-50 shadow-sm hover:bg-gray-100 transition"
                  >
                    <p className="font-medium text-[#04436F]">
                      📅 {formatDate(v.startDate)} – {formatDate(v.endDate)}
                    </p>
                    <span
                      className={`px-2 py-1 text-xs rounded mt-1 inline-block ${
                        v.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : v.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {v.status === "approved"
                        ? "Genehmigt"
                        : v.status === "rejected"
                        ? "Abgelehnt"
                        : "Ausstehend"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm italic">Keine Urlaube gefunden</p>
            )}
          </Section>

          <Section title="📊 Einsätze">
            <Item label="Gesamte Einsätze" value={employee.assignments?.length || 0} />
            <Item label="Gesamte Einsatzpläne" value={employee.schedules?.length || 0} />
            {employee.schedules?.length > 0 && (
              <ul className="list-disc ml-6 text-sm text-gray-700 max-h-48 overflow-y-auto">
                {employee.schedules.map((s) => (
                  <li key={s.id}>
                    {s.day} – {s.hours}h @ {s.startTime} ({formatDate(s.date)})
                  </li>
                ))}
              </ul>
            )}
          </Section>

<Section title=" Termine">
  {/* Filter Dropdown */}
  <div className="mb-3 flex items-center gap-2">
    <label className="font-medium text-gray-700">Filter:</label>
    <select
      value={termineFilter}
      onChange={(e) => setTermineFilter(e.target.value)}
      className="border rounded px-2 py-1"
    >
      <option value="all">Alle</option>
      <option value="completed">Genehmigt</option>
      <option value="cancelled">Abgelehnt</option>
      <option value="active">Ausstehend</option>
    </select>
  </div>

  {filteredTermine?.length > 0 ? (
    <ul className="space-y-2 max-h-64 overflow-y-auto">
      {filteredTermine.map((a) => (
        <li
          key={a.id}
          className="border p-3 rounded-lg bg-gray-50 shadow-sm hover:bg-gray-100 transition cursor-pointer"
        >
          <p className="font-medium text-[#04436F]">
            👤 Kunde: {a.user?.firstName} {a.user?.lastName}
          </p>
          <p className="text-sm text-gray-600">
            📅 {new Date(a.date).toLocaleDateString("de-DE")} — 🕒 {a.startTime} | {a.hours}h
          </p>

          {/* Shërbimet në gjermanisht */}
          {a.user?.services?.length > 0 && (
            <p className="text-sm text-gray-700 mt-1">
              🛠️ Dienstleistungen: {a.user.services.map((s) => s.name).join(", ")}
            </p>
          )}

          {a.user?.subServices?.length > 0 && (
            <p className="text-sm text-gray-700 mt-1">
              🔹 Unterdienste: {a.user.subServices.map((s) => s.name).join(", ")}
            </p>
          )}

          <span
            className={`px-2 py-1 inline-block text-xs rounded mt-1 ${
              a.status === "completed"
                ? "bg-green-100 text-green-700"
                : a.status === "cancelled"
                ? "bg-red-100 text-red-700"
                : a.status === "active"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {a.status === "completed"
              ? "Genehmigt"
              : a.status === "cancelled"
              ? "Abgelehnt"
              : a.status === "active"
              ? "Ausstehend"
              : a.status}
          </span>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500 text-sm italic">Keine Termine gefunden</p>
  )}
</Section>


        </div>
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={() => router.push("/admin/employees")}
          className="px-6 py-2 bg-[#04436F] text-white rounded hover:bg-[#033350] transition"
        >
          ← Zurück zu Mitarbeiter
        </button>
      </div>
    </div>
  );
}

// === REUSABLE COMPONENTS ===
function Section({ title, children }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h2 className="text-xl font-semibold text-[#04436F] mb-3">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Item({ label, value }) {
  return (
    <p>
      <span className="font-medium">{label}:</span> {value || "—"}
    </p>
  );
}
