import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/router";
import AssignmentsList from "../components/AssignmentList";
import EmployeeScheduleList from "../components/EmployeeScheduleList";
import { Menu, X } from "lucide-react";

export default function EmployeeDashboard() {
  const [vacations, setVacations] = useState([]);
  const [vacationStart, setVacationStart] = useState(null);
  const [vacationEnd, setVacationEnd] = useState(null);
  const [confirmedAssignments, setConfirmedAssignments] = useState([]);
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rejectedAssignments, setRejectedAssignments] = useState([]);
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [payment, setPayment] = useState({ iban: "", accountHolder: "", bankName: "", bic: "" });
  const [paymentMsg, setPaymentMsg] = useState("");
  const [paymentSaved, setPaymentSaved] = useState(false);
  const [paymentTotals, setPaymentTotals] = useState(null);
   const [isOpen, setIsOpen] = useState(false);

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
        const data = await res.json();
        setEmployeeData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  useEffect(() => {
    if (!employeeData?.email) return;
    const fetchData = async () => {
      const resRejected = await fetch("/api/employee/rejected-assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: employeeData.email }),
      });
      setRejectedAssignments(await resRejected.json());

      const resVacations = await fetch("/api/employee/vacations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: employeeData.email }),
      });
      setVacations(await resVacations.json());

      const resPending = await fetch("/api/employee/pending-assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: employeeData.email }),
      });
      setPendingAssignments(await resPending.json());

      const resConfirmed = await fetch("/api/employee/confirmed-assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: employeeData.email }),
      });
      setConfirmedAssignments(await resConfirmed.json());

      const resTotals = await fetch("/api/employee/total-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: employeeData.email }),
      });
      setPaymentTotals(await resTotals.json());
    };
    fetchData();
  }, [employeeData]);

  useEffect(() => {
    if (employeeData) {
      setPayment({
        iban: employeeData.iban || "",
        accountHolder: employeeData.accountHolder || "",
        bankName: employeeData.bankName || "",
        bic: employeeData.bic || "",
      });
      if (employeeData.iban && employeeData.accountHolder && employeeData.bankName) {
        setPaymentSaved(true);
      }
    }
  }, [employeeData]);
async function sendDocument(employee, documentType) {
  const res = await fetch("/api/send-documents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ employee, documentType }),
  });

  if (res.ok) {
    alert(`${documentType} wurde erfolgreich gesendet an ${employee.email}`);
  } else {
    alert("Fehler beim Senden des Dokuments.");
  }
}


  const handleVacationSave = async () => {
    if (!vacationStart || !vacationEnd) return;
    const res = await fetch("/api/employee/save-vacation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: employeeData.email,
        start: vacationStart?.toISOString(),
        end: vacationEnd?.toISOString(),
      }),
    });
    if (res.ok) {
      setVacations((prev) => [...prev, { start: vacationStart, end: vacationEnd, status: "Geplant" }]);
      setVacationStart(null);
      setVacationEnd(null);
    }
  };
