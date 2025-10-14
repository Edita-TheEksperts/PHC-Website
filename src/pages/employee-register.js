
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
  const actualFile = file instanceof FileList ? file[0] : file;

  const fileRef = ref(storage, `users/${userId}/${label}-${Date.now()}-${actualFile.name}`);
  const snapshot = await uploadBytes(fileRef, actualFile);
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
    "Postgänge",
    "Sonstige Begleitungen",
  ],
  "Freizeit und Soziale Aktivitäten": [
    "Gesellschaft leisten",
    "Gemeinsames Kochen",
    "Vorlesen",
    "Kartenspiele",
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


  // CSS class for inputs
  const inputClass =
    "w-full mb-6 px-5 py-4 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#04436F] placeholder-gray-500";

  // Step names shown at top of form
  const steps = [
    "Persönliche Informationen",
    "Weitere Informationen",
    "Arbeitsbereitschaft",
    "Abschluss",
  ];

const handleChange = (e) => {
  const { name, value, type, checked, files, selectedOptions } = e.target;

  // 🔹 Handle file inputs
  if (type === "file") {
    setForm((prev) => ({ ...prev, [name]: files }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name]; // Remove error when user selects a file
      return newErrors;
    });
    return;
  }

  // 🔹 Handle all other inputs
  let newValue =
    type === "checkbox"
      ? checked
      : type === "select-multiple"
      ? Array.from(selectedOptions).map((o) => o.value)
      : value;

  setForm((prev) => ({
    ...prev,
    [name]: newValue,
  }));

  // 🔹 Remove error for this field as soon as user types or selects
  setErrors((prev) => {
    const newErrors = { ...prev };
    delete newErrors[name];
    return newErrors;
  });
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
  if (!form.experienceYears) {
    newErrors.experienceYears = "Bitte Erfahrung auswählen.";
  }
  if (!form.experienceWhere) {
    newErrors.experienceWhere = "Bitte letzte Anstellung angeben.";
  }
  if (!form.hasLicense) {
    newErrors.hasLicense = "Bitte Führerschein angeben.";
  }
  if (form.hasLicense === "ja" && !form.licenseType) {
    newErrors.licenseType = "Bitte Führerscheintyp auswählen.";
  }
  if (!form.hasCar) {
    newErrors.hasCar = "Bitte Auto-Verfügbarkeit angeben.";
  }
  if (form.hasCar === "ja" && !form.carAvailableForWork) {
    newErrors.carAvailableForWork = "Bitte wählen, ob Auto für Arbeit verfügbar ist.";
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
  if (!form.availabilityFrom) {
    newErrors.availabilityFrom = "Bitte Startdatum wählen.";
  }

  if (!form.nightShifts) {
    newErrors.nightShifts = "Bitte auswählen, ob Nachtarbeit möglich ist.";
  }

  if (form.nightShifts === "ja" && !form.nightShiftFrequency) {
    newErrors.nightShiftFrequency = "Bitte Häufigkeit der Nachtschichten angeben.";
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
        <p className="text-red-600 text-sm mt-0.3">{errors.lastName}</p>
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



<div hidden={step !== 2}>

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
    <option value="G">G</option>
    <option value="L">L</option>
    <option value="B">B</option>
    <option value="C">C</option>
    <option value="CH Pass">CH Pass</option>
  </select>
  {errors.residencePermit && (
    <p className="text-red-600 text-sm mt-1">{errors.residencePermit}</p>
  )}

  <label className="block font-medium mb-1">
    Wie viele Jahre Erfahrung in der Pflege, Betreuung oder Hauswirtschaft?
  </label>
  <select
    name="experienceYears"
    value={form.experienceYears}
    onChange={handleChange}
    className={inputClass}
    disabled={emailExists}
  >
    <option value="">Bitte wählen</option>
    <option value="1-2 Jahre">1–2 Jahre</option>
    <option value="2-5 Jahre">2–5 Jahre</option>
    <option value="5+ Jahre">Mehr als 5 Jahre</option>
    <option value="Keine Erfahrung">Keine Erfahrung</option>
  </select>
  {errors.experienceYears && (
    <p className="text-red-600 text-sm mt-1">{errors.experienceYears}</p>
  )}

  {/* Letzte Anstellung */}
  <label className="block font-medium mb-1">Letzte Anstellung (Firma)?</label>
  <input
    type="text"
    placeholder="Name der Firma eingeben"
    name="experienceWhere"
    value={form.experienceWhere}
    onChange={handleChange}
    className={inputClass}
  />
  {errors.experienceWhere && (
    <p className="text-red-600 text-sm mt-1">{errors.experienceWhere}</p>
  )}

  {/* Zeige Textfeld nur wenn "Firma" gewählt wurde */}
  {form.experienceWhere === "Firma" && (
    <>
      <input
        name="experienceCompany"
        placeholder="Name der Firma"
        value={form.experienceCompany || ""}
        onChange={handleChange}
        className={inputClass}
      />
      {errors.experienceCompany && (
        <p className="text-red-600 text-sm mt-1">{errors.experienceCompany}</p>
      )}
    </>
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
          required
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
              required
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
  <label className="block font-medium mb-2 ">
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
      (z. B. spontane Einsätze, Springerfunktion, Bereitschafts- oder Pikettdienst)
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
    Reisen- und Ferienbegleitung möglich?
  </label>
  <p className="text-gray-500 text-sm mb-2 italic">
    Wochenende Milano oder 10 Tage Kreuzfahrt
  </p>
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
    Sind Sie bereit, Unterstützung in der Körperpflege zu leisten? 
    (Körperpflege, Hygiene, WC-Begleitung, Duschen etc.)
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
<div className="mb-2">
  <label className="font-medium mb-1">Verfügbar ab wann?</label>
  <input
    type="date"
    name="availabilityFrom"
    value={form.availabilityFrom || new Date().toISOString().split("T")[0]}
    min={new Date().toISOString().split("T")[0]}  // ✅ nuk lejon datë më të hershme
    onChange={handleChange}
    className={inputClass}
  />
  {errors.availabilityFrom && (
    <p className="text-red-600 text-sm mt-1">{errors.availabilityFrom}</p>
  )}
</div>


  {/* Feiertagseinsätze */}
  <div className="mb-2">
    <label className="block font-medium mb-1">
      Feiertagseinsätze möglich? (23.00 Uhr bis 06.00 Uhr)
    </label>
    <select
      name="nightShifts"
      value={form.nightShifts || ""}
      onChange={handleChange}
      className={inputClass}
    >
      <option value="">Bitte wählen</option>
      <option value="ja">Ja</option>
      <option value="nein">Nein</option>
    </select>
    {errors.nightShifts && (
      <p className="text-red-600 text-sm mt-1">{errors.nightShifts}</p>
    )}
  </div>

  {/* Häufigkeit der Nachtschichten */}
  <div className="mb-2">
    <label className="block font-medium mb-1">
      Häufigkeit der Nachtschichten (z. B. 1x/Woche)
    </label>
    <select
      name="nightShiftFrequency"
      value={form.nightShiftFrequency || ""}
      onChange={handleChange}
      className={inputClass}
    >
      <option value="">Bitte wählen</option>
      <option value="1x/Woche">1x/Woche</option>
      <option value="2x/Woche">2x/Woche</option>
      <option value="3x/Woche">3x/Woche</option>
      <option value="4x/Woche">4x/Woche</option>
      <option value="5x/Woche">5x/Woche</option>
      <option value="6x/Woche">6x/Woche</option>
      <option value="7x/Woche">7x/Woche</option>
    </select>
    {errors.nightShiftFrequency && (
      <p className="text-red-600 text-sm mt-1">{errors.nightShiftFrequency}</p>
    )}
  </div>
<DateEmployee
  form={form}
  setForm={setForm}
  handleChange={handleChange}
  hidden={step !== 3}
/>


{/* Tätigkeiten / Arbeitsbereiche */}
<div className="space-y-2 mt-8">
  <label className="font-medium mb-3 block text-lg text-[#04436F]">
    In welchem Bereich möchtest du arbeiten?
  </label>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
    {Object.entries(services).map(([category, subservices]) => {
      const isSelected = form.servicesOffered.includes(category);
      return (
        <div
          key={category}
          onClick={() => {
            setForm((prev) => {
              const updated = isSelected
                ? prev.servicesOffered.filter((item) => item !== category)
                : [...prev.servicesOffered, category];
              return { ...prev, servicesOffered: updated };
            });
          }}
          className={`p-5 rounded-xl border transition-all cursor-pointer shadow-sm 
            ${
              isSelected
                ? "border-[#04436F] bg-[#04436F]/10 ring-2 ring-[#04436F]"
                : "border-gray-300 hover:border-[#04436F]/50"
            }`}
        >
          <div className="flex justify-between items-center">
            <h3
              className={`text-[16px] font-semibold ${
                isSelected ? "text-[#04436F]" : "text-gray-800"
              }`}
            >
              {category}
            </h3>
            <div
              className={`w-5 h-5 rounded-full border-2 ${
                isSelected
                  ? "bg-[#04436F] border-[#04436F]"
                  : "border-gray-400"
              }`}
            />
          </div>

          {isSelected && (
            <ul className="mt-3 text-sm text-gray-600 list-disc list-inside space-y-1">
              {subservices.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      );
    })}
  </div>

  {errors.servicesOffered && (
    <p className="text-red-600 text-sm mt-2">{errors.servicesOffered}</p>
  )}
</div>


  {/* Dokumente hochladen */}
  <div className="mt-6">
    <h3 className="text-xl font-semibold">Dokumente hochladen</h3>
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
  >
    <label className="block font-medium mb-1 mt-4">
      {field.label}{" "}
      {field.required ? (
        <span className="text-red-500 font-bold">*</span>
      ) : field.hideOptional !== true ? (
        <span className="text-gray-500 text-sm">(optional)</span>
      ) : null}
    </label>

    {/* Hidden file input */}
<input
  type="file"
  id={field.key}
  accept="image/*,application/pdf"
  capture="environment"
  style={{ display: "none" }}
  onChange={(e) => setForm({ ...form, [field.key]: e.target.files })}
  required={field.required}
/>


    {/* Upload button */}
    <label
      htmlFor={field.key}
      className="inline-block bg-[#04436F] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#a6884a] text-sm"
    >
      Datei hochladen
    </label>

    {/* File name display */}
    <p className="text-sm text-gray-600 mt-1">
      {form[field.key]?.length > 0
        ? `${form[field.key].length} Datei(en) ausgewählt`
        : "Keine Datei ausgewählt"}
    </p>

    {/* Error message */}
    {errors[field.key] && (
      <p className="text-red-600 text-sm mt-1">{errors[field.key]}</p>
    )}
  </div>
))}


{/* Führerschein (always mounted, just hidden) */}
<div hidden={form.hasLicense !== "ja"}>
  <label className="block text-sm font-medium text-gray-700 mb-1">
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
    className="inline-block bg-[#04436F] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#a6884a] text-sm"
  >
    Dokumente hochladen
  </label>

  <p className="text-sm text-gray-600 mt-1">
    {form.drivingLicenceFile?.length > 0
      ? `${form.drivingLicenceFile.length} Datei(en) ausgewählt`
      : "Keine Datei ausgewählt"}
  </p>

  {errors.drivingLicenceFile && (
    <p className="text-red-600 text-sm mt-1">{errors.drivingLicenceFile}</p>
  )}
</div>


    {/* Foto Upload */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
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
        className="inline-block bg-[#04436F] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#a6884a] text-sm"
      >
        Dokumente hochladen
      </label>
      <p className="text-sm text-gray-600 mt-1">
        {form.profilePhoto?.length > 0
          ? `${form.profilePhoto.length} Datei(en) ausgewählt`
          : "Keine Datei ausgewählt"}
      </p>
      {errors.profilePhoto && (
        <p className="text-red-600 text-sm mt-1">{errors.profilePhoto}</p>
      )}
    </div>
  </div>

  {/* Wie haben Sie von uns erfahren */}
  <div className="space-y-4 mt-6 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
    <label className="text-xl font-semibold mb-1">
      Wie haben Sie von uns erfahren?
    </label>
    <div className="flex flex-col gap-3">
      {["LinkedIn", "Facebook", "Instagram", "Google"].map((option) => (
        <label key={option} className="flex items-center gap-3 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            name="howDidYouHearAboutUs"
            value={option}
            checked={form.howDidYouHearAboutUs === option}
            onChange={(e) =>
              setForm({ ...form, howDidYouHearAboutUs: e.target.value })
            }
            className="h-4 w-4 accent-[#04436F]"
          />
          {option}
        </label>
      ))}

      <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
        <input
          type="checkbox"
          name="howDidYouHearAboutUs"
          value="Andere"
          checked={form.howDidYouHearAboutUs?.startsWith("Andere:")}
          onChange={(e) => {
            const isChecked = e.target.checked;
            setForm((prev) => ({
              ...prev,
              howDidYouHearAboutUs: isChecked ? "Andere:" : "",
            }));
          }}
          className="h-4 w-4 accent-[#04436F]"
        />
        Andere
      </label>

      {form.howDidYouHearAboutUs?.startsWith("Andere:") && (
        <input
          type="text"
          placeholder="z. B. Empfehlung, Werbung..."
          value={form.howDidYouHearAboutUs.split(":")[1] || ""}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              howDidYouHearAboutUs: `Andere:${e.target.value}`,
            }))
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#B99B5F]"
        />
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
      Bitte bestätigen Sie Ihre Angaben und schliessen Sie die Registrierung ab.
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
        <SummaryRow label="Erfahrung" value={form.experienceYears} />
        <SummaryRow label="Erfahrung (Ort)" value={form.experienceWhere === "Firma" ? form.experienceCompany || "Firma" : form.experienceWhere} />
        <SummaryRow label="Wie erfahren?" value={form.howDidYouHearAboutUs} />
      </div>
    </div>
  </div>

    </div>
  );
}
