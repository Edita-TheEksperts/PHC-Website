import React from 'react';
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
    const testMode = true; // ✅ set to false to re-enable payment

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
subServices: prev.subServices?.length ? prev.subServices : [data[0]?.name].filter(Boolean)
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
  services: [], // ✅ important: default to empty array
  frequency: "",
  duration: 2,
  firstDate: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  address: "",
  cardNumber: "",
  expiryDate: "",
  cvc: "",
  subServices: [], // ✅ was "" — now fixed to be an array
  schedules: [{ day: "", startTime: "08:00", hours: 2 }], // ✅ 1 day by default
});
{Array.isArray(form.schedules) && form.schedules.map((entry, i) => (
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
      cardNumber,
      expiryDate,
      cvc
    } = form;

    switch (step) {
      case 1:
        return frequency && duration >= 2 && firstDate;
      case 2:
        return firstName && lastName && email && phone && password && address;
      case 3:
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

  const HOURLY_RATE = 1;
  const totalHours = form.schedules.reduce(
    (sum, entry) => sum + (parseInt(entry.hours) || 0),
    0
  );
  const totalPayment = totalHours * HOURLY_RATE;

  // ✅ Skip Stripe if testMode is on
  if (testMode) {
    try {
      const res = await fetch("/api/client-register-api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          totalPayment,
          paymentIntentId: "TEST_MODE_NO_PAYMENT", // Dummy value
firstDate: (() => {
  const [day, month, year] = form.firstDate.split(".");
  return `${year}-${month}-${day}`; // → yyyy-mm-dd for backend
})(),
        }),
      });

      if (res.ok) {
        setIsSubmitted(true);
        router.push("/client-dashboard");
      } else {
        const err = await res.json();
        alert("Fehler bei der Registrierung: " + err.message);
      }
    } catch (err) {
      alert("Serverfehler. Bitte versuchen Sie es später erneut.");
      console.error(err);
    }
    return;
  }

  // ✅ Stripe logic for live mode
  if (!stripe || !elements) {
    alert("Stripe ist noch nicht geladen.");
    return;
  }

  try {
    const paymentIntentRes = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: totalPayment * 100 }),
    });

    const { clientSecret, id: paymentIntentId } = await paymentIntentRes.json();

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      alert("Zahlungsfehler: " + result.error.message);
      return;
    }

    if (
      result.paymentIntent.status === "requires_capture" ||
      result.paymentIntent.status === "requires_confirmation" ||
      result.paymentIntent.status === "succeeded"
    ) {
      const res = await fetch("/api/client-register-api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          totalPayment,
          paymentIntentId,
          firstDate: form.firstDate,
        }),
      });

      if (res.ok) {
        setIsSubmitted(true);
        router.push("/login");
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

const steps = testMode
  ? ["Wann?", "Finalisieren"]
  : ["Wann?", "Finalisieren", "Zahlungdetails"];
const HOURLY_RATE = 1;

const totalHours = form.schedules.reduce(
  (sum, entry) => sum + (parseFloat(entry.hours) || 0),
  0
);

// totalPayment is kept as a number, formatted when displayed
const totalPayment = totalHours * HOURLY_RATE;

const parseSwissDate = (str) => {
  const [day, month, year] = str.split('.');
  return new Date(`${year}-${month}-${day}`);
};


// Convert Date to dd.mm.yyyy string
const formatSwissDate = (date) => {
  return format(date, 'dd.MM.yyyy');

};
const tenDaysFromToday = addDays(new Date(), 14);

const [allServices, setAllServices] = useState([]);
useEffect(() => {
  const fetchAllSubServices = async () => {
    if (!form.services || form.services.length === 0) return;

    try {
      const allFetched = await Promise.all(
        form.services.map((srv) =>
          fetch(`/api/subservices?serviceName=${encodeURIComponent(srv)}`).then((res) =>
            res.ok ? res.json() : []
          )
        )
      );

      // Flatten and remove duplicates
      const allSubservices = allFetched.flat();
      const unique = Array.from(
        new Map(allSubservices.map((s) => [s.name, s])).values()
      );

      setSubServices(unique);
    } catch (err) {
      console.error("Fehler beim Laden der Subservices", err);
    }
  };

  fetchAllSubServices();
}, [form.services]);
useEffect(() => {
  const fetchAllServices = async () => {
    try {
      const res = await fetch('/api/services');
      if (!res.ok) throw new Error('Failed to fetch services');
      const data = await res.json();
      setAllServices(data);
    } catch (err) {
      console.error("Fehler beim Laden der Services", err);
    }
  };

  fetchAllServices();
}, []);
useEffect(() => {
  if (service) {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(service) ? prev.services : [...prev.services, service],
    }));
  }
}, [service]);

