import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AssignmentCalendar from "../components/AssignmentCalendar";
import EmployeeScheduleList from "../components/EmployeeScheduleList";
export default function EmployeeDashboard() {
  const [vacations, setVacations] = useState([]);
const [vacationStart, setVacationStart] = useState("");
const [vacationEnd, setVacationEnd] = useState("");
  const [employeeId, setEmployeeId] = useState(null);

  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rejectedAssignments, setRejectedAssignments] = useState([]);
  const [workInputs, setWorkInputs] = useState({});
const updateWorkInput = (scheduleId, field, value) => {
  setWorkInputs((prev) => ({
    ...prev,
    [scheduleId]: {
      ...prev[scheduleId],
      [field]: value,
    },
  }));
};

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
useEffect(() => {
  async function loadVacations() {
    if (!employeeData?.email) return;

    const res = await fetch("/api/employee/vacations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: employeeData.email }),
    });

    const data = await res.json();
    setVacations(data);
  }

  loadVacations();
}, [employeeData]);

const handleVacationSave = async () => {
  if (!vacationStart || !vacationEnd) {
    alert("Bitte Start- und Enddatum auswählen");
    return;
  }

  const res = await fetch("/api/employee/save-vacation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: employeeData.email,
      start: vacationStart,
      end: vacationEnd,
    }),
  });

  if (res.ok) {
    const newVacation = { start: vacationStart, end: vacationEnd, status: "Geplant" };
    setVacations((prev) => [...prev, newVacation]);
    setVacationStart("");
    setVacationEnd("");
  } else {
    alert("❌ Fehler beim Speichern des Urlaubs");
  }
};

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
 const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    fetch("/api/employee-dashboard")
      .then((res) => res.json())
      .then((data) => setSchedules(data))
      .catch((err) => console.error("❌ Error loading:", err));
  }, []);
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

const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    fetch("/api/assignments")
      .then((res) => res.json())
      .then((data) => setAssignments(data))
      .catch((err) => console.error("Error loading assignments:", err));
  }, []);
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


const [paymentTotals, setPaymentTotals] = useState(null);

