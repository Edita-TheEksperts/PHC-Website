import React from 'react';
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { parse, addMonths, startOfMonth, format,setDate, isAfter, startOfDay, isSameMonth, isBefore } from "date-fns";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css'
import DatePicker from 'react-datepicker';
import { de } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import {  addDays } from "date-fns";
export default function RegisterPage() {
    const testMode = false; 
const { watch } = useForm();
const [formError, setFormError] = useState("");

  const router = useRouter();
const { service, subService } = router.query;
const [clientSecret, setClientSecret] = useState(null);
const selectedServices = service
  ? service.split(",").map((s) => s.trim()).filter((s) => s)
  : [];



  const [subServices, setSubServices] = useState([]);
const [step, setStep] = useState(1);

useEffect(() => {
  if (typeof window !== 'undefined') {
    const saved = parseInt(sessionStorage.getItem('step'));
    if (saved) setStep(saved);
  }
}, []);



const [isSubmitted, setIsSubmitted] = useState(false);

  const today = new Date();
  const minDate = new Date();
  minDate.setDate(today.getDate() + 10);
  const minDateStr = minDate.toISOString().split("T")[0];

const [user, setUser] = useState(null);
const { session_id } = router.query;

// Sync step with query
useEffect(() => {
  if (router.query.step) {
    setStep(Number(router.query.step)); // or keep as string if your `step` is string
  }
}, [router.query.step]);

const [userId, setUserId] = useState('');
useEffect(() => {
  if (typeof window !== 'undefined') {
    const storedUserId = sessionStorage.getItem('userId');
    if (storedUserId) setUserId(storedUserId);
  }
}, []);
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
  subServices: [], // ✅ was "" — now fixed to be an array
  schedules: [{ day: "", startTime: "08:00", hours: 2,  subServices: [] }], // ✅ 1 day by default
  arrivalConditions: [],
  hasParking: "",
  entranceLocation: "",
  mobilityAids: [],
  transportOption: "",
});
const HOURLY_RATE = 1;

const totalHours = form.schedules?.reduce(
  (sum, entry) => sum + (parseFloat(entry.hours) || 0),
  0
);

const totalPayment = totalHours * HOURLY_RATE;

useEffect(() => {
  if (step === 3 && !clientSecret && totalPayment > 0) {
    const fetchPaymentIntent = async () => {
      try {
        const res = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: totalPayment * 100 }),
        });

        const data = await res.json();
        console.log("✅ PaymentIntent received:", data); // this must contain paymentIntentId

        setClientSecret(data.clientSecret);

        setForm((prev) => ({
          ...prev,
          paymentIntentId: data.paymentIntentId, // must be pi_***
        }));
      } catch (err) {
        console.error("❌ Error getting paymentIntent:", err);
      }
    };

    fetchPaymentIntent();
  }
}, [step, clientSecret, totalPayment]);



// Load user data from Stripe session
useEffect(() => {
  if (step === 4 && session_id) {
    console.log("🔍 Step 4 triggered with session_id:", session_id);

    fetch(`/api/complete-registration?session_id=${session_id}`)
      .then((res) => {
        console.log("📡 Response from /complete-registration:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("📦 Data from complete-registration:", data);
        if (!data.userId) throw new Error("❌ No userId returned from /complete-registration");
        
        console.log("✅ userId found:", data.userId);
        return fetch(`/api/get-user-by-id?id=${data.userId}`);
      })
      .then((res) => {
        console.log("📡 Response from /get-user-by-id:", res.status);
        return res.json();
      })
      .then((userData) => {
        console.log("👤 Full user data fetched:", userData);
        setUser(userData);
        setForm(prev => ({
          ...prev,
          ...userData,
          service: userData.services?.[0]?.name || '',
          postalCode: userData.carePostalCode || userData.postalCode || ''
        }));
      })
      .catch((err) => {
        console.error("❌ Error loading user for Step 4:", err);
      });
  }
}, [step, session_id]);

useEffect(() => {
  if (user && user.services?.[0]?.name) {
    setForm(prev => ({
      ...prev,
      service: user.services[0].name,
      postalCode: user.carePostalCode || user.postalCode || ''
    }));
  }
}, [user]);



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
    "w-full px-5 py-4 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#B99B5F] placeholder-gray-500 mt-1";
const preparePayload = (form) => ({
  firstName: form.firstName,
  lastName: form.lastName,
  email: form.email,
  phone: form.phone || "",
  password: form.password,
  address: form.address || "",
  frequency: form.frequency || "",
  duration: Number(form.duration) || null,
  firstDate: form.firstDate,
  cardNumber: form.cardNumber || "",
  expiryDate: form.expiryDate || "",
  cvc: form.cvc || "",
  languages: form.languages || "",
  hasPets: form.hasPets || "Nein",
  petDetails: form.hasPets === "Ja" ? form.petDetails || "" : "",
  services: form.services || [],          // array of strings
  subServices: form.subServices || [],    // array of strings
  schedules: form.schedules || [],        // array of schedule objects
  arrivalConditions: form.arrivalConditions || [], // array
  hasParking: form.hasParking || "",
  entranceLocation: form.entranceLocation || "",
  postalCode: form.postalCode || "",
  city: form.city || "",
  street: form.street || "",
  mobilityAids: form.mobilityAids || [],
  transportOption: form.transportOption || "",
  shoppingWithClient: form.shoppingWithClient || "",
  shoppingItems: form.shoppingItems || [],
  mailboxKeyLocation: form.mailboxKeyLocation || "",
  mailboxDetails: form.mailboxDetails || "",
  additionalAccompaniment: form.additionalAccompaniment || "",
  companionship: form.companionship || "",
  cookingTogether: form.cookingTogether || "",
  biographyWork: form.biographyWork || "",
  hasTech: form.hasTech || "",
  reading: form.reading || "",
  cardGames: form.cardGames || "",
  hasAllergies: form.hasAllergies || "",
  allergyDetails: form.allergyDetails || "",
  trips: form.trips || [],
  height: Number(form.height) || null,
  weight: Number(form.weight) || null,
  careTools: form.careTools || [],
  careToolsOther: form.careToolsOther || "",
  incontinence: form.incontinence || [],
  vision: form.vision || "",
  hearing: form.hearing || "",
  speaking: form.speaking || "",
  nutritionSupport: form.nutritionSupport || [],
  basicCare: form.basicCare || [],
  basicCareOther: form.basicCareOther || "",
  healthPromotion: form.healthPromotion || [],
  healthPromotionOther: form.healthPromotionOther || "",
  mentalSupportNeeded: form.mentalSupportNeeded || "",
  diagnoses: form.diagnoses || [],
  behaviorTraits: form.behaviorTraits || [],
  healthFindings: form.healthFindings || "",
  roomCount: Number(form.roomCount) || null,
  householdSize: Number(form.householdSize) || null,
  paymentIntentId: form.paymentIntentId || "",  // make sure this is set
});
  const validateStep = () => {
  if (step === 1) {
    if (!form.frequency) {
  setFormError("Bitte wählen Sie die Häufigkeit der Unterstützung.");
      return false;
    }
    if (!form.firstDate) {
      setFormError("Bitte wählen Sie ein Beginndatum.");
      return false;
    }
    if (!form.services || form.services.length === 0) {
      setFormError("Bitte wählen Sie mindestens eine Dienstleistung.");
      return false;
    }
   const hasAnySubService = form.schedules.some(
  (entry) => Array.isArray(entry.subServices) && entry.subServices.length > 0
);

if (!hasAnySubService) {
  setFormError("Bitte wählen Sie mindestens eine Zusatzleistung für mindestens einen Tag.");
  return false;
}

  }

  if (step === 2) {
    if (!form.firstName) {
      setFormError("Bitte geben Sie den Vornamen ein.");
      return false;
    }
    if (!form.lastName) {
      setFormError("Bitte geben Sie den Nachnamen ein.");
      return false;
    }
    if (!form.email) {
      setFormError("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      return false;
    }
    if (!form.phone) {
      setFormError("Bitte geben Sie eine gültige Telefonnummer ein.");
      return false;
    }
    if (!form.password) {
      setFormError("Bitte geben Sie ein Passwort ein.");
      return false;
    }
    if (!form.address) {
      setFormError("Bitte geben Sie die Adresse ein.");
      return false;
    }
  }

if (step === 3 && !testMode) {
if (!testMode) {
  // remove CardElement check completely
}

}


  if (step === 4 || (testMode && step === 3)) {
    if (!form.transportOption) {
      setFormError("Bitte wählen Sie eine Transportoption.");
      return false;
    }
  }

  return true;
};


  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

const handleNext = async () => {
  setFormError(""); 

  if (!validateStep()) return;

  if (step === 2) {
    setStep(3);
    return;
  }

  if (step === 3 && !testMode) {
    await handleSubmit({ preventDefault: () => {} }); 
    return;
  }

  if (step === 3 && testMode) {
    setStep(4);
    return;
  }

  setStep((prev) => prev + 1);
};


useEffect(() => {
  const stepParam = new URLSearchParams(window.location.search).get('step');
  if (stepParam) {
    setStep(Number(stepParam));
  }
}, []);

const stripe = useStripe();
const elements = useElements();

function generateScheduleDates({ firstDateStr, schedules, repeat = 6 }) {
  const weekdays = {
    Montag: 1,
    Dienstag: 2,
    Mittwoch: 3,
    Donnerstag: 4,
    Freitag: 5,
    Samstag: 6,
    Sonntag: 0,
  };

  const firstDate = parse(firstDateStr, "dd.MM.yyyy", new Date());
  const result = [];

  for (const { day, startTime, hours } of schedules) {
    if (!day) continue;

    let date = new Date(firstDate);
    while (date.getDay() !== weekdays[day]) {
      date = addDays(date, 1);
    }

    for (let i = 0; i < repeat; i++) {
      result.push({
        date: format(addDays(date, i * 7), "yyyy-MM-dd"),
        day,
        startTime,
        hours,
      });
    }
  }

  return result;
}
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!stripe || !elements) {
    alert("❌ Stripe ist nicht bereit");
    return;
  }

  const cardElement = elements.getElement(CardElement);
  if (!cardElement) {
    alert("❌ Kartenfeld fehlt");
    return;
  }

  // 🔐 Get or reuse existing clientSecret for PaymentIntent
  let secret = clientSecret;
  if (!secret) {
    try {
      const intentRes = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPayment * 100 }),
      });

      const data = await intentRes.json();

      if (!data.clientSecret) {
        alert("❌ clientSecret fehlt. Zahlung kann nicht durchgeführt werden.");
        return;
      }

      secret = data.clientSecret;
    } catch (err) {
      console.error("❌ Fehler beim Erstellen von PaymentIntent:", err);
      alert("Fehler beim Erstellen der Zahlungsanfrage.");
      return;
    }
  }

  try {
    const { paymentIntent, error } = await stripe.confirmCardPayment(secret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: form.billingName || `${form.firstName} ${form.lastName}`,
          email: form.billingEmail || form.email,
        },
      },
    });

    if (error) {
      alert("❌ Fehler bei der Karte: " + error.message);
      return;
    }

    const paymentMethodId = paymentIntent.payment_method;
    console.log("✅ Zahlung erfolgreich. PaymentMethod ID:", paymentMethodId);

    let generatedSchedules = [];

