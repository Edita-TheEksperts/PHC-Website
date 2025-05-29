import { useState } from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";
export default function RegisterEmployee() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
const SummaryRow = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
    <span className="text-[14px] font-semibold text-gray-900">{value || "—"}</span>
  </div>
);
const [showReferralModal, setShowReferralModal] = useState(false);
useEffect(() => {
  if (step === 3) {
    setShowReferralModal(true);
  }
}, [step]);

 const [form, setForm] = useState({
  email: "",
  salutation: "",
  firstName: "",
  lastName: "",
  phone: "",
  address: "",
  houseNumber: "",
  zipCode: "",
  city: "",
country: "",
  residencePermit: "",
  experienceYears: "",
  experienceWhere: "",
experienceCompany: "",
  hasSRK: "",
  hasLicense: "",
  licenseType: "",
  hasCar: "",
  carAvailableForWork: "",
  smoker: "",
  onCallAvailable: "",
  specialTrainings: [],
  weekendReady: "",
  nightShifts: "",
  nightShiftFrequency: "",
  communicationTraits: [],
  languages: [],
  languageOther: "",
  householdTasks: [],
  dietaryExperience: [],
  careServices: [],
  travelSupport: "",
  bodyCareSupport: "",
  hasAllergies: "",
  worksWithAnimals: "",
  howFarCanYouTravel: "",
  availabilityFrom: "",
  availabilityDays: [],
  servicesOffered: [],
  resumeUrl: "",
  photoUrl: "",
  howDidYouHearAboutUs: "",
});

const [agbAccepted, setAgbAccepted] = useState(false);

