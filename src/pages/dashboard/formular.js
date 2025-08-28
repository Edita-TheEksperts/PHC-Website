// pages/dashboard/formular.js
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

export default function FormularPage() {
  const [userData, setUserData] = useState(null)
  const [editData, setEditData] = useState({})
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
      <nav className="w-72 bg-[#B99B5F] text-white p-8 flex flex-col shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-12 select-none">PHC</h1>
        <ul className="space-y-6 flex-grow">
          <li onClick={() => router.push("/client-dashboard")} className="cursor-pointer">Dashboard</li>
          <li onClick={() => router.push("/dashboard/personal-info")} className="cursor-pointer">Persönliche Daten</li>
          <li onClick={() => router.push("/dashboard/formular")} className="cursor-pointer">Formular</li>
        </ul>
      </nav>

      <main className="flex-1 p-10 max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg p-12">
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
