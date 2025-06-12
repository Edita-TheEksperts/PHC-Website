import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function EmployeeDashboard() {
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState({ cardNumber: "", expiryDate: "", cvc: "" });
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
      cardNumber: employeeData.cardNumber || "",
      expiryDate: employeeData.expiryDate || "",
      cvc: employeeData.cvc || "",
    });

    // If all payment fields are filled, disable form
    if (employeeData.cardNumber && employeeData.expiryDate && employeeData.cvc) {
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
    cardNumber: payment.cardNumber,
    expiryDate: payment.expiryDate,
    cvc: payment.cvc,
  }),
      });

      if (!res.ok) throw new Error("Fehler beim Speichern");

      setPaymentMsg("✅ Zahlungsdaten gespeichert");
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
      <Info label="Kartennummer" value={`**** **** **** ${payment.cardNumber.slice(-4)}`} />
      <Info label="Ablaufdatum" value={payment.expiryDate} />
      <Info label="CVC" value="●●●" />
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
        <label className="block font-medium">Kartennummer</label>
        <input
          type="text"
          name="cardNumber"
          value={payment.cardNumber}
          onChange={handlePaymentChange}
          className="border w-full p-2 rounded"
          required
        />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block font-medium">Ablaufdatum</label>
          <input
            type="text"
            name="expiryDate"
            value={payment.expiryDate}
            onChange={handlePaymentChange}
            className="border w-full p-2 rounded"
            placeholder="MM/YY"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block font-medium">CVC</label>
          <input
            type="text"
            name="cvc"
            value={payment.cvc}
            onChange={handlePaymentChange}
            className="border w-full p-2 rounded"
            required
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