useEffect(() => {
  if (!employeeData?.email) return;

  const fetchTotals = async () => {
    const res = await fetch("/api/employee/total-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: employeeData.email }),
    });

    const data = await res.json();
    setPaymentTotals(data);
  };

  fetchTotals();
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
const calculatePayment = (services = [], schedules = []) => {
  const serviceCost = services.reduce(
    (sum, s) => sum + (s.hours || 0) * (s.rate || 0),
    0
  );
  const travelCost = schedules.reduce(
    (sum, s) => sum + (s.kilometers || 0),
    0
  );
  return {
    serviceCost,
    travelCost,
    total: serviceCost + travelCost,
  };
};

  return (
    <div className="flex min-h-screen bg-[#F9F9F9] text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-[#04436F] text-white p-6 space-y-6 shadow-md">
        <h2 className="text-3xl font-bold text-center tracking-wide">PHC</h2>
        <nav className="space-y-3">
          <SidebarLink label="Dashboard" />
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
         <Card title="🏖 Urlaub">
  <div className="space-y-3">
    {/* Date pickers */}
    <div className="flex flex-col space-y-2">
      <input
        type="date"
        value={vacationStart}
        onChange={(e) => setVacationStart(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="date"
        value={vacationEnd}
        onChange={(e) => setVacationEnd(e.target.value)}
        className="border p-2 rounded"
      />
    </div>

    {/* Save button */}
    <button
      onClick={handleVacationSave}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      Urlaub speichern
    </button>

    {/* Show existing vacations */}
    <div className="mt-4 space-y-2">
      {vacations.length === 0 ? (
        <p className="text-sm text-gray-500">Kein Urlaub geplant.</p>
      ) : (
        vacations.map((v, i) => {
          // Safely format dates
          const start = v.startDate
            ? new Date(v.startDate).toLocaleDateString("de-DE")
            : "–";
          const end = v.endDate
            ? new Date(v.endDate).toLocaleDateString("de-DE")
            : "–";

          return (
            <div key={i} className="border p-2 rounded bg-gray-50 text-sm">
              {start} – {end} ({v.status || "ohne Status"})
            </div>
          );
        })
      )}
    </div>
  </div>
</Card>


          </Card>
<Card title="💰 Gesamtzahlung">
  {paymentTotals ? (
    <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-6 text-sm space-y-4">
      {/* Invoice Header */}
      <div className="flex justify-between items-center border-b pb-3">
        <h3 className="text-lg font-semibold text-[#04436F]">Zahlungsübersicht</h3>
        <span className="text-xs text-gray-500">
          {new Date().toLocaleDateString("de-DE")}
        </span>
      </div>

      {/* Service Costs */}
      <div className="flex justify-between">
        <span className="text-gray-600">Servicekosten</span>
        <span className="font-medium">
          {(paymentTotals.serviceCost ?? 0).toFixed(2)} CHF
        </span>
      </div>

      {/* Travel Costs */}
      <div className="flex justify-between">
        <span className="text-gray-600">Fahrkosten</span>
        <span className="font-medium">
          {(paymentTotals.travelCost ?? 0).toFixed(2)} CHF
        </span>
      </div>

      {/* Divider */}
      <hr className="border-gray-300" />

      {/* Total */}
      <div className="flex justify-between items-center text-lg font-bold text-[#04436F]">
        <span>Gesamtbetrag</span>
        <span>{(paymentTotals.total ?? 0).toFixed(2)} CHF</span>
      </div>

      {/* Footer / Note */}
      <p className="text-xs text-gray-500 pt-2 italic">
        * Betrag basiert auf bestätigten Einsätzen
      </p>
    </div>
  ) : (
    <p className="text-sm text-gray-500">Noch keine Zahlungen berechnet.</p>
  )}
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
      (assignment.user?.schedules || []).map((schedule, index) => {
        const scheduleId = schedule.id;

        // default to schedule or empty
        const inputs = workInputs[scheduleId] || {
          workedHours: schedule.hours || "",
          kilometers: schedule.kilometers || "",
        };

        const serviceRate = assignment.user.services?.[0]?.rate || 0;
        const serviceCost = (parseFloat(inputs.workedHours) || 0) * serviceRate;
        const travelCost = parseFloat(inputs.kilometers) || 0;
const workedHours = schedule.hours;

    const handleSave = async (employeeId) => {
  const workedHoursParsed = parseFloat(inputs.workedHours);
  const kilometersParsed = parseFloat(inputs.kilometers);

  if (isNaN(workedHoursParsed) || isNaN(kilometersParsed)) {
    alert("Bitte geben Sie gültige Werte ein.");
    return;
  }

  const res = await fetch("/api/update-worked-data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      scheduleId,
      workedHours: workedHoursParsed,
      kilometers: kilometersParsed,
      employeeId,
    }),
  });

  if (res.ok) {
    alert("✅ Gespeichert");
  } else {
    alert("❌ Fehler beim Speichern.");
  }
};


        return (
          <div key={`${assignment.id}-${index}`} className="border p-3 rounded mb-2">
            <p><strong>Kunde:</strong> {assignment.user.firstName} {assignment.user.lastName}</p>

            <p><strong>Service:</strong></p>
            <ul className="ml-4 list-disc">
              {(assignment.user.services || []).map((s, i) => (
                <li key={i}>
                  {s.name} – {s.hours || 0} Std @ {s.rate || 0} CHF/h
                </li>
              ))}
            </ul>

            <p><strong>Startdatum:</strong> {schedule.day}, {schedule.startTime} Uhr</p>

            {/* INPUTS */}
            <div className="my-2 text-sm space-y-2">
              <div>
                <label>🕒 Geleistete Stunden:</label>
                <input
                  type="number"
                  step="0.1"
                  value={inputs.workedHours}
                  onChange={(e) =>
                    updateWorkInput(scheduleId, "workedHours", e.target.value)
                  }
                  className="border rounded p-1 ml-2 w-24"
                />
              </div>

              <div>
                <label>🚗 Gefahrene Kilometer:</label>
                <input
                  type="number"
                  step="1"
                  value={inputs.kilometers}
                  onChange={(e) =>
                    updateWorkInput(scheduleId, "kilometers", e.target.value)
                  }
                  className="border rounded p-1 ml-2 w-24"
                />
              </div>

<button
  onClick={() => handleSave(employeeData.id)}
  className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
>
  Speichern
</button>

            </div>

            {/* CALCULATED COSTS */}
            <div className="mt-2 text-sm">
              <p><strong>Fahrkosten:</strong> {travelCost.toFixed(2)} CHF</p>
              <p><strong>Gesamtzahlung:</strong> {workedHours.toFixed(2)} CHF</p>
            </div>
          </div>
        );
      })
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
  <EmployeeScheduleList employeeId={employeeId} />
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