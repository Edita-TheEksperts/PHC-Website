import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import RegisterForm1 from "../components/RegisterForm1"
import RegisterForm2 from "../components/RegisterForm2"
import RegisterForm3 from "../components/RegisterForm3"
import RegisterForm4 from "../components/RegisterForm4"
import { Pie, Line } from "react-chartjs-2"
import OvertimeAlerts from "../components/OvertimeAlerts"; // Adjust import based on your file structure
import { CalendarDays } from "lucide-react" // or any icon library you use
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
      {/* Overlay */}
      {showOverlayForm && SelectedForm && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex justify-center items-start p-6">
          <div className="bg-white shadow-xl rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-10 scrollbar-thin scrollbar-thumb-[#B99B5F]">
            <h2 className="text-2xl font-semibold mb-8 text-[#B99B5F]">
              Bitte füllen Sie das Serviceformular aus
            </h2>
            <SelectedForm onComplete={() => setShowOverlayForm(false)} />
          </div>
        </div>
      )}

      <div className={`flex min-h-screen transition-filter duration-300 ${showOverlayForm ? "blur-sm pointer-events-none" : ""}`}>
        {/* Sidebar */}
        <nav className="w-72 bg-[#B99B5F] text-white p-8 flex flex-col shadow-lg">
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
            <h2 className="text-4xl font-bold text-[#B99B5F]">Client Dashboard</h2>
            <button
              onClick={() => router.push("/edit-client-profile")}
              className="py-3 px-7 bg-[#B99B5F] text-white rounded-2xl font-semibold text-lg hover:bg-[#A6884A] transition"
            >
              Profil bearbeiten
            </button>
          </header>

          {/* User Info + Documents + Service */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <article className="bg-white p-8 rounded-3xl shadow-xl">

              <h3 className="text-2xl font-semibold text-[#B99B5F] mb-8 select-none">Benutzerinformationen</h3>
                    <OvertimeAlerts employees={employees} targetHours={targetHours} />

              <p className="text-lg mb-3"><strong>Name:</strong> {userData.firstName} {userData.lastName}</p>
              <p className="text-lg mb-3"><strong>Email:</strong> {userData.email}</p>
              <p className="text-lg mb-3"><strong>Telefon:</strong> {userData.phone}</p>
              <p className="text-lg mb-3"><strong>Adresse:</strong> {userData.address}</p>



            </article>

        <article className="bg-white p-8 rounded-3xl shadow-xl max-w-lg mx-auto">
  <h3 className="text-2xl font-semibold text-[#B99B5F] mb-6 select-none">Nächste Termine</h3>



{/* Geplante Termine */}
<div className="mb-6">

  {appointments.length > 0 ? (
    <ul className="space-y-4">
      {appointments.map(({ id, day, startTime, hours, date }) => (
        <li
          key={id}
          className="flex items-center justify-between p-5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition"
        >
          {/* Appointment Info */}
          <div className="flex flex-col text-gray-700">
            <span className="text-lg font-semibold flex items-center gap-2">
              📅 {day}
            </span>
            {date && (
              <span className="text-sm flex items-center gap-2 text-gray-500">
                🗓 {new Date(date).toLocaleDateString("de-DE", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
            <span className="text-sm flex items-center gap-2">
              ⏰ {startTime}
            </span>
            <span className="text-sm flex items-center gap-2">
              ⌛ {hours} Std
            </span>
          </div>

          {/* Cancel Button */}
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-xl shadow transition"
            onClick={() => cancelAppointment(id)}
          >
            Cancel
          </button>
        </li>
      ))}
    </ul>
  ) : (
    <p className="italic text-gray-400">Keine Termine geplant</p>
  )}
</div>




<section className="bg-gradient-to-b from-white to-gray-50 p-2 rounded-3xl  border border-t-gray-100 max-w-md mx-auto">
  {/* Title */}
  <h3 className="text-3xl font-bold text-[#B99B5F] uppercase mb-8 text-center tracking-wide">
    Urlaub
  </h3>

  {/* Vacation Form */}
  <div className="bg-gray-50 rounded-2xl p-5 shadow-inner mb-6">
    <VacationForm 
      userId={userData.id} 
      refreshVacations={() => fetchVacations(userData.id)} 
    />
  </div>

  {/* Vacation List */}
  <div className="mt-4">
    {vacations.length > 0 ? (
      <ul className="space-y-4">
        {vacations.map((v) => (
          <li 
            key={v.id} 
            className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition duration-200"
          >
            {/* Icon */}
            <div className="flex-shrink-0 bg-[#B99B5F]/10 p-3 rounded-xl">
              <CalendarDays className="text-[#B99B5F] w-6 h-6" />
            </div>

            {/* Date Info */}
            <div>
              <p className="text-gray-800 font-semibold">
                {new Date(v.startDate).toLocaleDateString()} – {new Date(v.endDate).toLocaleDateString()}
              </p>
              <p className="text-gray-500 text-sm italic">Geplant</p>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-400 italic text-center mt-6">
        Kein Urlaub eingetragen
      </p>
    )}
  </div>
</section>
</article>


     <article className="bg-white p-8 rounded-3xl shadow-xl max-w-lg mx-auto">
  <h3 className="text-2xl font-semibold text-[#B99B5F] mb-6 select-none">Gewählter Service</h3>

  {/* Highlight the chosen service */}
  <div className="mb-6 p-6 bg-[#B99B5F] text-white rounded-2xl shadow-md font-bold text-xl text-center select-none">
    {userData.services[0]?.name || "Kein Service ausgewählt"}
  </div>

  {/* List other services to choose from */}
  <div className="space-y-4">
    {[
      "Haushaltshilfe und Wohnpflege",
      "Freizeit und Soziale Aktivitäten",
      "Gesundheitsführsorge",
      "Alltagsbegleitung und Besorgungen",
    ]
      .filter((service) => service !== userData.services[0]?.name)
      .map((service, i) => (
        <button
          key={i}
          onClick={() => {
            localStorage.setItem("selectedService", service);
            // optionally reload or update state here
            window.location.reload();
          }}
          className="w-full py-3 border border-[#B99B5F] rounded-2xl text-[#B99B5F] font-semibold hover:bg-[#B99B5F] hover:text-white transition"
        >
          {service}
        </button>
      ))}
  </div>
   
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

    {/* Service History */}
    <section className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col">
      <h3 className="text-2xl font-semibold text-[#B99B5F] uppercase tracking-wide mb-6 select-none">
        Serviceverlauf
      </h3>
      <ul className="space-y-3 text-gray-700 text-sm flex-grow overflow-auto">
        {[
          "15. Mai 2025 · Haushaltshilfe für 4 Stunden",
          "10. Mai 2025 · Freizeitaktivitäten - Theaterbesuch",
          "03. Mai 2025 · Begleitung zum Arzttermin",
        ].map((item, i) => (
          <li
            key={i}
            className="bg-gray-50 border border-gray-300 p-3 rounded-lg shadow-sm hover:shadow-md cursor-default select-none transition"
          >
            {item}
          </li>
        ))}
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
