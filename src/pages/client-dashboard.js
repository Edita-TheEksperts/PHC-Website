import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import RegisterForm1 from "../components/RegisterForm1";
import RegisterForm2 from "../components/RegisterForm2";
import { ChevronDown, ChevronUp } from "lucide-react";
import RegisterForm3 from "../components/RegisterForm3";
import RegisterForm4 from "../components/RegisterForm4";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker";
import { de } from "date-fns/locale";

import {
  CalendarDays,
  Clock,
  Plane,
  AlarmClock,
  Hourglass,
} from "lucide-react";

import { addDays, format } from "date-fns";

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import ClientDashboard2 from "../components/ClientDashboard2";
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

  const [updatedData, setUpdatedData] = useState({});
  const [showAppointments, setShowAppointments] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showOverlayForm, setShowOverlayForm] = useState(true);
  const [services, setServices] = useState("");
  const [isNotifVisible, setIsNotifVisible] = useState(false);
  const [notifShownOnce, setNotifShownOnce] = useState(false);
  const [filter, setFilter] = useState("cancelled"); // ose "done"

  const router = useRouter();
  const [vacations, setVacations] = useState([]);

  const [allServices, setAllServices] = useState([]);

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
  useEffect(() => {
    console.log("🔹 allServices:", allServices);
  }, [allServices]);

  useEffect(() => {
    console.log("🔹 Current form state:", form);
    console.log("🔹 Selected service (object):", selectedService);
  }, [form, selectedService]);

  useEffect(() => {
    console.log("🔹 Appointments loaded:", appointments);
  }, [appointments]);

  useEffect(() => {
    console.log("🔹 Vacations loaded:", vacations);
  }, [vacations]);

  useEffect(() => {
    if (!userData?.id) return;

    fetch(`/api/appointments?userId=${userData.id}`)
      .then((res) => res.json())
      .then((data) => setAppointments(data));
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

  const cancelAppointment = async (id) => {
    await fetch("/api/appointments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, cancel: true }),
    });

    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === id ? { ...appt, status: "cancelled" } : appt
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
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          router.push("/");
          return;
        }
        const res = await fetch("/api/user/getUserData", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Fehler beim Laden der Benutzerdaten");
        const user = await res.json();
        setUserData(user);
        setUpdatedData(user);

        const selectedService = localStorage.getItem("selectedService");
        const userService =
          Array.isArray(user.services) && user.services.length
            ? user.services[0].name.trim()
            : "";

        const serviceKey = normalize(userService || selectedService || "");
        setServices(serviceKey);

        const formCompletionMap = {
          haushaltshilfeundwohnpflege: "form1Completed",
          freizeitundsozialeaktivitaeten: "form2Completed",
          gesundheitsfuersorge: "form3Completed",
          alltagsbegleitungundbesorgungen: "form4Completed",
        };

        const formKey = formCompletionMap[serviceKey];
        const isCompleted = user[formKey] === true;
        setShowOverlayForm(formKey && !isCompleted);

        const needsPersonalData =
          !user.languages ||
          !user.languages.trim() ||
          !user.otherLanguage ||
          !user.otherLanguage.trim() ||
          !user.pets ||
          !user.pets.trim() ||
          !user.allergies ||
          !user.allergies.trim() ||
          !user.specialRequests ||
          !user.specialRequests.trim() ||
          !user.emergencyContactName ||
          !user.emergencyContactName.trim() ||
          !user.emergencyContactPhone ||
          !user.emergencyContactPhone.trim();

        setIsNotifVisible(needsPersonalData);
        setLoading(false);
      } catch (err) {
        console.error(err);
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
        console.log("✅ Services API response:", data);
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
    const res = await fetch("/api/updateUserData", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userData.id, ...updatedData }),
    });
    alert(
      res.ok ? "Daten erfolgreich aktualisiert!" : "Fehler beim Aktualisieren."
    );
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
      await fetch("/api/vacation/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          startDate: startDate?.toISOString().split("T")[0], // yyyy-mm-dd
          endDate: endDate?.toISOString().split("T")[0],
        }),
      });
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
        <DatePicker
          selected={startDate}
          onChange={(date) => {
            setStartDate(date);
            setEndDate(null); // reset enddate when start changes 
          }}
          dateFormat="dd.MM.yyyy"
          locale="de"
          placeholderText="dd.mm.yyyy"
          minDate={new Date()} // don t approve before today date 
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm"
        />

        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          dateFormat="dd.MM.yyyy"
          locale="de"
          placeholderText="dd.mm.yyyy"
          minDate={startDate || new Date()} // mos lejo përpara startDate
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm"
        />

        <button
          type="submit"
          className="bg-[#04436F] text-white py-2 px-4 rounded-lg"
        >
          Urlaub speichern
        </button>
      </form>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-100 font-sans">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <nav className="w-72 bg-[#B99B5F] text-white p-4 flex flex-col shadow-lg">
          <h1 className="text-4xl font-bold text-center mb-12 select-none">
            PHC
          </h1>
          <ul className="space-y-6 flex-grow">
            <li className="text-lg font-medium hover:text-[#A6884A] cursor-pointer transition">
              Dashboard
            </li>
            <li
              onClick={() => router.push("/dashboard/personal-info")}
              className="relative flex items-center gap-3 text-lg font-medium cursor-pointer hover:text-[#A6884A] transition"
            >
              Persönliche Informationen
              {isNotifVisible && (
                <span className="w-4 h-4 bg-[#04436F] rounded-full animate-pulse"></span>
              )}
              {isNotifVisible && (
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-6 w-72 bg-white text-black rounded-2xl shadow-lg p-5 z-50">
                  <div className="flex items-start gap-4">
                    <svg
                      className="w-7 h-7 text-[#04436F] flex-shrink-0"
                      fill="#04436F"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M12 2a6 6 0 00-6 6v4H5a1 1 0 000 2h14a1 1 0 000-2h-1V8a6 6 0 00-6-6zM6 18a6 6 0 0012 0H6z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-base mb-1">
                        Bitte persönliche Daten ausfüllen
                      </p>
                      <p className="text-sm text-gray-600">
                        Diese Daten sind für uns wichtig.
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsNotifVisible(false);
                      }}
                      aria-label="Close notification"
                      className="text-2xl font-bold text-gray-400 hover:text-gray-700"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              )}
            </li>

            <li
              onClick={() => router.push("/dashboard/formular")}
              className="text-lg font-medium hover:text-[#A6884A] cursor-pointer transition"
            >
              Formular
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-12 overflow-auto">
          {/* Header */}
          <header className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-[#B99B5F]">
              Kundenübersicht{" "}
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5m-6 6H3"
                />
              </svg>
              Logout
            </button>
          </header>

          {/* User Info + Documents + Service */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <article className="bg-white p-8 rounded-3xl shadow-xl">
              <h3 className="text-2xl font-semibold text-[#B99B5F] mb-8 select-none">
                Benutzerinformationen
              </h3>

              <p className="text-lg mb-3">
                <strong>Name:</strong> {userData.firstName} {userData.lastName}
              </p>
              <p className="text-lg mb-3">
                <strong>Email:</strong> {userData.email}
              </p>
              <p className="text-lg mb-3">
                <strong>Telefon:</strong> {userData.phone}
              </p>
              <p className="text-lg mb-3">
                <strong>Adresse:</strong> {userData.address}
              </p>
            </article>

            <article className="bg-white p-8 rounded-3xl shadow-xl max-w-3xl mx-auto space-y-12">
              {/* --- NÄCHSTE TERMINE --- */}
              <section className="bg-white rounded-2xl shadow-xl border border-gray-200">
                {/* Header */}
                <header
                  onClick={() => setShowAppointments((prev) => !prev)}
                  className="flex items-center justify-between px-6 py-4 cursor-pointer select-none border-b border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <CalendarDays className="w-6 h-6 text-[#B99B5F]" />
                    <h3 className="text-xl font-bold text-gray-800">
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

                {/* Content */}
                <div
                  className={`transition-all duration-500 overflow-hidden ${
                    showAppointments
                      ? "max-h-[1000px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-6 space-y-4">
                    {appointments.filter((a) => a.status !== "cancelled")
                      .length > 0 ? (
                      <ul
                        className="space-y-4 max-h-96 overflow-y-auto pr-2 
                   scrollbar-thin scrollbar-thumb-[#B99B5F]/40 
                   scrollbar-track-transparent"
                      >
                        {appointments
                          .filter((a) => a.status !== "cancelled")
                          .map((appt) => (
                            <li
                              key={appt.id}
                              className="p-5 rounded-2xl shadow-md hover:shadow-lg transition 
                         bg-[#B99B5F]/10 border border-[#B99B5F]/20"
                            >
                              {/* Info */}
                              <div className="space-y-2 text-sm text-gray-800">
                                <div className="flex items-center justify-between">
                                  <p className="flex items-center gap-2 font-semibold">
                                    <CalendarDays className="w-4 h-4 text-[#B99B5F]" />{" "}
                                    {appt.day}
                                  </p>
                                  <span
                                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                                      appt.status === "active"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-600"
                                    }`}
                                  >
                                    {appt.status}
                                  </span>
                                </div>

                                {appt.date && (
                                  <p className="flex items-center gap-2 text-xs text-gray-600">
                                    <Clock className="w-4 h-4 text-[#B99B5F]" />
                                    {new Date(appt.date).toLocaleDateString(
                                      "de-DE",
                                      {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      }
                                    )}
                                  </p>
                                )}

                                <div className="flex items-center gap-4 text-xs text-gray-600">
                                  <span className="flex items-center gap-2">
                                    <AlarmClock className="w-4 h-4 text-[#B99B5F]" />{" "}
                                    {appt.startTime}
                                  </span>
                                  <span className="flex items-center gap-2">
                                    <Hourglass className="w-4 h-4 text-[#B99B5F]" />{" "}
                                    {appt.hours} Std
                                  </span>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex gap-2 mt-4">
                                <button
                                  onClick={() => cancelAppointment(appt.id)}
                                  className="flex-1 px-4 py-2 text-xs font-medium text-red-600 
                             bg-red-50 border border-red-200 rounded-lg hover:bg-red-100"
                                >
                                  Abbrechen
                                </button>
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

              {/* --- Modal für Details --- */}
              {selectedAppointment && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                  <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative">
                    {/* Close btn */}
                    <button
                      onClick={() => setSelectedAppointment(null)}
                      className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-lg"
                    >
                      ×
                    </button>

                    <h3 className="text-xl font-bold text-[#B99B5F] mb-4">
                      Termin Details
                    </h3>

                    <div className="space-y-2 text-sm text-gray-700">
                      <p>
                        <strong>Tag:</strong> {selectedAppointment.day}
                      </p>
                      <p>
                        <strong>Datum:</strong>{" "}
                        {new Date(selectedAppointment.date).toLocaleDateString(
                          "de-DE",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                      <p>
                        <strong>Startzeit:</strong>{" "}
                        {selectedAppointment.startTime}
                      </p>
                      <p>
                        <strong>Dauer:</strong> {selectedAppointment.hours} Std
                      </p>
                      {selectedAppointment.serviceName && (
                        <p>
                          <strong>Service:</strong>{" "}
                          {selectedAppointment.serviceName}
                        </p>
                      )}
                      {selectedAppointment.subServiceName && (
                        <p>
                          <strong>Sub-Service:</strong>{" "}
                          {selectedAppointment.subServiceName}
                        </p>
                      )}
                      {selectedAppointment.kilometers && (
                        <p>
                          <strong>Kilometer:</strong>{" "}
                          {selectedAppointment.kilometers}
                        </p>
                      )}
                      <p>
                        <strong>Status:</strong> {selectedAppointment.status}
                      </p>
                    </div>

                    <div className="mt-6 text-right">
                      <button
                        onClick={() => setSelectedAppointment(null)}
                        className="px-4 py-2 bg-[#04436F] text-white rounded-lg hover:bg-[#033553] transition"
                      >
                        Schließen
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* --- URLAUB --- */}
              <section>
                <header className="flex items-center gap-2 mb-6">
                  <Plane className="w-6 h-6 text-[#B99B5F]" />
                  <h3 className="text-xl font-bold text-gray-800">Urlaub</h3>
                </header>

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
                            {new Date(v.startDate).toLocaleDateString("de-CH")}{" "}
                            – {new Date(v.endDate).toLocaleDateString("de-CH")}
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
              </section>
            </article>

            <article className="bg-white p-8 rounded-3xl shadow-xl max-w-lg mx-auto">
              {/* Optional Dashboard2 */}
              <div className="mt-8">
                {userData?.id && <ClientDashboard2 userId={userData.id} />}
              </div>
            </article>
          </section>

          <div className="max-w-7xl mx-auto px-6 mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* --- SERVICE HISTORY --- */}
              <section className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col">
                {/* Header */}
                <div
                  className="flex items-center justify-between mb-4 cursor-pointer select-none"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  <h3 className="text-2xl font-semibold text-[#B99B5F] uppercase tracking-wide">
                    Serviceverlauf
                  </h3>
                  {showHistory ? (
                    <ChevronUp className="w-6 h-6 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-500" />
                  )}
                </div>

                {/* Filter buttons */}
                {showHistory && (
                  <div className="flex items-center gap-6 mb-6">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilter("cancelled");
                      }}
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      <span
                        className={`w-4 h-4 rounded-full border-2 ${
                          filter === "cancelled"
                            ? "bg-red-500 border-red-600 scale-110"
                            : "bg-red-300 border-red-400"
                        }`}
                      ></span>
                      <span
                        className={`${
                          filter === "cancelled"
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        Cancelled
                      </span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilter("done");
                      }}
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      <span
                        className={`w-4 h-4 rounded-full border-2 ${
                          filter === "done"
                            ? "bg-green-500 border-green-600 scale-110"
                            : "bg-green-300 border-green-400"
                        }`}
                      ></span>
                      <span
                        className={`${
                          filter === "done" ? "text-green-600" : "text-gray-600"
                        }`}
                      >
                        Done
                      </span>
                    </button>
                  </div>
                )}

                {/* List */}
                {showHistory && (
                  <ul
                    className="space-y-4 max-h-96 overflow-y-auto pr-2 
                   scrollbar-thin scrollbar-thumb-[#B99B5F]/40 scrollbar-track-transparent"
                  >
                    {appointments.filter((a) => a.status === filter).length >
                    0 ? (
                      appointments
                        .filter((a) => a.status === filter)
                        .map((item) => (
                          <li
                            key={item.id}
                            className={`p-5 rounded-2xl shadow-md hover:shadow-lg transition 
                ${
                  item.status === "cancelled"
                    ? "bg-red-50 border border-red-200"
                    : "bg-green-50 border border-green-200"
                }`}
                          >
                            {/* Info */}
                            <div className="space-y-2 text-sm text-gray-800">
                              <div className="flex items-center justify-between">
                                <p className="flex items-center gap-2 font-semibold">
                                  <CalendarDays className="w-4 h-4 text-[#B99B5F]" />{" "}
                                  {item.day}
                                </p>
                                <span
                                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                                    item.status === "done"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {item.status}
                                </span>
                              </div>

                              {item.date && (
                                <p className="flex items-center gap-2 text-xs text-gray-600">
                                  <Clock className="w-4 h-4 text-[#B99B5F]" />
                                  {new Date(item.date).toLocaleDateString(
                                    "de-DE",
                                    {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )}
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
                                  <strong>Sub-Service:</strong>{" "}
                                  {item.subServiceName}
                                </p>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-2 mt-4">
                              <button
                                onClick={() => setSelectedAppointment(item)}
                                className="px-4 py-2 text-xs font-medium text-[#04436F] 
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
                )}
              </section>

              {/* New Booking */}
              {/* New Booking */}
              <section className="bg-white p-4 rounded-2xl shadow-lg border border-gray-200 flex flex-col">
                <h3 className="text-2xl font-semibold text-[#B99B5F] uppercase tracking-wide mb-6 text-center select-none">
                  Neue Buchung planen
                </h3>

                {step === "booking" && (
                  <form
                    onSubmit={handleBookingSubmit}
                    className="space-y-4 flex flex-col flex-grow"
                  >
                    {/* Date Picker (14 days ahead only) */}
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
                        const time = `${String(hour).padStart(
                          2,
                          "0"
                        )}:${minutes}`;
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
                        {/* Minus Button */}
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

                        {/* Hours Display */}
                        <span className="px-4 text-lg font-semibold text-gray-800 select-none">
                          {form.hours || 2}
                        </span>

                        {/* Plus Button */}
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
                      className="mt-12 bg-[#04436F] text-white py-3 rounded-lg font-semibold text-sm 
             hover:bg-[#033553] transition"
                    >
                      Termin buchen
                    </button>
                  </form>
                )}

                {/* Step 2: Payment */}
                {step === "payment" && (
                  <div className="p-2 bg-white rounded-2xl shadow-md">
                    <h2 className="text-xl font-bold mb-4">Zahlungsdetails</h2>

                    <CardElement className="border p-3 rounded-lg" />

                    {/* AGB checkbox */}
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
                          href="/AGB"
                          target="_blank"
                          className="text-[#B99B5F] underline"
                        >
                          AGB
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
                      Ihre Zahlung wurde bestätigt und Ihr Termin ist
                      gespeichert.
                    </p>
                    <button
                      onClick={() => setStep("booking")}
                      className="bg-[#04436F] text-white py-3 px-6 rounded-lg hover:bg-[#033553] transition"
                    >
                      Neuen Termin buchen
                    </button>
                  </div>
                )}
              </section>

              {/* Update Information Form */}
              {/* Update Information Form */}
              <section className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col">
                <h3 className="text-2xl font-semibold text-[#B99B5F] uppercase tracking-wide mb-6 text-center select-none">
                  Informationen aktualisieren
                </h3>
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 flex flex-col"
                >
                  {[
                    { name: "firstName", label: "Vorname", type: "text" },
                    { name: "lastName", label: "Nachname", type: "text" },
                    { name: "email", label: "E-Mail Adresse", type: "email" },
                    { name: "phone", label: "Telefonnummer", type: "tel" },
                    {
                      name: "emergencyContactName",
                      label: "Notfallkontakt Name",
                      type: "text",
                    },
                    {
                      name: "emergencyContactPhone",
                      label: "Notfallkontakt Telefon",
                      type: "tel",
                    },
                  ].map(({ name, label, type }) => (
                    <div key={name} className="flex flex-col gap-1">
                      <label
                        htmlFor={name}
                        className="text-sm font-medium text-gray-700"
                      >
                        {label}
                      </label>
                      <input
                        id={name}
                        type={type}
                        name={name}
                        value={updatedData[name] || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm 
                     placeholder-gray-400 focus:ring-2 focus:ring-[#04436F] 
                     focus:outline-none transition"
                      />
                    </div>
                  ))}

                  {/* Buton si “Termin buchen” */}
                  <button
                    type="submit"
                    className="mt-4 bg-[#04436F] text-white py-3 rounded-lg font-semibold text-sm 
                 hover:bg-[#033553] transition"
                  >
                    Änderungen speichern
                  </button>
                </form>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
