import { useState } from "react";
import { useRouter } from "next/router";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const today = new Date();
  const minDate = new Date();
  minDate.setDate(today.getDate() + 10);
  const minDateStr = minDate.toISOString().split("T")[0];

  const [form, setForm] = useState({
    frequency: "",
    duration: 2,
    firstDate: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    cardNumber: "",
    expiryDate: "",
    cvc: ""
  });
const SummaryRow = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
    <span className="text-[14px] font-semibold text-gray-900">{value || "—"}</span>
  </div>
);

  const inputClass =
    "w-full px-5 py-4 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#04436F] placeholder-gray-500";

  const validateStep = () => {
    const {
      frequency,
      duration,
      firstDate,
      fullName,
      email,
      phone,
      password,
      address,
      emergencyContactName,
      emergencyContactPhone,
      cardNumber,
      expiryDate,
      cvc
    } = form;

    switch (step) {
      case 1:
        return frequency && duration >= 2 && firstDate;
      case 2:
        return fullName && email && phone && password && address;
      case 3:
        return emergencyContactName && emergencyContactPhone;
      case 4:
        return cardNumber && expiryDate && cvc;
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

  const steps = ["Wann?", "Personalien", "Finalisieren", "Pflege"];

  return (
    <div className="min-h-screen bg-white p-6 md:p-12 flex flex-col md:flex-row gap-8">
      <div className="flex-1 space-y-8">
        <div className="flex justify-between text-base font-medium text-[#04436F]">
          {steps.map((label, i) => (
            <div key={i} className="flex-1 flex items-center gap-2">
              <div
                className={`w-7 h-7 flex items-center justify-center rounded-full border-2 ${
                  step > i
                    ? "bg-[#04436F] text-white"
                    : "border-[#04436F] text-[#04436F]"
                } text-sm font-bold`}
              >
                {i + 1}
              </div>
              <span className={step === i + 1 ? "font-bold" : ""}>{label}</span>
              {i < steps.length - 1 && <div className="flex-1 h-px bg-gray-300 mx-2"></div>}
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl border-2 border-gray-200 space-y-8 text-base text-gray-800"
        >
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold text-black">Wie oft & wann?</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="font-semibold text-gray-800">Wie oft brauchen Sie Unterstützung?</p>
                  <div className="flex flex-wrap gap-4">
                    {["Einmal", "Wöchentlich", "Alle 2 Wochen", "Alle 4 Wochen", "Öfter"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setForm({ ...form, frequency: option })}
                        className={`px-4 py-3 rounded-lg border text-center w-[140px] ${
                          form.frequency === option
                            ? "border-[#04436F] text-[#04436F] font-semibold"
                            : "border-gray-300 text-gray-800"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-gray-800">Wie viele Stunden?</p>
                  <div className="flex items-center gap-6">
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          duration: Math.max(2, prev.duration - 1),
                        }))
                      }
                      className="text-xl w-10 h-10 flex items-center justify-center border rounded-full"
                    >
                      -
                    </button>
                    <span className="text-lg font-bold">{form.duration} Stunden</span>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          duration: prev.duration + 1,
                        }))
                      }
                      className="text-xl w-10 h-10 flex items-center justify-center border rounded-full"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-800">Datum auswählen</label>
                  <input
                    name="firstDate"
                    type="date"
                    value={form.firstDate}
                    min={minDateStr}
                    onChange={handleChange}
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#04436F]"
                    style={{ fontSize: '16px' }}
                  />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
           <>
  <h2 className="text-2xl font-bold text-black">Personalien</h2>
  <div className="space-y-6">
    <input name="fullName" placeholder="Vollständiger Name" value={form.fullName} onChange={handleChange} className={inputClass} />
    <input name="email" type="email" placeholder="E-Mail" value={form.email} onChange={handleChange} className={inputClass} />
    <input name="phone" placeholder="Telefon" value={form.phone} onChange={handleChange} className={inputClass} />
    <input name="password" type="password" placeholder="Passwort" value={form.password} onChange={handleChange} className={inputClass} />
    <input name="address" placeholder="Adresse / Ort der Betreuung" value={form.address} onChange={handleChange} className={inputClass} />

    {/* Language Preferences */}
    <div>
      <label className="font-semibold block mb-2">Welche Sprachen sollen die Betreuer sprechen?</label>
      <div className="flex flex-wrap gap-4">
       {[
  { code: "ch", name: "CH-Deutsch" },
  { code: "de", name: "Deutsch" },
  { code: "gb", name: "Englisch" },
  { code: "fr", name: "Französisch" },
  { code: "it", name: "Italienisch" }
].map((lang) => (
  <label key={lang.name} className="flex items-center gap-2 border rounded-lg px-4 py-2">
    <input
      type="checkbox"
      name="languages"
      value={lang.name}
      onChange={(e) => {
        const selected = form.languages || [];
        const updated = e.target.checked
          ? [...selected, lang.name]
          : selected.filter((l) => l !== lang.name);
        setForm({ ...form, languages: updated });
      }}
      checked={form.languages?.includes(lang.name) || false}
    />
    <img
      src={`https://flagcdn.com/w40/${lang.code}.png`}
      alt={lang.name}
      className="w-6 h-4 object-cover rounded-sm"
    />
    <span>{lang.name}</span>
  </label>
))}
  </div>
      <input
        name="otherLanguage"
        placeholder="Sonstige – Freitext"
        value={form.otherLanguage || ""}
        onChange={handleChange}
        className="mt-2 w-full border px-4 py-3 rounded"
      />
    </div>

    {/* Haustiere */}
    <div>
      <label className="font-semibold block mb-2">Haustiere im Haushalt? (wichtig für Allergien)</label>
      <input
        name="pets"
        placeholder="z. B. Katze, Hund, Vogel..."
        value={form.pets || ""}
        onChange={handleChange}
        className="w-full border px-4 py-3 rounded"
      />
    </div>
  </div>
</>

          )}

          {step === 3 && (
            <>
              <h2 className="text-2xl font-bold text-black">Finalisieren</h2>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-black">Checkliste / Fragebogen</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="h-5 w-5 text-[#04436F]" required />
                      <span>Ich habe keine akuten Beschwerden</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="h-5 w-5 text-[#04436F]" required />
                      <span>Ich nehme keine regelmäßigen Medikamente</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="h-5 w-5 text-[#04436F]" required />
                      <span>Ich stimme dem Datenschutz zu</span>
                    </label>
                  </div>
                </div>
                <input name="emergencyContactName" placeholder="Notfallkontakt Name" value={form.emergencyContactName} onChange={handleChange} className={inputClass} />
                <input name="emergencyContactPhone" placeholder="Notfallkontakt Telefon" value={form.emergencyContactPhone} onChange={handleChange} className={inputClass} />
              </div>
            </>
          )}

         {step === 4 && (
  <>
    <h2 className="text-2xl font-bold text-black">Zahlungsdetails</h2>
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Kartennummer</label>
      <div className="relative">
        <input
          name="cardNumber"
          placeholder="1234 5678 9012 3456"
          value={form.cardNumber}
          onChange={handleChange}
          className="w-full px-5 py-4 pr-16 border border-gray-300 rounded-xl shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-[#04436F]"
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          💳
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Gültig bis</label>
          <input
            name="expiryDate"
            placeholder="MM/YY"
            value={form.expiryDate}
            onChange={handleChange}
            className="w-full px-5 py-4 border border-gray-300 rounded-xl shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-[#04436F]"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">CVC</label>
          <input
            name="cvc"
            placeholder="123"
            value={form.cvc}
            onChange={handleChange}
            className="w-full px-5 py-4 border border-gray-300 rounded-xl shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-[#04436F]"
          />
        </div>
      </div>
    </div>

    {isSubmitted && (
      <p className="text-[#04436F] mt-4 font-medium">
        ✓ Registrierung erfolgreich!
      </p>
    )}
  </>
)}


          <div className="pt-6 flex justify-end gap-4">
            {step > 1 && (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg">
                Zurück
              </button>
            )}
            {step < steps.length ? (
              <button type="button" onClick={handleNext} className="px-6 py-3 bg-[#04436F] text-white rounded-lg">
                Weiter
              </button>
            ) : (
              <button type="submit" className="px-6 py-3 bg-[#04436F] text-white rounded-lg">
                Registrierung abschließen
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="w-full md:w-96">
       <div className="bg-white border border-gray-200 rounded-xl p-8 shadow space-y-6">
  <h3 className="text-xl font-bold text-gray-800 mb-2">Zusammenfassung</h3>

  <div className="grid grid-cols-1 gap-4 text-sm text-gray-700">
    <SummaryRow label="Häufigkeit" value={form.frequency} />
    <SummaryRow label="Dauer" value={`${form.duration} Stunden`} />
    <SummaryRow label="Datum" value={form.firstDate} />
    <SummaryRow label="Name" value={form.fullName} />
    <SummaryRow label="Telefon" value={form.phone} />
    <SummaryRow label="E-Mail" value={form.email} />
    <SummaryRow label="Adresse" value={form.address} />
    <SummaryRow label="Sprachen" value={(form.languages || []).join(", ")} />
    <SummaryRow label="Haustiere" value={form.pets || "Nicht angegeben"} />
  </div>
</div>

      </div>
      
    </div>
    
  );
}