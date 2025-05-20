import { useState } from "react";
import { useRouter } from "next/router";

export default function RegisterEmployee() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [agbAccepted, setAgbAccepted] = useState(false);

  const [form, setForm] = useState({
    email: "",
    salutation: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    residencePermit: "",
    experienceYears: "",
    experienceWhere: "",
    hasLicense: false,
    howFarCanYouTravel: "",
    availabilityFrom: "",
    availabilityDays: [],
    servicesOffered: [],
    resumeUrl: "",
    photoUrl: "",
    howDidYouHearAboutUs: "",
    officeAppointmentConfirmed: false,
  });

  const inputClass =
    "w-full px-5 py-4 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#B99B5F] placeholder-gray-500";

  const steps = [
    "Los geht's",
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
      case 1:
        return form.email && agbAccepted;
      case 2:
        return form.firstName && form.lastName && form.phone && form.address;
      case 3:
        return (
          form.residencePermit &&
          form.experienceYears &&
          form.experienceWhere &&
          form.howFarCanYouTravel
        );
      case 4:
        return (
          form.availabilityFrom &&
          form.availabilityDays.length > 0 &&
          form.servicesOffered.length > 0 &&
          form.resumeUrl &&
          form.officeAppointmentConfirmed
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep()) {
      alert("Bitte alle Pflichtfelder korrekt ausfüllen.");
      return;
    }
    setIsSubmitted(true);
    setTimeout(() => {
      router.push("/employee-dashboard");
    }, 3000);
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
          {/* Step 1: Los geht's */}
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold text-[#B99B5F]">Los geht's</h2>
              <input
                name="email"
                type="email"
                placeholder="E-Mail"
                value={form.email}
                onChange={handleChange}
                className={inputClass}
              />
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={agbAccepted}
                  onChange={() => setAgbAccepted(!agbAccepted)}
                  className="h-5 w-5 text-[#B99B5F]"
                />
                <span>Ich akzeptiere die AGB</span>
              </label>
            </>
          )}

          {/* Step 2: Persönliche Informationen */}
          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold text-[#B99B5F]">
                Persönliche Informationen
              </h2>
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
              <input
                name="phone"
                placeholder="Telefonnummer"
                value={form.phone}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                name="address"
                placeholder="Adresse"
                value={form.address}
                onChange={handleChange}
                className={inputClass}
              />
            </>
          )}

          {/* Step 3: Arbeitserfahrung */}
          {step === 3 && (
            <>
              <h2 className="text-2xl font-bold text-[#B99B5F]">Arbeitserfahrung</h2>
              <input
                name="residencePermit"
                placeholder="Aufenthaltsbewilligung"
                value={form.residencePermit}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                name="experienceYears"
                placeholder="Erfahrung in Jahren"
                value={form.experienceYears}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                name="experienceWhere"
                placeholder="Wo gearbeitet?"
                value={form.experienceWhere}
                onChange={handleChange}
                className={inputClass}
              />
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="hasLicense"
                  checked={form.hasLicense}
                  onChange={handleChange}
                  className="h-5 w-5 text-[#B99B5F]"
                />
                <span>Führerschein vorhanden</span>
              </label>
              <input
                name="howFarCanYouTravel"
                placeholder="Mobilität (z.B. 10km)"
                value={form.howFarCanYouTravel}
                onChange={handleChange}
                className={inputClass}
              />
            </>
          )}

          {/* Step 4: Arbeitsbereitschaft */}
{step === 4 && (
  <>
    <h2 className="text-2xl font-bold text-[#B99B5F] mb-4">Arbeitsbereitschaft</h2>

    {/* Verfügbarkeit */}
    <div className="space-y-2">
      <label className="font-medium">Verfügbar ab</label>
      <input
        type="date"
        name="availabilityFrom"
        value={form.availabilityFrom}
        onChange={handleChange}
        className={inputClass}
      />
    </div>

    <div className="space-y-2">
      <label className="font-medium">Verfügbare Tage</label>
      <select
        multiple
        name="availabilityDays"
        value={form.availabilityDays}
        onChange={handleChange}
        className={inputClass + " h-40"}
      >
        {["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"].map(
          (day) => (
            <option key={day} value={day}>
              {day}
            </option>
          )
        )}
      </select>
    </div>

    {/* Tätigkeiten */}
    <div className="space-y-2">
      <label className="font-medium">Welche Tätigkeiten bieten Sie an?</label>
      <select
        multiple
        name="servicesOffered"
        value={form.servicesOffered}
        onChange={handleChange}
        className={inputClass + " h-40"}
      >
        {["Reinigung", "Pflege", "Kochen", "Begleitung"].map((task) => (
          <option key={task} value={task}>
            {task}
          </option>
        ))}
      </select>
    </div>

    {/* Dokumente */}
    <div className="space-y-2">
      <label className="font-medium">Lebenslauf-Link</label>
      <input
        name="resumeUrl"
        placeholder="https://..."
        value={form.resumeUrl}
        onChange={handleChange}
        className={inputClass}
      />

      <label className="font-medium">Foto-Link (optional)</label>
      <input
        name="photoUrl"
        placeholder="https://..."
        value={form.photoUrl}
        onChange={handleChange}
        className={inputClass}
      />
    </div>

    {/* Empfehlung */}
    <div className="space-y-2">
      <label className="font-medium">Wie haben Sie von uns erfahren?</label>
      <input
        name="howDidYouHearAboutUs"
        placeholder="z.B. Google, Freund, Facebook..."
        value={form.howDidYouHearAboutUs}
        onChange={handleChange}
        className={inputClass}
      />
    </div>

    <label className="flex items-center mt-4 space-x-3">
      <input
        type="checkbox"
        name="officeAppointmentConfirmed"
        checked={form.officeAppointmentConfirmed}
        onChange={handleChange}
        className="h-5 w-5 text-[#B99B5F]"
      />
      <span>Ich habe einen Termin im Office geplant</span>
    </label>
  </>
)}


          {/* Step 5: Offizieller Status */}
          {step === 5 && (
            <>
              <h2 className="text-2xl font-bold text-[#B99B5F]">
                Offizieller Arbeitsstatus
              </h2>
              {isSubmitted ? (
                <p className="text-green-600">
                  ✓ Erfolgreich registriert! Weiterleitung...
                </p>
              ) : (
                <p>
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
                className="px-6 py-3 bg-[#B99B5F] text-white rounded-lg"
              >
                Weiter
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-3 bg-green-600 text-white rounded-lg"
              >
                Registrierung abschließen
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Summary Section */}
      <div className="w-full md:w-96">
        <div className="bg-white border rounded-xl p-8 shadow text-base text-gray-800 space-y-3">
          <h3 className="text-xl font-bold text-[#B99B5F] mb-3">Zusammenfassung</h3>
          <p>📧 E-Mail: {form.email}</p>
          <p>👤 Name: {form.salutation} {form.firstName} {form.lastName}</p>
          <p>📞 Telefon: {form.phone}</p>
          <p>🏠 Adresse: {form.address}</p>
          <p>📅 Start: {form.availabilityFrom}</p>
          <p>📆 Tage: {form.availabilityDays.join(", ")}</p>
          <p>🚗 Mobilität: {form.howFarCanYouTravel}</p>
        </div>
      </div>
    </div>
  );
}
