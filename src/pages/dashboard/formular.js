// pages/dashboard/formular.js
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

export default function FormularPage() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("userToken")
        if (!token) return router.push("/")
        const res = await fetch("/api/user/getUserData", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Fehler beim Abrufen der Daten")
        const data = await res.json()
        setUserData(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchUserData()
  }, [])

  if (loading)
    return <p className="p-10 text-center text-xl text-[#B99B5F]">Lädt Formular-Daten...</p>

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <nav className="w-72 bg-[#B99B5F] text-white p-8 flex flex-col shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-12 select-none">PHC</h1>
        <ul className="space-y-6 flex-grow">
          <li
            onClick={() => router.push("/client-dashboard")}
            className="text-lg font-medium hover:text-[#A6884A] cursor-pointer transition"
          >
            Dashboard
          </li>
          <li
            onClick={() => router.push("/dashboard/personal-info")}
            className="text-lg font-medium hover:text-[#A6884A] cursor-pointer transition"
          >
            Persönliche Daten
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

      {/* Content */}
      <main className="flex-1 p-10 max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg p-12">
          <h2 className="text-4xl font-bold mb-12 text-gray-900 border-b pb-4">Formulardaten</h2>

         <section className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 text-gray-800">
  {[
    { label: "Begleitung / Gesellschaft", value: userData.companionship },
    { label: "Gemeinsames Kochen", value: userData.cooking },
    { label: "Biografiearbeit gewünscht", value: userData.biographyWork },
    { label: "Technik vorhanden", value: userData.hasTech },
    { label: "Liest gerne", value: userData.reads },
    { label: "Spielt Kartenspiele", value: userData.playsCards },
    { label: "Allergien vorhanden", value: userData.hasAllergies },
    { label: "Allergie-Details", value: userData.allergyDetails },
    { label: "Ausflüge", value: userData.outings },
    { label: "Pflegehilfsmittel", value: userData.aids },
    { label: "Andere Hilfsmittel", value: userData.aidsOther },
    { label: "Inkontinenz", value: userData.incontinence },
    { label: "Sehen", value: userData.communicationSehen },
    { label: "Hören", value: userData.communicationHören },
    { label: "Sprechen", value: userData.communicationSprechen },
    { label: "Ernährungshilfe", value: userData.foodSupport },
    { label: "Grundpflege", value: userData.basicCare },
    { label: "Andere Grundpflege", value: userData.basicCareOther },
    { label: "Gesundheitsförderung", value: userData.healthActivities },
    { label: "Andere Gesundheitsförderung", value: userData.healthActivitiesOther },
    { label: "Mentale Unterstützung benötigt", value: userData.mentalSupport },
    { label: "Diagnosen", value: userData.mentalConditions },
    { label: "Verhaltensmerkmale", value: userData.behaviorTraits },
    { label: "Medizinische Befunde", value: userData.medicalFindings },
    { label: "Anzahl Räume im Haushalt", value: userData.householdRooms },
    { label: "Anzahl Personen im Haushalt", value: userData.householdPeople },
  ].map(({ label, value }) => (
    <div key={label} className="flex flex-col border-b border-gray-200 pb-4 last:border-b-0">
      <span className="font-semibold text-lg mb-1 text-gray-700">{label}</span>
      <span className="text-base text-gray-900">{value || "—"}</span>
    </div>
  ))}
</section>
        </div>
      </main>
    </div>
  )
}
