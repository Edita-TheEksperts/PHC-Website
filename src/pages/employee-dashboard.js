import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AssignmentCalendar from "../components/AssignmentCalendar";

export default function EmployeeDashboard() {
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rejectedAssignments, setRejectedAssignments] = useState([]);
useEffect(() => {
  async function loadRejected() {
    if (!employeeData?.email) return;

    const res = await fetch("/api/employee/rejected-assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: employeeData.email }),
    });

    const data = await res.json();
    setRejectedAssignments(data);
  }

  loadRejected();
}, [employeeData]);

  const handlePaymentEditRequest = async () => {
  try {
    const res = await fetch("/api/request-payment-change", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: employeeData.email,
        name: `${employeeData.firstName} ${employeeData.lastName}`,
      }),
    });

    if (!res.ok) throw new Error();

    setPaymentMsg("Anfrage wurde an das Team gesendet.");
  } catch {
    setPaymentMsg("❌ Fehler beim Senden der Anfrage.");
  }
};
function getFirstScheduleDate(schedules) {
  if (!schedules || schedules.length === 0) return null;

  const validDates = schedules
    .map((s) => new Date(s.day))
    .filter((d) => !isNaN(d));

  if (validDates.length === 0) return null;

  return new Date(Math.min(...validDates));
}

const [pendingAssignments, setPendingAssignments] = useState([]);

useEffect(() => {
  async function loadPending() {
    if (!employeeData?.email) return;

    const res = await fetch("/api/employee/pending-assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: employeeData.email }),
    });

    const data = await res.json();
    setPendingAssignments(data);
  }

  loadPending();
}, [employeeData]);

const [confirmedAssignments, setConfirmedAssignments] = useState([]);

useEffect(() => {
  const loadConfirmed = async () => {
    if (!employeeData?.email) return;

    const res = await fetch("/api/employee/confirmed-assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: employeeData.email }),
    });

    const data = await res.json();
        // 👇 ADD THIS LINE
    console.log("✅ Confirmed Assignments from API:", data);
    setConfirmedAssignments(data);
  };

  loadConfirmed();
}, [employeeData]);


const handleAssignmentAction = async (assignmentId, action) => {
  try {
    const res = await fetch("/api/employee/confirm-assignment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignmentId, action }),
    });

    if (!res.ok) throw new Error();

    setPendingAssignments((prev) =>
      prev.filter((a) => a.id !== assignmentId)
    );

    if (action === "rejected") {
      const rejected = pendingAssignments.find((a) => a.id === assignmentId);
      setRejectedAssignments((prev) => [...prev, rejected]);
    }
  } catch {
    alert("❌ Fehler beim Aktualisieren der Zuweisung.");
  }
};


