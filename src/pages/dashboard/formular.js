// pages/dashboard/formular.js
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Menu, X } from "lucide-react"
export default function FormularPage() {
  const [userData, setUserData] = useState(null)
  const [editData, setEditData] = useState({})
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [isNotifVisible, setIsNotifVisible] = useState(false)
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
        setEditData(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchUserData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      // 🔹 Convert comma-separated strings back to arrays
      const arrayFields = [
        "arrivalConditions",
        "trips",
        "physicalCondition",
        "careTools",
        "incontinence",
        "nutritionSupport",
        "basicCare",
        "healthPromotion",
        "diagnoses",
        "behaviorTraits",
        "householdTasks",
        "languages",
      ]

      const cleanedData = { ...editData }
      arrayFields.forEach((field) => {
        if (typeof cleanedData[field] === "string") {
          cleanedData[field] = cleanedData[field]
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        }
      })

      const res = await fetch("/api/updateFormularData", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userData.id, ...cleanedData }),
      })

      if (res.ok) {
        alert("✅ Daten erfolgreich gespeichert")
      } else {
        alert("❌ Fehler beim Speichern")
      }
    } catch (err) {
      console.error(err)
      alert("Server-Fehler")
    }
  }

  if (loading)
    return <p className="p-10 text-center text-xl text-[#B99B5F]">Lädt Formular-Daten...</p>

  return (
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
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
            router.push("/dashboard/personal-info");
            setIsOpen(false);
          }}
          className="cursor-pointer hover:text-[#A6884A]"
        >
          Persönliche Informationen
        </li>
        <li
          onClick={() => {
            router.push("/dashboard/formular");
            setIsOpen(false);
          }}
          className="cursor-pointer hover:text-[#A6884A]"
        >
          Formular
        </li>
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
        onClick={() => router.push("/dashboard/personal-info")}
        className="relative flex items-center gap-3 text-lg font-medium cursor-pointer hover:text-[#A6884A] transition"
      >
        Persönliche Informationen
        {isNotifVisible && (
          <span className="w-4 h-4 bg-[#04436F] rounded-full animate-pulse"></span>
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
</>

      <main className="flex-1 p-2 mt-[50px] lg:mt-0 lg:p-10 max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg p-6 lg:p-12">
          <h2 className="text-4xl font-bold mb-12 text-gray-900 border-b pb-4">Formulardaten</h2>

   <section className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 text-gray-800">
  {[
    { label: "Vorname", key: "firstName" },
    { label: "Nachname", key: "lastName" },
    { label: "Telefonnummer", key: "phone" },
    { label: "Email", key: "email" },
    { label: "Adresse", key: "address" },
    { label: "PLZ", key: "postalCode" },

    // city → careCity
    { label: "Ort", key: "careCity" },

    // entranceLocation → careEntrance
    { label: "Stockwerk / Eingangscode", key: "careEntrance" },

    // arrivalConditions → careArrivalConditions
    { label: "Ankunftsbedingungen", key: "careArrivalConditions" },

    // keyLocation → mailboxKeyLocation
    { label: "Schlüssel hinterlegt bei", key: "mailboxKeyLocation" },

    // hasParking → careHasParking
    { label: "Parkplatz vorhanden", key: "careHasParking" },

    // parkingLocation → careStreet
    { label: "Parkplatz Ort", key: "careStreet" },

    // entranceDescription → careEntranceDetails
    { label: "Eingangsbeschreibung", key: "careEntranceDetails" },

    // additionalNotes → specialRequests
    { label: "Zusätzliche Infos", key: "specialRequests" },

    // companionship → companionshipSupport
    { label: "Gesellschaft leisten", key: "companionshipSupport" },

    // cookingTogether → jointCooking
    { label: "Gemeinsames Kochen", key: "jointCooking" },

    { label: "Biografiearbeit", key: "biographyWork" },
    { label: "Allergien?", key: "hasAllergies" },
    { label: "Allergie-Details", key: "allergyDetails" },

    // reading → reads
    { label: "Vorlesen", key: "reads" },

    // cardGames → playsCards
    { label: "Kartenspiele", key: "playsCards" },

    { label: "Ausflüge", key: "trips" },
    { label: "Größe (cm)", key: "height" },
    { label: "Gewicht (kg)", key: "weight" },

    // physicalCondition → physicalState
    { label: "Zustand", key: "physicalState" },

    // careTools → mobilityAids
    { label: "Hilfsmittel", key: "mobilityAids" },

    // careToolsOther → toolsOther
    { label: "Sonstige Hilfsmittel", key: "toolsOther" },

    // incontinence → incontinenceTypes
    { label: "Inkontinenz", key: "incontinenceTypes" },

    // Sehen/Hören/Sprechen → proper comm fields
    { label: "Sehen", key: "communicationVision" },
    { label: "Hören", key: "communicationHearing" },
    { label: "Sprechen", key: "communicationSpeech" },

    // nutritionSupport → foodSupport
    { label: "Nahrungsaufnahme", key: "foodSupport" },

    // basicCare → basicCareNeeds
    { label: "Grundpflege", key: "basicCareNeeds" },

    // basicCareOther → basicCareOtherField
    { label: "Andere Grundpflege", key: "basicCareOtherField" },

    // healthPromotion → healthPromotions
    { label: "Gesundheitsförderung", key: "healthPromotions" },

    { label: "Andere Gesundheitsförderung", key: "healthPromotionOther" },

    // diagnoses → mentalDiagnoses
    { label: "Diagnosen", key: "mentalDiagnoses" },

    { label: "Verhaltensmerkmale", key: "behaviorTraits" },
    { label: "Medizinische Befunde", key: "healthFindings" },

    // roomCount → householdRooms
    { label: "Anzahl Zimmer", key: "householdRooms" },

    // householdSize → householdPeople
    { label: "Haushaltsgröße", key: "householdPeople" },

    { label: "Tätigkeiten", key: "householdTasks" },

    // cookingForPeople → cooking
    { label: "Kochen für Personen", key: "cooking" },

    { label: "Sprachen", key: "languages" },
    { label: "Andere Sprache", key: "languageOther" },

    // hasPets → pets
    { label: "Haustiere", key: "pets" },

    { label: "Tierdetails", key: "petDetails" },
  ].map(({ label, key }) => (
    <div key={key} className="flex flex-col border-b border-gray-200 pb-4">
      <span className="font-semibold text-lg mb-1">{label}</span>
      <input
        name={key}
        value={Array.isArray(editData[key]) ? editData[key].join(", ") : (editData[key] || "")}
        onChange={handleChange}
        placeholder={`Bitte ${label} eingeben`}
        className="border rounded px-3 py-2 text-gray-900"
      />
    </div>
  ))}
</section>


          <button
            onClick={handleSave}
            className="mt-8 bg-[#B99B5F] text-white px-6 py-3 rounded-lg hover:bg-[#a6884a] transition"
          >
            Speichern
          </button>
        </div>
      </main>
    </div>
  )
}