if (form.frequency === "monatlich") {
  if (form.monthlyMode === "pattern") {
    generatedSchedules = generateMonthlyDates({
      startDate: form.firstDate,
      weekIndex: form.monthlyWeekIndex,
      dayName: form.monthlyDay,
      startTime: "08:00",
      hours: 2,
      count: 6,
    });
  } else if (form.monthlyMode === "date") {
    generatedSchedules = generateFixedDayDates({
      startDate: form.firstDate,
      fixedDay: Number(form.fixedDayOfMonth),
      startTime: "08:00",
      hours: 2,
      count: 6,
    });
  }
} else {
  generatedSchedules = generateScheduleDates({
    firstDateStr: form.firstDate,
    schedules: form.schedules,
    repeat: 6,
  });
}

const collectedSubservices = Array.from(
  new Set(
    (form.schedules || []).flatMap((entry) => entry.subServices || [])
  )
);

// Final payload
const payload = {
  ...form,
  subServices: collectedSubservices,
  schedules: generatedSchedules,
};


    // 📬 Finish registration
    const res = await fetch("/api/client-register-api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        paymentIntentId: form.paymentIntentId || "", // important!
          subServices: collectedSubservices, // ✅ this fixes the issue

        schedules: generatedSchedules,
        firstDate: form.firstDate,
      }),
    });

    const data = await res.json();

    // After registration success
if (res.ok && data.userId) {
  const userId = data.userId;

  // ✅ Create SetupIntent
  const setupRes = await fetch("/api/create-setup-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: form.email }), // or userId if needed
  });

  const { clientSecret, customerId } = await setupRes.json();

  const setupResult = await stripe.confirmCardSetup(clientSecret, {
    payment_method: {
      card: elements.getElement(CardElement),
      billing_details: {
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
      },
    },
  });
if (!setupResult.error) {
  const paymentMethodId = setupResult.setupIntent.payment_method;

  await fetch("/api/save-payment-method", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      stripeCustomerId: customerId,
      stripePaymentMethodId: paymentMethodId,
    }),
  });

  // ✅ GO TO STEP 4 after everything is successful
  setUserId(userId);
  setIsSubmitted(true);
  setStep(4);
} else {
  alert("❌ Fehler beim Speichern der Karte: " + setupResult.error.message);
}

}


  } catch (err) {
    console.error("❌ Stripe error:", err);
    alert("Zahlungsfehler aufgetreten");
  }
};


const handleOptionalSubmit = async () => {
  if (!userId) {
    alert("❌ userId fehlt – Registrierung nicht abgeschlossen");
    return;
  }

  // ✅ Create a shallow copy to avoid mutating original form
  const optionalData = { ...form };

  // ✅ Convert only if in DD.MM.YYYY format
  if (optionalData.firstDate && typeof optionalData.firstDate === "string" && optionalData.firstDate.includes(".")) {
    const [day, month, year] = optionalData.firstDate.split(".");
    if (day && month && year) {
      const fixedDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
      if (!isNaN(fixedDate.getTime())) {
        optionalData.firstDate = fixedDate.toISOString();
      } else {
        console.warn("❌ Ungültiges Datum:", optionalData.firstDate);
      }
    }
  }

  try {
    const res = await fetch("/api/save-optional-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        optionalData, // ✅ this one is formatted safely
      }),
    });

    const result = await res.json();

