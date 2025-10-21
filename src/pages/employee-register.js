
import { useState } from "react";               // React hook to use component state
import { useRouter } from "next/router"; 
import { useEffect } from "react";  
import { useRef } from "react";            // React hook to handle side effects
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase"; // adjust path based on your structure
import DateEmployee from "../components/DateEmployee.js"; // Adjust path if needed
// Component Start
export default function RegisterEmployee() {
  const router = useRouter();                   // Next.js router
  const [step, setStep] = useState(1);         // Current form step (1 to 4)
  const [isSubmitted, setIsSubmitted] = useState(false); // To show confirmation after submit
const [stepError, setStepError] = useState("");

  // Component for showing summary rows
  const SummaryRow = ({ label, value }) => (
    <div className="flex flex-col">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
      <span className="text-[14px] font-semibold text-gray-900">{value || "—"}</span>
    </div>
  );

  const [showReferralModal, setShowReferralModal] = useState(false); // Show popup on step 3
const uploadToFirebase = async (file, userId, label) => {
  if (!file) return null;

  const fileRef = ref(storage, `users/${userId}/${label}-${Date.now()}-${file.name}`);
  const snapshot = await uploadBytes(fileRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};
const [errors, setErrors] = useState({});

  // When step changes to 3, show the modal
  useEffect(() => {
    if (step === 3) {
      setShowReferralModal(true);
    }
  }, [step]);
// 👇 Scroll function before return
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
  // Initial form state - every input field in your form
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
    canton:"",
  nationality:"",
    residencePermit: "",
    experienceYears: "",
    experienceWhere: "",
    experienceCompany: "",
    hasLicense: "",
    licenseType: "",
    hasCar: "",
    carAvailableForWork: "",
    smoker: "",
    onCallAvailable: "",
    specialTrainings: [],
    communicationTraits: [],
    languages: [],
    languageOther: "",
    dietaryExperience: [],
    travelSupport: "",
    bodyCareSupport: "",
    hasAllergies: "",
    worksWithAnimals: "",
    desiredWeeklyHours: "",
    howFarCanYouTravel: "",
    availabilityFrom: "",
    availabilityDays: [],
    servicesOffered: [],
    howDidYouHearAboutUs: "",
  });
const services = {
  "Alltagsbegleitung und Besorgungen": [
    "Beleitung zu Terminen",
    "Einkäufe erledigen",
      "Gemeinsames Kochen",
    "Postgänge",
    "Sonstige Begleitungen",
  ],
  "Freizeit und Soziale Aktivitäten": [
    "Gesellschaft leisten",
  "Biografiearbeit",
    "Vorlesen",
   "Gesellschaftspiele",
    "Ausflüge und Reisebegleitung",
  ],
  "Gesundheitsführsorge": [
    "Körperliche Unterstützung",
    "Nahrungsaufnahme",
    "Grundpflegerische Tätigkeiten",
    "Gesundheitsfördernde Aktivitäten",
    "Geistige Unterstützung",
  ],
  "Haushaltshilfe und Wohnpflege": [
    "Hauswirtschaft",
    "Balkon und Blumenpflege",
    "Waschen / Bügeln",
    "Kochen",
    "Fenster Putzen",
    "Bettwäsche wechseln",
    "Aufräumen",
    "Trennung / Entsorgung / Abfall",
    "Abstauben",
    "Staubsaugen",
    "Boden wischen",
    "Vorhänge reinigen",
  ],
};
const refs = {
  availabilityFrom: useRef(null),
  availabilityDays: useRef(null),
  servicesOffered: useRef(null),
  passportFile: useRef(null),
  cvFile: useRef(null),
  certificateFile: useRef(null),
  workPermitFile: useRef(null),
  drivingLicenceFile: useRef(null),
  profilePhoto: useRef(null),
  nightShifts: useRef(null),
  nightShiftFrequency: useRef(null),   // ✅ add this
};

  const [agbAccepted, setAgbAccepted] = useState(false); // Tracks if user accepted terms

const [emailExists, setEmailExists] = useState(false);