const timeOptions = Array.from({ length: 28 }, (_, i) => {
  const hour = Math.floor(i / 2) + 7; // from 07:00
  const minute = i % 2 === 0 ? '00' : '30';
  return `${String(hour).padStart(2, '0')}:${minute}`;
});

function TimeDropdown({ value, onChange }) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (val) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <div className="relative" style={{ width: '120px' }}>
      <div
        className="time-picker-display"
        onClick={() => setOpen(!open)}
      >
        {value || 'Select time'}
      </div>
      {open && (
        <div className="time-grid-dropdown">
          {timeOptions.map((time) => (
            <div
              key={time}
              className={`time-option ${value === time ? 'selected' : ''}`}
              onClick={() => handleSelect(time)}
            >
              {time}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
const [errors, setErrors] = useState({});

// Simple regex for email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Simple regex for phone validation (numbers only, optional +, spaces allowed)
const phoneRegex = /^[+\d\s]*$/;

const handleChange1 = (e) => {
  const { name, value } = e.target;

  // Update form value
  setForm(prev => ({ ...prev, [name]: value }));

  // Validate fields on change (optional, or use onBlur)
  if (name === "email") {
    if (!emailRegex.test(value)) {
      setErrors(prev => ({ ...prev, email: "Ungültige E-Mail-Adresse" }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.email;
        return newErrors;
      });
    }
  }

  if (name === "phone") {
    if (!phoneRegex.test(value)) {
      setErrors(prev => ({ ...prev, phone: "Telefonnummer darf nur Zahlen, + und Leerzeichen enthalten" }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    }
  }
};

  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
const [showConfirm, setShowConfirm] = useState(false);
const toggleShowPassword = () => setShowPassword(!showPassword);
const toggleShowConfirm = () => setShowConfirm(!showConfirm);

  const [passwordChecks, setPasswordChecks] = useState({
  lowercase: false,
  uppercase: false,
  number: false,
  special: false,
  minLength: false,
});

const handlePasswordChange = (e) => {
  const value = e.target.value;
  setForm({ ...form, password: value });

  setPasswordChecks({
    lowercase: /[a-z]/.test(value),
    uppercase: /[A-Z]/.test(value),
    number: /[0-9]/.test(value),
    special: /[^A-Za-z0-9]/.test(value),
    minLength: value.length >= 8,
  });
};


  const handleConfirmChange = (e) => {
    setConfirmPassword(e.target.value);
    if (form.password !== e.target.value) {
      setError("Passwörter stimmen nicht überein");
    } else {
      setError("");
    }
  };
    const EyeIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const EyeOffIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.05 10.05 0 0112 20c-7 0-11-8-11-8a18.94 18.94 0 014.24-5.31" />
      <path d="M1 1l22 22" />
      <path d="M9.88 9.88a3 3 0 014.24 4.24" />
    </svg>
  );
  
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
            <h2 className="text-2xl font-bold text-black">Ausgewählte Dienstleistungen</h2>

            <div className="flex flex-wrap gap-3">
              
  {allServices.map((srv) => {
    const isSelected = form.services.includes(srv.name);
    return (
      <button
        key={srv.id}
        type="button"
        onClick={() => {
          const updated = isSelected
            ? form.services.filter((s) => s !== srv.name)
            : [...form.services, srv.name];
          setForm((prev) => ({ ...prev, services: updated }));
        }}
        className={`px-4 py-2 border rounded-lg ${
          isSelected ? "bg-[#04436F] text-white" : "bg-white text-gray-800"
        }`}
      >
        {srv.name}
      </button>
    );
  })}
</div>

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
            schedules: prev.schedules.slice(0, Math.max(1, prev.schedules.length - 1))
          }))
        }
        className="w-8 h-8 text-xl border rounded-full"
      >
        −
      </button>
      <span className="font-semibold">{form.schedules.length || 1}</span>
      <button
        type="button"
        onClick={() =>
          setForm((prev) => ({
            ...prev,
            schedules: [
              ...prev.schedules,
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
    {form.schedules.map((entry, i) => (
      <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Weekday */}
        <select
          value={entry.day}
          onChange={(e) => {
            const updated = [...form.schedules];
            updated[i].day = e.target.value;
            setForm({ ...form, schedules: updated });
          }}
          className="border px-4 py-2 rounded-md"
        >
          <option value="">Wochentag wählen</option>
          {["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"].map((day) => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>

  {/* Start time */}
<TimeDropdown
  value={entry.startTime}
  onChange={(val) => {
    // Snap to closest 30-minutes
    if (val) {
      const [hourStr, minuteStr] = val.split(':');
      const hour = parseInt(hourStr);
      const minute = parseInt(minuteStr);

      const snappedMinute = minute < 15 ? '00' : minute < 45 ? '30' : '00';
      const nextHour = minute >= 45 ? (hour + 1) % 24 : hour;

      const fixedTime = `${String(nextHour).padStart(2, '0')}:${snappedMinute}`;

      const updated = [...form.schedules];
      updated[i].startTime = fixedTime;
      setForm({ ...form, schedules: updated });
    }
  }}
/>



        {/* Duration */}
 <div className="flex items-center gap-2">
 {(() => {
  const subServiceCount = form.subServices.length;
  const minHours = Math.min(Math.max(subServiceCount, 2), 24);
  const currentHours = form.schedules[i].hours;

  return currentHours > minHours ? (
    <button
      type="button"
      onClick={() => {
        const updated = [...form.schedules];
        const newValue = parseFloat((currentHours - 0.5).toFixed(1));
        updated[i].hours = newValue;
        setForm({ ...form, schedules: updated });
      }}
      className="w-8 h-8 border rounded-full"
    >
      −
    </button>
  ) : null;
})()}


  <span>{entry.hours} Std</span>

  {/* Plus Button */}
  <button
    type="button"
    onClick={() => {
      const updated = [...form.schedules];
      const current = updated[i].hours;
      const newValue = parseFloat((current + 0.5).toFixed(1));

      if (newValue <= 24) {
        updated[i].hours = newValue;
        setForm({ ...form, schedules: updated });
      }
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

{form.services && (
  <div className="space-y-2">
    <label className="block mb-2 font-semibold text-gray-800">Welche Extras möchten Sie?</label>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {subServices.map((sub) => {
        const isSelected = form.subServices.includes(sub.name);

        return (
          <button
            key={sub.id}
            type="button"
           onClick={() =>
  setForm((prev) => {
const currentSub = Array.isArray(prev.subServices) ? prev.subServices : [];

    const alreadySelected = currentSub.includes(sub.name);
    const updatedSub = alreadySelected
      ? currentSub.filter((name) => name !== sub.name)
      : [...currentSub, sub.name];

    // Correct logic: first 2 subservices => 2 hours, then increase by count
    const subCount = updatedSub.length;
    const hours = subCount <= 2 ? 2 : Math.min(subCount, 24);

    const updatedSchedule = prev.schedules.map((entry) => ({
      ...entry,
      hours,
    }));

    return {
      ...prev,
      subServices: updatedSub,
      schedules: updatedSchedule,
    };
  })
}

            className={`flex flex-col items-center justify-center p-4 border rounded-xl text-center space-y-2 ${
              isSelected ? "border-[#04436F] bg-[#f0f9ff]" : "border-gray-300"
            }`}
          >
            <span className="font-medium">{sub.name}</span>
            <span className="text-sm text-gray-500">
              {isSelected ? "Ausgewählt" : "Hinzufügen"}
            </span>
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
  const formatted = format(date, "dd.MM.yyyy");
  setForm({ ...form, firstDate: formatted }); // store in dd.MM.yyyy
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
    {/* Telefon */}
      <div>
        <label className="block font-semibold mb-1">Telefonnummer</label>
       <input
  name="phone"
  value={form.phone}
  placeholder="Telefonnummer"
  onChange={handleChange1}
  onKeyDown={(e) => {
    // Allow digits, +, space, backspace, arrows, delete
    if (!/[0-9+\s]/.test(e.key) && !["Backspace", "ArrowLeft", "ArrowRight", "Delete"].includes(e.key)) {
      e.preventDefault();
    }
  }}
  className={inputClass}
/>
{errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}

      </div>

      {/* E-Mail */}
      <div>
        <label className="block font-semibold mb-1">E-Mail</label>
       <input
  type="email"
  name="email"
  placeholder="E-Mail"
  value={form.email}
  onChange={handleChange1}
  className={inputClass}
/>
{errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}

      </div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
  {/* Password */}
  <div className="relative">
    <label className="block font-semibold mb-1">Passwort*</label>
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        name="password"
        placeholder="Passwort"
        value={form.password}
        onChange={handlePasswordChange}
        className="w-full rounded-md border border-gray-300 p-3 pr-10"
      />
      <button
        type="button"
        onClick={toggleShowPassword}
        className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
        aria-label="Passwort anzeigen/verstecken"
      >
        {showPassword ? EyeOffIcon : EyeIcon}
      </button>
    </div>

    {/* Password Validation List */}
<ul className="mt-3 space-y-1 text-sm">
  <li className="flex items-center gap-2">
    <span className={passwordChecks.lowercase ? "text-[#2F2F2F]" : "text-gray-300"}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    </span>
    <span className={passwordChecks.lowercase ? "text-[#2F2F2F]" : "text-gray-300"}>
      ein Kleinbuchstabe
    </span>
  </li>

  <li className="flex items-center gap-2">
    <span className={passwordChecks.uppercase ? "text-[#2F2F2F]" : "text-gray-300"}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    </span>
    <span className={passwordChecks.uppercase ? "text-[#2F2F2F]" : "text-gray-300"}>
      ein Grossbuchstabe
    </span>
  </li>

  <li className="flex items-center gap-2">
    <span className={passwordChecks.number ? "text-[#2F2F2F]" : "text-gray-300"}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    </span>
    <span className={passwordChecks.number ? "text-[#2F2F2F]" : "text-gray-300"}>
      eine Zahl
    </span>
  </li>
</ul>


  </div>

  {/* Confirm Password */}
  <div className="relative">
    <label className="block font-semibold mb-1">Passwort bestätigen*</label>
    <div className="relative">
      <input
        type={showConfirm ? "text" : "password"}
        name="confirmPassword"
        placeholder="Passwort bestätigen"
        value={confirmPassword}
        onChange={handleConfirmChange}
        className="w-full rounded-md border border-gray-300 p-3 pr-10"
      />
      <button
        type="button"
        onClick={toggleShowConfirm}
        className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
        aria-label="Passwort bestätigen anzeigen/verstecken"
      >
        {showConfirm ? EyeOffIcon : EyeIcon}
      </button>
    </div>

    {/* Confirm Password Validation */}
   <ul className="mt-3 space-y-1 text-sm">
  <li className={`flex items-center gap-2 ${passwordChecks.special ? "text-[#2F2F2F]" : "text-gray-300"}`}>
     <span className={passwordChecks.number ? "text-[#2F2F2F]" : "text-gray-300"}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    </span> Sonderzeichen
  </li>
  <li className={`flex items-center gap-2 ${passwordChecks.minLength ? "text-[#2F2F2F]" : "text-gray-300"}`}>
     <span className={passwordChecks.number ? "text-[#2F2F2F]" : "text-gray-300"}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    </span> Mindestens 8 Zeichen
  </li>
</ul>


    {/* Error Message */}
    {error && (
      <p className="text-red-600 text-sm mt-2">{error}</p>
    )}
  </div>
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


  

{step === 3 && !testMode && (
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
    <SummaryRow label="Nachname" value={form.lastName} />
    <SummaryRow label="Telefon" value={form.phone} />
    <SummaryRow label="E-Mail" value={form.email} />
    <SummaryRow label="Adresse" value={form.address} />
    <SummaryRow label="Gesamtsumme pro Einsatz" value={`${totalPayment.toFixed(2)} CHF`} />

  </div>
</div>

      </div>
      
    </div>
    
  );
}