if (res.ok) {
  console.log("✅ Optional data saved");
  router.push("/login");
    } else {
      alert("❌ Fehler beim Speichern: " + result.error);
    }
  } catch (err) {
    console.error("❌ Fehler im Submit:", err);
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
  ? ["Wann?", "Finalisieren" ,"Abschluss"]
  : ["Wann?", "Finalisieren", "Zahlungdetails" ,"Abschluss"];


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

      const allSubservices = allFetched.flat();
      const unique = Array.from(
        new Map(allSubservices.map((s) => [s.name, s])).values()
      );

      setSubServices(unique);

      // Only update form if it's empty
      setForm((prev) => ({
        ...prev,
        subServices: prev.subServices?.length ? prev.subServices : [unique[0]?.name].filter(Boolean),
      }));
    } catch (err) {
      console.error("Fehler beim Laden der Subservices", err);
    }
  };

  fetchAllSubServices();
}, [form.services]);
useEffect(() => {
  if (service) {
    const selected = service
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    setForm((prev) => ({
      ...prev,
      services: selected, // ← ONLY use the clean list
    }));
  }
}, [service]);


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
    const selected = service
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    setForm((prev) => ({
      ...prev,
      services: selected, // ← ✅ THIS IS CORRECT
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

  const toggleCheckbox = (fieldName, value) => {
  const updated = new Set(form[fieldName] || []);
  updated.has(value) ? updated.delete(value) : updated.add(value);
  setForm((prev) => ({
    ...prev,
    [fieldName]: Array.from(updated),
  }));
};
const isEinmalig = form.frequency === "einmalig";

  const showTravelNotice = form.subServices?.includes("Ausflüge und Reisebegleitung");
function generateMonthlyDates({ startDate, weekIndex, dayName, count = 6, startTime = "08:00", hours = 2 }) {
  const weekdays = {
    Sonntag: 0,
    Montag: 1,
    Dienstag: 2,
    Mittwoch: 3,
    Donnerstag: 4,
    Freitag: 5,
    Samstag: 6,
  };

  const results = [];
  const baseDate = typeof startDate === "string" ? parse(startDate, "dd.MM.yyyy", new Date()) : startDate;

  for (let i = 0; i < count; i++) {
    const monthDate = addMonths(baseDate, i);
    const firstOfMonth = startOfMonth(monthDate);
    const targetDay = weekdays[dayName];

    let countDay = 0;
    let date = new Date(firstOfMonth);

    while (date.getMonth() === monthDate.getMonth()) {
      if (date.getDay() === targetDay) {
        countDay++;
        const isTargetWeek =
          (weekIndex === "last" && addMonths(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7), 0).getMonth() !== date.getMonth()) ||
          countDay === parseInt(weekIndex);

        if (isTargetWeek) {
          results.push({
            date: format(date, "yyyy-MM-dd"),
            day: dayName,
            startTime,
            hours,
          });
          break;
        }
      }
      date.setDate(date.getDate() + 1);
    }
  }

  return results;
}
function generateFixedDayDates({ startDate, fixedDay, startTime, hours, count }) {
  const start = parse(startDate, "dd.MM.yyyy", new Date());
  const results = [];

  for (let i = 0; i < count; i++) {
    const dateObj = setDate(addMonths(start, i), fixedDay);

    results.push({
      date: format(dateObj, "yyyy-MM-dd"),
      day: format(dateObj, "EEEE", { locale: de }), // e.g. "Montag"
      startTime: startTime,
      hours: hours,
    });
  }

  return results;
}


useEffect(() => {
  if (
    form.frequency === "monatlich" &&
    form.monthlyMode === "date" &&
    form.fixedDayOfMonth
  ) {
    const today = startOfDay(new Date());
    const minAllowedDate = addDays(today, 14); // +14 days
    const dayOfMonth = Number(form.fixedDayOfMonth);

    let candidateMonth = new Date();
    let candidateDate = setDate(candidateMonth, dayOfMonth);

    // Keep moving to next month until we’re 14+ days in the future
    while (isBefore(candidateDate, minAllowedDate)) {
      candidateMonth = addMonths(candidateMonth, 1);
      candidateDate = setDate(candidateMonth, dayOfMonth);
    }

    const formatted = format(candidateDate, "dd.MM.yyyy");

    // Set or overwrite only if it's auto-generated
    if (form.autoGeneratedDate || !form.firstDate) {
      setForm((prev) => ({
        ...prev,
        firstDate: formatted,
        autoGeneratedDate: true,
      }));
    }
  }
}, [form.fixedDayOfMonth, form.frequency, form.monthlyMode]);

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
useEffect(() => {
  scrollToTop();
}, [step]);


return (
    <div className="min-h-screen bg-white p-6 md:p-12 flex flex-col md:flex-row gap-8">
      <div className="flex-1 space-y-8">
<div className="flex flex-wrap gap-y-4 justify-center md:justify-between text-sm md:text-base font-medium text-[#B99B5F]">
          {steps.map((label, i) => (
            <div key={i} className="flex-1 flex items-center gap-2">
              <div
                className={`w-7 h-7 flex items-center justify-center rounded-full border-2 ${
                  step > i
                    ? "bg-[#B99B5F] text-white"
                    : "border-[#B99B5F] text-[#B99B5F]"
                } text-sm font-bold`}
              >
                {i + 1}
              </div>
              <span className={step === i + 1 ? "font-bold" : ""}>{label}</span>
              {i < steps.length - 1 && <div className="flex-1 h-px bg-gray-300 mx-2"></div>}
            </div>
          ))}
        </div>
{formError && (
  <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded relative">
    {formError}
  </div>
)}

        <form
          onSubmit={handleSubmit}
          className="bg-white  p-2 lg:p-8 rounded-xl border-2 border-gray-200 space-y-8 text-base text-gray-800"
        >
          {step === 1 && (
            <>
            <h2 className="text-2xl font-bold text-black">Ausgewählte Dienstleistungen</h2>

            <div className="flex flex-wrap gap-3">
              
  {allServices.map((srv) => {
 const isSelected = (form.services || []).includes(srv.name);    
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
          isSelected ? "bg-[#B99B5F] text-white" : "bg-white text-gray-800"
        }`}
      >
        {srv.name}
      </button>
    );
  })}
</div>
              <h2 className="text-2xl font-bold text-black">Wie oft & wann?</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="font-medium">Wie oft wünschen Sie Unterstützung?</p>
                  <div className="flex flex-wrap gap-4">
                    {["einmalig", "wöchentlich", "alle 2 Wochen", "monatlich"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setForm({ ...form, frequency: option })}
                        className={`px-4 py-3 rounded-lg border text-center w-[140px] ${
                          form.frequency === option
                            ? "border-[#B99B5F] text-[#B99B5F] font-semibold"
                            : "border-gray-300 text-gray-800"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

            {form.frequency === "monatlich" && (
  <div className="space-y-4 bg-white p-5 rounded-xl shadow-sm border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900">Monatlicher Termin wählen</h3>

    {/* Auswahlart */}
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium text-gray-700">Art der Auswahl</label>
      <select
        value={form.monthlyMode || ""}
        onChange={(e) => setForm({ ...form, monthlyMode: e.target.value })}
        className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#B99B5F]"
      >
        <option value="">Bitte wählen</option>
        <option value="pattern">Woche + Wochentag</option>
        <option value="date">Fester Kalendertag</option>
      </select>
    </div>

    {/* Option 1: Week + Weekday */}
    {form.monthlyMode === "pattern" && (
      <>
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700">Woche im Monat</label>
          <select
            value={form.monthlyWeekIndex || ""}
            onChange={(e) => setForm({ ...form, monthlyWeekIndex: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#B99B5F]"
          >
            <option value="">Woche wählen</option>
            <option value="1">Erste</option>
            <option value="2">Zweite</option>
            <option value="3">Dritte</option>
            <option value="4">Vierte</option>
            <option value="last">Letzte</option>
          </select>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700">Wochentag</label>
          <select
            value={form.monthlyDay || ""}
            onChange={(e) => setForm({ ...form, monthlyDay: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#B99B5F]"
          >
            <option value="">Wochentag wählen</option>
            {["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"].map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
      </>
    )}

    {/* Option 2: Fixed Calendar Date */}
    {form.monthlyMode === "date" && (
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-700">Kalendertag im Monat</label>
     <select
  value={form.fixedDayOfMonth || ""}
  onChange={(e) =>
    setForm({ ...form, fixedDayOfMonth: e.target.value })
  }
  className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#B99B5F]"
>
  <option value="">Tag wählen</option>
  {Array.from({ length: 31 }, (_, i) => (
    <option key={i + 1} value={i + 1}>
      {i + 1}
    </option>
  ))}
</select>
<p className="text-xs text-gray-500 mt-1">
  Der ausgewählte Tag wird jeden Monat wiederholt (z. B. jeder 15.)
</p>

      </div>
    )}
  </div>
)}


                {form.frequency !== "Einmal" && (
  <div className="space-y-4">
    <p className="font-medium">Wann genau wünschen Sie Unterstützung?</p>

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
  onClick={() => {
    if (isEinmalig) return; // 🚫 block adding if "einmalig"
    setForm((prev) => ({
      ...prev,
      schedules: [
        ...prev.schedules,
        { day: "", startTime: "08:00", hours: 2 }
      ].slice(0, 7), // max 7 days
    }));
  }}
  disabled={isEinmalig}
  className={`w-8 h-8 text-xl border rounded-full ${
    isEinmalig ? "opacity-50 cursor-not-allowed" : ""
  }`}
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
  {/* Minus Button – always rendered, just disabled when needed */}
  <button
    type="button"
    onClick={() => {
      const subServiceCount = form.subServices.length;
      const minHours = Math.min(Math.max(subServiceCount, 2), 24);
      const currentHours = form.schedules[i].hours;

      if (currentHours <= minHours) return;

      const updated = [...form.schedules];
      const newValue = parseFloat((currentHours - 0.5).toFixed(1));
      updated[i].hours = newValue;
      setForm({ ...form, schedules: updated });
    }}
    disabled={form.schedules[i].hours <= Math.min(Math.max(form.subServices.length, 2), 24)}
    className={`w-8 h-8 border rounded-full text-xl flex items-center justify-center ${
      form.schedules[i].hours <= Math.min(Math.max(form.subServices.length, 2), 24)
        ? "opacity-50 cursor-not-allowed"
        : ""
    }`}
  >
    −
  </button>

  {/* Display hours */}
  <span className="inline-block w-[60px] text-center">
    {form.schedules[i].hours} Std
  </span>

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
    className="w-8 h-8 border rounded-full text-xl flex items-center justify-center"
  >
    +
  </button>
</div>

{/* Subservices for this day */}
<div className="col-span-4 mt-2 mb-4">
  <label className="block mb-2 font-medium">
    Zusatzleistungen für {entry.day || `Tag ${i + 1}`}
  </label>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {form.schedules[i]?.subServices?.includes("Ausflüge und Reisebegleitung") && (
  <div className="mt-4 col-span-full p-4 border-l-4 border-[#B99B5F] bg-[#FFF8EA] rounded">
    <p className="text-gray-800 mb-2 font-semibold">
      Für <span className="text-[#B99B5F]">„Ausflüge und Reisebegleitung“</span> bitten wir Sie, uns direkt zu kontaktieren.
    </p>
    <a
      href="/contact"
      className="text-[#04436F] underline font-medium hover:text-[#033552]"
    >
      Zum Kontaktformular
    </a>
  </div>
)}

    {subServices.map((sub) => {
      
      const isSelected = entry.subServices?.includes(sub.name);

      return (
        <button
          key={sub.id}
          type="button"
          onClick={() => {
            const updated = [...form.schedules];
            const current = updated[i].subServices || [];

            updated[i].subServices = isSelected
              ? current.filter((s) => s !== sub.name)
              : [...current, sub.name];

            // Optional: auto-update hours based on subservices
            const count = updated[i].subServices.length;
            updated[i].hours = count <= 2 ? 2 : Math.min(count, 24);

            setForm({ ...form, schedules: updated });
          }}
          className={`flex flex-col items-center justify-center p-4 border rounded-xl text-center space-y-2 ${
            isSelected ? "border-[#B99B5F] bg-[#f0f9ff]" : "border-gray-300"
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


      </div>
    ))}
  </div>
)}




              <div>
  <label className="block mb-2 font-medium">Beginndatum auswählen</label>
<DatePicker
  selected={form.firstDate ? parseSwissDate(form.firstDate) : null}
onChange={(date) => {
  if (!date) {
    setForm({ ...form, firstDate: "" }); // Clear the date in the form
  } else {
    const formatted = format(date, "dd.MM.yyyy");
    setForm({ ...form, firstDate: formatted });
  }
}}



  dateFormat="dd.MM.yyyy"
  locale={de}
  placeholderText="TT.MM.JJJJ"
  minDate={tenDaysFromToday} 
  className="w-full px-5 py-4 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#B99B5F]"
  calendarClassName="rounded-xl shadow-lg border border-gray-300"
  wrapperClassName="w-full"
    disabled={form.frequency === "monatlich" && form.monthlyMode === "date"} // 👈 disables only when auto-date set

/>

</div>

              </div>
            </>
          )}

         {step === 2 && (
  <>
    <h2 className="text-2xl font-bold text-black">Persönliche Angaben</h2>

    <div className="text-sm text-left mt-6">
      <p>
        Bereits registriert?{" "}
        <span
          className="text-[#B99B5F] font-semibold cursor-pointer underline"
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
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
<div className="mb-2">
  <label className="block font-medium mb-1">
    Vorname
  </label>
  <input
    name="firstName"
    placeholder="Vorname"
    value={form.firstName || ""}
    onChange={handleChange}
    className={inputClass}
  />
</div>

       <div className="mb-2">
  <label className="block font-medium mb-1">
    Nachname
  </label>
  <input
    name="lastName"
    placeholder="Nachname"
    value={form.lastName || ""}
    onChange={handleChange}
    className={inputClass}
  />
</div>

  </div>
</div>
    {/* Telefon */}
      <div>
          <label className="block  font-medium mb-1">
Telefonnummer</label>
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
          <label className="block font-medium mb-1">
E-Mail</label>
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
      <label className="block font-medium mb-1">
Passwort*</label>
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
      <label className="block font-medium mb-1">
Passwort bestätigen*</label>
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
            <label className="block font-medium mb-1">Strasse</label>
            <input
              name="street"
              placeholder="z. B. Bahnhofstrasse"
              value={form.street || ""}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Hausnummer</label>
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
            <label className="block font-medium mb-1">PLZ</label>
            <input
              name="postalCode"
                      placeholder="z. B. 8000"

              value={form.postalCode || ""}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Ort</label>
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
          <label className="block font-medium mb-1">Land</label>
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
    <h2 className="text-xl font-bold mb-4">Zahlungsdetails</h2>

  <div className="p-4 border border-gray-300 rounded-md shadow-sm bg-white">
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#32325d',
              '::placeholder': { color: '#a0aec0' },
            },
            invalid: { color: '#fa755a' },
          },
        }}
      />
    </div>
<p className="mt-2 text-sm text-gray-500">
    Alle Zahlungen werden sicher verarbeitet.
  </p>

  <div className=" flex items-center">
    <input
      type="checkbox"
      id="agb"
      className="mr-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
    />
<label htmlFor="agb" className="text-sm text-gray-700">
  Ich akzeptiere die{" "}
  <a
    href="/AGB"
    className="text-blue-600 underline"
    target="_blank"
    rel="noopener noreferrer"
  >
    AGB
  </a>.
</label>

  </div>
  <button
  className=" hidden bg-[#B99B5F] text-white px-4 py-2 rounded"
  onClick={handleSubmit}
  disabled={!form.paymentIntentId} // ← This prevents early submission
>
  Jetzt bezahlen
</button>
  </>
)}




{(testMode ? step === 3 : step === 4) && (
  <>

    <div className="space-y-8 mt-6">
    <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm">
  <h3 className="font-bold text-[20px] mb-6">Persönliche Angaben (Zusammenfassung)</h3>

  {/* Anfragende Person */}
  <div className="mb-8">
    <h4 className="font-[600] text-[16px] mb-4">Anfragende Person</h4>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* First row: Vorname and Nachname */}
  <div className="mb-2">
    <label className="block font-medium mb-1">Vorname</label>
    <input
      name="firstName"
      placeholder="Vorname"
      onChange={handleChange}
      className={inputClass}
    />
  </div>

  <div className="mb-2">
    <label className="block font-medium mb-1">Nachname</label>
    <input
      name="lastName"
      placeholder="Nachname"
      onChange={handleChange}
      className={inputClass}
    />
  </div>

  {/* Second row: Telefonnummer and Email */}
  <div className="mb-2">
    <label className="block font-medium mb-1">Telefonnummer</label>
    <input
      name="phone"
      placeholder="Telefonnummer"
      onChange={handleChange}
      className={inputClass}
    />
  </div>

  <div className="mb-2">
    <label className="block font-medium mb-1">Email</label>
    <input
      name="email"
      placeholder="Email"
      onChange={handleChange}
      className={inputClass}
    />
  </div>
</div>


  </div>

  {/* Einsatzort */}
  <div>
<h4 className="font-[600] text-[16px] ">Einsatzort</h4>
<p className="text-[14px] font-semibold mb-4">zu betreuende Person</p>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
      <div className="mb-2">
       <label className="block font-medium mb-1">
    Vorname
  </label>
      <input
        name="firstName"
        placeholder="Vorname"
        defaultValue ={form.firstName || ""}
        onChange={handleChange}
        className={inputClass}
      />
      </div>
            <div className="mb-2">
 <label className="block font-medium mb-1">
    Nachname
  </label>
      <input
        name="lastName"
        placeholder="Nachname"
        value={form.lastName || ""}
        onChange={handleChange}
        className={inputClass}
      />
      </div>
      <div className="mb-2">
         <label className="block font-medium mb-1">
Telefonnummer  </label>
      <input
        name="phone"
        placeholder="Telefonnummer"
        value={form.phone || ""}
        onChange={handleChange}
        className={inputClass}
      />
      </div>
            <div className="mb-2">
               <label className="block font-medium mb-1">Email</label>
    <input
      name="email"
      placeholder="Email"
      value={form.email || ""}
      onChange={handleChange}
      className={inputClass}
    />
</div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
 <div className="mb-2">
  <label className="block font-medium mb-1">
    Adresse & Hausnummer
  </label>
  <input
    name="street"
    placeholder="Adresse & Hausnummer"
    onChange={handleChange}
value={form.address ||''}    className={inputClass}
  />
</div>

   <div className="mb-2">
  <label className="block font-medium mb-1">
    Stockwerk / Eingangscode
  </label>
  <input
    name="entranceLocation"
    placeholder="Stockwerk / Eingangscode"
    onChange={handleChange}

    className={inputClass}
  />
</div>

     <div className="mb-2">
  <label className="block font-medium mb-1">
    PLZ
  </label>
  <input
    type="number"
    name="postalCode"
    placeholder="PLZ"
                value={form.postalCode || ""}

    onChange={handleChange}
    className={inputClass}
  />
</div>

   <div className="mb-2">
  <label className="block font-medium mb-1">
    Ort
  </label>
  <input
    name="city"
    placeholder="Ort"
    value={form.city || ""}
    onChange={handleChange}
    className={inputClass}
  />
</div>

    </div>

    {/* Ankunftsbedingungen */}
   <div className="mb-6">
  <p className="font-[600] text-[16px] mb-1">Ankunftsbedingungen</p>

  <div className="flex flex-wrap items-center gap-6">
    {["Schlüssel ist hinterlegt", "Es ist jemand zu Hause"].map((option) => (
      <label
        key={option}
        className="inline-flex items-center gap-2 text-sm text-gray-800"
      >
        <input
          type="checkbox"
          className="w-5 h-5 accent-[#B99B5F]"
          checked={form.arrivalConditions?.includes(option)}
          onChange={() => toggleCheckbox("arrivalConditions", option)}
        />
        <span>{option}</span>
      </label>
    ))}
  </div>

  {form.arrivalConditions?.includes("Schlüssel ist hinterlegt") && (
    <div className="mt-4">
      <label className="block text-sm font-medium mb-1">
        Wo ist der Schlüssel hinterlegt?
      </label>
      <input
        name="keyLocation"
        placeholder="z. B. unter der Fussmatte, beim Nachbarn..."
        onChange={handleChange}
        className={inputClass}
      />
    </div>
  )}

  {form.arrivalConditions?.length === 0 && (
    <p className="text-red-600 text-sm mt-2">
      Bitte wählen Sie mindestens eine Option aus: Schlüssel oder jemand ist zu Hause.
    </p>
  )}
</div>


    {/* Parkplatz vorhanden */}
   <div className="mb-4">
  <label className="block font-[600] mb-1">Parkplatz vorhanden?</label>
  <select
    name="hasParking"
    value={form.hasParking || ""}
    onChange={handleChange}
    className={inputClass}
  >
    <option value="">Bitte auswählen</option>
    <option value="Ja">Ja</option>
    <option value="Nein">Nein</option>
  </select>
</div>

{form.hasParking === "Ja" && (
  <>
   
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">
        Ort (Parkplatz)
      </label>
      <input
        name="parkingLocation"
        placeholder="Ort (Parkplatz)"
        onChange={handleChange}
        className={inputClass}
      />
    </div>
  </>
)}


    {/* Wo befindet sich der Eingang */}
    <div>
           <div className="mb-2">
  <label className="block font-medium mb-1">
    Wo befindet sich der Eingang?
  </label>
  <input
    name="entranceDescription"
    placeholder="Wo befindet sich der Eingang?"
    onChange={handleChange}
    className={inputClass}
  />
</div>
    </div>


      <div className="mt-3">
  <label className="block font-medium mb-1">
    Zusätzliche Informationen hinzufügen
  </label>
  <textarea
    name="additionalNotes"
    placeholder="Gibt es etwas, das wir wissen sollten? (z. B. besondere Wünsche, Hinweise etc.)"
    onChange={handleChange}
    className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#B99B5F]"
    rows={4}
  />
</div>

  </div>
</div>


<div className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm">
  {/* Main Section Title */}
  <h2 className="font-bold text-[20px] mb-6"> Alltagsbegleitung & Besorgungen</h2>

  {/* 🔹 Mobilität */}
  <h3 className="font-[600] text-[16px] mb-4">Mobilität</h3>

  {/* Verfügbare Hilfsmittel */}
  <div className="mb-4">
    <p className="font-medium mb-2">Verfügbare Hilfsmittel</p>
    <div className="flex flex-wrap gap-6">
      {["Rollstuhl", "Rollator", "Gehstock"].map((aid) => (
        <label key={aid} className="inline-flex items-center gap-2 text-sm text-gray-800">
          <input
            type="checkbox"
            className="w-5 h-5 accent-[#B99B5F] border border-gray-300 rounded"
            checked={form.mobilityAids?.includes(aid)}
            onChange={() => toggleCheckbox("mobilityAids", aid)}
          />
          <span>{aid}</span>
        </label>
      ))}
    </div>
  </div>

  {/* Transportmittel Auswahl */}
  <div className="mb-6">
    <label className="block font-medium mb-2">Transportmittel</label>
    <select
      name="transportOption"
      value={form.transportOption || ""}
      onChange={handleChange}
      className="bg-white border border-gray-300 rounded-md p-3 w-full"
    >
      <option value="">Bitte wählen</option>
      <option value="Eigenes Auto">Eigenes Auto</option>
      <option value="Fahrzeug durch Mitarbeitende">Fahrzeug durch Mitarbeitende (CHF 1.--/km)</option>
      <option value="Öffentliche Verkehrsmittel">Öffentliche Verkehrsmittel (Kosten übernimmt Kunde)</option>
      <option value="Taxi">Taxi</option>
    </select>
  </div>

  {/* 🔹 Begleitung zu Terminen */}
  <h3 className="font-medium mb-1">Begleitung zu Terminen</h3>

  {/* Checkboxen + Sonstiges */}
  <div className="mb-6">
    <div className="flex flex-wrap gap-6">
      {["Arzt", "Physiotherapie", "Behördengänge"].map((term) => (
        <label key={term} className="inline-flex items-center gap-2 text-sm text-gray-800">
          <input
            type="checkbox"
            className="w-5 h-5 accent-[#B99B5F] border border-gray-300 rounded"
            checked={form.accompanimentAppointments?.includes(term)}
            onChange={() => {
              const updated = new Set(form.accompanimentAppointments || []);
              updated.has(term) ? updated.delete(term) : updated.add(term);
              setForm((prev) => ({ ...prev, accompanimentAppointments: Array.from(updated) }));
            }}
          />
          <span>{term}</span>
        </label>
      ))}
    </div>

    {/* Textfield für Sonstiges */}
    <div className="mt-4">
      <input
        name="accompanimentOther"
        placeholder="Sonstiges"
        value={form.accompanimentOther || ""}
        onChange={handleChange}
        className="bg-white border border-gray-300 rounded-md p-3 w-full"
      />
    </div>
  </div>

  {/* 🔹 Einkäufe */}
  <h3 className="font-[600] text-[16px] mb-4">Einkäufe</h3>

  {/* Begleitung durch Kunde */}
  <div className="mb-4">
    <label className="block font-medium mb-1">Begleitung durch Kunde?</label>
    <select
      name="shoppingWithClient"
      value={form.shoppingWithClient || ""}
      onChange={handleChange}
      className="bg-white border border-gray-300 rounded-md p-3 w-full"
    >
      <option value="">Bitte auswählen</option>
      <option value="Ja">Ja</option>
      <option value="Nein">Nein</option>
    </select>
  </div>

  {/* Art der Einkäufe */}
  <div className="mb-6">
    <p className="font-medium mb-1">Art der Einkäufe</p>
    <div className="flex flex-wrap gap-6">
      {["Lebensmittel", "Apotheke", "Garten", "Kleidung"].map((item) => (
        <label key={item} className="inline-flex items-center gap-2 text-sm text-gray-800">
          <input
            type="checkbox"
            className="w-5 h-5 accent-[#B99B5F] border border-gray-300 rounded"
            checked={form.shoppingItems?.includes(item)}
            onChange={() => {
              const updated = new Set(form.shoppingItems || []);
              updated.has(item) ? updated.delete(item) : updated.add(item);
              setForm((prev) => ({ ...prev, shoppingItems: Array.from(updated) }));
            }}
          />
          <span>{item}</span>
        </label>
      ))}
    </div>
  </div>

  {/* 🔹 Postgänge */}
  <h3 className="font-medium mb-1">Postgänge</h3>

  <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
    <input
      name="mailboxKeyLocation"
      placeholder="Wo ist der Briefkastenschlüssel?"
      value={form.mailboxKeyLocation || ""}
      onChange={handleChange}
      className="bg-white border border-gray-300 rounded-md p-3 w-full"
    />
    <input
      name="mailboxDetails"
      placeholder="Welches Postfach?"
      value={form.mailboxDetails || ""}
      onChange={handleChange}
      className="bg-white border border-gray-300 rounded-md p-3 w-full"
    />
  </div>

  {/* 🔹 Weitere Begleitungen */}
  <h3 className="font-medium mb-1">Weitere Begleitungen</h3>

  <div>
    <textarea
      name="additionalAccompaniment"
      value={form.additionalAccompaniment || ""}
      onChange={handleChange}
      placeholder="Details hier eintragen"
      className="bg-white border border-gray-300 rounded-md p-3 w-full"
    />
  </div>
</div>

      {/* Freizeit & soziale Aktivitäten */}
     <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm mt-8">
  {/* Main Section Title */}
  <h2 className="font-bold text-[20px] mb-6"> Freizeit & soziale Aktivitäten</h2>

  {/* 🔹 Aktivitäten */}
  <h3 className="font-[600] text-[16px] mb-4">Aktivitäten</h3>

  <div className="space-y-6">
    {[
      ["Gesellschaft leisten", "companionship"],
      ["Gemeinsames Kochen", "cookingTogether"],
      ["Allergien?", "hasAllergies"],
      ["Biografiearbeit", "biographyWork"],
      ["Technische Mittel vorhanden?", "hasTech"],
      ["Vorlesen", "reading"],
      ["Kartenspiele", "cardGames"]
    ].map(([label, name]) => (
      <div key={name}>
        <label className="block font-medium mb-1">{label}</label>
        <select
          name={name}
          value={form[name] || ""}
          onChange={handleChange}
          className="bg-white border border-gray-300 rounded-md p-3 w-full"
        >
          <option value="">Bitte auswählen</option>
          <option value="Ja">Ja</option>
          <option value="Nein">Nein</option>
        </select>

        {/* Conditional input if "hasAllergies" is Ja */}
        {name === "hasAllergies" && form.hasAllergies === "Ja" && (
          <input
            name="allergyDetails"
            placeholder="Welche?"
            value={form.allergyDetails || ""}
            onChange={handleChange}
            className="bg-white border border-gray-300 rounded-md p-3 w-full mt-2"
          />
        )}
      </div>
    ))}
  </div>

  {/* 🔹 Ausflüge & Reisebegleitung */}
  <h3 className="font-[600] text-[16px] mb-2 mt-4">Ausflüge & Reisebegleitung</h3>

  <div className="flex flex-wrap items-center gap-6">
    {["Theaterbesuch", "Kinobesuch", "Konzertbesuch", "Fussballspiel", "Urlaubsbegleitung"].map((trip) => (
      <label key={trip} className="inline-flex items-center gap-2 text-sm text-gray-800">
        <input
          type="checkbox"
          className="w-5 h-5 accent-[#B99B5F] border border-gray-300 rounded"
          checked={form.trips?.includes(trip)}
          onChange={() => {
            const updated = new Set(form.trips || []);
            updated.has(trip) ? updated.delete(trip) : updated.add(trip);
            setForm((prev) => ({ ...prev, trips: Array.from(updated) }));
          }}
        />
        <span>{trip}</span>
      </label>
    ))}
  </div>
</div>


    <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm mt-8">
  {/* Main Title */}
  <h2 className="font-bold text-[20px] mb-6"> Gesundheitsfürsorge</h2>

  {/* 🔹 Körperliche Unterstützung */}
  <h3 className="font-[600] text-[16px] mb-4">Körperliche Unterstützung</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
   <div>
    <label className="block font-medium mb-1">
      Grösse (cm)
    </label>
    <input
      type="number"
      name="height"
      placeholder="Grösse (cm)"
      value={form.height || ""}
      onChange={handleChange}
      className={inputClass}
    />
  </div>
  <div> <label className="block font-medium mb-1">
      Gewicht (kg)
    </label>
    <input
      type="number"
      name="weight"
      placeholder="Gewicht (kg)"
      value={form.weight || ""}
      onChange={handleChange}
      className={inputClass}
    /></div>
  </div>

  {/* Zustand */}
  <div className="mb-6">
    <p className="block  font-medium mb-1">Zustand</p>
    <div className="flex flex-wrap gap-6">
      {[
        "Vollständig mobil",
        "Sturzgefährdet",
        "Bettlägerig",
        "Hilfe beim Aufstehen",
        "Hilfe beim Toilettengang",
        "Hilfe beim Umlagern, kann sich nicht selbständig bewegen"
      ].map((cond) => (
        <label key={cond} className="inline-flex items-center gap-2 text-sm text-gray-800">
          <input
            type="checkbox"
            className="w-5 h-5 accent-[#B99B5F] border border-gray-300 rounded"
            checked={form.physicalCondition?.includes(cond)}
            onChange={() => {
              const updated = new Set(form.physicalCondition || []);
              updated.has(cond) ? updated.delete(cond) : updated.add(cond);
              setForm((prev) => ({ ...prev, physicalCondition: Array.from(updated) }));
            }}
          />
          <span>{cond}</span>
        </label>
      ))}
    </div>
  </div>

  {/* 🔹 Vorhandene Hilfsmittel */}
  <h3 className="block  font-medium mb-1">Vorhandene Hilfsmittel</h3>
  <div className="mb-4 flex flex-wrap gap-6">
    {[
      "Gehstock",
      "Rollator",
      "Rollstuhl",
      "Hebesitz",
      "Pflegebett",
      "Patientenlift",
      "Badewannenlift",
      "Toilettenstuhl"
    ].map((tool) => (
      <label key={tool} className="inline-flex items-center gap-2 text-sm text-gray-800">
        <input
          type="checkbox"
          className="w-5 h-5 accent-[#B99B5F] border border-gray-300 rounded"
          checked={form.careTools?.includes(tool)}
          onChange={() => {
            const updated = new Set(form.careTools || []);
            updated.has(tool) ? updated.delete(tool) : updated.add(tool);
            setForm((prev) => ({ ...prev, careTools: Array.from(updated) }));
          }}
        />
        <span>{tool}</span>
      </label>
    ))}
  </div>
  <input
    name="careToolsOther"
    placeholder="Sonstige"
    value={form.careToolsOther || ""}
    onChange={handleChange}
    className={inputClass + " mb-6"}
  />

  {/* 🔹 Inkontinenz */}
  <h3 className="block  font-medium mb-1">Inkontinenz</h3>
  <div className="mb-6 flex flex-wrap gap-6">
    {["Urin", "Stuhl", "Dauerkatheter", "Stoma"].map((inc) => (
      <label key={inc} className="inline-flex items-center gap-2 text-sm text-gray-800">
        <input
          type="checkbox"
          className="w-5 h-5 accent-[#B99B5F] border border-gray-300 rounded"
          checked={form.incontinence?.includes(inc)}
          onChange={() => {
            const updated = new Set(form.incontinence || []);
            updated.has(inc) ? updated.delete(inc) : updated.add(inc);
            setForm((prev) => ({ ...prev, incontinence: Array.from(updated) }));
          }}
        />
        <span>{inc}</span>
      </label>
    ))}
  </div>

  {/* 🔹 Kommunikation */}
  <h3 className="block  font-medium mb-1">Kommunikation</h3>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    {["Sehen", "Hören", "Sprechen"].map((field) => (
      <select
        key={field}
        name={field}
        value={form[field] || ""}
        onChange={handleChange}
        className={inputClass}
      >
        <option value="">{field.charAt(0).toUpperCase() + field.slice(1)}...</option>
        <option value="Keine Probleme">Keine Probleme</option>
        <option value="Eingeschränkt">Eingeschränkt</option>
        <option value="Nahezu blind/taub">Nahezu blind/taub</option>
      </select>
    ))}
  </div>

  {/* 🔹 Nahrungsaufnahme */}
  <h3 className="block  font-medium mb-1">Nahrungsaufnahme</h3>
  <div className="mb-6 flex flex-wrap gap-6">
    {[
      "Unterstützung notwendig",
      "Nahrung anreichen notwendig",
      "Flüssigkeitsaufnahme kontrollieren oder unterstützen",
      "Probleme beim Schlucken",
      "Appetitlosigkeit"
    ].map((item) => (
      <label key={item} className="inline-flex items-center gap-2 text-sm text-gray-800">
        <input
          type="checkbox"
          className="w-5 h-5 accent-[#B99B5F] border border-gray-300 rounded"
          checked={form.nutritionSupport?.includes(item)}
          onChange={() => {
            const updated = new Set(form.nutritionSupport || []);
            updated.has(item) ? updated.delete(item) : updated.add(item);
            setForm((prev) => ({ ...prev, nutritionSupport: Array.from(updated) }));
          }}
        />
        <span>{item}</span>
      </label>
    ))}
  </div>

  {/* 🔹 Grundpflege */}
  <h3 className="block  font-medium mb-1">Grundpflege</h3>
  <div className="mb-4 flex flex-wrap gap-6">
    {["Körperhygiene", "An-/Auskleiden"].map((item) => (
      <label key={item} className="inline-flex items-center gap-2 text-sm text-gray-800">
        <input
          type="checkbox"
          className="w-5 h-5 accent-[#B99B5F] border border-gray-300 rounded"
          checked={form.basicCare?.includes(item)}
          onChange={() => {
            const updated = new Set(form.basicCare || []);
            updated.has(item) ? updated.delete(item) : updated.add(item);
            setForm((prev) => ({ ...prev, basicCare: Array.from(updated) }));
          }}
        />
        <span>{item}</span>
      </label>
    ))}
  </div>
  <input
    name="basicCareOther"
    placeholder="Sonstige"
    value={form.basicCareOther || ""}
    onChange={handleChange}
    className={inputClass + " mb-6"}
  />

  {/* 🔹 Gesundheitsförderung */}
  <h3 className="block  font-medium mb-1">Gesundheitsförderung</h3>
  <div className="mb-4 flex flex-wrap gap-6">
    {["Gymnastik", "Spaziergänge", "Aktivierende Betreuung"].map((act) => (
      <label key={act} className="inline-flex items-center gap-2 text-sm text-gray-800">
        <input
          type="checkbox"
          className="w-5 h-5 accent-[#B99B5F] border border-gray-300 rounded"
          checked={form.healthPromotion?.includes(act)}
          onChange={() => {
            const updated = new Set(form.healthPromotion || []);
            updated.has(act) ? updated.delete(act) : updated.add(act);
            setForm((prev) => ({ ...prev, healthPromotion: Array.from(updated) }));
          }}
        />
        <span>{act}</span>
      </label>
    ))}
  </div>
  <input
    name="healthPromotionOther"
    placeholder="Sonstige"
    value={form.healthPromotionOther || ""}
    onChange={handleChange}
    className={inputClass + " mb-6"}
  />

  {/* 🔹 Geistige Unterstützung */}
  <h3 className="font-[600] text-[16px] mb-4">Geistiger Zustand</h3>


  {/* Diagnosen */}
  <p className="block  font-medium mb-2">Diagnosen</p>
  <div className="mb-6 flex flex-wrap gap-6">
    {["Depression", "Demenz", "Alzheimer"].map((diag) => (
      <label key={diag} className="inline-flex items-center gap-2 text-sm text-gray-800">
        <input
          type="checkbox"
          className="w-5 h-5 accent-[#B99B5F] border border-gray-300 rounded"
          checked={form.diagnoses?.includes(diag)}
          onChange={() => {
            const updated = new Set(form.diagnoses || []);
            updated.has(diag) ? updated.delete(diag) : updated.add(diag);
            setForm((prev) => ({ ...prev, diagnoses: Array.from(updated) }));
          }}
        />
        <span>{diag}</span>
      </label>
    ))}
  </div>

  {/* Verhaltensmerkmale */}
  <p className="block  font-medium mb-2">Verhaltensmerkmale</p>
  <div className="mb-6 flex flex-wrap gap-6">
    {[
      "Gestörter Tag-/Nachtrhythmus",
      "Weglauftendenz",
      "Persönlichkeitsveränderungen",
      "Aggressivität",
      "Apathie",
      "Starke Unruhe"
    ].map((trait) => (
      <label key={trait} className="inline-flex items-center gap-2 text-sm text-gray-800">
        <input
          type="checkbox"
          className="w-5 h-5 accent-[#B99B5F] border border-gray-300 rounded"
          checked={form.behaviorTraits?.includes(trait)}
          onChange={() => {
            const updated = new Set(form.behaviorTraits || []);
            updated.has(trait) ? updated.delete(trait) : updated.add(trait);
            setForm((prev) => ({ ...prev, behaviorTraits: Array.from(updated) }));
          }}
        />
        <span>{trait}</span>
      </label>
    ))}
  </div>

  {/* Gesundheitsbefunde */}
  <textarea
    name="healthFindings"
    value={form.healthFindings || ""}
    onChange={handleChange}
    placeholder="Gesundheitsbefunde"
    className={inputClass}
  />
</div>


<div className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm mt-8">
  {/* Main Title */}
  <h2 className="font-bold text-[20px] mb-6"> Haushaltshilfe & Wohnpflege</h2>

  {/* 🔹 Allgemeines */}
  <h3 className="font-[600] text-[16px] mb-4">Allgemeines</h3>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
  <div>
    <label className="block font-medium mb-1" htmlFor="roomCount">
      Anzahl Zimmer
    </label>
    <input
      type="number"
      id="roomCount"
      name="roomCount"
      placeholder="Anzahl Zimmer"
      value={form.roomCount || ""}
      onChange={handleChange}
      className={inputClass}
    />
  </div>
  <div>
    <label className="block font-medium mb-1" htmlFor="householdSize">
      Wieviel-Personen-Haushalt?
    </label>
    <input
      type="number"
      id="householdSize"
      name="householdSize"
      placeholder="Wieviel-Personen-Haushalt?"
      value={form.householdSize || ""}
      onChange={handleChange}
      className={inputClass}
    />
  </div>
</div>


  {/* 🔹 Tätigkeiten */}
  <h3 className="font-[600] text-[16px] mb-4">Tätigkeiten</h3>
  <label className="block font-medium mb-2">Ihre Tätigkeiten aus</label>

  <div className="flex flex-wrap gap-6 mb-4">
    {[
      "Balkon- & Blumenpflege",
      "Waschen / Bügeln / Verräumen",
      "Kochen",
      "Fenster putzen",
      "Bettwäsche wechseln",
      "Aufräumen",
      "Abfall trennen / entsorgen",
      "Abstauben",
      "Staubsaugen",
      "Boden wischen",
      "Vorhänge reinigen"
    ].map((task) => (
      <label key={task} className="inline-flex items-center gap-2 text-sm text-gray-800">
        <input
          type="checkbox"
          className="w-5 h-5 accent-[#B99B5F] border border-gray-300 rounded"
          checked={form.householdTasks?.includes(task)}
          onChange={() => {
            const updated = new Set(form.householdTasks || []);
            updated.has(task) ? updated.delete(task) : updated.add(task);
            setForm((prev) => ({ ...prev, householdTasks: Array.from(updated) }));
          }}
        />
        <span>{task}</span>
      </label>
    ))}
  </div>

  {/* Kochen - additional input if selected */}
  {form.householdTasks?.includes("Kochen") && (
    <div className="mb-4">
      <label className="block font-medium text-gray-800 mb-1">Für wie viele Personen wird gekocht?</label>
      <input
        type="number"
        name="cookingForPeople"
        placeholder="Anzahl Personen"
        value={form.cookingForPeople || ""}
        onChange={handleChange}
        className={inputClass}
      />
    </div>
  )}
</div>


    <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm mt-8">
  {/* Main Title */}
  <h2 className="font-bold text-[20px] mb-6"> Weitere Angaben für die Einsatzplanung</h2>

  {/* 🔹 Sprache der Betreuungsperson */}
  <h3 className="font-medium mb-2">Sprache der Betreuungsperson</h3>
  <div className="flex flex-wrap gap-6 mb-4">
    {["CH-Deutsch", "Deutsch", "Englisch", "Französisch", "Italienisch"].map((lang) => (
      <label key={lang} className="inline-flex items-center gap-2 text-sm text-gray-800">
        <input
          type="checkbox"
          className="w-5 h-5 accent-[#B99B5F] border border-gray-300 rounded"
          checked={form.languages?.includes(lang)}
          onChange={() => {
            const updated = new Set(form.languages || []);
            updated.has(lang) ? updated.delete(lang) : updated.add(lang);
            setForm((prev) => ({ ...prev, languages: Array.from(updated) }));
          }}
        />
        <span>{lang}</span>
      </label>
    ))}
  </div>

  {/* Sonstige Sprache */}
  <div className="mb-6">
    <input
      name="languageOther"
      placeholder="Sonstige Sprache"
      value={form.languageOther || ""}
      onChange={handleChange}
      className={inputClass}
    />
  </div>

  {/* 🔹 Haustiere im Haushalt */}
  <h3 className="font-medium mb-1">Haustiere im Haushalt?</h3>
  <div className="mb-4">
    <select
      name="hasPets"
      value={form.hasPets || ""}
      onChange={handleChange}
      className={inputClass}
    >
      <option value="">Bitte auswählen</option>
      <option value="Ja">Ja</option>
      <option value="Nein">Nein</option>
    </select>

    {form.hasPets === "Ja" && (
      <input
        name="petDetails"
        placeholder="Welche Haustiere?"
        value={form.petDetails || ""}
        onChange={handleChange}
        className={inputClass + " mt-2"}
      />
    )}
  </div>
</div>

    </div>
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

  {step === 4 ? (
    <button
      type="button"
      onClick={handleOptionalSubmit}
      className="px-6 py-3 bg-[#B99B5F] text-white rounded-lg"
    >
      Weiter
    </button>
  ) : step === 3 ? (
    <button
      type="button"
      onClick={handleNext}
      className="px-6 py-3 bg-[#B99B5F] text-white rounded-lg"
    >
      Jetzt bezahlen & weiter
    </button>
  ) : (
    <button
      type="button"
      onClick={handleNext}
      className="px-6 py-3 bg-[#B99B5F] text-white rounded-lg"
    >
      Weiter
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
<SummaryRow
  label="Dauer"
  value={`${form.schedules.reduce((sum, s) => sum + (s.hours || 0), 0)} Stunden`}
/>
    <SummaryRow label="Beginndatum" value={form.firstDate} />
    <SummaryRow label="Gesamtsumme" value={`${totalPayment.toFixed(2)} CHF`} />

  </div>
</div>

      </div>
      
    </div>
    
  );
}