const [payment, setPayment] = useState({
  iban: "",
  accountHolder: "",
  bankName: "",
  bic: "",
});
  const [paymentMsg, setPaymentMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch("/api/get-employee", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (!res.ok) throw new Error("Fehler beim Laden der Daten");

        const data = await res.json();
        setEmployeeData(data);
      } catch (error) {
        console.error("❌", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);
const [paymentSaved, setPaymentSaved] = useState(false);

useEffect(() => {
  if (employeeData) {
    setPayment({
      iban: employeeData.iban || "",
      accountHolder: employeeData.accountHolder || "",
      bankName: employeeData.bankName || "",
      bic: employeeData.bic || "",
    });

    // If essential bank fields are filled, mark as saved
    if (
      employeeData.iban &&
      employeeData.accountHolder &&
      employeeData.bankName
    ) {
      setPaymentSaved(true);
    }
  }
}, [employeeData]);



  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPayment((prev) => ({ ...prev, [name]: value }));
  };

const handlePaymentSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("/api/update-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: employeeData.email,
        iban: payment.iban,
        accountHolder: payment.accountHolder,
        bankName: payment.bankName,
        bic: payment.bic,
      }),
    });

    if (!res.ok) throw new Error("Fehler beim Speichern");

    setPaymentMsg("✅ Zahlungsdaten gespeichert");
    setPaymentSaved(true);
  } catch {
    setPaymentMsg("❌ Fehler beim Speichern");
  }
};


  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg text-gray-500">Lade Dashboard...</div>;
  }

  if (!employeeData) {
    return <div className="p-6">Keine Daten gefunden.</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#F9F9F9] text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-[#04436F] text-white p-6 space-y-6 shadow-md">
        <h2 className="text-3xl font-bold text-center tracking-wide">PHC</h2>
        <nav className="space-y-3">
          <SidebarLink label="Dashboard" />
          <SidebarLink label="Profil" />
          <SidebarLink label="Einstellungen" />
          <SidebarLink
            label="Logout"
            onClick={() => {
              localStorage.removeItem("email");
              router.push("/login");
            }}
          />
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
            <Info label="Telefon" value={employeeData.phone || "—"} />
            <Info
              label="Adresse"
              value={`${employeeData.address || ""} ${employeeData.houseNumber || ""}, ${employeeData.zipCode || ""} ${employeeData.city || ""}, ${employeeData.country || ""}`}
            />
          </Card>
          
          <Card title="🛠 Berufserfahrung">
            <Info label="Jahre" value={employeeData.experienceYears} />
            <Info label="Ort" value={employeeData.experienceWhere || "—"} />
            <Info label="Firma" value={employeeData.experienceCompany || "—"} />
            <Info label="Führerschein" value={employeeData.hasLicense ? "Ja" : "Nein"} />
            <Info label="Autotyp" value={employeeData.licenseType || "—"} />
          </Card>

          <Card title="📅 Verfügbarkeit">
            <Info label="Ab" value={new Date(employeeData.availabilityFrom).toLocaleDateString()} />
            <Info label="Tage" value={employeeData.availabilityDays?.join(", ") || "—"} />
            <Info label="Stunden/Woche" value={employeeData.desiredWeeklyHours || "—"} />
          </Card>

          <Card title="🧰 Services">
            {employeeData.servicesOffered?.map((s, i) => (
              <p key={i} className="text-sm">{s}</p>
            )) || "—"}
          </Card>
<Card title="📥 Neue Zuweisungen">
  {pendingAssignments.length === 0 ? (
    <p className="text-sm text-gray-500">Keine neuen Zuweisungen.</p>
  ) : (
    pendingAssignments.map((a) => (
      <div key={a.id} className="border p-3 rounded mb-3">
        <p><strong>Kunde:</strong> {a.user.firstName} {a.user.lastName}</p>
        <p><strong>Email:</strong> {a.user.email}</p>
        <div className="mt-2 space-x-2">
          <button
            className="bg-green-600 text-white px-3 py-1 rounded"
            onClick={() => handleAssignmentAction(a.id, "accepted")}
          >
            Annehmen
          </button>
          <button
            className="bg-red-600 text-white px-3 py-1 rounded"
            onClick={() => handleAssignmentAction(a.id, "rejected")}
          >
            Ablehnen
          </button>
        </div>
      </div>
    ))
  )}
</Card>
<Card title="📅 Bestätigte Einsätze">
  {confirmedAssignments.length === 0 ? (
    <p className="text-sm text-gray-500">Keine bestätigten Zuweisungen.</p>
  ) : (
    confirmedAssignments.flatMap((assignment) =>
      (assignment.user?.schedules || []).map((schedule, index) => (
        <div key={`${assignment.id}-${index}`} className="border p-3 rounded mb-2">
          <p><strong>Kunde:</strong> {assignment.user.firstName} {assignment.user.lastName}</p>
          <p><strong>Service:</strong> {assignment.user.services?.map(s => s.name).join(", ") || "—"}</p>
          <p><strong>Startdatum:</strong> {schedule.day}, {schedule.startTime} Uhr</p>
        </div>
      ))
    )
  )}
</Card>


<Card title="🚫 Abgelehnte Zuweisungen">
  {rejectedAssignments.length === 0 ? (
    <p className="text-sm text-gray-500">Keine abgelehnten Zuweisungen.</p>
  ) : (
    rejectedAssignments.map((a) => (
      <div key={a.id} className="border p-3 rounded mb-2">
        <p><strong>Kunde:</strong> {a.user.firstName} {a.user.lastName}</p>
        <p><strong>Email:</strong> {a.user.email}</p>
      </div>
    ))
  )}
</Card>

<Card ><AssignmentCalendar assignments={confirmedAssignments} />
</Card>

          <Card title="📄 Dokumente">
            {[
              { label: "Pass", key: "passportFile" },
              { label: "Visum", key: "visaFile" },
              { label: "Führungszeugnis", key: "policeLetterFile" },
              { label: "Lebenslauf", key: "cvFile" },
              { label: "Zertifikate", key: "certificateFile" },
              { label: "Führerschein", key: "drivingLicenceFile" },
              { label: "Foto", key: "profilePhoto" },
            ].map(({ label, key }) =>
              employeeData[key] ? (
                <Info key={key} label={label} value={<a href={employeeData[key]} target="_blank" className="text-[#04436F] underline">Ansehen</a>} />
              ) : (
                <Info key={key} label={label} value="Nicht hochgeladen" />
              )
            )}
          </Card>

          <Card title="🎓 Zusätzliche Infos">
            <Info label="Spezial-Trainings" value={employeeData.specialTrainings?.join(", ") || "—"} />
            <Info label="Sprachen" value={employeeData.languages?.join(", ") || "—"} />
            <Info label="Andere Sprache" value={employeeData.languageOther || "—"} />
            <Info label="Reisebereitschaft" value={employeeData.howFarCanYouTravel || "—"} />
          </Card>

          <Card title="🩺 Pflege & Unterstützung">
            <Info label="Körperpflege" value={employeeData.bodyCareSupport || "—"} />
            <Info label="Ernährungserfahrung" value={employeeData.dietaryExperience?.join(", ") || "—"} />
            <Info label="Mit Tieren arbeiten" value={employeeData.worksWithAnimals || "—"} />
            <Info label="Allergien" value={employeeData.hasAllergies || "—"} />
          </Card>

          <Card title="📊 Status">
            <Info label="Status" value={employeeData.status} />
            <Info label="Erstellt" value={new Date(employeeData.createdAt).toLocaleDateString()} />
          </Card>
        </div>

     <Card title="💳 Zahlungsinformationen">
  {paymentSaved ? (
    <div className="space-y-2 text-sm">
    <Info label="IBAN" value={payment.iban || "—"} />
<Info label="Kontoinhaber" value={payment.accountHolder || "—"} />
<Info label="Bankname" value={payment.bankName || "—"} />
<Info label="BIC / SWIFT" value={payment.bic || "—"} />

<p className="text-blue-700 mt-2">Zahlungsdaten wurden gespeichert und sind nicht mehr bearbeitbar.</p>
<button
  onClick={handlePaymentEditRequest}
  className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
>
  Anfrage zur Änderung senden
</button>
{paymentMsg && <p className="text-sm text-blue-700 mt-2">{paymentMsg}</p>}
    </div>
  ) : (
    <form onSubmit={handlePaymentSubmit} className="space-y-4 text-sm">
      <div>
      <div>
  <label className="block font-medium">IBAN</label>
  <input
    type="text"
    name="iban"
    value={payment.iban}
    onChange={handlePaymentChange}
    className="border w-full p-2 rounded"
    required
  />
</div>

<div>
  <label className="block font-medium">Kontoinhaber</label>
  <input
    type="text"
    name="accountHolder"
    value={payment.accountHolder}
    onChange={handlePaymentChange}
    className="border w-full p-2 rounded"
    required
  />
</div>

<div>
  <label className="block font-medium">Bankname (optional)</label>
  <input
    type="text"
    name="bankName"
    value={payment.bankName}
    onChange={handlePaymentChange}
    className="border w-full p-2 rounded"
  />
</div>

<div>
  <label className="block font-medium">BIC / SWIFT (optional)</label>
  <input
    type="text"
    name="bic"
    value={payment.bic}
    onChange={handlePaymentChange}
    className="border w-full p-2 rounded"
  />
</div>

      </div>
      <button type="submit" className="bg-[#04436F] text-white px-4 py-2 rounded mt-2">
        Speichern
      </button>
      {paymentMsg && <p className="text-green-600 mt-2">{paymentMsg}</p>}
    </form>
  )}
</Card>

      </main>
    </div>
  );
}

function SidebarLink({ label, onClick }) {
  return (
    <div className="hover:bg-[#033553] px-4 py-2 rounded cursor-pointer transition" onClick={onClick}>
      {label}
    </div>
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
