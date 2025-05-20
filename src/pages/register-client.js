import { useState } from "react";
import { useRouter } from "next/router";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [form, setForm] = useState({
    service: "",
    subService: "",
    frequency: "",
    startTime: "",
    endTime: "",
    firstDate: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  const services = {
    Reinigung: ["Fenster", "Boden", "Bad"],
    Pflege: ["Tägliche Hilfe", "Medizinisch"],
  };

  const inputClass =
    "w-full px-5 py-4 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-500";

  const calculateHours = () => {
    const { startTime, endTime } = form;
    if (!startTime || !endTime) return 0;
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    return (eh * 60 + em - (sh * 60 + sm)) / 60;
  };

  const validateStep = () => {
    const {
      service,
      subService,
      frequency,
      startTime,
      endTime,
      firstDate,
      fullName,
      email,
      phone,
      password,
      address,
      emergencyContactName,
      emergencyContactPhone,
    } = form;

    switch (step) {
      case 1:
        return service && subService;
      case 2:
        return (
          frequency &&
          startTime &&
          endTime &&
          firstDate &&
          calculateHours() >= 2
        );
      case 3:
        return fullName && email && phone && password && address;
      case 4:
        return emergencyContactName && emergencyContactPhone;
      default:
        return true;
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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
      router.push("/client-dashboard");
    }, 3000);
  };

  const steps = ["Was?", "Wann?", "Personalien", "Finalisieren", "Pflege"];

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 flex flex-col md:flex-row gap-8">
      {/* Left: Form Section */}
      <div className="flex-1 space-y-8">
        {/* Stepper */}
        <div className="flex justify-between text-base font-medium text-blue-900">
          {steps.map((label, i) => (
            <div key={i} className="flex-1 flex items-center gap-2">
              <div
                className={`w-7 h-7 flex items-center justify-center rounded-full ${
                  step > i
                    ? "bg-blue-900 text-white"
                    : "border border-blue-900 text-blue-900"
                } text-sm font-bold`}
              >
                {i + 1}
              </div>
              <span className={step === i + 1 ? "font-bold" : ""}>{label}</span>
              {i < steps.length - 1 && (
                <div className="flex-1 h-px bg-blue-200 mx-2"></div>
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
              <h2 className="text-2xl font-bold text-blue-900">Was?</h2>
              <div className="space-y-6">
                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Auswahl Services</option>
                  {Object.keys(services).map((srv) => (
                    <option key={srv}>{srv}</option>
                  ))}
                </select>

                {form.service && (
                  <select
                    name="subService"
                    value={form.subService}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Sub-Services</option>
                    {services[form.service].map((sub) => (
                      <option key={sub}>{sub}</option>
                    ))}
                  </select>
                )}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold text-blue-900">Wann?</h2>
              <div className="space-y-6">
                <select
                  name="frequency"
                  value={form.frequency}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Häufigkeit</option>
                  <option value="1x">1x</option>
                  <option value="1x/Woche">1x/Woche</option>
                </select>

                <div className="flex gap-4">
                  <input
                    name="startTime"
                    type="time"
                    value={form.startTime}
                    onChange={handleChange}
                    className={inputClass + " flex-1"}
                  />
                  <input
                    name="endTime"
                    type="time"
                    value={form.endTime}
                    onChange={handleChange}
                    className={inputClass + " flex-1"}
                  />
                </div>

                <input
                  name="firstDate"
                  type="date"
                  value={form.firstDate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-2xl font-bold text-blue-900">
                Personalien & Zahlung
              </h2>
              <div className="space-y-6">
                <input
                  name="fullName"
                  placeholder="Vollständiger Name"
                  value={form.fullName}
                  onChange={handleChange}
                  className={inputClass}
                />
                <input
                  name="email"
                  type="email"
                  placeholder="E-Mail"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass}
                />
                <input
                  name="phone"
                  placeholder="Telefon"
                  value={form.phone}
                  onChange={handleChange}
                  className={inputClass}
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Passwort"
                  value={form.password}
                  onChange={handleChange}
                  className={inputClass}
                />
                <input
                  name="address"
                  placeholder="Adresse / Ort der Betreuung"
                  value={form.address}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="text-2xl font-bold text-blue-900">
                Finalisieren
              </h2>
              <div className="space-y-6">
               <div className="space-y-4">
  <h3 className="text-lg font-semibold text-blue-900">Checkliste / Fragebogen</h3>
  <div className="space-y-2">
    <label className="flex items-center space-x-3">
      <input type="checkbox" className="h-5 w-5 text-blue-600" required />
      <span>Ich habe keine akuten Beschwerden</span>
    </label>
    <label className="flex items-center space-x-3">
      <input type="checkbox" className="h-5 w-5 text-blue-600" required />
      <span>Ich nehme keine regelmäßigen Medikamente</span>
    </label>
    <label className="flex items-center space-x-3">
      <input type="checkbox" className="h-5 w-5 text-blue-600" required />
      <span>Ich stimme dem Datenschutz zu</span>
    </label>
  </div>
</div>

                <input
                  name="emergencyContactName"
                  placeholder="Notfallkontakt Name"
                  value={form.emergencyContactName}
                  onChange={handleChange}
                  className={inputClass}
                />
                <input
                  name="emergencyContactPhone"
                  placeholder="Notfallkontakt Telefon"
                  value={form.emergencyContactPhone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <h2 className="text-2xl font-bold text-blue-900">
                Kundenbeziehung / Pflege
              </h2>
              <p className="text-base text-gray-600">tbd</p>
              <p className="mt-2 text-gray-700">Sind Sie zufrieden?</p>
              {isSubmitted && (
                <p className="text-green-600 mt-4">
                  ✓ Registrierung erfolgreich!
                </p>
              )}
            </>
          )}

          <div className="pt-6 flex justify-end gap-4">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg"
              >
                Zurück
              </button>
            )}
            {step < steps.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-blue-900 text-white rounded-lg"
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

      {/* Right: Summary */}
      <div className="w-full md:w-96">
        <div className="bg-white border rounded-xl p-8 shadow text-base text-gray-800 space-y-3">
          <h3 className="text-xl font-bold text-blue-900 mb-3">Zusammenfassung</h3>
          <p>🧾 Service: {form.service} – {form.subService}</p>
          <p>📅 Häufigkeit: {form.frequency}</p>
          <p>🕐 Zeit: {form.startTime} – {form.endTime}</p>
          <p>🗓 Datum: {form.firstDate}</p>
          <p>👤 Name: {form.fullName}</p>
          <p>📞 Telefon: {form.phone}</p>
          <p>📧 E-Mail: {form.email}</p>
          <p>🏠 Adresse: {form.address}</p>
        </div>
      </div>
    </div>
  );
}
