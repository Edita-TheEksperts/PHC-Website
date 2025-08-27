import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import RegisterForm1 from "../components/RegisterForm1"
import RegisterForm2 from "../components/RegisterForm2"
import RegisterForm3 from "../components/RegisterForm3"
import RegisterForm4 from "../components/RegisterForm4"
import { Pie, Line } from "react-chartjs-2"
import OvertimeAlerts from "../components/OvertimeAlerts"; // Adjust import based on your file structure
import { CalendarDays,Clock, Plane, AlarmClock, Hourglass } from "lucide-react" // or any icon library you use
import ClientDashboard2 from "../components/ClientDashboard2"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js"

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
)

const chartColors = ["#B99B5F", "#04436F", "#A6884A", "#6B8E23"]

const ServiceUsageChart = ({ services }) => {
  const counts = services.reduce((acc, s) => {
    const name = s.name || "Unbekannt"
    acc[name] = (acc[name] || 0) + 1
    return acc
  }, {})

  const data = {
    labels: Object.keys(counts),
    datasets: [
      {
        data: Object.values(counts),
        backgroundColor: chartColors,
        hoverOffset: 25,
      },
    ],
  }

  return (
    <section className="bg-white p-6 rounded-2xl shadow-lg transition-shadow hover:shadow-xl">
      <h3 className="text-xl font-semibold text-[#B99B5F] mb-6">Service-Verteilung</h3>
      <Pie data={data} />
    </section>
  )
}

const BookingsOverTimeChart = ({ schedules }) => {
  const counts = schedules.reduce((acc, e) => {
    acc[e.day] = (acc[e.day] || 0) + 1
    return acc
  }, {})

  const sortedDates = Object.keys(counts).sort((a, b) => new Date(a) - new Date(b))

  const data = {
    labels: sortedDates,
    datasets: [
      {
        label: "Buchungen pro Tag",
        data: sortedDates.map((d) => counts[d]),
        borderColor: chartColors[0],
        backgroundColor: "rgba(185,155,95,0.3)",
        fill: true,
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  }



  return (
    <section className="bg-white p-6 rounded-2xl shadow-lg transition-shadow hover:shadow-xl">
      <h3 className="text-xl font-semibold text-[#B99B5F] mb-6">Buchungen im Zeitverlauf</h3>
      <Line data={data} />
    </section>
  )
}


export default function ClientDashboard() {
  const [userData, setUserData] = useState(null)
  const [employees, setEmployees] = useState([]);  // State to store employee data
  const [targetHours, setTargetHours] = useState([]) // Default target hours for overtime alerts

  const [loading, setLoading] = useState(true)
  const [updatedData, setUpdatedData] = useState({})
  const [showOverlayForm, setShowOverlayForm] = useState(true)
  const [services, setServices] = useState("")
  const [isNotifVisible, setIsNotifVisible] = useState(false)
  const router = useRouter()
const [vacations, setVacations] = useState([])
const [appointments, setAppointments] = useState([])
useEffect(() => {
  if (!userData?.id) return

  fetch(`/api/appointments?userId=${userData.id}`) // ✅ filter by current client
    .then((res) => res.json())
    .then((data) => setAppointments(data))
}, [userData])

const markAsDone = async (id) => {
  await fetch("/api/appointments", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, update: { captured: true } }),
  })
  setAppointments((prev) =>
    prev.map((appt) => (appt.id === id ? { ...appt, captured: true } : appt))
  )
}

const cancelAppointment = async (id) => {
  await fetch("/api/appointments", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  })
  setAppointments((prev) => prev.filter((appt) => appt.id !== id))
}

