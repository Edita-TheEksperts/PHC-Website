import { useState } from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { addDays } from 'date-fns';

export default function RegisterPage() {
  const router = useRouter();
const { service, subService } = router.query;

useEffect(() => {
  const fetchSubServices = async () => {
    if (!service) return;

    try {
   const res = await fetch(`/api/subservices?serviceName=${encodeURIComponent(service)}`);
if (!res.ok) {
  console.error("Status:", res.status);
  return;
}
const data = await res.json();
setSubServices(Array.isArray(data) ? data : []);
setForm(prev => ({
  ...prev,
  subService: prev.subService || data[0]?.name || ""
}));

    } catch (err) {
      console.error("Fehler beim Laden der Subservices", err);
    }
  };

  fetchSubServices();
}, [service]);
  const [subServices, setSubServices] = useState([]);
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
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  address: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  cardNumber: "",
  expiryDate: "",
  cvc: "",
  languages: [],
  pets: "",
  service: "",          
  subService: "",
  allergies: "", // ✅ ADD THIS
  specialRequests: "", // ✅ ADD THIS
  schedule: [] // <-- This was missing
});
{Array.isArray(form.schedule) && form.schedule.map((entry, i) => (
  <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
    {/* existing mapping code */}
  </div>
))}
const SummaryRow = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
    <span className="text-[14px] font-semibold text-gray-900">{value || "—"}</span>
  </div>
);

  const inputClass =
    "w-full px-5 py-4 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#04436F] placeholder-gray-500 mt-1";

  const validateStep = () => {
    const {
      frequency,
      duration,
      subService,
      firstDate,
      firstName,
      lastName,
      email,
      phone,
      password,
      address,
      emergencyContactName,
      emergencyContactPhone,
      cardNumber,
      expiryDate,
      allergies,
specialRequests,

      cvc
    } = form;

    switch (step) {
      case 1:
        return frequency && duration >= 2 && firstDate;
      case 2:
        return firstName && lastName && email && phone && password && address;
      case 3:
        return emergencyContactName && emergencyContactPhone && allergies && specialRequests;
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
const stripe = useStripe();
const elements = useElements();

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateStep()) {
    alert("Bitte alle Pflichtfelder korrekt ausfüllen.");
    return;
  }

  if (!stripe || !elements) {
    alert("Stripe ist noch nicht geladen.");
    return;
  }

  try {
    const HOURLY_RATE = 1;
    const totalHours = form.schedule.reduce((sum, entry) => sum + (parseInt(entry.hours) || 0), 0);
    const totalPayment = totalHours * HOURLY_RATE;

    // Step 1: Create PaymentIntent (manual capture)
    const paymentIntentRes = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: totalPayment * 100 })
    });

    const { clientSecret, id: paymentIntentId } = await paymentIntentRes.json();

    // Step 2: Confirm the payment (authorization only)
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)
      }
    });

    if (result.error) {
      alert("Zahlungsfehler: " + result.error.message);
      return;
    }

    // Payment authorized, but not captured yet
    if (result.paymentIntent.status === "requires_capture" || result.paymentIntent.status === "requires_confirmation" || result.paymentIntent.status === "succeeded") {
      // Step 3: Save registration info + paymentIntentId + firstDate + totalPayment to backend
      const res = await fetch("/api/client-register-api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, totalPayment, paymentIntentId, firstDate: form.firstDate })
      });

      if (res.ok) {
        setIsSubmitted(true);
        router.push("/client-dashboard");
      } else {
        const err = await res.json();
        alert("Fehler bei der Registrierung: " + err.message);
      }
    }
  } catch (err) {
    alert("Serverfehler. Bitte versuchen Sie es später erneut.");
    console.error(err);
  }
};


