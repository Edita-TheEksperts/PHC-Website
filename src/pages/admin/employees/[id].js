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
        Employee Profile: {employee.firstName} {employee.lastName}
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* === LEFT COLUMN === */}
        <div className="space-y-5">
          <Section title="👤 Basic Info">
            <Item label="Email" value={employee.email} />
            <Item label="Phone" value={employee.phone} />
            <Item label="Status" value={employee.status} />
            <Item label="Created At" value={formatDate(employee.createdAt)} />
          </Section>

          <Section title="📍 Address">
            <Item label="Street" value={`${employee.address || "—"} ${employee.houseNumber || ""}`} />
            <Item label="City/ZIP" value={`${employee.city || "—"}, ${employee.zipCode || "—"}`} />
            <Item label="Country" value={`${employee.country || "—"} (${employee.canton || "—"})`} />
            <Item label="Nationality" value={employee.nationality} />
          </Section>

          <Section title="📅 Availability">
            <Item label="From" value={formatDate(employee.availabilityFrom)} />
            <Item label="Days" value={(employee.availabilityDays || []).join(", ")} />
          </Section>

          <Section title="🗂 Uploaded Files">
            {fileLinks.map((f) => (
              <Item key={f.key} label={f.label} value={formatUrl(employee[f.key], f.label)} />
            ))}
          </Section>
        </div>

        {/* === RIGHT COLUMN === */}
        <div className="space-y-5">
          <Section title="💼 Experience">
            <Item label="Years" value={employee.experienceYears} />
            <Item label="Where" value={employee.experienceWhere} />
            <Item label="Company" value={employee.experienceCompany} />
          </Section>

          <Section title="🚘 License & Vehicle">
            <Item label="Has License" value={employee.hasLicense ? "Yes" : "No"} />
            <Item label="Type" value={employee.licenseType} />
            <Item label="Has Car" value={employee.hasCar} />
            <Item label="Car for Work" value={employee.carAvailableForWork} />
          </Section>

          <Section title="⚙️ Traits & Support">
            <Item label="Trainings" value={(employee.specialTrainings || []).join(", ")} />
            <Item label="Languages" value={(employee.languages || []).join(", ")} />
            <Item label="Communication" value={(employee.communicationTraits || []).join(", ")} />
            <Item label="Dietary Exp" value={(employee.dietaryExperience || []).join(", ")} />
          </Section>

          <Section title="📊 Assignments & Schedules">
            <Item label="Total Assignments" value={employee.assignments?.length || 0} />
            <Item label="Total Schedules" value={employee.schedules?.length || 0} />
            {employee.schedules?.length > 0 && (
              <ul className="list-disc ml-6 text-sm text-gray-700">
                {employee.schedules.map((s) => (
                  <li key={s.id}>
                    {s.day} - {s.hours}h @ {s.startTime} ({formatDate(s.date)})
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
          ← Back to Employees
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
