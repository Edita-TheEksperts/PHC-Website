import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import RegisterForm1 from "../components/RegisterForm1";
import RegisterForm2 from "../components/RegisterForm2";
import { ChevronDown, ChevronUp } from "lucide-react";
import Kundigung from "./dashboard/kundigung";
import RegisterForm3 from "../components/RegisterForm3";
import RegisterForm4 from "../components/RegisterForm4";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker";
import { parseISO } from "date-fns";
import { de } from "date-fns/locale";



import {
  CalendarDays,
  Clock,
  Plane,
  AlarmClock,
  Hourglass,
  Menu,
  X,
} from "lucide-react";

import { addDays, format } from "date-fns";

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

registerLocale("de", de);

export default function ClientDashboard() {
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [userData, setUserData] = useState(null);
  const [employees, setEmployees] = useState([]); // State to store employee data
  const [targetHours, setTargetHours] = useState([]); // Default target hours for overtime alerts
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
const [uiMessage, setUiMessage] = useState(null);
const [activeTab, setActiveTab] = useState("dashboard");
const [updatedData, setUpdatedData] = useState({});
const [showAppointments, setShowAppointments] = useState(true);
const [showHistory, setShowHistory] = useState(true);
const [showUserInfo, setShowUserInfo] = useState(true);
const [showVacations, setShowVacations] = useState(true);
const [showBooking, setShowBooking] = useState(true);
  const [services, setServices] = useState("");
  const [allServices, setAllServices] = useState([]);

  const [isNotifVisible, setIsNotifVisible] = useState(false);
  const [notifShownOnce, setNotifShownOnce] = useState(false);
  const [filter, setFilter] = useState("cancelled"); // ose "done"
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const router = useRouter();
  const [vacations, setVacations] = useState([]);
// Calculate total hours & km
const safeAppointments = Array.isArray(appointments) ? appointments : [];

const totalHours = safeAppointments.reduce(
  (sum, a) => sum + (a.hours || 0),
  0
);

const totalKm = safeAppointments.reduce(
  (sum, a) => sum + (a.kilometers || 0),
  0
);


// Define a baseline (contracted) hours/km, for example:
const contractedHours = 20; // adjust based on your rules
const contractedKm = 50;

const extraHours = Math.max(0, totalHours - contractedHours);
const extraKm = Math.max(0, totalKm - contractedKm);

  const [form, setForm] = useState({
    date: null,
    time: "",
    hours: 2, // default to 2 hours

    service: "",
    subService: "",
  });

  const minSelectableDate = addDays(new Date(), 14);

  // ✅ Always defined (or null)
  const selectedService =
    allServices.find((srv) => String(srv.id) === String(form.service)) || null;

  // --- DEBUG: Track form + services state
  useEffect(() => {}, [allServices]);

  useEffect(() => {}, [form, selectedService]);

  useEffect(() => {}, [appointments]);

  useEffect(() => {}, [vacations]);

useEffect(() => {
  if (userData?.id) {
    fetchAppointments(userData.id);
  }
}, [userData]);

  const markAsDone = async (id) => {
    await fetch("/api/appointments", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, update: { captured: true } }),
    });
    setAppointments((prev) =>
      prev.map((appt) => (appt.id === id ? { ...appt, captured: true } : appt))
    );
  };
useEffect(() => {
  if (!selectedAppointment?.date) return;

  // SIGURIA: kontrollo nëse data është valide
  const raw = selectedAppointment.date.split("T")[0]; // merr vetëm YYYY-MM-DD
  const d = new Date(raw + "T12:00:00");

  if (isNaN(d.getTime())) return; // shmang crash

  const formatted = [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0")
  ].join("-");

  setEditData({
    date: formatted,
    startTime: selectedAppointment.startTime,
    hours: selectedAppointment.hours,
    serviceName: selectedAppointment.serviceName,
    subServiceName: selectedAppointment.subServiceName,
  });
}, [selectedAppointment]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = appointments.filter((a) => {
    const d = a.date ? new Date(a.date) : null;
    const isFuture = d ? d >= today : true;
    return isFuture && !["cancelled", "terminated", "done"].includes(a.status);
  });

  const history = appointments.filter((a) => {
    const d = a.date ? new Date(a.date) : null;
    const isPast = d ? d < today : false;
    return ["cancelled", "terminated", "done"].includes(a.status) || isPast;
  });

  const fetchAppointments = async (userId) => {
  const res = await fetch(`/api/appointments?userId=${userId}`);
  if (res.ok) {
    const data = await res.json();
    setAppointments(data);
  }
};


const cancelAppointment = async (id) => {
  try {
    const res = await fetch(`/api/appointments?id=${id}&cancel=true`, {
      method: "DELETE",
    });

    // ✅ Përditëso UI menjëherë
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === id ? { ...appt, status: "cancelled" } : appt
      )
    );

    if (!res.ok) {
      // ⚠️ backend error (email), por UX vazhdon
      setUiMessage({
        type: "warning",
        text:
          "Termin wurde storniert, aber die Bestätigungs-E-Mail konnte nicht gesendet werden.",
      });
    } else {
      setUiMessage({
        type: "success",
        text: "✅ Termin erfolgreich storniert.",
      });
    }
  } catch (err) {
    console.error(err);
    setUiMessage({
      type: "error",
      text: "❌ Termin konnte nicht storniert werden. Bitte versuchen Sie es erneut.",
    });
  }

  // ⏳ fshi mesazhin pas 4 sekondash
  setTimeout(() => setUiMessage(null), 4000);
};

  const terminateAppointment = async (id, immediate = false) => {
    await fetch(
      `/api/appointments?id=${id}&terminate=true&immediate=${immediate}`,
      {
        method: "DELETE",
      }
    );

    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === id ? { ...appt, status: "terminated" } : appt
      )
    );
  };

  const fetchVacations = async (userId) => {
    const res = await fetch(`/api/vacation/get?userId=${userId}`);
    if (res.ok) {
      const data = await res.json();
      setVacations(data);
    }
  };

  useEffect(() => {
    if (userData?.id) {
      fetchVacations(userData.id);
    }
  }, [userData]);