useEffect(() => {
  const fetchSubServices = async () => {
    if (!service) return;

    try {
      const res = await fetch(`/api/subservices?serviceName=${encodeURIComponent(service)}`);
      if (!res.ok) {
        console.error("Status:", res.status);
        return;
      }
      const data = await res.json();
      setSubServices(Array.isArray(data) ? data : []);

      // ✅ set form.service here
      setForm((prev) => ({
        ...prev,
        service: service,
        subService: prev.subService || data[0]?.name || "",
      }));
    } catch (err) {
      console.error("Fehler beim Laden der Subservices", err);
    }
  };

  fetchSubServices();
}, [service]);

  const steps = ["Wann?", "Registration", "Finalisieren", "Zahlungdetails"];
const HOURLY_RATE = 1; // 1 CHF per hour

const totalHours = form.schedule.reduce((sum, entry) => sum + (parseInt(entry.hours) || 0), 0);
const totalPayment = totalHours * HOURLY_RATE;
const parseSwissDate = (str) => {
  const [day, month, year] = str.split('.');
  return new Date(`${year}-${month}-${day}`);
};

// Convert Date to dd.mm.yyyy string
const formatSwissDate = (date) => {
  return format(date, 'dd.MM.yyyy');

};
const tenDaysFromToday = addDays(new Date(), 10);
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
                  <p className="font-semibold text-gray-800">Wie oft wünschen Sie Unterstützung?</p>
                  <div className="flex flex-wrap gap-4">
                    {["einmalig", "wöchentlich", "Alle 2 Wochen", "monatlich", "öfter"].map((option) => (
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
                  <p className="font-semibold text-gray-800">Wie viele Stunden pro Einsatz?</p>
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
                    <span className="text-lg ">{form.duration} Stunden</span>
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
                {form.frequency !== "Einmal" && (
  <div className="space-y-4">
    <p className="font-semibold text-gray-800">Wann genau wünschen Sie Unterstützung?</p>

    {/* Allow adjusting number of days */}
    <div className="flex items-center gap-4">
      <span className="text-gray-700 font-medium">Tage pro Woche:</span>
      <button
        type="button"
        onClick={() =>
          setForm((prev) => ({
            ...prev,
            schedule: prev.schedule.slice(0, Math.max(1, prev.schedule.length - 1))
          }))
        }
        className="w-8 h-8 text-xl border rounded-full"
      >
        −
      </button>
      <span className="font-semibold">{form.schedule.length || 1}</span>
      <button
        type="button"
        onClick={() =>
          setForm((prev) => ({
            ...prev,
            schedule: [
              ...prev.schedule,
              { day: "", startTime: "08:00", hours: 2 }
            ].slice(0, 7)
          }))
        }
        className="w-8 h-8 text-xl border rounded-full"
      >
        +
      </button>
    </div>

    {/* Each day's schedule */}
    {form.schedule.map((entry, i) => (
      <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Weekday */}
        <select
          value={entry.day}
          onChange={(e) => {
            const updated = [...form.schedule];
            updated[i].day = e.target.value;
            setForm({ ...form, schedule: updated });
          }}
          className="border px-4 py-2 rounded-md"
        >
          <option value="">Wochentag wählen</option>
          {["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"].map((day) => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>

        {/* Start time */}
         <TimePicker
    value={entry.startTime}
    onChange={(val) => {
      const updated = [...form.schedule];
      updated[i].startTime = val;
      setForm({ ...form, schedule: updated });
    }}
    format="HH:mm"
    disableClock={true}
    clearIcon={null} // remove "X" clear button
    className="time-picker-input"
  />

        {/* Duration */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const updated = [...form.schedule];
              updated[i].hours = Math.max(1, updated[i].hours - 1);
              setForm({ ...form, schedule: updated });
            }}
            className="w-8 h-8 border rounded-full"
          >
            −
          </button>
          <span>{entry.hours} Std</span>
          <button
            type="button"
            onClick={() => {
              const updated = [...form.schedule];
              updated[i].hours = updated[i].hours + 1;
              setForm({ ...form, schedule: updated });
            }}
            className="w-8 h-8 border rounded-full"
          >
            +
          </button>
        </div>
      </div>
    ))}
  </div>
)}

{form.service && (
  <div className="space-y-2">
    <label className="block mb-2 font-semibold text-gray-800">Welche Extras möchten Sie?</label>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {subServices.map((sub) => {
        const isSelected = form.subService === sub.name;
        return (
          <button
            key={sub.id}
            type="button"
            onClick={() => setForm((prev) => ({ ...prev, subService: sub.name }))}
            className={`flex flex-col items-center justify-center p-4 border rounded-xl text-center space-y-2 ${
              isSelected ? "border-[#04436F] bg-[#f0f9ff]" : "border-gray-300"
            }`}
          >
            {/* Optional: Replace with icon if available */}
            <span className="font-medium">{sub.name}</span>
            <span className="text-sm text-gray-500">{isSelected ? "Ausgewählt" : "Hinzufügen"}</span>
          </button>
        );
      })}
    </div>
  </div>
)}


              <div>
  <label className="block mb-2 font-semibold text-gray-800">Beginndatum auswählen</label>
<DatePicker
  selected={form.firstDate ? parseSwissDate(form.firstDate) : null}
  onChange={(date) => {
    const formatted = formatSwissDate(date);
    setForm({ ...form, firstDate: formatted });
  }}
  dateFormat="dd.MM.yyyy"
  locale={de}
  placeholderText="TT.MM.JJJJ"
  minDate={tenDaysFromToday} // ✅ block all before 10 days from today
  className="w-full px-5 py-4 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#04436F]"
  calendarClassName="rounded-xl shadow-lg border border-gray-300"
  wrapperClassName="w-full"
/>

</div>

              </div>
            </>
          )}

         {step === 2 && (
  <>
    <h2 className="text-2xl font-bold text-black">Personalien</h2>

    <div className="text-sm text-left mt-6">
      <p>
        Bereits registriert?{" "}
        <span
          className="text-[#04436F] font-semibold cursor-pointer underline"
          onClick={() => router.push("/login")}
        >
          Hier einloggen
        </span>
      </p>
    </div>

    <div className="space-y-6 mt-6">
      {/* Vollständiger Name */}
 <div>
  <label className="block font-semibold mb-1">Vollständiger Name</label>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
    <input
      name="firstName"
      placeholder="Vorname"
      value={form.firstName || ""}
      onChange={handleChange}
      className={inputClass}
    />
    <input
      name="lastName"
      placeholder="Nachname"
      value={form.lastName || ""}
      onChange={handleChange}
      className={inputClass}
    />
  </div>
</div>


      {/* E-Mail */}
      <div>
        <label className="block font-semibold mb-1">E-Mail</label>
        <input
          type="email"
          name="email"
          placeholder="E-Mail"
          value={form.email}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      {/* Telefon */}
      <div>
        <label className="block font-semibold mb-1">Telefonnummer</label>
        <input
          name="phone"
          value={form.phone}
          placeholder="Telefonnummer"
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      {/* Passwort */}
      <div>
        <label className="block font-semibold mb-1">Passwort</label>
        <input
          type="password"
          name="password"
          placeholder="Passwort"
          value={form.password}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      {/* Adresse */}
      <div>
        <label className="block font-semibold text-base mb-2">Adresse</label>

        {/* Strasse & Hausnummer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Strasse</label>
            <input
              name="street"
              placeholder="z. B. Bahnhofstrasse"
              value={form.street || ""}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hausnummer</label>
            <input
              name="houseNumber"
              placeholder="z. B. 12a"
              value={form.houseNumber || ""}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* PLZ & Ort */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-1">PLZ</label>
            <input
              name="postalCode"
                      placeholder="z. B. 8000"

              value={form.postalCode || ""}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ort</label>
            <input
              name="city"
                      placeholder="z. B. Zürich"

              value={form.city || ""}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* Land */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">Land</label>
          <input
            name="address"
            placeholder="z. B. Schweiz"
            value={form.address || ""}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  </>
)}


          {step === 3 && (
  <>
    <h2 className="text-2xl font-bold text-black">Finalisieren</h2>
          {/* Sprachen */}
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
            className={inputClass}
        />
      </div>

      {/* Haustiere */}
      <div>
  <label className="block font-semibold mb-1">Allergien</label>
  <input
    name="allergies"
    value={form.allergies || ""}
    onChange={handleChange}
    placeholder="z. B. Pollen, Nüsse..."
    className={inputClass}
  />
</div>
<div>
  <label className="block font-semibold mb-1">Besondere Wünsche</label>
  <input
    name="specialRequests"
    value={form.specialRequests || ""}
    onChange={handleChange}
    placeholder="z. B. vegetarische Mahlzeiten"
    className={inputClass}
  />
</div>

      <div>
        <label className="font-semibold block mb-2">Haustiere im Haushalt? (wichtig für Allergien)</label>
        <input
          name="pets"
          placeholder="z. B. Katze, Hund, Vogel..."
          value={form.pets || ""}
          onChange={handleChange}
            className={inputClass}
        />
      </div>
    <div className="space-y-6 mt-6">
      {/* Fragebogen / Checkliste */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-black">Checkliste / Fragebogen</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="h-5 w-5 text-[#04436F]" required />
            <span>Ich habe keine akuten Beschwerden</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="h-5 w-5 text-[#04436F]" required />
            <span>Ich nehme keine regelmässigen Medikamente</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="h-5 w-5 text-[#04436F]" required />
            <span>Ich stimme dem Datenschutz zu</span>
          </label>
        </div>
      </div>

      {/* Notfallkontakt Name */}
      <div>
        <label className="block font-semibold mb-1">Notfallkontakt Name</label>
        <input
          name="emergencyContactName"
          placeholder="z. B. Maria Muster"
          value={form.emergencyContactName}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      {/* Notfallkontakt Telefon */}
      <div>
        <label className="block font-semibold mb-1">Notfallkontakt Telefon</label>
        <input
          name="emergencyContactPhone"
          placeholder="z. B. +41 79 123 45 67"
          value={form.emergencyContactPhone}
          onChange={handleChange}
          className={inputClass}
        />
      </div>
    </div>
  </>
)}

{step === 4 && (
  <>
    <h2 className="text-2xl font-bold text-black">Zahligsdetails</h2>

    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Chreditkarte-Informatione</label>

      <div className="relative">
        <div className="w-full px-5 py-4 pr-16 border border-gray-300 rounded-xl shadow-sm text-base focus-within:ring-2 focus-within:ring-[#04436F]">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#000',
                  '::placeholder': { color: '#a0aec0' },
                },
                invalid: {
                  color: '#e53e3e',
                },
              },
            }}
          />
        </div>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          💳
        </div>
      </div>

      {/* ✅ AGB Checklist */}
      <div className="flex items-start gap-2 mt-4">
        <input
          type="checkbox"
          required
          id="agb"
          className="mt-1"
        />
        <label htmlFor="agb" className="text-sm text-gray-700">
          Ich ha d’ <a href="/agb" className="underline text-[#04436F]">AGB</a> gläse und bim i dermit iiverschtande.
        </label>
      </div>

      {/* ✅ Note about delayed payment */}
      <p className="text-sm text-gray-600 mt-2">
        Vermerk zur Abbuchig: <strong>D'Zahlig wird ersch 24 Stund nach bestätigtem Iisatz über d’App abgebucht.</strong>
      </p>
    </div>

    {isSubmitted && (
      <p className="text-[#04436F] mt-4 font-medium">
        ✓ Registrierig erfolgrich!
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
                Registrierung abschliessen
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
    <SummaryRow label="Beginndatum" value={form.firstDate} />
    <SummaryRow label="Name" value={form.firstName} />
    <SummaryRow label="Last Name" value={form.lastName} />
    <SummaryRow label="Telefon" value={form.phone} />
    <SummaryRow label="E-Mail" value={form.email} />
    <SummaryRow label="Adresse" value={form.address} />
    <SummaryRow label="Sprachen" value={(form.languages || []).join(", ")} />
    <SummaryRow label="Haustiere" value={form.pets || "Nicht angegeben"} />
    <SummaryRow label="Gesamtsumme pro Einsatz" value={`${totalPayment.toFixed(2)} CHF`} />

  </div>
</div>

      </div>
      
    </div>
    
  );
}