useEffect(() => {
  const savedEmail = typeof window !== "undefined" && localStorage.getItem("employeeEmail");
  const savedAgb = typeof window !== "undefined" && localStorage.getItem("employeeAgbAccepted");

  setForm((prev) => ({
    ...prev,
    email: savedEmail || "",
  }));

  setAgbAccepted(savedAgb === "true");

  if (savedEmail) {
    fetch("/api/check-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: savedEmail }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.exists) {
          setEmailExists(true);
        }
      })
      .catch((err) => {
        console.error("❌ Failed to check email:", err);
      });
  }
}, []);


const inputClass =
  "w-full px-5 py-3 border border-gray-200 rounded-xl text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#04436F] focus:border-[#04436F] placeholder-gray-400 transition-all duration-200";

  // Step names shown at top of form
  const steps = [
    "Persönliche Informationen",
    "Weitere Informationen",
    "Arbeitsbereitschaft",
    "Abschluss",
  ];

const handleChange = (e) => {
  const { name, value, type, checked, files, selectedOptions } = e.target;

  if (type === "file") {
    setForm((prev) => ({ ...prev, [name]: files[0] }));
    return;
  }

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
  let newErrors = {};

if (step === 1) {
  if (!form.email) newErrors.email = "E-Mail ist erforderlich.";
  if (!form.firstName) newErrors.firstName = "Vorname ist erforderlich.";
  if (!form.lastName) newErrors.lastName = "Nachname ist erforderlich.";
  if (!form.phone) newErrors.phone = "Telefonnummer ist erforderlich.";
  if (!form.address) newErrors.address = "Strasse ist erforderlich.";
  if (!form.houseNumber) newErrors.houseNumber = "Hausnummer ist erforderlich.";
  if (!form.zipCode) newErrors.zipCode = "PLZ ist erforderlich.";
  if (!form.city) newErrors.city = "Ort ist erforderlich.";
  if (!form.canton) newErrors.canton = "Kanton ist erforderlich.";
  if (!form.country) newErrors.country = "Land ist erforderlich.";
}
if (step === 2) {
  if (!form.residencePermit) {
    newErrors.residencePermit = "Bitte Aufenthaltsbewilligung wählen.";
  }

if (!form.hasLicense) {
  newErrors.hasLicense = "Bitte Führerschein angeben.";
} else if (form.hasLicense === "ja" && !form.licenseType) {
  newErrors.licenseType = "Bitte Führerscheintyp auswählen.";
}

if (form.hasLicense === "ja") {
  if (!form.hasCar) {
    newErrors.hasCar = "Bitte Auto-Verfügbarkeit angeben.";
  } else if (form.hasCar === "ja" && !form.carAvailableForWork) {
    newErrors.carAvailableForWork = "Bitte wählen, ob Auto für Arbeit verfügbar ist.";
  }
}

  if (!form.howFarCanYouTravel) {
    newErrors.howFarCanYouTravel = "Bitte Umkreis auswählen.";
  }
 
  if (!form.onCallAvailable) {
    newErrors.onCallAvailable = "Bitte angeben, ob Sie auf Abruf verfügbar sind.";
  }
  if (!form.travelSupport) {
    newErrors.travelSupport = "Bitte angeben, ob Sie Reise- und Ferienbegleitung leisten können.";
  }
  if (!form.bodyCareSupport) {
    newErrors.bodyCareSupport = "Bitte angeben, ob Sie Unterstützung in der Körperpflege leisten.";
  }

  if (!form.languages || form.languages.length === 0) {
    newErrors.languages = "Bitte mindestens eine Sprache auswählen.";
  }
  
if (!form.worksWithAnimals) {
  newErrors.worksWithAnimals = "Bitte angeben, ob Sie in einem Haushalt mit Tieren arbeiten können.";
}

}

if (step === 3) {
if (form.availabilityFrom === "") {
  errors.availabilityFrom = "Bitte Startdatum wählen.";
}


  if (!form.nightShifts) {
    newErrors.nightShifts = "Bitte auswählen, ob Nachtarbeit möglich ist.";
  }


  if (!form.availabilityDays || form.availabilityDays.length === 0) {
    newErrors.availabilityDays = "Bitte mindestens einen Tag auswählen.";
  }

  if (!form.servicesOffered || form.servicesOffered.length === 0) {
    newErrors.servicesOffered = "Bitte mindestens eine Tätigkeit auswählen.";
  }

// File Uploads
if (!form.passportFrontFile || form.passportFrontFile.length === 0) {
  newErrors.passportFrontFile = "Bitte Vorderseite des Passes/IDs hochladen.";
}
if (!form.passportBackFile || form.passportBackFile.length === 0) {
  newErrors.passportBackFile = "Bitte Rückseite des Passes/IDs hochladen.";
}

  if (!form.cvFile || form.cvFile.length === 0) {
    newErrors.cvFile = "Bitte Lebenslauf hochladen.";
  }

  if (form.residencePermit !== "CH Pass" && (!form.workPermitFile || form.workPermitFile.length === 0)) {
newErrors.workPermitFile = "Bitte Aufenthalts- oder Arbeitsbewilligung hochladen.";

  }

  if (form.hasLicense === "ja" && (!form.drivingLicenceFile || form.drivingLicenceFile.length === 0)) {
    newErrors.drivingLicenceFile = "Bitte Führerschein hochladen.";
  }

  if (!form.profilePhoto || form.profilePhoto.length === 0) {
    newErrors.profilePhoto = "Bitte Foto hochladen.";
  }
}


   setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) {
    // 👇 Scroll to first error field
    const firstErrorField = Object.keys(newErrors)[0];
    const el = document.querySelector(`[name="${firstErrorField}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.focus();
    }
    return false;
  }

  return true;
};

const handleNext = () => {
  const isValid = validateStep();
  if (!isValid) return; 

  setStepError("");
  setStep((s) => s + 1);
};


const specialTrainingsRef = useRef(null);

 const [submissionMessage, setSubmissionMessage] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();
 setStepError("");
setIsSubmitted(true);
setSubmissionMessage("Dateien werden hochgeladen...");


  setIsSubmitted(true);
  setSubmissionMessage("Dateien werden hochgeladen...");

  try {
    const userId = form.email.replace(/[@.]/g, "_"); // use email as unique ID

    // Upload all files to Firebase
    const fileUploads = {
  passportFrontFile: await uploadToFirebase(form.passportFrontFile, userId, "passport_front"),
  passportBackFile: await uploadToFirebase(form.passportBackFile, userId, "passport_back"),
  visaFile: await uploadToFirebase(form.visaFile, userId, "visa"),
      policeLetterFile: await uploadToFirebase(form.policeLetterFile, userId, "police_letter"),
      cvFile: await uploadToFirebase(form.cvFile, userId, "cv"),
      certificateFile: form.certificateFile
        ? await uploadToFirebase(form.certificateFile, userId, "certificate")
        : null,
      drivingLicenceFile:
form.hasLicense === "ja" && form.drivingLicenceFile
          ? await uploadToFirebase(form.drivingLicenceFile, userId, "driving_licence")
          : null,
      profilePhoto: await uploadToFirebase(form.profilePhoto, userId, "photo"),
    };
// Combine URLs into the payload
const payload = {
  ...form,
  ...fileUploads,
  hasLicense: form.hasLicense === "ja",
  availabilityFrom: form.availabilityFrom || new Date().toISOString().split("T")[0],
  specialTrainings: Array.isArray(form.specialTrainings) ? form.specialTrainings : [],
};

    // Send form data to your API
    const res = await fetch("/api/employee-register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
await fetch("/api/send-interview-email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: form.email, firstName: form.firstName }),
});

    if (res.status === 409) {
      const errorData = await res.json();
      setSubmissionMessage("❌ " + errorData.message);
      setIsSubmitted(false);
      return;
    }

    if (!res.ok) throw new Error("API error");

 setSubmissionMessage(
  `Vielen Dank für Ihre Bewerbung bei der Prime Home Care AG. Wir haben Ihre Unterlagen erfolgreich erhalten und werden diese sorgfältig prüfen. Wir melden uns so bald wie möglich mit weiteren Informationen bei Ihnen. Zu beachten: Der Login Bereich wird nach Bestätigung durch die PHC freigeschaltet.`
);


    
  } catch (error) {
    console.error("❌ Upload/Submit error:", error);
    setSubmissionMessage("❌ Fehler beim Hochladen oder Senden der Daten.");
    setIsSubmitted(false);
  }
};

useEffect(() => {
  scrollToTop();
}, [step]);

  return (
    
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6 md:p-10 flex flex-col md:flex-row gap-8">
      {/* Form Section */}
      <div className="flex-1 ">
        {/* Stepper */}
        <div className="flex flex-col lg:flex-row justify-between space-y-2 lg:space-y-0 text-base font-medium text-[#04436F] mb-[16px] lg:mb-0">
          {steps.map((label, i) => (
            <div key={i} className="flex-1 flex items-center gap-2">
              <div
                className={`w-7 h-7 flex items-center justify-center rounded-full ${
                  step > i
                    ? "bg-[#04436F] text-white"
                    : "border border-[#04436F] text-[#04436F]"
                } text-sm font-bold`}
              >
                {i + 1}
              </div>
              <span className={step === i + 1 ? "font-bold" : ""}>{label}</span>
              {i < steps.length - 1 && (
                <div className="flex-1 h-px bg-[#04436F] mx-2"></div>
              )}
            </div>
          ))}
        </div>
{emailExists && (
  <div className="p-6 text-center bg-red-100 border border-red-400 text-red-700 rounded mb-6">
    <p className="text-lg font-semibold">⚠️ Achtung</p>
    <p className="mt-1">Diese E-Mail ist bereits registriert.</p>
    <p>
      Bitte <a href="/login" className="underline text-red-800 font-bold">hier einloggen</a>, wenn Sie bereits ein Konto haben.
    </p>
  </div>
)}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 lg:p-8 rounded-xl shadow  text-base text-gray-800"
        >


<div hidden={step !== 1}>

  <h2 className="text-2xl font-bold text-[#04436F] mb-8">
    Persönliche Informationen
  </h2>

  {/* Anrede */}
  <div className="mb-4">
    <label className="block font-medium mb-1">Anrede</label>
    <select
      name="salutation"
      value={form.salutation}
      onChange={handleChange}
      className={inputClass}
      disabled={emailExists}
    >
      <option value="">Anrede wählen</option>
      <option value="Herr">Herr</option>
      <option value="Frau">Frau</option>
    </select>
  </div>

  {/* Vorname & Nachname */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block font-medium mb-1">Vorname</label>
      <input
        name="firstName"
        placeholder="Vorname"
        value={form.firstName}
        onChange={handleChange}
        className={inputClass}
        disabled={emailExists}
      />
      {errors.firstName && (
        <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
      )}
    </div>

    <div>
      <label className="block font-medium mb-1">Nachname</label>
      <input
        name="lastName"
        placeholder="Nachname"
        value={form.lastName}
        onChange={handleChange}
        className={inputClass}
        disabled={emailExists}
      />
      {errors.lastName && (
        <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
      )}
    </div>
  </div>

  {/* Telefonnummer */}
  <div className="mt-4">
    <label className="block font-medium mb-1">Telefonnummer</label>
    <input
      name="phone"
      placeholder="Telefonnummer"
      value={form.phone}
      onChange={handleChange}
      className={inputClass}
      disabled={emailExists}
    />
    {errors.phone && (
      <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
    )}
  </div>

  {/* Strasse & Hausnummer */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
    <div className="md:col-span-2">
      <label className="block font-medium mb-1">Strasse</label>
      <input
        name="address"
        placeholder="Strasse"
        value={form.address}
        onChange={handleChange}
        className={inputClass}
        disabled={emailExists}
      />
      {errors.address && (
        <p className="text-red-600 text-sm mt-1">{errors.address}</p>
      )}
    </div>

    <div>
      <label className="block font-medium mb-1">Hausnummer</label>
      <input
        name="houseNumber"
        placeholder="Hausnummer"
        value={form.houseNumber || ""}
        onChange={handleChange}
        className={inputClass}
        disabled={emailExists}
      />
      {errors.houseNumber && (
        <p className="text-red-600 text-sm mt-1">{errors.houseNumber}</p>
      )}
    </div>
  </div>

  {/* PLZ & Ort */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
    <div>
      <label className="block font-medium mb-1">PLZ</label>
      <input
        name="zipCode"
        placeholder="PLZ"
        value={form.zipCode || ""}
        onChange={handleChange}
        className={inputClass}
        disabled={emailExists}
      />
      {errors.zipCode && (
        <p className="text-red-600 text-sm mt-1">{errors.zipCode}</p>
      )}
    </div>

    <div>
      <label className="block font-medium mb-1">Ort</label>
      <input
        name="city"
        placeholder="Ort"
        value={form.city || ""}
        onChange={handleChange}
        className={inputClass}
        disabled={emailExists}
      />
      {errors.city && (
        <p className="text-red-600 text-sm mt-1">{errors.city}</p>
      )}
    </div>
  </div>

  {/* Kanton & Nationalität in the same row */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
    {/* Kanton */}
    <div>
      <label className="block font-medium mb-1">Kanton</label>
      <select
        name="canton"
        value={form.canton || ""}
        onChange={handleChange}
        className={inputClass}
        disabled={emailExists}
      >
        <option value="">Kanton wählen</option>
        {[
          "AG", "AI", "AR", "BE", "BL", "BS", "FR", "GE", "GL",
          "GR", "JU", "LU", "NE", "NW", "OW", "SG", "SH", "SO",
          "SZ", "TG", "TI", "UR", "VD", "VS", "ZG", "ZH"
        ].map((canton) => (
          <option key={canton} value={canton}>
            {canton}
          </option>
        ))}
      </select>
      {errors.canton && (
        <p className="text-red-600 text-sm mt-1">{errors.canton}</p>
      )}
    </div>

    {/* Nationalität */}
    <div>
      <label className="block font-medium mb-1">Nationalität</label>
      <input
        name="nationality"
        placeholder="z. B. Schweiz, Deutschland..."
        value={form.nationality || ""}
        onChange={handleChange}
        className={inputClass}
        disabled={emailExists}
      />
    </div>
  </div>

  {/* Land */}
  <div className="mt-4">
    <label className="block font-medium mb-1">Land</label>
    <select
      name="country"
      value={form.country || ""}
      onChange={handleChange}
      className={inputClass}
      disabled={emailExists}
    >
      <option value="">Land wählen</option>
      <option value="CH">Schweiz (CH)</option>
      <option value="DE">Deutschland (DE)</option>
      <option value="AT">Österreich (AT)</option>
    </select>
  </div>
</div>


<div hidden={step !== 2} className="space-y-4">
  <h2 className="text-2xl font-bold text-[#04436F] mb-8">
    Weitere Informationen
  </h2>

  <label className="block font-medium mb-1">Aufenthalts-/Arbeitsbewilligung</label>
<select
  name="residencePermit"
  value={form.residencePermit}
  onChange={handleChange}
  className={inputClass}
  disabled={emailExists}
>
  <option value="">Bitte wählen</option>
  {[
    "CH Pass",
    ...["B", "C", "G", "L"].sort(), // rendit alfabetikisht të tjerët
  ].map((option) => (
    <option key={option} value={option}>
      {option}
    </option>
  ))}
</select>

  {errors.residencePermit && (
    <p className="text-red-600 text-sm mt-1">{errors.residencePermit}</p>
  )}

 


  <label className="block font-medium mb-1">PKW Führerschein vorhanden?</label>
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
  {errors.hasLicense && (
    <p className="text-red-600 text-sm mt-1">{errors.hasLicense}</p>
  )}

  {form.hasLicense === "ja" && (
    <>
      <label className="block font-medium mb-1">Fahrzeugtyp</label>
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
      {errors.licenseType && (
        <p className="text-red-600 text-sm mt-1">{errors.licenseType}</p>
      )}

      <label className="block font-medium mb-1">Eigenes Auto vorhanden?</label>
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
      {errors.hasCar && (
        <p className="text-red-600 text-sm mt-1">{errors.hasCar}</p>
      )}

      {form.hasCar === "ja" && (
        <>
          <label className="block font-medium mb-1">
            Fahrzeug für Einsätze bereitstellen? (CHF 1.00/km Vergütung),
            exklusiv Arbeitsweg
          </label>
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
          {errors.carAvailableForWork && (
            <p className="text-red-600 text-sm mt-1">
              {errors.carAvailableForWork}
            </p>
          )}
        </>
      )}
    </>
  )}

  <label className="block font-medium mb-1">
    In welchem KM-Radius sind Sie bereit zu arbeiten?
  </label>
  <select
    name="howFarCanYouTravel"
    value={form.howFarCanYouTravel}
    onChange={handleChange}
    className={inputClass}
  >
    <option value="">Bitte wählen</option>
    <option value="0-15km">0–20 km</option>
    <option value="15-30km">20–40 km</option>
    <option value="30km+">40 km+</option>
  </select>
  {errors.howFarCanYouTravel && (
    <p className="text-red-600 text-sm mt-1">{errors.howFarCanYouTravel}</p>
  )}

  {/* Arbeitsstunden pro Woche */}
  <div className="mt-6">
    <label className="block font-medium mb-2">
      Wie viele Stunden pro Woche möchtest du arbeiten?
    </label>
    <div className="grid grid-cols-2 sm:grid-cols-3 mb-5 gap-3">
      {[
        { label: "40h / 100%", value: "40" },
        { label: "32h / 80%", value: "32" },
        { label: "24h / 60%", value: "24" },
        { label: "16h / 40%", value: "16" },
        { label: "8h / 20%", value: "8" },
      ].map((option) => {
        const selected = form.desiredWeeklyHours === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() =>
              setForm((prev) => ({ ...prev, desiredWeeklyHours: option.value }))
            }
            className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
              selected
                ? "bg-[#04436F] text-white border-[#04436F] shadow-md"
                : "bg-white border-gray-300 text-gray-700 hover:border-[#04436F]/50"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
    {errors.desiredWeeklyHours && (
      <p className="text-red-600 text-sm mt-2">{errors.desiredWeeklyHours}</p>
    )}
  </div>

  <label className="block font-medium mb-1">
    Kurzfristige Einsätze möglich? <br />
    <span className="text-sm font-normal text-gray-600">
      (z. B. spontane Einsätze, Springerfunktion, Bereitschafts- oder
      Pikettdienst)
    </span>
  </label>
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
  {errors.onCallAvailable && (
    <p className="text-red-600 text-sm mt-1">{errors.onCallAvailable}</p>
  )}

  <label className="block font-medium mb-1">Sprachen</label>
  <div className="flex flex-wrap gap-4 mb-6">
    {["CH-Deutsch", "Deutsch", "Englisch", "Französisch", "Italienisch"].map(
      (lang) => (
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
            className="h-5 w-5 text-[#04436F]"
          />
          <span>{lang}</span>
        </label>
      )
    )}
  </div>
  <input
    name="languageOther"
    placeholder="Weitere Sprachen"
    value={form.languageOther || ""}
    onChange={handleChange}
    className={inputClass + " mt-[-4px]"}
  />
  {errors.languages && (
    <p className="text-red-600 text-sm mt-1">{errors.languages}</p>
  )}

  <label className="block font-medium mb-1">
 Reise- und Ferienbegleitung möglich?
  </label>
    <span className="text-sm font-normal text-gray-600">
   Info: Wochenende Milano oder 10 Tage Kreuzfahrt
  </span>
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
  {errors.travelSupport && (
    <p className="text-red-600 text-sm mt-1">{errors.travelSupport}</p>
  )}

  <label className="block font-medium mb-1">
    Sind Sie bereit, Unterstützung in der Körperpflege zu leisten? (Körperpflege,
    Hygiene, WC-Begleitung, Duschen etc.)
  </label>
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
  {errors.bodyCareSupport && (
    <p className="text-red-600 text-sm mt-1">{errors.bodyCareSupport}</p>
  )}

  <label className="block font-medium mb-1">
    Können Sie in einem Haushalt mit Tieren arbeiten?
  </label>
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
  {errors.worksWithAnimals && (
    <p className="text-red-600 text-sm mt-1">{errors.worksWithAnimals}</p>
  )}
</div>


<div hidden={step !== 3}>

  <h2 className="text-2xl font-bold text-[#04436F] mb-8">Arbeitsbereitschaft</h2>

{/* Verfügbar ab wann */}
<div className="mb-6">
  <label className="block text-[16px] font-medium text-[#04436F] mb-2">
    Verfügbar ab wann?
  </label>
  <input
    type="date"
    name="availabilityFrom"
    value={
      form.availabilityFrom ||
      new Date().toISOString().split("T")[0] // ✅ Default today
    }
    min={new Date().toISOString().split("T")[0]} // ✅ Prevent past dates
    onChange={(e) => {
      handleChange(e);

      // ✅ Auto-fix: if date is empty, set today by default
      if (!e.target.value) {
        setForm((prev) => ({
          ...prev,
          availabilityFrom: new Date().toISOString().split("T")[0],
        }));
      }
    }}
    className={`${inputClass} w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#04436F] focus:border-transparent transition-all`}
  />

  {/* ✅ Only show error if date is truly missing */}
  {errors.availabilityFrom && !form.availabilityFrom && (
    <p className="text-red-600 text-sm mt-2">{errors.availabilityFrom}</p>
  )}
</div>


{/* Feiertagseinsätze */}
<div className="mb-6">
  <label className="block text-[16px] font-medium text-[#04436F] mb-2">
    Feiertagseinsätze möglich?
  </label>
  <select
    name="nightShifts"
    value={form.nightShifts || ""}
    onChange={handleChange}
    className={`${inputClass} w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#04436F] focus:border-transparent transition-all`}
  >
    <option value="">Bitte wählen</option>
    <option value="ja">Ja</option>
    <option value="nein">Nein</option>
  </select>
  {errors.nightShifts && (
    <p className="text-red-600 text-sm mt-2">{errors.nightShifts}</p>
  )}
</div>


<DateEmployee
  form={form}
  setForm={setForm}
  handleChange={handleChange}
  hidden={step !== 3}
/>


{/* Tätigkeiten / Arbeitsbereiche */}
<div className="space-y-8 mt-8">
  <label className="font-semibold text-2xl text-[#04436F]">
    In welchem Bereich möchtest du arbeiten?
  </label>

  <div className="space-y-4">
    {Object.entries(services).map(([category, subservices]) => {
      const isSelected = form.servicesOffered.includes(category);

      return (
        <div
          key={category}
          className={`rounded-2xl border transition-all duration-500 overflow-hidden shadow-sm
            ${
              isSelected
                ? "border-[#04436F]/50 bg-[#F5FAFD] scale-[1.01] shadow-md"
                : "border-gray-200 bg-[#FAFBFC] hover:border-[#04436F]/30 hover:shadow-sm"
            }`}
        >
          {/* Header */}
          <button
            type="button"
            onClick={() => {
              setForm((prev) => {
                const updated = isSelected
                  ? prev.servicesOffered.filter((item) => item !== category)
                  : [...prev.servicesOffered, category];
                return { ...prev, servicesOffered: updated };
              });
            }}
            className="w-full flex justify-between items-center px-6 py-4 text-left"
          >
            <span
              className={`text-lg font-semibold transition-colors ${
                isSelected ? "text-[#04436F]" : "text-gray-800"
              }`}
            >
              {category}
            </span>

            <span
              className={`transition-transform duration-500 text-[#04436F] ${
                isSelected ? "rotate-90" : "rotate-0"
              }`}
            >
              ▶
            </span>
          </button>

          {/* Animated Subservices Section */}
          <div
            className={`transition-all duration-500 ease-in-out ${
              isSelected ? "max-h-[300px] opacity-100 py-4" : "max-h-0 opacity-0 py-0"
            }`}
          >
            <div className="flex flex-wrap gap-2 px-6">
              {subservices.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-full bg-white border border-[#04436F]/20 text-[#04436F] text-sm font-medium hover:bg-[#04436F] hover:text-white transition-all cursor-pointer shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      );
    })}
  </div>

  {errors.servicesOffered && (
    <p className="text-red-600 text-sm mt-2">{errors.servicesOffered}</p>
  )}
</div>


{/* Datei hochladen */}
<div className="mt-8 space-y-6">
  <h3 className="text-lg font-semibold text-gray-800">Datei hochladen</h3>

  {[
    { label: "ID oder Reisepass – Vorderseite", key: "passportFrontFile", required: true },
    { label: "ID oder Reisepass – Rückseite", key: "passportBackFile", required: true },
    { label: "Aufenthalts- oder Arbeitsbewilligung", key: "workPermitFile", required: true, hideIfCHPass: true },
    { label: "Strafregisterauszug", key: "policeLetterFile", required: false, hideOptional: true },
    { label: "Lebenslauf", key: "cvFile", required: true },
    { label: "Zertifikate/Arbeitszeugnisse", key: "certificateFile", required: false },
  ].map((field) => (
    <div
      key={field.key}
      hidden={field.hideIfCHPass && form.residencePermit === "CH Pass"}
      className="space-y-2"
    >
      <label className="block text-sm font-medium text-gray-700">
        {field.label}{" "}
        {field.required ? (
          <span className="text-red-500 font-bold">*</span>
        ) : field.hideOptional !== true ? (
          <span className="text-gray-400 text-xs">(optional)</span>
        ) : null}
      </label>

      <input
        type="file"
        id={field.key}
        accept="image/*,application/pdf"
        capture="environment"
        style={{ display: "none" }}
        onChange={(e) => setForm({ ...form, [field.key]: e.target.files })}
        required={field.required}
      />

      <label
        htmlFor={field.key}
        className="inline-block bg-[#04436F] text-white px-4 py-2 rounded-md cursor-pointer hover:bg-[#a6884a] text-sm transition-all duration-150"
      >
        Datei hochladen
      </label>

      <p className="text-sm text-gray-600">
        {form[field.key]?.length > 0
          ? `${form[field.key].length} Datei(en) ausgewählt`
          : "Keine Datei ausgewählt"}
      </p>

      {errors[field.key] && (
        <p className="text-red-500 text-sm">{errors[field.key]}</p>
      )}
    </div>
  ))}

  {/* Führerschein */}
  <div hidden={form.hasLicense !== "ja"} className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      Führerschein <span className="text-red-500 font-bold">*</span>
    </label>
    <input
      type="file"
      id="drivingLicenceFile"
      accept="image/*,application/pdf"
      capture="environment"
      multiple
      style={{ display: "none" }}
      onChange={(e) =>
        setForm({ ...form, drivingLicenceFile: e.target.files })
      }
      required
    />
    <label
      htmlFor="drivingLicenceFile"
      className="inline-block bg-[#04436F] text-white px-4 py-2 rounded-md cursor-pointer hover:bg-[#a6884a] text-sm transition-all duration-150"
    >
      Dokumente hochladen
    </label>
    <p className="text-sm text-gray-600">
      {form.drivingLicenceFile?.length > 0
        ? `${form.drivingLicenceFile.length} Datei(en) ausgewählt`
        : "Keine Datei ausgewählt"}
    </p>
    {errors.drivingLicenceFile && (
      <p className="text-red-500 text-sm">{errors.drivingLicenceFile}</p>
    )}
  </div>

  {/* Foto Upload */}
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      Foto <span className="text-red-500 font-bold">*</span>
    </label>
    <input
      type="file"
      accept="image/*"
      capture="environment"
      id="profilePhoto"
      multiple
      style={{ display: "none" }}
      onChange={(e) => setForm({ ...form, profilePhoto: e.target.files })}
      required
    />
    <label
      htmlFor="profilePhoto"
      className="inline-block bg-[#04436F] text-white px-4 py-2 rounded-md cursor-pointer hover:bg-[#a6884a] text-sm transition-all duration-150"
    >
      Dokumente hochladen
    </label>
    <p className="text-sm text-gray-600">
      {form.profilePhoto?.length > 0
        ? `${form.profilePhoto.length} Datei(en) ausgewählt`
        : "Keine Datei ausgewählt"}
    </p>
    {errors.profilePhoto && (
      <p className="text-red-500 text-sm">{errors.profilePhoto}</p>
    )}
  </div>
</div>

</div>

<div hidden={step !== 4}>

  <h2 className="text-2xl font-bold text-[#04436F]">Abschluss</h2>

  {isSubmitted ? (
    <div className="mt-4 p-4 bg-[#f1f1f1] text-[#04436F] rounded-lg shadow">
      {submissionMessage}
    </div>
  ) : (
    <p className="mt-2 text-gray-700">
     Danke für Deine Online-Bewerbung. Wir werden Deine Unterlagen prüfen und uns zeitnah melden.
    </p>
  )}
</div>


        {/* Navigation Buttons */}
<div className="pt-6 flex justify-end gap-4">
  {/* Hide "Zurück" on step 4 */}
  {step > 1 && step !== 4 && (
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
      className="px-6 py-3 bg-white text-[#04436F] border-[#04436F] border-[2px] rounded-lg"
    >
      Weiter
    </button>
  ) : (
    <button
      type="submit"
  onClick={() => router.push("/")}
      className="px-6 py-3 bg-[#04436F] text-white rounded-lg"
    >
      Registrierung abschliessen
    </button>
  )}
</div>

        </form>
      </div>

      {/* Summary Section */}
  <div className="hidden w-full md:w-96">
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
        <SummaryRow label="Erfahrung (Ort)" value={form.experienceWhere === "Firma" ? form.experienceCompany || "Firma" : form.experienceWhere} />
        <SummaryRow label="Wie erfahren?" value={form.howDidYouHearAboutUs} />
      </div>
    </div>
  </div>

    </div>
  );
}