useEffect(() => {
  if (typeof window === "undefined") return;

  const token = localStorage.getItem("userToken");

  // nëse s'ka token → ridrejto menjëherë
  if (!token) {
    router.replace("/login");
    return;
  }

  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/user/getUserData", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        // token i pavlefshëm → fshi nga localStorage dhe ridrejto
        localStorage.removeItem("userToken");
        router.replace("/login");
        return;
      }

      if (!res.ok) throw new Error("Fehler beim Laden der Benutzerdaten");

      const user = await res.json();
      setUserData(user);
      setUpdatedData(user);
    } catch (err) {
      console.error("❌ Error loading user:", err);
      router.replace("/login"); // si fallback nëse ndodh ndonjë gabim
    } finally {
      setLoading(false);
    }
  };

  fetchUserData();
}, [router]);


  // --- Fetch available services
  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        setAllServices(data);
      })
      .catch((err) => console.error("❌ Service fetch error:", err));
  }, []);

  const [step, setStep] = useState("booking"); // "booking" | "payment" | "done"
  const [pendingBooking, setPendingBooking] = useState(null);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    const service = allServices.find(
      (s) => String(s.id) === String(form.service)
    );
    const subService =
      service?.subServices.find(
        (s) => String(s.id) === String(form.subService)
      ) || null;

    const payload = {
      userId: userData.id,
      date: form.date?.toISOString(),
      time: form.time,
      email: userData.email,
      hours: form.hours,
      service: service?.name || null,
      subService: subService?.name || null,
      serviceId: service?.id || null,
      subServiceId: subService?.id || null,
    };

    setPendingBooking(payload);
    setStep("payment"); // 👉 go to payment screen
  };

  const stripe = useStripe();
  const elements = useElements();
  const [agbAccepted, setAgbAccepted] = useState(false);
  const [agbError, setAgbError] = useState("");

  const handleStripePayment = async () => {
    if (!agbAccepted) {
      setAgbError("Bitte AGB akzeptieren.");
      return;
    }

    try {
      // 1. Create PaymentIntent on backend
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: pendingBooking.hours * 5000 }), // 💰 e.g. 50 CHF per hour
      });
      const { clientSecret } = await res.json();

      // 2. Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: { card: elements.getElement(CardElement) },
        }
      );

      if (error) {
        alert(error.message);
        return;
      }

      // 3. Save appointment after successful payment
      const saveRes = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...pendingBooking,
          email: userData.email,
          paymentIntentId: paymentIntent.id,
        }),
      });

      if (saveRes.ok) {
        alert("✅ Termin gebucht & Zahlung erfolgreich!");
        setStep("done");
        setForm({ date: "", time: "", hours: 2, service: "", subService: "" });
      } else {
        alert("❌ Fehler beim Speichern des Termins");
      }
    } catch (err) {
      console.error(err);
      alert("Fehler bei der Zahlung.");
    }
  };
  const [editingCard, setEditingCard] = useState(false);
const [cardLoading, setCardLoading] = useState(false);