// Safe localStorage usage
useEffect(() => {
  const savedEmail = typeof window !== "undefined" && localStorage.getItem("employeeEmail");
  const savedAgb = typeof window !== "undefined" && localStorage.getItem("employeeAgbAccepted");

  setForm((prev) => ({
    ...prev,
    email: savedEmail || "",
  }));

  setAgbAccepted(savedAgb === "true");
}, []);

  const inputClass =
    "w-full px-5 py-4 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#B99B5F] placeholder-gray-500";

  const steps = [
    "Persönliche Informationen",
    "Arbeitserfahrung",
    "Arbeitsbereitschaft",
    "Offizieller Status",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked, selectedOptions } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "select-multiple"
          ? Array.from(selectedOptions).map((o) => o.value)
          : value,
    }));
  };

  const validateStep = () => {
   switch (step) {
  case 1: // now Persönliche Informationen
    return form.firstName && form.lastName && form.phone && form.address;
  case 2:
    return (
      form.residencePermit &&
      form.experienceYears &&
      form.experienceWhere &&
      form.howFarCanYouTravel
    );
 case 3:
  const days = [
    "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"
  ];
  const hasAvailability = days.some(
    (day) => form[`available_${day}`] && parseFloat(form[`availabilityHours_${day}`]) > 0
  );
  return (
    hasAvailability &&
    form.servicesOffered.length > 0 &&
    form.resumeFile
  );

  default:
    return true;
}

  };

  const handleNext = () => {
    if (!validateStep()) {
      alert("Bitte alle Pflichtfelder korrekt ausfüllen.");
      return;
    }
    setStep((s) => s + 1);
  };

 const [submissionMessage, setSubmissionMessage] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateStep()) {
    alert("Bitte alle Pflichtfelder korrekt ausfüllen.");
    return;
  }

  setIsSubmitted(true);
  setSubmissionMessage("Registrierung abgeschlossen. Eine E-Mail mit einem Interview-Link wurde an Sie gesendet.");

  try {
    console.log("Sending email to:", form.email);
    // await axios.post("/api/send-confirmation", { email: form.email });

    // Wait 3 seconds before redirecting
    setTimeout(() => {
      router.push("/");
    }, 3000);
  } catch (error) {
    console.error("Email sending failed:", error);
    setSubmissionMessage("❌ Fehler beim Senden der E-Mail. Bitte später erneut versuchen.");
  }
};


  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 flex flex-col md:flex-row gap-8">
      {/* Form Section */}
      <div className="flex-1 space-y-8">
        {/* Stepper */}
        <div className="flex justify-between text-base font-medium text-[#B99B5F]">
          {steps.map((label, i) => (
            <div key={i} className="flex-1 flex items-center gap-2">
              <div
                className={`w-7 h-7 flex items-center justify-center rounded-full ${
                  step > i
                    ? "bg-[#B99B5F] text-white"
                    : "border border-[#B99B5F] text-[#B99B5F]"
                } text-sm font-bold`}
              >
                {i + 1}
              </div>
              <span className={step === i + 1 ? "font-bold" : ""}>{label}</span>
              {i < steps.length - 1 && (
                <div className="flex-1 h-px bg-[#E6D8B3] mx-2"></div>
              )}
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow space-y-8 text-base text-gray-800"
        >


    {step === 1 && (
  <>
    <h2 className="text-2xl font-bold text-[#B99B5F] mb-4">
      Persönliche Informationen
    </h2>

    {/* Salutation */}
    <select
      name="salutation"
      value={form.salutation}
      onChange={handleChange}
      className={inputClass}
    >
      <option value="">Anrede wählen</option>
      <option value="Herr">Herr</option>
      <option value="Frau">Frau</option>
    </select>

    {/* First and Last Name */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        name="firstName"
        placeholder="Vorname"
        value={form.firstName}
        onChange={handleChange}
        className={inputClass}
      />
      <input
        name="lastName"
        placeholder="Nachname"
        value={form.lastName}
        onChange={handleChange}
        className={inputClass}
      />
    </div>

    {/* Phone */}
    <input
      name="phone"
      placeholder="Telefonnummer"
      value={form.phone}
      onChange={handleChange}
      className={inputClass}
    />

    {/* Street + House Number */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input
        name="address"
        placeholder="Straße"
        value={form.address}
        onChange={handleChange}
className={`md:col-span-2 ${inputClass}`}
      />
      <input
        name="houseNumber"
        placeholder="Hausnummer"
        value={form.houseNumber || ""}
        onChange={handleChange}
        className={inputClass}
      />
    </div>

    {/* ZIP + City */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        name="zipCode"
        placeholder="PLZ"
        value={form.zipCode || ""}
        onChange={handleChange}
        className={inputClass}
      />
      <input
        name="city"
        placeholder="Ort"
        value={form.city || ""}
        onChange={handleChange}
        className={inputClass}
      />
    </div>

    {/* Country */}
    <select
      name="country"
      value={form.country || ""}
      onChange={handleChange}
      className={inputClass}
    >
      <option value="">Land wählen</option>
      <option value="CH">Schweiz (CH)</option>
      <option value="DE">Deutschland (DE)</option>
      <option value="AT">Österreich (AT)</option>
    </select>
  </>
)}

{step === 2 && (
  <>


    <h2 className="text-2xl font-bold text-[#B99B5F]">Arbeitserfahrung</h2>
        <label className="block font-medium mt-4">Aufenthaltsbewilligung</label>

   <select
  name="residencePermit"
  value={form.residencePermit}
  onChange={handleChange}
  className={inputClass}
>
  <option value="">Bitte wählen</option>
  <option value="G">G</option>
  <option value="L">L</option>
  <option value="B">B</option>
  <option value="C">C</option>
  <option value="CH Pass">CH Pass</option>
  <option value="Andere">Andere (nicht möglich)</option>
</select>

    <label className="block font-medium mt-4">Warbeitserfahrung (Jahre)</label>

    <select
  name="experienceYears"
  value={form.experienceYears}
  onChange={handleChange}
  className={inputClass}
>
  <option value="">Bitte wählen</option>
  <option value="1-2 Jahre">1–2 Jahre</option>
  <option value="2-5 Jahre">2–5 Jahre</option>
  <option value="5+ Jahre">Mehr als 5 Jahre</option>
</select>

   {/* Erfahrung auswählen */}
<label className="block font-medium mt-4">Wo gearbeitet?</label>
<select
  name="experienceWhere"
  value={form.experienceWhere}
  onChange={handleChange}
  className={inputClass}
>
  <option value="">Bitte wählen</option>
  <option value="Privat">Privat</option>
  <option value="Firma">Firma</option>
</select>

{/* Zeige Textfeld nur wenn "Firma" gewählt wurde */}
{form.experienceWhere === "Firma" && (
  <input
    name="experienceCompany"
    placeholder="Name der Firma"
    value={form.experienceCompany || ""}
    onChange={handleChange}
    className={inputClass + " mt-2"}
  />
)}


    <label className="block font-medium mt-4">Führerschein vorhanden?</label>
    <select
      name="hasLicense"
      value={form.hasLicense}
      onChange={handleChange}
      className={inputClass}
    >
      <option value="">Bitte auswählen</option>
      <option value="ja">Ja</option>
      <option value="nein">Nein</option>
    </select>

    {form.hasLicense === "ja" && (
      <>
        <label className="block font-medium mt-4">Fahrzeugtyp</label>
        <select
          name="licenseType"
          value={form.licenseType || ""}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="">Bitte wählen</option>
          <option value="Automat">Automat</option>
          <option value="Manuell">Manuell</option>
        </select>

        <label className="block font-medium mt-4">Eigenes Auto vorhanden?</label>
        <select
          name="hasCar"
          value={form.hasCar || ""}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="">Bitte wählen</option>
          <option value="ja">Ja</option>
          <option value="nein">Nein</option>
        </select>

        {form.hasCar === "ja" && (
          <>
            <label className="block font-medium mt-4">Fahrzeug für Einsätze bereitstellen? (CHF 1.00/km Vergütung)</label>
            <select
              name="carAvailableForWork"
              value={form.carAvailableForWork || ""}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Bitte wählen</option>
              <option value="ja">Ja</option>
              <option value="nein">Nein</option>
            </select>
          </>
        )}
      </>
    )}

    <label className="block font-medium mt-4">Mobilität</label>
    <input
      name="howFarCanYouTravel"
      placeholder="z. B. 10km, ÖV, Auto"
      value={form.howFarCanYouTravel}
      onChange={handleChange}
      className={inputClass}
    />

    <label className="block font-medium mt-6">Wie viele Stunden pro Woche möchten Sie arbeiten?</label>
    <select
      name="desiredWeeklyHours"
      value={form.desiredWeeklyHours || ""}
      onChange={handleChange}
      className={inputClass}
    >
      <option value="">Bitte wählen</option>
      <option value="42">42 Std / 5 Tage / 100%</option>
      <option value="33.6">33.6 Std / 4 Tage / 80%</option>
      <option value="25.2">25.2 Std / 3 Tage / 60%</option>
      <option value="16.8">16.8 Std / 2 Tage / 40%</option>
      <option value="8.4">8.4 Std / 1 Tag / 20%</option>
      <option value="4.2">4.2 Std / 0.5 Tage / 10%</option>
      <option value="2.1">2.1 Std / 0.25 Tage / 5%</option>
      <option value="0.84">0.84 Std / 0.1 Tage / 2%</option>
    </select>

    <label className="block font-medium mt-4">Rauchen Sie?</label>
    <select
      name="smoker"
      value={form.smoker || ""}
      onChange={handleChange}
      className={inputClass}
    >
      <option value="">Bitte wählen</option>
      <option value="ja">Ja</option>
      <option value="nein">Nein</option>
    </select>

    <label className="block font-medium mt-4">Kurzfristige Einsätze möglich?</label>
    <select
      name="onCallAvailable"
      value={form.onCallAvailable || ""}
      onChange={handleChange}
      className={inputClass}
    >
      <option value="">Bitte wählen</option>
      <option value="ja">Ja</option>
      <option value="nein">Nein</option>
    </select>

    <label className="block font-medium mt-4">Fortbildungen</label>
<div className="flex flex-wrap gap-6">
  {["Demenzbetreuung", "Palliativbetreuung", "Andere"].map((option) => (
    <label key={option} className="flex items-center space-x-2">
      <input
        type="checkbox"
        name="specialTrainings"
        value={option}
        checked={form.specialTrainings?.includes(option)}
        onChange={(e) => {
          const isChecked = e.target.checked;
          const value = e.target.value;

          setForm((prev) => {
            const updated = isChecked
              ? [...(prev.specialTrainings || []), value]
              : (prev.specialTrainings || []).filter((v) => v !== value);
            return { ...prev, specialTrainings: updated };
          });
        }}
        className="h-5 w-5 text-[#B99B5F]"
      />
      <span>{option}</span>
    </label>
  ))}
</div>


    <label className="block font-medium mt-4">Kommunikationsfähigkeit & Empathie</label>
<div className="flex flex-wrap gap-6">
  {["Kommunikativ", "Ruhig", "Fröhlich", "Geduldig"].map((trait) => (
    <label key={trait} className="flex items-center space-x-2">
      <input
        type="checkbox"
        name="communicationTraits"
        value={trait}
        checked={form.communicationTraits?.includes(trait)}
        onChange={(e) => {
          const isChecked = e.target.checked;
          const value = e.target.value;

          setForm((prev) => {
            const updated = isChecked
              ? [...(prev.communicationTraits || []), value]
              : (prev.communicationTraits || []).filter((v) => v !== value);
            return { ...prev, communicationTraits: updated };
          });
        }}
        className="h-5 w-5 text-[#B99B5F]"
      />
      <span>{trait}</span>
    </label>
  ))}
</div>

    <label className="block font-medium mt-4">Sprachen</label>
<div className="flex flex-wrap gap-6">
  {["CH-Deutsch", "Deutsch", "Englisch", "Französisch", "Italienisch"].map((lang) => (
    <label key={lang} className="flex items-center space-x-2">
      <input
        type="checkbox"
        name="languages"
        value={lang}
        checked={form.languages?.includes(lang)}
        onChange={(e) => {
          const isChecked = e.target.checked;
          const value = e.target.value;

          setForm((prev) => {
            const updated = isChecked
              ? [...(prev.languages || []), value]
              : (prev.languages || []).filter((v) => v !== value);
            return { ...prev, languages: updated };
          });
        }}
        className="h-5 w-5 text-[#B99B5F]"
      />
      <span>{lang}</span>
    </label>
  ))}
</div>

<input
  name="languageOther"
  placeholder="Sonstige Sprachen – Freitext"
  value={form.languageOther || ""}
  onChange={handleChange}
  className={inputClass + " mt-4"}
/>

   <label className="block font-medium mt-4">Ernährungsbedürfnisse</label>
<div className="flex gap-6 mt-2">
  {["Diäten", "Allergien"].map((item) => (
    <label key={item} className="flex items-center space-x-2">
      <input
        type="checkbox"
        name="mealKnowledge"
        value={item}
        checked={form.mealKnowledge?.includes(item)}
        onChange={(e) => {
          const isChecked = e.target.checked;
          const value = e.target.value;

          setForm((prev) => {
            const updated = isChecked
              ? [...(prev.mealKnowledge || []), value]
              : (prev.mealKnowledge || []).filter((v) => v !== value);
            return { ...prev, mealKnowledge: updated };
          });
        }}
        className="h-5 w-5 text-[#B99B5F]"
      />
      <span>{item}</span>
    </label>
  ))}
</div>


    <label className="block font-medium mt-4">Reisebegleitung möglich?</label>
    <select
      name="travelSupport"
      value={form.travelSupport || ""}
      onChange={handleChange}
      className={inputClass}
    >
      <option value="">Bitte wählen</option>
      <option value="ja">Ja</option>
      <option value="nein">Nein</option>
    </select>

    <label className="block font-medium mt-4">Körperpflege-Unterstützung?</label>
    <select
      name="bodyCareSupport"
      value={form.bodyCareSupport || ""}
      onChange={handleChange}
      className={inputClass}
    >
      <option value="">Bitte wählen</option>
      <option value="ja">Ja</option>
      <option value="nein">Nein</option>
    </select>

    <label className="block font-medium mt-4">Allergien</label>
    <select
      name="hasAllergies"
      value={form.hasAllergies || ""}
      onChange={handleChange}
      className={inputClass}
    >
      <option value="">Bitte wählen</option>
      <option value="ja">Ja</option>
      <option value="nein">Nein</option>
    </select>

    <label className="block font-medium mt-4">Bereitschaft für Haushalte mit Tieren?</label>
    <select
      name="worksWithAnimals"
      value={form.worksWithAnimals || ""}
      onChange={handleChange}
      className={inputClass}
    >
      <option value="">Bitte wählen</option>
      <option value="ja">Ja</option>
      <option value="nein">Nein</option>
    </select>
  </>
)}


{step === 3 && (
  <>
    {/* Modal on entering Step 3 */}
{showReferralModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md relative">
      {/* Close button */}
      <button
        onClick={() => setShowReferralModal(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
      >
        &times;
      </button>

      <h3 className="text-xl font-bold text-[#B99B5F] mb-4">Wie haben Sie von uns erfahren?</h3>

      <div className="space-y-3 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="howDidYouHearAboutUs"
            value="LinkedIn"
            checked={form.howDidYouHearAboutUs === "LinkedIn"}
            onChange={(e) => setForm({ ...form, howDidYouHearAboutUs: e.target.value })}
          />
          LinkedIn
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="howDidYouHearAboutUs"
            value="Facebook"
            checked={form.howDidYouHearAboutUs === "Facebook"}
            onChange={(e) => setForm({ ...form, howDidYouHearAboutUs: e.target.value })}
          />
          Facebook
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="howDidYouHearAboutUs"
            value="Instagram"
            checked={form.howDidYouHearAboutUs === "Instagram"}
            onChange={(e) => setForm({ ...form, howDidYouHearAboutUs: e.target.value })}
          />
          Instagram
        </label>
        <input
          name="howDidYouHearAboutUs"
          placeholder="Andere (z.B. Google, Freund...)"
          value={form.howDidYouHearAboutUs || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
      </div>

      <button
        onClick={() => setShowReferralModal(false)}
        className="bg-[#B99B5F] hover:bg-[#A6884A] text-white font-semibold px-4 py-2 rounded w-full"
      >
        Speichern
      </button>
    </div>
  </div>
)}

    <h2 className="text-2xl font-bold text-[#B99B5F] mb-4">Arbeitsbereitschaft</h2>
<div className="space-y-2">
  <label className="font-medium">Verfügbar ab wann?</label>
  <input
    type="date"
    name="availabilityFrom"
    value={form.availabilityFrom}
    onChange={handleChange}
    className={inputClass}
  />
</div>

    {/* Weekly availability with checkboxes and hours */}
    <div className="space-y-4">
      <label className="font-medium">Ihre wöchentliche Verfügbarkeit (Stunden pro Tag)</label>
      {["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"].map((day) => (
        <div key={day} className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name={`available_${day}`}
              checked={form[`available_${day}`] || false}
              onChange={(e) =>
                setForm({
                  ...form,
                  [`available_${day}`]: e.target.checked,
                })
              }
              className="h-5 w-5 text-[#B99B5F]"
            />
            <span className="w-24">{day}</span>
          </label>
          <input
            type="number"
            min="0"
            name={`availabilityHours_${day}`}
            placeholder="Stunden"
            value={form[`availabilityHours_${day}`] || ""}
            onChange={handleChange}
            className="w-32 px-4 py-2 border rounded"
          />
        </div>
      ))}
    </div>

    <div className="space-y-2 mt-6">
  <label className="font-medium">Welche Tätigkeiten bieten Sie an?</label>
  <div className="flex flex-wrap gap-4">
    {["Reinigung", "Pflege", "Kochen", "Begleitung"].map((task) => (
      <label key={task} className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="servicesOffered"
          value={task}
          checked={form.servicesOffered.includes(task)}
          onChange={(e) => {
            const value = e.target.value;
            setForm((prev) => {
              const updated = prev.servicesOffered.includes(value)
                ? prev.servicesOffered.filter((item) => item !== value)
                : [...prev.servicesOffered, value];
              return { ...prev, servicesOffered: updated };
            });
          }}
          className="h-5 w-5 text-[#B99B5F]"
        />
        <span>{task}</span>
      </label>
    ))}
  </div>
</div>


    {/* Lebenslauf Upload */}
    <div className="space-y-2 mt-6">
      <label className="font-medium">Lebenslauf hochladen</label>
      <input
        type="file"
        name="resumeFile"
        accept=".pdf,.doc,.docx"
        onChange={handleChange}
        className="w-full"
      />
    </div>

    {/* Foto Upload */}
    <div className="space-y-2">
      <label className="font-medium">Foto hochladen (optional)</label>
      <input
        type="file"
        name="photoFile"
        accept="image/*"
        onChange={handleChange}
        className="w-full"
      />
    </div>

    {/* Führerschein Upload nur wenn vorher Ja */}
    {form.hasLicense === "ja" && (
      <div className="space-y-2">
        <label className="font-medium">Führerschein hochladen</label>
        <input
          type="file"
          name="licenseFile"
          accept=".jpg,.png,.pdf"
          onChange={handleChange}
          className="w-full"
        />
      </div>
    )}

  </>
)}



        {step === 4 && (
  <>
    <h2 className="text-2xl font-bold text-[#B99B5F]">Offizieller Arbeitsstatus</h2>

    {isSubmitted ? (
      <div className="mt-4 p-4 bg-[#f1f1f1] text-[#B99B5F] rounded-lg shadow">
        ✓ {submissionMessage}
      </div>
    ) : (
      <p className="mt-2 text-gray-700">
        Bitte bestätigen Sie Ihre Angaben und schließen Sie die Registrierung ab.
      </p>
    )}
  </>
)}


          {/* Navigation Buttons */}
          <div className="pt-6 flex justify-end gap-4">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg"
              >
                Zurück
              </button>
            )}
            {step < steps.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-white text-[#B99B5F] border-[#B99B5F] border-[2px] rounded-lg"
              >
                Weiter
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-3 bg-[#B99B5F] text-white rounded-lg"
              >
                Registrierung abschließen
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Summary Section */}
  <div className="w-full md:w-96">
    <div className="bg-white border border-gray-200 rounded-xl p-8 shadow space-y-6">
      <h3 className="text-xl font-bold text-gray-800 mb-2">Zusammenfassung</h3>

      <div className="grid grid-cols-1 gap-4 text-sm text-gray-700">
        <SummaryRow label="E-Mail" value={form.email} />
        <SummaryRow label="Name" value={`${form.salutation} ${form.firstName} ${form.lastName}`} />
        <SummaryRow label="Telefon" value={form.phone} />
        <SummaryRow label="Adresse" value={`${form.address} ${form.houseNumber || ''}`} />
        <SummaryRow label="PLZ / Ort" value={`${form.zipCode || ''} ${form.city || ''}`} />
        <SummaryRow label="Land" value={form.country} />
        <SummaryRow label="Startdatum" value={form.availabilityFrom} />
        <SummaryRow
          label="Verfügbare Tage"
          value={Object.entries(form)
            .filter(([key, val]) => key.startsWith("available_") && val)
            .map(([key]) => key.replace("available_", ""))
            .join(", ")}
        />
        <SummaryRow label="Mobilität" value={form.howFarCanYouTravel} />
        <SummaryRow label="Tätigkeiten" value={(form.servicesOffered || []).join(", ")} />
        <SummaryRow label="Führerschein" value={form.hasLicense === "ja" ? "Ja" : "Nein"} />
        {form.hasLicense === "ja" && (
          <>
            <SummaryRow label="Fahrzeugtyp" value={form.licenseType} />
            <SummaryRow label="Auto vorhanden" value={form.hasCar} />
            {form.hasCar === "ja" && (
              <SummaryRow label="Auto für Arbeit" value={form.carAvailableForWork} />
            )}
          </>
        )}
        <SummaryRow label="Erfahrung" value={form.experienceYears} />
        <SummaryRow label="Erfahrung (Ort)" value={form.experienceWhere === "Firma" ? form.experienceCompany || "Firma" : form.experienceWhere} />
        <SummaryRow label="Wie erfahren?" value={form.howDidYouHearAboutUs} />
      </div>
    </div>
  </div>

    </div>
  );
}