const fetchVacations = async (userId) => {
  const res = await fetch(`/api/vacation/get?userId=${userId}`)
  if (res.ok) {
    const data = await res.json()
    setVacations(data)
  }
}
useEffect(() => {
  if (userData?.id) {
    fetchVacations(userData.id)
  }
}, [userData])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("userToken")
        if (!token) {
          router.push("/")
          return
        }
        const res = await fetch("/api/user/getUserData", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Fehler beim Laden der Benutzerdaten")
        const user = await res.json()
        setUserData(user)
        setUpdatedData(user)

        const selectedService = localStorage.getItem("selectedService")
        const userService = Array.isArray(user.services) && user.services.length
          ? user.services[0].name.trim()
          : ""

        const serviceKey = normalize(userService || selectedService || "")
        setServices(serviceKey)

        const formCompletionMap = {
          haushaltshilfeundwohnpflege: "form1Completed",
          freizeitundsozialeaktivitaeten: "form2Completed",
          gesundheitsfuersorge: "form3Completed",
          alltagsbegleitungundbesorgungen: "form4Completed",
        }

        const formKey = formCompletionMap[serviceKey]
        const isCompleted = user[formKey] === true
        setShowOverlayForm(formKey && !isCompleted)

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
          !user.emergencyContactPhone.trim()

        setIsNotifVisible(needsPersonalData)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setLoading(false)
      }
    }
    fetchUserData()
  }, [router])

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
      .replace(/[^\w]/g, "") || ""

  const formMap = {
    haushaltshilfeundwohnpflege: RegisterForm1,
    freizeitundsozialeaktivitaeten: RegisterForm2,
    gesundheitsfuhrsorge: RegisterForm3,
    alltagsbegleitungundbesorgungen: RegisterForm4,
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setUpdatedData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch("/api/updateUserData", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userData.id, ...updatedData }),
    })
    alert(res.ok ? "Daten erfolgreich aktualisiert!" : "Fehler beim Aktualisieren.")
  }

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-[#B99B5F] text-xl font-semibold">
        Lädt...
      </div>
    )

  const SelectedForm = formMap[services]