async function handleUpdateCard() {
  setCardLoading(true);

  // 1) Create Stripe payment method
  const { paymentMethod, error } = await stripe.createPaymentMethod({
    type: "card",
    card: elements.getElement(CardElement),
  });

  if (error) {
    alert(error.message);
    setCardLoading(false);
    return;
  }

  // 2) Send to backend
  const res = await fetch("/api/update-payment-method", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: userData.id,
      customerId: userData.stripeCustomerId,
      newPaymentMethodId: paymentMethod.id,
    }),
  });

  const data = await res.json();
  setCardLoading(false);

  if (data.success) {
    alert("Zahlungsmethode erfolgreich aktualisiert!");
    setEditingCard(false);
    fetchPaymentMethod(); // Rifresko kartën e re
  } else {
    alert("Fehler: Zahlungsmethode konnte nicht gespeichert werden.");
  }
}

  const normalize = (str) =>
    str
      ?.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .replace(/\s+/g, "")
      .replace(/[^\w]/g, "") || "";

  const formMap = {
    haushaltshilfeundwohnpflege: RegisterForm1,
    freizeitundsozialeaktivitaeten: RegisterForm2,
    gesundheitsfuhrsorge: RegisterForm3,
    alltagsbegleitungundbesorgungen: RegisterForm4,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({ ...prev, [name]: value }));
  };



  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("✅ handleSubmit u thirr");
  console.log("UpdatedData: ", updatedData);

if (!updatedData.careStreet || updatedData.careStreet.trim() === "") {
  alert("❌ Bitte geben Sie Ihre Hausnummer ein.");
  return;
}

if (!updatedData.careCity || updatedData.careCity.trim() === "") {
  alert("❌ Bitte geben Sie Ihren Wohnort ein.");
  return;
}


  // nëse do të mbash edhe fushat tjera si opsionale ose të kontrolluara
  const requiredFields = ["firstName", "lastName", "email", "phone"];
  for (let field of requiredFields) {
    const value = updatedData[field] ? String(updatedData[field]).trim() : "";
    if (value === "") {
      alert(`❌ Bitte füllen Sie das Feld "${field}" aus.`);
      return;
    }
  }

  try {
    console.log("➡️ Dërgoj të dhënat tek API:", { id: userData.id, ...updatedData });

    const res = await fetch("/api/updateUserData", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userData.id, ...updatedData }),
    });

    console.log("📡 Response nga server:", res.status);

    if (res.ok) {
      alert("✅ Daten erfolgreich aktualisiert!");
    } else {
      alert("❌ Fehler beim Aktualisieren.");
    }
  } catch (err) {
    console.error("🔥 Gabim serveri:", err);
    alert("❌ Serverfehler.");
  }
};


  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-[#B99B5F] text-xl font-semibold">
        Lädt...
      </div>
    );

  const SelectedForm = formMap[services];
  function VacationForm({ userId, refreshVacations }) {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();

  const start = new Date(startDate);
  const end = new Date(endDate);

  await fetch("/api/vacation/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    }),
  });

// 🔁 për çdo termin aktiv gjatë Urlaub
for (const appt of appointments) {
  if (!appt.date || appt.status !== "active") continue;

  const apptDate = new Date(appt.date);
  const startDay = new Date(start);
  const endDay = new Date(end);

  apptDate.setHours(12, 0, 0, 0);
  startDay.setHours(0, 0, 0, 0);
  endDay.setHours(23, 59, 59, 999);

  if (apptDate >= startDay && apptDate <= endDay) {
    // ✅ KJO është STORNIEREN i vërtetë
    await fetch(
      `/api/admin/schedules/${appt.id}/cancel?cancelledBy=Urlaub`,
      {
        method: "PATCH",
      }
    );
  }
}

