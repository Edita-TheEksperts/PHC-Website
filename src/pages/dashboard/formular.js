import { useEffect, useState } from "react"
import { useRouter } from "next/router"

// Simple read-only field renderer
function Field({ label, value }) {
  return (
    <div className="flex flex-col border-b border-gray-100 pb-2 mb-2">
      <span className="font-semibold text-gray-700">{label}</span>
      <span className="text-gray-900 whitespace-pre-line">{value || "-"}</span>
    </div>
  )
}

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

        const data = await res.json()
        setUserData(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-[#B99B5F]">
        Lädt Formular-Daten…
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-72 bg-[#B99B5F] text-white flex-col p-6">
        <h1
          className="text-4xl font-bold text-center mb-12 cursor-pointer"
          onClick={() => router.push("/client-dashboard")}
        >
          PHC
        </h1>

        <ul className="space-y-6 text-lg">
          <li
            onClick={() => router.push("/client-dashboard")}
            className="cursor-pointer hover:text-[#A6884A] transition"
          >
            Dashboard
          </li>

          <li
            onClick={() => router.push("/dashboard/formular")}
            className="cursor-pointer hover:text-[#A6884A] transition"
          >
            Persönliche Informationen
          </li>

          <li
            onClick={() => router.push("/dashboard/finanzen")}
            className="cursor-pointer hover:text-[#A6884A] transition"
          >
            Finanzen
          </li>

          <li
            onClick={() => router.push("/dashboard/kundigung")}
            className="cursor-pointer hover:text-red-400 transition"
          >
            Kündigung
          </li>
        </ul>
      </aside>

      {/* MAIN */}
      <main className="flex-1 pt-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-4xl font-bold mb-10 border-b pb-4">
              Persönliche Daten
            </h2>

            {!userData ? (
              <div className="text-gray-600">Keine Daten gefunden.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* BASIC */}
                <Field label="Vorname" value={userData.firstName} />
                <Field label="Nachname" value={userData.lastName} />
                <Field label="E-Mail" value={userData.email} />
                <Field label="Telefon" value={userData.phone} />
                <Field label="Adresse" value={userData.address} />
                <Field label="PLZ" value={userData.postalCode} />
                <Field label="Stadt" value={userData.careCity || userData.city} />
                <Field label="Häufigkeit" value={userData.frequency} />

                {/* EMERGENCY */}
                <Field label="Notfall Kontakt Name" value={userData.emergencyContactName} />
                <Field label="Notfall Kontakt Telefon" value={userData.emergencyContactPhone} />

                {/* CARE */}
                <Field label="Pflege Telefon" value={userData.carePhone} />
                <Field label="Pflege Straße" value={userData.careStreet} />
                <Field label="Pflege PLZ" value={userData.carePostalCode} />
                <Field label="Parkplatz vorhanden?" value={userData.careHasParking} />
                <Field label="Ankunftsbedingungen" value={userData.careArrivalConditions} />
                <Field label="Eingang" value={userData.careEntrance} />
                <Field label="Eingang Details" value={userData.careEntranceDetails} />

                {/* PERSONAL */}
                <Field label="Sprachen" value={userData.languages} />
                <Field label="Haustiere?" value={userData.pets} />
                <Field label="Allergien?" value={userData.hasAllergies} />
                {userData.hasAllergies === "Ja" && (
                  <Field label="Allergie Details" value={userData.allergyDetails} />
                )}
                <Field label="Verhalten" value={userData.behaviorTraits} />

                {/* HEALTH */}
                <Field label="Gesundheitliche Hinweise" value={userData.healthFindings} />
                <Field label="Hilfsmittel" value={userData.mobilityAids} />
                <Field label="Körperlicher Zustand" value={userData.physicalState} />
                <Field label="Mentale Diagnosen" value={userData.mentalDiagnoses} />
                <Field label="Inkontinenz Typen" value={userData.incontinenceTypes} />

                {/* HOUSEHOLD */}
                <Field label="Personen im Haushalt" value={userData.householdPeople} />
                <Field label="Zimmer Anzahl" value={userData.householdRooms} />

                {/* EXTRA */}
                <Field label="Zusätzliche Hinweise" value={userData.specialRequests} />
                <Field label="Einkaufen mit Klient" value={userData.shoppingWithClient} />
                <Field label="Transport" value={userData.transport} />
                <Field label="Ausflüge" value={userData.outings} />
                <Field label="Lesen" value={userData.reads} />
                <Field label="Kartenspiele" value={userData.playsCards} />

                {/* SERVICES */}
                <Field
                  label="Services"
                  value={
                    Array.isArray(userData.services) && userData.services.length > 0
                      ? userData.services.map((s) => s.name).join(", ")
                      : "Keine Services"
                  }
                />
                <Field
                  label="Subservices"
                  value={
                    Array.isArray(userData.subServices) && userData.subServices.length > 0
                      ? userData.subServices.map((s) => s.name).join(", ")
                      : "Keine Subservices"
                  }
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}