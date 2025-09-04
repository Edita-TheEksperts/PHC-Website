import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EmployeeDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [employee, setEmployee] = useState(null);

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

  const formatDate = (d) => d ? new Date(d).toLocaleDateString() : "—";
  const formatUrl = (file, label) => file ? <a className="text-blue-600 underline" href={file} target="_blank" rel="noreferrer">{label}</a> : "—";

  const fileLinks = [
    { key: "passportFile", label: "Passport" },
    { key: "visaFile", label: "Visa" },
    { key: "policeLetterFile", label: "Police Letter" },
    { key: "cvFile", label: "CV" },
    { key: "certificateFile", label: "Certificate" },
    { key: "drivingLicenceFile", label: "Driving Licence" },
    { key: "profilePhoto", label: "Profile Photo" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#04436F] mb-4">
        Mitarbeiterprofil: {employee.firstName} {employee.lastName}
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* === LEFT COLUMN === */}
        <div className="space-y-5">
          <Section title="👤 Grundlegende Informationen">
            <Item label="E-Mail" value={employee.email} />
            <Item label="Telefon" value={employee.phone} />
            <Item label="Status" value={employee.status} />
            <Item label="Created At" value={formatDate(employee.createdAt)} />
          </Section>

          <Section title="📍 Adresse">
          <Item label="Strasse" value={`${employee.address || "—"} ${employee.houseNumber || ""}`} />
          <Item label="Stadt/PLZ" value={`${employee.city || "—"}, ${employee.zipCode || "—"}`} />
          <Item label="Land" value={`${employee.country || "—"} (${employee.canton || "—"})`} />
          <Item label="Nationalität" value={employee.nationality} />

          </Section>

        <Section title="📅 Verfügbarkeit">
          <Item label="Ab" value={formatDate(employee.availabilityFrom)} />
          <Item label="Tage" value={(employee.availabilityDays || []).join(", ")} />
        </Section>


          <Section title="🗂 Hochgeladene Dateien">
            {fileLinks.map((f) => (
              <Item key={f.key} label={f.label} value={formatUrl(employee[f.key], f.label)} />
            ))}
          </Section>
        </div>

        {/* === RIGHT COLUMN === */}
        <div className="space-y-5">
          <Section title="💼 Erfahrung">
            <Item label="Jahre" value={employee.experienceYears} />
            <Item label="Wo" value={employee.experienceWhere} />
            <Item label="Unternehmen" value={employee.experienceCompany} />
          </Section>

          <Section title="🚘 Führerschein & Fahrzeug">
            <Item label="Hat Lizenz" value={employee.hasLicense ? "Yes" : "No"} />
            <Item label="Typ" value={employee.licenseType} />
            <Item label="Hat Auto" value={employee.hasCar} />
            <Item label="Auto für die Arbeit" value={employee.carAvailableForWork} />
          </Section>    
          
<Section title="⚙️ Eigenschaften & Unterstützung">
  <Item label="Schulungen" value={(employee.specialTrainings || []).join(", ")} />
  <Item label="Sprachen" value={(employee.languages || []).join(", ")} />
  <Item label="Kommunikation" value={(employee.communicationTraits || []).join(", ")} />
  <Item label="Ernährungserfahrung" value={(employee.dietaryExperience || []).join(", ")} />
</Section>


<Section title="📊 Einsätze & Einsatzpläne">
  <Item label="Gesamte Einsätze" value={employee.assignments?.length || 0} />
  <Item label="Gesamte Einsatzpläne" value={employee.schedules?.length || 0} />
  {employee.schedules?.length > 0 && (
    <ul className="list-disc ml-6 text-sm text-gray-700">
      {employee.schedules.map((s) => (
        <li key={s.id}>
          {s.day} – {s.hours}h @ {s.startTime} ({formatDate(s.date)})
        </li>
      ))}
    </ul>
  )}
</Section>

        </div>
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={() => router.push("/admin/employees")}
          className="px-6 py-2 bg-[#04436F] text-white rounded hover:bg-[#033350]"
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