// 🔄 rifresko nga backend
await fetchAppointments(userId);


  setStartDate(null);
  setEndDate(null);
  refreshVacations();
};

    function isUserDataIncomplete(data) {
      if (!data) return true;
      return (
        !data.firstName ||
        !data.lastName ||
        !data.email ||
        !data.phone ||
        !data.address
      );
    }

    useEffect(() => {
      if (!notifShownOnce && isUserDataIncomplete(userData)) {
        setIsNotifVisible(true);
        setNotifShownOnce(true);
      }
    }, [userData, notifShownOnce]);

    return (
<form onSubmit={handleSubmit} className="space-y-4">

  {/* Startdatum */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Startdatum
    </label>
    <DatePicker
      selected={startDate}
      onChange={(date) => {
        setStartDate(date);
        setEndDate(null);
      }}
      dateFormat="dd.MM.yyyy"
      locale="de"
      placeholderText="dd.mm.yyyy"
      minDate={new Date()}
      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm"
    />
  </div>

  {/* Enddatum */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Enddatum
    </label>
    <DatePicker
      selected={endDate}
      onChange={(date) => setEndDate(date)}
      dateFormat="dd.MM.yyyy"
      locale="de"
      placeholderText="dd.mm.yyyy"
      minDate={startDate || new Date()}
      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm"
    />
  </div>

  {/* Rule info */}
  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg p-3">
    <strong>Hinweis:</strong>  
    Termine, die in diesen Zeitraum fallen, werden automatisch storniert.
  </div>

  <button
    type="submit"
    className="bg-[#B99B5F] text-white py-2 px-4 rounded-lg"
  >
    Urlaub speichern
  </button>
</form>

    );
  }

  return (
    <div className="relative min-h-screen bg-gray-100 font-sans">
      <div className="flex min-h-screen">
        <>
          {/* --- MOBILE TOP NAVBAR --- */}
          <div className="lg:hidden bg-[#B99B5F] text-white shadow-lg w-full fixed top-0 left-0 z-50">
            {/* Top bar */}
            <div className="flex items-center justify-between p-4">
              <h1
                className="text-xl font-bold cursor-pointer"
                onClick={() => router.push("/client-dashboard")}
              >
                PHC
              </h1>
              <button onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          

          {/* Fullscreen Mobile Menu Overlay */}
          {isOpen && (
            <div className="lg:hidden fixed inset-0 bg-[#B99B5F] text-white z-40 flex flex-col">
              {/* Top bar inside overlay */}
              <div className="flex items-center justify-between p-4 border-b border-white/20">
                <h1
                  className="text-xl font-bold cursor-pointer"
                  onClick={() => {
                    router.push("/client-dashboard");
                    setIsOpen(false);
                  }}
                >
                  PHC
                </h1>
                <button onClick={() => setIsOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Menu items */}
              <ul className="flex flex-col space-y-6 px-6 py-8 text-lg font-medium">
                <li
                  onClick={() => {
                    router.push("/client-dashboard");
                    setIsOpen(false);
                  }}
                  className="cursor-pointer hover:text-[#A6884A]"
                >
                  Dashboard
                </li>

                <li
                  onClick={() => {
                    router.push("/dashboard/formular");
                    setIsOpen(false);
                  }}
                  className="cursor-pointer hover:text-[#A6884A]"
                >
Persönliche Informationen                </li>

     <li
                  onClick={() => {
                    router.push("/dashboard/finanzen");
                    setIsOpen(false);
                  }}
                  className="cursor-pointer hover:text-[#A6884A]"
                >
Finanzen             </li>
              </ul>
            </div>
          )}

          {/* --- DESKTOP SIDEBAR --- */}
          <nav className="hidden lg:flex bg-[#B99B5F] text-white p-4 flex-col shadow-lg lg:w-72">
            <h1
              className="text-4xl font-bold text-center mb-12 select-none cursor-pointer"
              onClick={() => router.push("/client-dashboard")}
            >
              PHC
            </h1>

            <ul className="space-y-6 flex-grow">
              <li
                onClick={() => router.push("/client-dashboard")}
                className="text-lg font-medium hover:text-[#A6884A] cursor-pointer transition"
              >
                Dashboard
              </li>

              <li
                onClick={() => router.push("/dashboard/formular")}
                className="text-lg font-medium hover:text-[#A6884A] cursor-pointer transition"
              >
             Persönliche Informationen
              </li>

                                    <li
                onClick={() => {
                  router.push("/dashboard/finanzen");
                  setIsOpen(false);
                }}
                className="text-lg font-medium hover:text-[#A6884A] cursor-pointer transition"
              >
                Finanzen
              </li>
              <li
                onClick={() => {
                  router.push("/dashboard/kundigung");
                  setIsOpen(false);
                }}
                className="cursor-pointer hover:text-red-400"
              >
                Kündigung
              </li>

    
            </ul>
          </nav>
        </>

        {/* Main Content */}
        <main className="flex-1 p-2 mt-[100px] lg:mt-0 lg:p-12 overflow-auto">
          {/* Header */}
          <header className="flex justify-between items-center mb-12">
     <h2 className="text-2xl lg:text-4xl font-bold text-[#B99B5F]">
  Guten Tag {userData?.firstName} {userData?.lastName}
</h2>


            {/* Logout Button */}
            <button
              onClick={() => {
                localStorage.removeItem("userToken");
                localStorage.removeItem("selectedService");
                router.push("/");
              }}
              className="flex items-center gap-2 bg-[#B99B5F]
             text-white px-6 py-3 rounded-full shadow-md
             font-semibold text-sm transition-all duration-300 ease-in-out
             hover:shadow-lg hover:scale-105"
            >
              {/* Icon */}
           
              Logout
            </button>
          </header>

          {/* User Info + Documents + Service */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">

<section
  className={`bg-white border border-gray-200 transition-all duration-500 ease-in-out overflow-hidden
  ${showAppointments
    ? " scale-100 opacity-100 rounded-3xl shadow-2xl"
    : " scale-95 opacity-90 rounded-xl shadow-md"}`}
>
  {/* Header */}
  <header
    onClick={() => setShowAppointments((prev) => !prev)}
    className="flex items-center justify-between px-6 py-4 cursor-pointer select-none border-b border-gray-100"
  >
    <div className="flex items-center gap-3">
          <h3 className="text-2xl font-semibold text-[#B99B5F]">
    Nächste Termine
    </h3>
    </div>
    <svg
      className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${
        showAppointments ? "rotate-180" : ""
      }`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </header>

  {/* Description kur është i mbyllur */}
  {!showAppointments && (
    <div className="transition-all duration-500">
      <p className="px-6 py-6 text-sm text-gray-500 italic text-left">
        Hier finden Sie Ihre geplanten Termine.
      </p>
    </div>
  )}

  {/* Content kur hapet */}
  <div
    className={`transition-all duration-500 transform ${
      showAppointments
        ? "max-h-[800px] opacity-100 scale-100"
        : "max-h-0 opacity-0 scale-95"
    }`}
        style={{
      position: "relative", // Kjo i jep mundësinë e pozicionimit absolut brenda
      overflow: "hidden",   // Parandalon që dropdown-i të ndikojë në layout
    }}
  >
    <div className="p-6 space-y-4">
{appointments.filter((a) => a.status === "active").length > 0 ? (
        <ul
          className="space-y-4 max-h-96 overflow-y-auto pr-2 
          scrollbar-thin scrollbar-thumb-[#B99B5F]/40 
          scrollbar-track-transparent"
        >
       {  appointments
  .filter((a) => a.status === "active")

            .map((appt) => (
              <li
                key={appt.id}
                className="p-5 rounded-2xl shadow-md hover:shadow-lg transition 
                bg-[#B99B5F]/10 border border-[#B99B5F]/20"
              >
                {/* Info */}
                <div className="space-y-2 text-sm text-gray-800">
                  <div className="flex items-center justify-between">
      
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        appt.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {appt.status === "active" ? "Aktiv" : appt.status}
                    </span>
                  </div>

                  {appt.date && (
       <p className="flex items-center gap-3 text-base font-bold text-gray-800">
  <CalendarDays className="w-5 h-5 text-[#B99B5F]" />
  {format(parseISO(appt.date), "EEEE, d. MMMM yyyy", {
    locale: de,
  })}
</p>

                  )}

                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-2">
                      <AlarmClock className="w-4 h-4 text-[#B99B5F]" />
                      {appt.startTime}
                    </span>
                    <span className="flex items-center gap-2">
                      <Hourglass className="w-4 h-4 text-[#B99B5F]" />
                      {appt.hours} Std
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  {/* Cancel */}
                  <button
                    onClick={() => cancelAppointment(appt.id)}
                    className="flex-1 px-4 py-2 text-xs font-medium text-red-600 
                      bg-red-50 border border-red-200 rounded-lg hover:bg-red-100"
                  >
                    Stornieren
                  </button>

                  {/* Details */}
                  <button
                    onClick={() => setSelectedAppointment(appt)}
                    className="flex-1 px-4 py-2 text-xs font-medium text-[#04436F] 
                      bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
                  >
                    Details
                  </button>
                </div>
              </li>
            ))}
        </ul>
      ) : (
        <p className="italic text-gray-400 text-center py-6">
          Keine Termine geplant
        </p>
      )}
    </div>
  </div>
</section>


<section
  className={`bg-white border border-gray-200 transition-all duration-500 ease-in-out

  ${showVacations
    ? " scale-100 opacity-100 rounded-3xl shadow-2xl"
    : " scale-95 opacity-90 rounded-xl shadow-md"}`}
>
  {/* Header */}
  <header
    onClick={() => setShowVacations((prev) => !prev)}
    className="flex items-center justify-between px-6 py-4 cursor-pointer select-none border-b border-gray-100"
  >
    <div className="flex items-center gap-2">
       <h3 className="text-2xl font-semibold text-[#B99B5F]">
   Urlaub
    </h3>
    </div>
    <svg
      className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${
        showVacations ? "rotate-180" : ""
      }`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </header>

  {/* Description kur është i mbyllur */}
  {!showVacations && (
    <div className="transition-all duration-500">
      <p className="px-6 py-6 text-sm text-gray-500 italic text-left">
        Hier können Sie Ihre Urlaubszeiten verwalten.
      </p>
    </div>
  )}
<div
  className={`transition-all duration-500 ${
    showVacations
      ? "opacity-100 scale-100 h-auto"
      : "opacity-0 scale-95 h-0"
  }`}
>

    <div className="p-6 space-y-6">
      {/* Form */}
      <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 shadow-inner mb-6">
        <VacationForm
          userId={userData.id}
          refreshVacations={() => fetchVacations(userData.id)}
        />
      </div>

      {/* List */}
      {vacations.length > 0 ? (
        <ul className="space-y-4">
          {vacations.map((v) => (
            <li
              key={v.id}
              className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-2xl hover:shadow-md transition"
            >
              <div className="bg-[#B99B5F]/10 p-3 rounded-xl">
                <CalendarDays className="text-[#B99B5F] w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(v.startDate).toLocaleDateString("de-CH")} –{" "}
                  {new Date(v.endDate).toLocaleDateString("de-CH")}
                </p>
                <p className="text-xs text-gray-500">Geplant</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="italic text-gray-400 text-center">
          Kein Urlaub eingetragen
        </p>
      )}
    </div>
  </div>
</section>

              {/* --- SERVICE HISTORY --- */}
      {/* Serviceverlauf Section */}
<section
  className={`bg-white border border-gray-200 transition-all duration-500 ease-in-out overflow-hidden
  ${showHistory
    ? "scale-100 opacity-100 rounded-3xl shadow-2xl"
    : "scale-95 opacity-90 rounded-xl shadow-md"}`}
>

  {/* Header */}
  <div
    className="flex items-center justify-between px-2 py-4 cursor-pointer select-none border-b border-gray-100"
    onClick={() => setShowHistory(!showHistory)}
  >
           <h3 className="text-2xl font-semibold text-[#B99B5F]">
   Serviceverlauf
    </h3>

    {showHistory ? (
      <ChevronUp className="w-6 h-6 text-gray-500" />
    ) : (
      <ChevronDown className="w-6 h-6 text-gray-500" />
    )}
  </div>

  <div
    className={`transition-all duration-500 ${
      showHistory
        ? "max-h-0 opacity-0 overflow-hidden"
        : "max-h-40 opacity-100"
    }`}
  >
    <p className="px-6 py-4 text-sm text-gray-500 italic text-left">
      Hier sehen Sie den Verlauf Ihrer Services mit Status, Datum und
      Details.
    </p>
  </div>

  {/* Filter + List + Zusammenfassung */}
  <div
    className={`transition-all duration-500 transform ${
      showHistory
        ? "max-h-[900px] opacity-100 scale-100"
        : "max-h-0 opacity-0 scale-95 overflow-hidden"
    }`}
  >
 
    {/* List */}
    <ul
      className="space-y-4 max-h-96 overflow-y-auto pr-2 px-6
        scrollbar-thin scrollbar-thumb-[#B99B5F]/40 scrollbar-track-transparent"
    >
      {appointments.filter((a) => a.status === filter).length > 0 ? (
        appointments
          .filter((a) => a.status === filter)
          .map((item) => (
            <li
              key={item.id}
              className={`p-5 rounded-2xl shadow-md hover:shadow-lg transition 
                ${
                  item.status === "cancelled"
                    ? "bg-red-50 border border-red-200"
                    : item.status === "done"
                    ? "bg-green-50 border border-green-200"
                    : item.status === "terminated"
                    ? "bg-yellow-50 border border-yellow-200"
                    : "bg-white border"
                }`}
            >
              {/* Info */}
              <div className="space-y-2 text-sm text-gray-800">
                <div className="flex items-center justify-between">
       
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full
                      ${
                        item.status === "done"
                          ? "bg-green-100 text-green-700"
                          : item.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : item.status === "terminated"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    {item.status === "done"
                      ? "Erledigt"
                      : item.status === "cancelled"
                      ? "Storniert"
                      : item.status === "terminated"
                      ? "Gekündigt"
                      : item.status}
                  </span>
                </div>

                {item.date && (
                  <p className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="w-4 h-4 text-[#B99B5F]" />
                    {new Date(item.date).toLocaleDateString("de-DE", {
                      weekday: "long",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span className="flex items-center gap-2">
                    <AlarmClock className="w-4 h-4 text-[#B99B5F]" />{" "}
                    {item.startTime}
                  </span>
                  <span className="flex items-center gap-2">
                    <Hourglass className="w-4 h-4 text-[#B99B5F]" />{" "}
                    {item.hours} Std
                  </span>
                </div>

                {item.serviceName && (
                  <p className="text-xs text-gray-600">
                    <strong>Service:</strong> {item.serviceName}
                  </p>
                )}
                {item.subServiceName && (
                  <p className="text-xs text-gray-600">
                    <strong>Sub-Service:</strong> {item.subServiceName}
                  </p>
                )}
              </div>

       <div className="flex gap-2 mt-4">
  {/* ❌ MOS shfaq Stornieren në Serviceverlauf */}
  {!["cancelled", "done", "terminated"].includes(item.status) && (
    <button
      onClick={() => cancelAppointment(item.id)}
      className="flex-1 px-4 py-2 text-xs font-medium text-red-600 
        bg-red-50 border border-red-200 rounded-lg hover:bg-red-100"
    >
      Stornieren
    </button>
  )}

  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      setSelectedAppointment(item);
    }}
    className="flex-1 px-4 py-2 text-xs font-medium text-[#04436F] 
      bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
  >
    Details
  </button>
</div>

            </li>
          ))
      ) : (
        <p className="italic text-gray-400">
          Keine Einträge für diesen Status
        </p>
      )}
    </ul>

    {/* Zusammenfassung */}
    <article className="bg-white p-8 rounded-3xl shadow-xl m-6">
      <h3 className="text-2xl font-semibold text-[#B99B5F] mb-6">
        Zusammenfassung
      </h3>

      <p className="text-lg mb-3">
        <strong>Gesamtstunden:</strong> {totalHours} Std
      </p>
      <p className="text-lg mb-3">
        <strong>Gesamtkilometer:</strong> {totalKm} km
      </p>

      <p className="text-lg mt-6 text-red-600">
        <strong>Extra Stunden:</strong> {extraHours} Std
      </p>
      <p className="text-lg text-red-600">
        <strong>Extra Kilometer:</strong> {extraKm} km
      </p>
    </article>
  </div>
</section>
          {/* Neue Buchung planen Section */}
<section
  className={`bg-white border border-gray-200 transition-all duration-500 ease-in-out overflow-hidden
  ${showBooking
    ? " scale-100 opacity-100 rounded-3xl shadow-2xl"
    : "scale-95 opacity-90 rounded-xl shadow-md"}`}
>
  {/* Header */}
  <div
    className="flex items-center justify-between px-6 py-4 cursor-pointer select-none border-b border-gray-100"
    onClick={() => setShowBooking(!showBooking)}
  >
         <h3 className="text-2xl font-semibold text-[#B99B5F]">
    Neue Buchung planen
    </h3>

    {showBooking ? (
      <ChevronUp className="w-6 h-6 text-gray-500" />
    ) : (
      <ChevronDown className="w-6 h-6 text-gray-500" />
    )}
  </div>

  {/* Description kur është i mbyllur */}
  <div
    className={`transition-all duration-500 ${
      showBooking
        ? "max-h-0 opacity-0 overflow-hidden"
        : "max-h-40 opacity-100"
    }`}
  >
    <p className="px-6 py-4 text-sm text-gray-500 italic text-left">
      Hier können Sie einen neuen Termin planen, Ihre gewünschte Uhrzeit
      auswählen und direkt bezahlen.
    </p>
  </div>

  {/* Content kur hapet */}
  <div
    className={`transition-all duration-500 transform ${
      showBooking
        ? "max-h-[1200px] opacity-100 scale-100"
        : "max-h-0 opacity-0 scale-95 overflow-hidden"
    }`}
  >
    <div className="p-6">
      {step === "booking" && (
        <form
          onSubmit={handleBookingSubmit}
          className="space-y-4 flex flex-col flex-grow"
        >
          {/* Date Picker */}
          <DatePicker
            selected={form.date}
            onChange={(date) => setForm({ ...form, date })}
            dateFormat="dd.MM.yyyy"
            locale="de"
            placeholderText="TT.MM.JJJJ"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm"
            minDate={minSelectableDate}
          />

          {/* Time Slots */}
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: (20 - 7) * 2 + 2 }, (_, i) => {
              const hour = 7 + Math.floor(i / 2);
              const minutes = i % 2 === 0 ? "00" : "30";
              const time = `${String(hour).padStart(2, "0")}:${minutes}`;
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => setForm({ ...form, time })}
                  className={`px-3 py-2 rounded-lg text-sm border 
                    ${
                      form.time === time
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                >
                  {time}
                </button>
              );
            })}
          </div>

          {/* Hours Selection */}
          <div className="flex items-center gap-4 mt-4">
            <label className="text-sm font-medium text-gray-700">
              Dauer (Std):
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-white">
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    hours: Math.max(2, (prev.hours || 2) - 0.5),
                  }))
                }
                className="px-3 py-1 text-lg font-bold text-gray-600 hover:text-black"
              >
                –
              </button>
              <span className="px-4 text-lg font-semibold text-gray-800 select-none">
                {form.hours || 2}
              </span>
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    hours: Math.min(8, (prev.hours || 2) + 0.5),
                  }))
                }
                className="px-3 py-1 text-lg font-bold text-gray-600 hover:text-black"
              >
                +
              </button>
            </div>
          </div>

          {/* Service Dropdown */}
          <select
            value={form.service}
            onChange={(e) =>
              setForm({
                ...form,
                service: e.target.value,
                subService: "",
              })
            }
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm"
          >
            <option value="">Service auswählen</option>
            {allServices.map((srv) => (
              <option key={srv.id} value={String(srv.id)}>
                {srv.name}
              </option>
            ))}
          </select>

          {/* Subservice Dropdown */}
          {selectedService?.subServices?.length > 0 && (
            <select
              value={form.subService}
              onChange={(e) =>
                setForm({ ...form, subService: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm"
            >
              <option value="">Subservice auswählen</option>
              {selectedService.subServices.map((sub) => (
                <option key={sub.id} value={String(sub.id)}>
                  {sub.name}
                </option>
              ))}
            </select>
          )}

          <button
            type="submit"
            className="mt-12 bg-[#B99B5F] text-white py-3 rounded-lg font-semibold text-sm 
              hover:bg-[#bca77c] transition"
          >
            Termin buchen
          </button>
        </form>
      )}

      {/* Step 2: Payment */}
{step === "payment" && !editingCard && (
        <div className="p-2 bg-white rounded-2xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Zahlungsdetails</h2>
          <CardElement className="border p-3 rounded-lg" />
          <div className="flex items-start mt-4">
            <input
              type="checkbox"
              checked={agbAccepted}
              onChange={(e) => setAgbAccepted(e.target.checked)}
              className="mr-2 mt-[5px]"
            />
            <span>
              Ich akzeptiere die{" "}
              <a
                href="/AVB"
                target="_blank"
                className="text-[#B99B5F] underline"
              >
                AVB
              </a>
            </span>
          </div>
          {agbError && (
            <p className="text-red-500 text-sm">{agbError}</p>
          )}
          <button
            onClick={handleStripePayment}
            className="mt-6 bg-[#04436F] text-white py-3 px-6 rounded-lg"
          >
            Zahlung bestätigen
          </button>
        </div>
      )}

      {/* Step 3: Done */}
      {step === "done" && (
        <div className="p-6 bg-white rounded-2xl shadow-md text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            🎉 Termin erfolgreich gebucht!
          </h2>
          <p className="text-gray-700 mb-6">
            Ihre Zahlung wurde bestätigt und Ihr Termin ist gespeichert.
          </p>
          <button
            onClick={() => setStep("booking")}
            className="bg-[#04436F] text-white py-3 px-6 rounded-lg hover:bg-[#033553] transition"
          >
            Neuen Termin buchen
          </button>
        </div>
      )}
    </div>
  </div>
</section>

          </section>

     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-8">


          </div>
{selectedAppointment && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-lg w-full relative">
      <button
        onClick={() => setSelectedAppointment(null)} // Mbyll modalin kur shtypet
        className="absolute top-2 right-2 text-gray-500 hover:text-black"
      >
        ✕
      </button>

      <h3 className="text-xl font-semibold text-[#B99B5F] mb-4">
        Termin Details
      </h3>

      {!isEditing ? (
        <>
          {/* Shfaqja e detajeve */}
          <p>
            <strong>Datum:</strong>{" "}
            {new Date(selectedAppointment.date).toLocaleDateString("de-DE")}
          </p>
          <p>
            <strong>Uhrzeit:</strong> {selectedAppointment.startTime}
          </p>
          <p>
            <strong>Dauer:</strong> {selectedAppointment.hours} Std
          </p>
          <p>
            <strong>Gebuchte Dienstleistungen:</strong> {selectedAppointment.serviceName}
          </p>
          <p>
            <strong>Dienstleistung Unterkategorie:</strong> {selectedAppointment.subServiceName}
          </p>

          {/* Butoni për editim */}
          <button
            onClick={() => setIsEditing(true)} // Aktivizo redaktimin
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Bearbeiten
          </button>
        </>
      ) : (
        <>
          {/* Pjesa e formularit për editim */}
          <label className="block text-sm font-medium">Datum</label>
          <DatePicker
selected={
  editData.date && !isNaN(new Date(editData.date + "T12:00:00"))
    ? new Date(editData.date + "T12:00:00")
    : null
}
            onChange={(date) =>
              setEditData((prev) => ({
                ...prev,
                date: date.toISOString().split("T")[0],
              }))
            }
            dateFormat="dd.MM.yyyy"
            locale="de"
            className="border px-3 py-2 rounded-lg w-full mb-3"
          />

          <label className="block text-sm font-medium">Uhrzeit</label>
          <input
            type="time"
            value={editData.startTime || ""}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, startTime: e.target.value }))
            }
            className="border px-3 py-2 rounded-lg w-full mb-3"
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setIsEditing(false)} // Kthehu në shikimin normal
              className="px-4 py-2 rounded-lg border"
            >
              Abbrechen
            </button>
            <button
              onClick={async () => {
                await fetch("/api/appointments", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    id: selectedAppointment.id,
                    update: {
                      date: editData.date,
                      startTime: editData.startTime,
                    },
                  }),
                });
                // Përdorimi i detajeve të reja për të përditësuar listën
                setAppointments((prev) =>
                  prev.map((a) =>
                    a.id === selectedAppointment.id
                      ? { ...a, ...editData }
                      : a
                  )
                );
                setIsEditing(false);
                setSelectedAppointment(null); // Mbylle modalin pas ruajtjes
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Speichern
            </button>
          </div>
        </>
      )}
      
    </div>
  </div>
)}

        </main>
      </div>
    </div>
  );
}
