import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function EmployeeDashboard() {
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const mockEmployeeData = {
    email: "john.doe@example.com",
    firstName: "John",
    lastName: "Doe",
    phone: "123-456-7890",
    address: "123 Main St, Anytown, USA",
    experienceYears: 5,
    experienceWhere: "ABC Corp",
    hasLicense: true,
    availabilityFrom: "2023-06-01",
    availabilityDays: ["Montag", "Mittwoch", "Freitag"],
    servicesOffered: ["Reinigung", "Kochen"],
    resumeUrl: "https://example.com/resume.pdf",
    photoUrl: "https://example.com/photo.jpg",
    bookings: [
      { id: 1, date: "2024-05-12", hours: 4, client: "Frau Müller" },
      { id: 2, date: "2024-05-18", hours: 3, client: "Herr Schmidt" }
    ],
    payments: [
      { month: "April 2024", amount: 480 },
      { month: "Mai 2024", amount: 360 }
    ],
    kmDriven: 52
  };

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) {
      router.push("/login");
      return;
    }

    setEmployeeData(mockEmployeeData);
    setLoading(false);
  }, [router]);

  if (loading) return <div className="flex justify-center items-center h-screen text-lg text-gray-500">Lade Dashboard...</div>;

  return (
    <div className="flex min-h-screen bg-[#F9F9F9] text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-[#04436F] text-white p-6 space-y-6 shadow-md">
        <h2 className="text-3xl font-bold text-center tracking-wide">PHC</h2>
        <nav className="space-y-3">
          <SidebarLink label="Dashboard" />
          <SidebarLink label="Profil" />
          <SidebarLink label="Einstellungen" />
          <SidebarLink label="Logout" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-10 py-10 space-y-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#04436F]">Mitarbeiter-Dashboard</h1>
          <button
            onClick={() => router.push("/edit-employee-profile")}
            className="px-4 py-2 bg-[#04436F] text-white rounded-lg hover:bg-[#033553] transition"
          >
            Profil bearbeiten
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <Card title="👤 Persönliche Informationen">
            <Info label="Name" value={`${employeeData.firstName} ${employeeData.lastName}`} />
            <Info label="E-Mail" value={employeeData.email} />
            <Info label="Telefon" value={employeeData.phone} />
            <Info label="Adresse" value={employeeData.address} />
          </Card>

          <Card title="🛠 Berufserfahrung">
            <Info label="Jahre" value={`${employeeData.experienceYears}`} />
            <Info label="Ort" value={employeeData.experienceWhere} />
            <Info label="Führerschein" value={employeeData.hasLicense ? "Ja" : "Nein"} />
          </Card>

          <Card title="📅 Verfügbarkeit">
            <Info label="Ab" value={employeeData.availabilityFrom} />
            <Info label="Tage" value={employeeData.availabilityDays.join(", ")} />
          </Card>

          <Card title="🧰 Services">
            {employeeData.servicesOffered.map((s, i) => (
              <p key={i} className="text-sm">{s}</p>
            ))}
          </Card>

          <Card title="📄 Dokumente">
            <Info label="Lebenslauf" value={<a href={employeeData.resumeUrl} target="_blank" className="text-[#04436F] underline">Ansehen</a>} />
            {employeeData.photoUrl && <Info label="Foto" value={<a href={employeeData.photoUrl} target="_blank" className="text-[#04436F] underline">Ansehen</a>} />}
          </Card>

          <Card title="📖 Buchungshistorie">
            {employeeData.bookings.map((b) => (
              <p key={b.id} className="text-sm">{b.date}: {b.hours} Std mit {b.client}</p>
            ))}
          </Card>

          <Card title="💸 Zahlungen">
            {employeeData.payments.map((p, i) => (
              <p key={i} className="text-sm">{p.month}: CHF {p.amount}</p>
            ))}
          </Card>

          <Card title="🚗 Kilometer">
            <p className="text-sm mb-2">Gefahren: {employeeData.kmDriven} km</p>
            <input type="number" placeholder="Neue km..." className="border px-3 py-2 rounded w-full" />
          </Card>
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ label }) {
  return (
    <div className="hover:bg-[#033553] px-4 py-2 rounded cursor-pointer transition">{label}</div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-2 border border-gray-100 hover:shadow-md transition">
      <h2 className="text-lg font-semibold text-[#04436F] mb-2">{title}</h2>
      {children}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <p className="text-sm"><span className="font-medium">{label}:</span> {value}</p>
  );
}