function VacationForm({ userId, refreshVacations }) {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    await fetch("/api/vacation/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, startDate, endDate }),
    })
    setStartDate("")
    setEndDate("")
    refreshVacations()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
      <button type="submit" className="bg-[#04436F] text-white py-2 px-4 rounded-lg">
        Urlaub speichern
      </button>
    </form>
  )
}

  return (
    <div className="relative min-h-screen bg-gray-100 font-sans">
     

<div className="flex min-h-screen">
        {/* Sidebar */}
        <nav className="w-72 bg-[#B99B5F] text-white p-4 flex flex-col shadow-lg">
          <h1 className="text-4xl font-bold text-center mb-12 select-none">PHC</h1>
          <ul className="space-y-6 flex-grow">
            <li className="text-lg font-medium hover:text-[#A6884A] cursor-pointer transition">Dashboard</li>
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
                      <p className="font-semibold text-base mb-1">Bitte persönliche Daten ausfüllen</p>
                      <p className="text-sm text-gray-600">Diese Daten sind für uns wichtig.</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsNotifVisible(false)
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
          <button
            onClick={() => {
              localStorage.removeItem("userToken")
              localStorage.removeItem("selectedService")
              router.push("/")
            }}
            className="mt-auto bg-[#A6884A] hover:bg-[#8a6f3b] py-3 rounded-xl font-semibold text-lg transition"
          >
            Logout
          </button>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-12 overflow-auto">
          {/* Header */}
          <header className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-[#B99B5F]">Kundenübersicht</h2>
          </header>

          {/* User Info + Documents + Service */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <article className="bg-white p-8 rounded-3xl shadow-xl">

              <h3 className="text-2xl font-semibold text-[#B99B5F] mb-8 select-none">Benutzerinformationen</h3>
                    <OvertimeAlerts employees={employees} targetHours={targetHours} />

              <p className="text-lg mb-3"><strong>Name:</strong> {userData.firstName} {userData.lastName}</p>
              <p className="text-lg mb-3"><strong>Email:</strong> {userData.email}</p>
              <p className="text-lg mb-3"><strong>Telefon:</strong> {userData.phone}</p>
              <p className="text-lg mb-3"><strong>Adresse:</strong> {userData.address}</p>



            </article>

  <article className="bg-white p-8 rounded-3xl shadow-xl max-w-3xl mx-auto space-y-12">

  {/* --- NÄCHSTE TERMINE --- */}
 {/* --- NÄCHSTE TERMINE --- */}
<section>
  <header className="flex items-center gap-2 mb-6">
    <CalendarDays className="w-6 h-6 text-[#B99B5F]" />
    <h3 className="text-xl font-bold text-gray-800">Nächste Termine</h3>
  </header>

  {appointments.filter(a => a.status !== "cancelled").length > 0 ? (
    <ul className="space-y-4">
      {appointments
        .filter((a) => a.status !== "cancelled")
        .map(({ id, day, startTime, hours, date }) => (
          <li
            key={id}
            className="p-5 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition flex justify-between items-center"
          >
            {/* Info */}
            <div className="text-sm space-y-1 text-gray-700">
              <p className="flex items-center gap-2 font-semibold text-gray-900">
                <CalendarDays className="w-4 h-4 text-[#B99B5F]" /> {day}
              </p>
              {date && (
                <p className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {new Date(date).toLocaleDateString("de-DE", {
                    weekday: "long",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              )}
              <p className="flex items-center gap-2 text-xs text-gray-600">
                <AlarmClock className="w-4 h-4 text-gray-400" /> {startTime}
              </p>
              <p className="flex items-center gap-2 text-xs text-gray-600">
                <Hourglass className="w-4 h-4 text-gray-400" /> {hours} Std
              </p>
            </div>

            {/* Action */}
            <button
              onClick={() => cancelAppointment(id)}
              className="px-4 py-2 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition"
            >
              Abbrechen
            </button>
          </li>
        ))}
    </ul>
  ) : (
    <p className="italic text-gray-400">Keine Termine geplant</p>
  )}
</section>

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
                {new Date(v.startDate).toLocaleDateString()} –{" "}
                {new Date(v.endDate).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-500">Geplant</p>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p className="italic text-gray-400 text-center">Kein Urlaub eingetragen</p>
    )}
  </section>
</article>



  <article className="bg-white p-8 rounded-3xl shadow-xl max-w-lg mx-auto">
  <h3 className="text-2xl font-semibold text-[#B99B5F] mb-6 select-none">
    Services Übersicht
  </h3>

  {/* Deine Services */}
  <div className="mb-8">
    <h4 className="text-lg font-semibold text-gray-800 mb-4">Deine Services</h4>
    {userData.services && userData.services.length > 0 ? (
      <div className="space-y-3">
        {userData.services.map((service) => (
          <div
            key={service.id}
            className="flex items-center justify-between p-4 bg-[#B99B5F] text-white rounded-xl shadow-md font-semibold text-lg select-none"
          >
            <span>{service.name}</span>
            {/* X button */}
            <button
              onClick={async () => {
                const res = await fetch("/api/updateUserData", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    id: userData.id,
                    removeService: service.name,
                  }),
                });
                if (res.ok) {
                  const data = await res.json();
                  setUserData((prev) => ({
                    ...prev,
                    services: data.services,
                  }));
                }
              }}
              className="ml-3 text-white text-xl font-bold hover:text-red-300 transition"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-400 italic">Kein Service ausgewählt</p>
    )}
  </div>

  {/* Weitere Services hinzufügen */}
  <div>
    <h4 className="text-lg font-semibold text-gray-800 mb-4">
      Weitere Services hinzufügen
    </h4>
    <div className="space-y-3">
      {[
        "Haushaltshilfe und Wohnpflege",
        "Freizeit und Soziale Aktivitäten",
        "Gesundheitsführsorge",
        "Alltagsbegleitung und Besorgungen",
      ]
        .filter((service) => !userData.services.some((s) => s.name === service))
        .map((service, i) => (
          <button
            key={i}
            onClick={async () => {
              const res = await fetch("/api/updateUserData", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id: userData.id,
                  addService: service,
                }),
              });
              if (res.ok) {
                const data = await res.json();
                setUserData((prev) => ({
                  ...prev,
                  services: data.services,
                }));
              }
            }}
            className="w-full py-3 border border-[#B99B5F] rounded-xl text-[#B99B5F] font-semibold hover:bg-[#B99B5F] hover:text-white transition"
          >
            {service}
          </button>
        ))}
    </div>
  </div>

  {/* Optional Dashboard2 */}
  <div className="mt-8">
    {userData?.id && <ClientDashboard2 userId={userData.id} />}
  </div>
</article>


          </section>

          {/* Charts */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-14">
            {userData.services?.length > 0 && <ServiceUsageChart services={userData.services} />}
            {userData.schedules?.length > 0 && <BookingsOverTimeChart schedules={userData.schedules} />}
          </section>

       <div className="max-w-7xl mx-auto px-6 mt-16">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
   
{/* --- SERVICE HISTORY --- */}
<section className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col">
  <h3 className="text-2xl font-semibold text-[#B99B5F] uppercase tracking-wide mb-6 select-none">
    Serviceverlauf
  </h3>
  <ul className="space-y-3 text-gray-700 text-sm flex-grow overflow-auto">
    {appointments.filter((a) => a.status === "cancelled").length > 0 ? (
      appointments
        .filter((a) => a.status === "cancelled")
        .map((item) => (
          <li
            key={item.id}
            className="bg-gray-50 border border-gray-300 p-3 rounded-lg shadow-sm hover:shadow-md cursor-default select-none transition"
          >
            {new Date(item.date).toLocaleDateString("de-DE", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}{" "}
            · {item.day} · {item.hours} Std
          </li>
        ))
    ) : (
      <p className="italic text-gray-400">Noch keine Historie</p>
    )}
  </ul>
</section>

    {/* New Booking */}
    <section className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col">
      <h3 className="text-2xl font-semibold text-[#B99B5F] uppercase tracking-wide mb-6 text-center select-none">
        Neue Buchung planen
      </h3>
      <form className="space-y-4 flex flex-col flex-grow">
        <input
          type="date"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm placeholder-gray-500 focus:ring-2 focus:ring-[#B99B5F] focus:outline-none transition"
          placeholder="Datum auswählen"
        />
        <input
          type="time"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm placeholder-gray-500 focus:ring-2 focus:ring-[#B99B5F] focus:outline-none transition"
          placeholder="Uhrzeit auswählen"
        />
        <select
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#B99B5F] focus:outline-none transition"
          defaultValue=""
        >
          <option value="" disabled>
            Service auswählen
          </option>
          <option>Haushaltshilfe</option>
          <option>Gesundheitsführung</option>
          <option>Freizeit</option>
          <option>Begleitung</option>
        </select>
        <button
          type="submit"
          className="mt-auto bg-[#04436F] text-white py-3 rounded-lg font-semibold text-sm hover:bg-[#033553] transition"
        >
          Termin buchen
        </button>
      </form>
    </section>

    {/* Update Information Form */}
    <section className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col">
      <h3 className="text-2xl font-semibold text-[#B99B5F] uppercase tracking-wide mb-6 text-center select-none">
        Informationen aktualisieren
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4 flex flex-col flex-grow">
        {[
          { name: "firstName", placeholder: "Vorname", type: "text" },
          { name: "lastName", placeholder: "Nachname", type: "text" },
          { name: "email", placeholder: "E-Mail Adresse", type: "email" },
          { name: "phone", placeholder: "Telefonnummer", type: "tel" },
          { name: "emergencyContactName", placeholder: "Notfallkontakt Name", type: "text" },
          { name: "emergencyContactPhone", placeholder: "Notfallkontakt Telefon", type: "tel" },
        ].map(({ name, placeholder, type }) => (
          <input
            key={name}
            type={type}
            name={name}
            value={updatedData[name] || ""}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm placeholder-gray-500 focus:ring-2 focus:ring-[#B99B5F] focus:outline-none transition"
          />
        ))}
        <button
          type="submit"
          className="mt-auto py-3 bg-[#B99B5F] text-white rounded-lg font-semibold text-sm hover:bg-[#A6884A] transition"
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
  )
}
