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

  // Sections to render
  const leftSections = [
    {
      title: "👤 Basic Information",
      content: (
        <>
          <p><span className="font-semibold">Salutation:</span> {employee.salutation || "—"}</p>
          <p><span className="font-semibold">Email:</span> {employee.email}</p>
          <p><span className="font-semibold">Phone:</span> {employee.phone || "—"}</p>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                employee.status === "pending"
                  ? "bg-yellow-200 text-yellow-800"
                  : employee.status === "approved"
                  ? "bg-green-200 text-green-800"
                  : "bg-red-200 text-red-800"
              }`}
            >
              {employee.status}
            </span>
          </p>
        </>
      ),
    },
    {
      title: "📅 Availability",
      content: (
        <>
          <p><span className="font-semibold">From:</span> {employee.availabilityFrom ? new Date(employee.availabilityFrom).toLocaleDateString() : "—"}</p>
          <p><span className="font-semibold">Days:</span> {(employee.availabilityDays || []).join(", ") || "—"}</p>
        </>
      ),
    },
    {
      title: "⚙️ Other Information",
      content: (
        <>
          <p><span className="font-semibold">Smoker:</span> {employee.smoker || "—"}</p>
          <p><span className="font-semibold">On Call Available:</span> {employee.onCallAvailable || "—"}</p>
          <p><span className="font-semibold">Weekend Ready:</span> {employee.weekendReady || "—"}</p>
          <p><span className="font-semibold">Night Shifts:</span> {employee.nightShifts || "—"}</p>
          <p><span className="font-semibold">Night Shift Frequency:</span> {employee.nightShiftFrequency || "—"}</p>
          <p><span className="font-semibold">Travel Support:</span> {employee.travelSupport || "—"}</p>
          <p><span className="font-semibold">Body Care Support:</span> {employee.bodyCareSupport || "—"}</p>
          <p><span className="font-semibold">Has Allergies:</span> {employee.hasAllergies || "—"}</p>
          <p><span className="font-semibold">Works With Animals:</span> {employee.worksWithAnimals || "—"}</p>
          <p><span className="font-semibold">How Far Can You Travel:</span> {employee.howFarCanYouTravel || "—"}</p>
          <p><span className="font-semibold">How Did You Hear About Us:</span> {employee.howDidYouHearAboutUs || "—"}</p>
          <p><span className="font-semibold">Desired Weekly Hours:</span> {employee.desiredWeeklyHours || "—"}</p>
        </>
      ),
    },
  ];

  const rightSections = [
    {
      title: "📍 Address",
      content: (
        <>
          <p>{employee.address || "—"} {employee.houseNumber || ""}</p>
          <p>{employee.zipCode || "—"} {employee.city || "—"}</p>
          <p>{employee.canton || "—"}, {employee.country || "—"}</p>
          <p><span className="font-semibold">Nationality:</span> {employee.nationality || "—"}</p>
        </>
      ),
    },
    {
      title: "💼 Experience",
      content: (
        <>
          <p><span className="font-semibold">Years:</span> {employee.experienceYears || "—"}</p>
          <p><span className="font-semibold">Where:</span> {employee.experienceWhere || "—"}</p>
          <p><span className="font-semibold">Company:</span> {employee.experienceCompany || "—"}</p>
        </>
      ),
    },
    {
      title: "🚗 License & Car",
      content: (
        <>
          <p><span className="font-semibold">Has License:</span> {employee.hasLicense ? "Yes" : "No"}</p>
          <p><span className="font-semibold">License Type:</span> {employee.licenseType || "—"}</p>
          <p><span className="font-semibold">Has Car:</span> {employee.hasCar || "—"}</p>
          <p><span className="font-semibold">Car Available For Work:</span> {employee.carAvailableForWork || "—"}</p>
        </>
      ),
    },
    {
      title: "🧰 Skills & Traits",
      content: (
        <>
          <p><span className="font-semibold">Special Trainings:</span> {(employee.specialTrainings || []).join(", ") || "—"}</p>
          <p><span className="font-semibold">Communication Traits:</span> {(employee.communicationTraits || []).join(", ") || "—"}</p>
          <p><span className="font-semibold">Languages:</span> {(employee.languages || []).join(", ") || "—"}</p>
          <p><span className="font-semibold">Dietary Experience:</span> {(employee.dietaryExperience || []).join(", ") || "—"}</p>
        </>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-extrabold text-[#04436F] border-b-4 border-[#04436F] pb-3 mb-6">
        Employee Profile: {employee.firstName} {employee.lastName}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Column */}
        <div className="space-y-6">
          {leftSections.map(({ title, content }) => (
            <section key={title} className="rounded-lg p-5 shadow-sm">
              <h3 className="text-2xl font-semibold mb-3 border-b border-gray-300 pb-2">{title}</h3>
              <div className="space-y-1 text-gray-800">{content}</div>
            </section>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {rightSections.map(({ title, content }) => (
            <section key={title} className="rounded-lg p-5 shadow-sm">
              <h3 className="text-2xl font-semibold mb-3 border-b border-gray-300 pb-2">{title}</h3>
              <div className="space-y-1 text-gray-800">{content}</div>
            </section>
          ))}
        </div>
      </div>

      {/* Back Button */}
      <div className="pt-8 text-center">
        <button
          onClick={() => router.push("/admin/employees")}
          className="inline-block px-8 py-3 bg-[#04436F] text-white font-semibold rounded-lg shadow hover:bg-[#033350] transition"
        >
          ← Back to Employees
        </button>
      </div>
    </div>
  );
}