const handleAssignmentAction = async (assignmentId, action) => {
  const res = await fetch("/api/employee/confirm-assignment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ assignmentId, action }),
  });

  if (res.ok) {
    const data = await res.json();
    const updated = data.assignment; // ✅ the full assignment from Prisma

    // remove from pending
    setPendingAssignments((prev) =>
      prev.filter((a) => a.id !== assignmentId)
    );

    // add to correct state
    if (action === "confirmed") {
      setConfirmedAssignments((prev) => [...prev, updated]);
    }
    if (action === "rejected") {
      setRejectedAssignments((prev) => [...prev, updated]);
    }
  }
};


  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPayment((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/update-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: employeeData.email, ...payment }),
    });
    if (res.ok) {
      setPaymentMsg("✅ Zahlungsdaten gespeichert");
      setPaymentSaved(true);
    }
  };

  const handlePaymentEditRequest = async () => {
    const res = await fetch("/api/request-payment-change", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: employeeData.email,
        name: `${employeeData.firstName} ${employeeData.lastName}`,
      }),
    });
    if (res.ok) setPaymentMsg("Anfrage wurde an das Team gesendet.");
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-lg text-gray-500">Lade Dashboard...</div>;
  if (!employeeData) return <div className="p-6">Keine Daten gefunden.</div>;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
      <>
      {/* --- MOBILE TOP NAVBAR --- */}
      <div className="lg:hidden bg-[#04436F] text-white shadow-lg w-full fixed top-0 left-0 z-50">
        <div className="flex items-center justify-between p-4">
          <h1
            className="text-xl font-bold cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            PHC
          </h1>
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Fullscreen Overlay Menu (Mobile) */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-[#04436F] text-white z-40 flex flex-col">
          {/* Close button inside overlay */}
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <h1
              className="text-xl font-bold cursor-pointer"
              onClick={() => {
                router.push("/dashboard");
                setIsOpen(false);
              }}
            >
              PHC
            </h1>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col space-y-6 px-6 py-8 text-lg font-medium">
            <SidebarLink
              label="Dashboard"
              onClick={() => {
                router.push("/employee-dashboard");
                setIsOpen(false);
              }}
            />
            <SidebarLink
              label="Logout"
              onClick={() => {
                localStorage.removeItem("email");
                router.push("/login");
                setIsOpen(false);
              }}
            />
          </nav>
        </div>
      )}

      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:flex w-64 bg-[#04436F] text-white p-6 space-y-8 shadow-xl flex-col">
        <h2 className="text-3xl font-extrabold text-center tracking-wide">
          PHC
        </h2>
        <nav className="space-y-2">
          <SidebarLink label="Dashboard" onClick={() => router.push("/employee-dashboard")} />
          <SidebarLink
            label="Logout"
            onClick={() => {
              localStorage.removeItem("email");
              router.push("/login");
            }}
          />
        </nav>
      </aside>
    </>
      <main className="flex-1 mt-[60px] lg:mt-0 px-4 lg:px-8 py-4 lg:py-10 space-y-10">
        <h1 className="text-2xl font-bold text-[#04436F] border-b pb-4">Mitarbeiter-Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <Card title="👤 Persönliche Informationen">
            <Info label="Name" value={`${employeeData.firstName} ${employeeData.lastName}`} />
            <Info label="E-Mail" value={employeeData.email} />
            <Info label="Telefon" value={employeeData.phone || "—"} />
            <Info label="Adresse" value={`${employeeData.address || ""} ${employeeData.houseNumber || ""}, ${employeeData.zipCode || ""} ${employeeData.city || ""}, ${employeeData.country || ""}`} />
          </Card>
          <Card title="🛠 Berufserfahrung">
            <Info label="Jahre" value={employeeData.experienceYears} />
            <Info label="Ort" value={employeeData.experienceWhere || "—"} />
            <Info label="Firma" value={employeeData.experienceCompany || "—"} />
            <Info label="Führerschein" value={employeeData.hasLicense ? "Ja" : "Nein"} />
            <Info label="Autotyp" value={employeeData.licenseType || "—"} />
          </Card>
          <Card title="🏖 Urlaub">
            <DatePicker selected={vacationStart} onChange={(date) => { setVacationStart(date); setVacationEnd(null); }} dateFormat="dd.MM.yyyy" placeholderText="Startdatum" minDate={new Date()} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm mb-2" />
            <DatePicker selected={vacationEnd} onChange={(date) => setVacationEnd(date)} dateFormat="dd.MM.yyyy" placeholderText="Enddatum" minDate={vacationStart || new Date()} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm mb-4" />
            <button onClick={handleVacationSave} className="bg-[#04436F] text-white w-full py-2 rounded-lg hover:bg-[#033553] transition">Urlaubsanfrage</button>
            <div className="mt-4 space-y-2">
              {vacations.length === 0 ? <p className="italic text-gray-400 text-center">Kein Urlaub eingetragen</p> : vacations.map((v, i) => {
                const start = new Date(v.start || v.startDate).toLocaleDateString("de-DE");
                const end = new Date(v.end || v.endDate).toLocaleDateString("de-DE");
                return (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg border flex justify-between">
                    <span>{start} - {end}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${v.status === "approved" ? "bg-green-100 text-green-700" : v.status === "declined" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {v.status === "approved" ? "Genehmigt" : v.status === "declined" ? "Abgelehnt" : "Angefragt"}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        <Card title="💰 Gesamtzahlung">
  {paymentTotals ? (
    <div className="space-y-4">
      <Info label="Service-Stunden" value={`${paymentTotals.thisMonth?.serviceHours ?? 0} Std`} />
      <Info label="Kilometer" value={`${paymentTotals.thisMonth?.kilometers ?? 0} km`} />
      <Info label="Einkommen Service" value={`${paymentTotals.thisMonth?.serviceCost ?? 0} CHF`} />
      <Info label="Einkommen Fahrt" value={`${paymentTotals.thisMonth?.travelCost ?? 0} CHF`} />
      <div className="flex justify-between bg-[#04436F] text-white px-4 py-2 rounded-lg">
        <span>Gesamt</span>
        <span>{paymentTotals.thisMonth?.total ?? 0} CHF</span>
      </div>
    </div>
  ) : (
    <p className="text-sm text-gray-500">Keine Zahlungen berechnet.</p>
  )}
</Card>
<Card title="📅 Meine Einsätze">
  <EmployeeScheduleList
    email={employeeData.email}
    onUpdate={() => {
      // refresh totals when hours/km change
      fetch("/api/employee/total-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: employeeData.email }),
      })
        .then((res) => res.json())
        .then((totals) => setPaymentTotals(totals));
    }}
  />
</Card>



          <Card title="📅 Verfügbarkeit">
            <Info label="Ab" value={new Date(employeeData.availabilityFrom).toLocaleDateString()} />
            <Info label="Tage" value={employeeData.availabilityDays?.join(", ") || "—"} />
            <Info label="Stunden/Woche" value={employeeData.desiredWeeklyHours || "—"} />
          </Card>
 
     <Card title="📥 Neue Zuweisungen">
  {pendingAssignments.length === 0 ? (
    <p className="text-sm text-gray-500">Keine neuen Zuweisungen.</p>
  ) : (
    pendingAssignments.map((a) => (
      <div key={a.id} className="border p-3 rounded mb-3">
        <p>
          <strong>Kunde:</strong> {a.user.firstName} {a.user.lastName}
        </p>
        <p>
          <strong>Email:</strong> {a.user.email}
        </p>

        <div className="mt-4 flex space-x-2">
         <button
  onClick={() => handleAssignmentAction(a.id, "confirmed")}
  className="bg-green-600 text-white px-3 py-1 rounded"
>
  Annehmen
</button>

<button
  onClick={() => handleAssignmentAction(a.id, "rejected")}
  className="bg-red-600 text-white px-3 py-1 rounded"
>
  Ablehnen
</button>
        </div>
      </div>
    ))
  )}
</Card>
<Card title="✅ Bestätigte Zuweisungen">
  <AssignmentsList confirmedAssignments={confirmedAssignments} />
</Card>


          <Card title="🚫 Abgelehnte Zuweisungen">
            {rejectedAssignments.length === 0 ? <p className="text-sm text-gray-500">Keine abgelehnten Zuweisungen.</p> : rejectedAssignments.map((a) => (
              <div key={a.id} className="border p-3 rounded mb-2">
                <p><strong>Kunde:</strong> {a.user.firstName} {a.user.lastName}</p>
                <p><strong>Email:</strong> {a.user.email}</p>
              </div>
            ))}
          </Card>
          <Card title="📄 Dokumente">
            {["passportFile","visaFile","policeLetterFile","cvFile","certificateFile","drivingLicenceFile","profilePhoto"].map((key, i) =>
              employeeData[key] ? <Info key={i} label={key} value={<a href={employeeData[key]} target="_blank" className="text-[#04436F] underline">Ansehen</a>} /> : <Info key={i} label={key} value="Nicht hochgeladen" />
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
          <Card title="💳 Bankdetails">
            {paymentSaved ? (
              <div className="space-y-2 text-sm">
                <Info label="IBAN" value={payment.iban || "—"} />
                <Info label="Kontoinhaber" value={payment.accountHolder || "—"} />
                <Info label="Bankname" value={payment.bankName || "—"} />
                <Info label="BIC" value={payment.bic || "—"} />
                <button onClick={handlePaymentEditRequest} className="mt-2 bg-red-500 text-white px-4 py-2 rounded">Änderung anfragen</button>
                {paymentMsg && <p className="text-sm text-blue-700 mt-2">{paymentMsg}</p>}
              </div>
            ) : (
              <form onSubmit={handlePaymentSubmit} className="space-y-2 text-sm">
                <input type="text" name="iban" placeholder="IBAN" value={payment.iban} onChange={handlePaymentChange} className="border w-full p-2 rounded" required />
                <input type="text" name="accountHolder" placeholder="Kontoinhaber" value={payment.accountHolder} onChange={handlePaymentChange} className="border w-full p-2 rounded" required />
                <input type="text" name="bankName" placeholder="Bankname" value={payment.bankName} onChange={handlePaymentChange} className="border w-full p-2 rounded" />
                <input type="text" name="bic" placeholder="BIC / SWIFT" value={payment.bic} onChange={handlePaymentChange} className="border w-full p-2 rounded" />
                <button type="submit" className="bg-[#04436F] text-white px-4 py-2 rounded w-full">Speichern</button>
                {paymentMsg && <p className="text-green-600 mt-2">{paymentMsg}</p>}
              </form>
            )}
          </Card>
        </div>
        <Card title="✅ Bestätigte Zuweisungen">
          <AssignmentsList confirmedAssignments={confirmedAssignments} />
        </Card>
      </main>
    </div>
  );
}

function SidebarLink({ label, onClick }) {
  return (
    <div onClick={onClick} className="px-4 py-2 rounded-lg cursor-pointer font-medium text-sm tracking-wide hover:bg-[#05507F] hover:pl-6 transition-all duration-200">
      {label}
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-[#04436F] border-b pb-2 flex items-center gap-2">
        <span className="inline-block w-1.5 h-5 bg-[#B99B5F] rounded-full"></span>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between items-center text-sm py-1 border-b last:border-none">
      <span className="font-medium text-gray-600">{label}</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}
