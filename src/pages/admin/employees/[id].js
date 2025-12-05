import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EmployeeDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [employee, setEmployee] = useState(null);
const [termineFilter, setTermineFilter] = useState("all"); // ✅ default
const [isEditing, setIsEditing] = useState(false);
const [editData, setEditData] = useState({});

const [editPersonal, setEditPersonal] = useState(false);
const [editAddress, setEditAddress] = useState(false);
const [editAvailability, setEditAvailability] = useState(false);

const [personalData, setPersonalData] = useState({});
const [addressData, setAddressData] = useState({});
const [availabilityData, setAvailabilityData] = useState({});
const [editLicense, setEditLicense] = useState(false);
const [licenseData, setLicenseData] = useState({});

const [editSkills, setEditSkills] = useState(false);
const [skillsData, setSkillsData] = useState({});
const [einsatzFilter, setEinsatzFilter] = useState("all");



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

const filteredAssignments =
  einsatzFilter === "all"
    ? employee.assignments
    : employee.assignments?.filter(a => {
        if (einsatzFilter === "pending") {
          return a.status === "pending" || a.status === "active";
        }
        return a.status === einsatzFilter;
      });

async function saveSkills() {
  const payload = {
    specialTrainings: skillsData.specialTrainings
      .split(",")
      .map((x) => x.trim()),
    languages: skillsData.languages
      .split(",")
      .map((x) => x.trim()),
    communicationTraits: skillsData.communicationTraits
      .split(",")
      .map((x) => x.trim()),
    dietaryExperience: skillsData.dietaryExperience
      .split(",")
      .map((x) => x.trim()),
  };

  const res = await fetch(`/api/admin/employee/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const updated = await res.json();
  setEmployee(updated);
  setEditSkills(false);
}


async function saveLicenseCar() {
  const payload = {
    hasLicense: licenseData.hasLicense === "Ja",
    licenseType: licenseData.licenseType,
    hasCar: licenseData.hasCar === "Ja",
    carAvailableForWork: licenseData.carAvailableForWork === "Ja",
  };



  const res = await fetch(`/api/admin/employee/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const updated = await res.json();
  setEmployee(updated);
  setEditLicense(false);
}

async function saveAvailability() {
  const payload = {
    ...availabilityData,
    availabilityDays: availabilityData.availabilityDays.split(",").map((d) => d.trim()),
  };

  const res = await fetch(`/api/admin/employee/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const updated = await res.json();
  setEmployee(updated);
  setEditAvailability(false);
}

async function saveAddress() {
  const res = await fetch(`/api/admin/employee/${id}`, {
method: "PATCH",

headers: { "Content-Type": "application/json" },
    body: JSON.stringify(addressData),
  });

  const updated = await res.json();
  setEmployee(updated);
  setEditAddress(false);
}

async function savePersonal() {
  const res = await fetch(`/api/admin/employee/${id}`, {
  method: "PATCH",

    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(personalData),
  });

  const updated = await res.json();
  setEmployee(updated);
  setEditPersonal(false);
}

async function saveChanges() {
  const res = await fetch(`/api/admin/employee/${id}`, {
 method: "PATCH",

    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(editData),
  });

  const updated = await res.json();
  setEmployee(updated);
  setIsEditing(false);
}

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
   <Section title=" Persönliche Informationen">

  {/* Edit Button */}
  <div className="flex justify-end mb-2">
  <button
  onClick={() => {
    setPersonalData({
      email: employee.email,
      phone: employee.phone
    });
    setEditPersonal(true);
  }}
  className="px-3 py-1 text-sm bg-[#04436F] text-white rounded hover:bg-yellow-600"
>
  Bearbeiten
</button>

  </div>

  <Item label="E-Mail" value={employee.email} />
  <Item label="Telefon" value={employee.phone} />
  <Item label="Status" value={STATUS_LABELS[employee.status] || employee.status} />
  <Item label="Erstellt am" value={formatDate(employee.createdAt)} />
</Section>


   <Section title=" Adresse & Nationalität">

  {/* Edit Button */}
  <div className="flex justify-end mb-2">
    <button
      onClick={() => {
        setAddressData({
          address: employee.address,
          houseNumber: employee.houseNumber,
          city: employee.city,
          zipCode: employee.zipCode,
          country: employee.country,
          canton: employee.canton,
          nationality: employee.nationality,
        });
        setEditAddress(true);
      }}
      className="px-3 py-1 text-sm bg-[#04436F] text-white rounded hover:bg-yellow-600"
    >
      Bearbeiten
    </button>
  </div>

  <Item label="Adresse" value={`${employee.address || "—"} ${employee.houseNumber || ""}`} />
  <Item label="Stadt/PLZ" value={`${employee.city || "—"}, ${employee.zipCode || "—"}`} />
  <Item label="Land" value={`${employee.country || "—"} (${employee.canton || "—"})`} />
  <Item label="Nationalität" value={employee.nationality} />
</Section>

<Section title="Verfügbarkeit & Erfahrung">

  {/* Edit Button */}
  <div className="flex justify-end mb-2">
    <button
      onClick={() => {
        setAvailabilityData({
          availabilityFrom: employee.availabilityFrom,
          availabilityDays: (employee.availabilityDays || []).join(", "),
          experienceYears: employee.experienceYears,
          experienceWhere: employee.experienceWhere,
          experienceCompany: employee.experienceCompany,
        });
        setEditAvailability(true);
      }}
      className="px-3 py-1 text-sm bg-[#04436F] text-white rounded hover:bg-yellow-600"
    >
      Bearbeiten
    </button>
  </div>

  <Item label="Ab" value={formatDate(employee.availabilityFrom)} />
  <Item label="Tage" value={(employee.availabilityDays || []).join(", ")} />
  <Item label="Erfahrung (Jahre)" value={employee.experienceYears} />
  <Item label="Erfahrungsort" value={employee.experienceWhere} />
  <Item label="Unternehmen" value={employee.experienceCompany} />
</Section>


          <Section title=" Hochgeladene Dateien">
            {fileLinks.map((f) => (
              <Item key={f.key} label={f.label} value={formatUrl(employee[f.key], f.label)} />
            ))}
          </Section>
<Section title=" Führerschein & Fahrzeug">

  {/* Edit Button */}
  <div className="flex justify-end mb-2">
    <button
      onClick={() => {
        setLicenseData({
          hasLicense: employee.hasLicense ? "Ja" : "Nein",
          licenseType: employee.licenseType || "",
          hasCar: employee.hasCar ? "Ja" : "Nein",
          carAvailableForWork: employee.carAvailableForWork ? "Ja" : "Nein",
        });
        setEditLicense(true);
      }}
      className="px-3 py-1 text-sm bg-[#04436F] text-white rounded hover:bg-yellow-600"
    >
      Bearbeiten
    </button>
  </div>

  <Item label="Hat Lizenz" value={employee.hasLicense ? "Ja" : "Nein"} />
  <Item label="Typ" value={employee.licenseType} />
  <Item label="Hat Auto" value={employee.hasCar ? "Ja" : "Nein"} />
  <Item label="Auto für Arbeit" value={employee.carAvailableForWork ? "Ja" : "Nein"} />
</Section>

<Section title="⚙️ Schulungen & Sprachen">

  {/* Edit Button */}
  <div className="flex justify-end mb-2">
    <button
      onClick={() => {
        setSkillsData({
     specialTrainings: Array.isArray(employee.specialTrainings)
  ? employee.specialTrainings.join(", ")
  : (employee.specialTrainings || ""),

languages: Array.isArray(employee.languages)
  ? employee.languages.join(", ")
  : (employee.languages || ""),

communicationTraits: Array.isArray(employee.communicationTraits)
  ? employee.communicationTraits.join(", ")
  : (employee.communicationTraits || ""),

dietaryExperience: Array.isArray(employee.dietaryExperience)
  ? employee.dietaryExperience.join(", ")
  : (employee.dietaryExperience || ""),

        });
        setEditSkills(true);
      }}
      className="px-3 py-1 text-sm bg-[#04436F] text-white rounded hover:bg-yellow-600"
    >
      Bearbeiten
    </button>
  </div>

  <Item label="Schulungen" value={(employee.specialTrainings || []).join(", ")} />
  <Item label="Sprachen" value={(employee.languages || []).join(", ")} />
  <Item label="Kommunikation" value={(employee.communicationTraits || []).join(", ")} />
  <Item label="Ernährungserfahrung" value={(employee.dietaryExperience || []).join(", ")} />
</Section>

        </div>

        {/* === RIGHT COLUMN: Vacations, Assignments, Appointments === */}
        <div className="space-y-6">
          <Section title=" Urlaube">
            {employee.vacations?.length > 0 ? (
              <ul className="space-y-2 max-h-64 overflow-y-auto">
                {employee.vacations.map((v) => (
                  <li
                    key={v.id}
                    className="border p-3 rounded-lg bg-gray-50 shadow-sm hover:bg-gray-100 transition"
                  >
                    <p className="font-medium text-[#04436F]">
                       {formatDate(v.startDate)} – {formatDate(v.endDate)}
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

<Section title=" Einsätze (History)">
  <div className="mb-3 flex items-center gap-2">
    <label className="font-medium text-gray-700">Filter:</label>
<select
  value={einsatzFilter}
  onChange={(e) => setEinsatzFilter(e.target.value)}
  className="border rounded px-2 py-1"
>
  <option value="all">Alle</option>
  <option value="pending">Offen</option>       {/* Offen */}
  <option value="active">Aktiv</option>        {/* Status real */}
  <option value="accepted">Angenommen</option>
  <option value="rejected">Abgelehnt</option>
</select>


  </div>

  <ul key={einsatzFilter} className="space-y-2 max-h-64 overflow-y-auto">
    {filteredAssignments?.map((a) => (
      <li
        key={a.id}
        className="border p-3 rounded-lg bg-gray-50 shadow-sm"
      >
        <p className="font-medium text-[#04436F]">
          Kunde: {a.user?.firstName} {a.user?.lastName}
        </p>

        <p className="text-sm text-gray-700">
          Zugewiesen am: {formatDate(a.createdAt)}
        </p>

        <p className="text-sm text-gray-700">
          Dienstleistung: {a.serviceName || "—"}
        </p>

        <span
          className={`px-2 py-1 text-xs rounded mt-1 inline-block ${
            a.status === "accepted"
              ? "bg-green-100 text-green-700"
              : a.status === "rejected"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {a.status === "accepted"
            ? "Angenommen"
            : a.status === "rejected"
            ? "Abgelehnt"
            : "Offen"}
        </span>
      </li>
    ))}
  </ul>

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
             Kunde: {a.user?.firstName} {a.user?.lastName}
          </p>
          <p className="text-sm text-gray-600">
             {new Date(a.date).toLocaleDateString("de-DE")} — 🕒 {a.startTime} | {a.hours}h
          </p>

          {/* Shërbimet në gjermanisht */}
          {a.user?.services?.length > 0 && (
            <p className="text-sm text-gray-700 mt-1">
              Dienstleistungen: {a.user.services.map((s) => s.name).join(", ")}
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

{editPersonal && (
  <EditModal
    title="Persönliche Informationen bearbeiten"
    data={personalData}
    onChange={setPersonalData}
    onSave={savePersonal}
    onClose={() => setEditPersonal(false)}
  />
)}
{editAddress && (
  <EditModal
    title="Adresse & Nationalität bearbeiten"
    data={addressData}
    onChange={setAddressData}
    onSave={saveAddress}
    onClose={() => setEditAddress(false)}
  />
)}
{editAvailability && (
  <EditModal
    title="Verfügbarkeit & Erfahrung bearbeiten"
    data={availabilityData}
    onChange={setAvailabilityData}
    onSave={saveAvailability}
    onClose={() => setEditAvailability(false)}
  />
)}
{editLicense && (
  <EditModal
    title="Führerschein & Fahrzeug bearbeiten"
    data={licenseData}
    onChange={setLicenseData}
    onSave={saveLicenseCar}
    onClose={() => setEditLicense(false)}
  />
)}
{editSkills && (
  <EditModal
    title="Schulungen & Sprachen bearbeiten"
    data={skillsData}
    onChange={setSkillsData}
    onSave={saveSkills}
    onClose={() => setEditSkills(false)}
  />
)}

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
function EditModal({ title, data, onChange, onSave, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl">
        <h2 className="text-xl font-bold text-[#04436F] mb-4">{title}</h2>

        <div className="space-y-3">
          {Object.keys(data).map((key) => (
            <input
              key={key}
              name={key}
              className="border p-2 rounded w-full"
              value={data[key] || ""}
              onChange={(e) => onChange({ ...data, [key]: e.target.value })}
              placeholder={key}
            />
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Abbrechen
          </button>
          <button onClick={onSave} className="px-4 py-2 bg-[#04436F] text-white rounded">
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}
