import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Menu, X } from "lucide-react"

export default function FormularPage() {
  const [userData, setUserData] = useState(null)
const [editData, setEditData] = useState({
  // BASIC
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  postalCode: "",
  frequency: "",

  // EMERGENCY
  emergencyContactName: "",
  emergencyContactPhone: "",

  // CARE / LOCATION
  city: "",
  careStreet: "",
  carePhone: "",
  carePostalCode: "",
  hasParking: "Nein",
  arrivalConditions: "",
  careEntrance: "",
  careEntranceDetails: "",

  // PERSONAL
  languages: "",
  hasPets: "Nein",
  hasAllergies: "Nein",
  allergyDetails: "",
  behaviorTraits: "",

  // HEALTH
  healthFindings: "",
  mobilityAids: "",
  physicalState: "",
  mentalDiagnoses: "",
  incontinenceTypes: "",
services: [],
subServices: [],

  // HOUSEHOLD
  householdPeople: "",
  householdRooms: "",

  // EXTRA
  additionalNotes: "",
  shoppingWithClient: "",
  transport: "",
  outings: "",
  reads: "",
  playsCards: "",
})


  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
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

setEditData({
  firstName: data.firstName || "",
  lastName: data.lastName || "",
  email: data.email || "",
  phone: data.phone || "",
  address: data.address || "",
  postalCode: data.postalCode || "",
  frequency: data.frequency || "",

  emergencyContactName: data.emergencyContactName || "",
  emergencyContactPhone: data.emergencyContactPhone || "",
services: data.services || [],
subServices: data.subServices || [],

  city: data.careCity || "",
  careStreet: data.careStreet || "",
  carePhone: data.carePhone || "",
  carePostalCode: data.carePostalCode || "",
  hasParking: data.careHasParking || "Nein",
  arrivalConditions: data.careArrivalConditions || "",
  careEntrance: data.careEntrance || "",
  careEntranceDetails: data.careEntranceDetails || "",

  languages: data.languages || "",
  hasPets: data.pets || "Nein",
  hasAllergies: data.hasAllergies || "Nein",
  allergyDetails: data.allergyDetails || "",
  behaviorTraits: data.behaviorTraits || "",

  healthFindings: data.healthFindings || "",
  mobilityAids: data.mobilityAids || "",
  physicalState: data.physicalState || "",
  mentalDiagnoses: data.mentalDiagnoses || "",
  incontinenceTypes: data.incontinenceTypes || "",

  householdPeople: data.householdPeople || "",
  householdRooms: data.householdRooms || "",

  additionalNotes: data.specialRequests || "",
  shoppingWithClient: data.shoppingWithClient || "",
  transport: data.transport || "",
  outings: data.outings || "",
  reads: data.reads || "",
  playsCards: data.playsCards || "",
})


      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      const res = await fetch("/api/updateFormularData", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userData.id, ...editData }),
      })

      res.ok ? alert("✅ Gespeichert") : alert("❌ Fehler")
    } catch (err) {
      console.error(err)
    }
  }

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
          <li onClick={() => router.push("/client-dashboard")}>Dashboard</li>
          <li onClick={() => router.push("/dashboard/formular")}>
            Persönliche Informationen
          </li>
        </ul>
      </aside>

      {/* MAIN */}
      <main className="flex-1 pt-12 px-6">
        <div className="max-w-5xl">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-4xl font-bold mb-10 border-b pb-4">
              Persönliche Daten
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <Input label="Vorname" name="firstName" value={editData.firstName} onChange={handleChange} />
              <Input label="Nachname" name="lastName" value={editData.lastName} onChange={handleChange} />
              <Input label="E-Mail" name="email" value={editData.email} onChange={handleChange} />
              <Input label="Telefon" name="phone" value={editData.phone} onChange={handleChange} />
              <Input label="Adresse" name="address" value={editData.address} onChange={handleChange} />
              <Input label="PLZ" name="postalCode" value={editData.postalCode} onChange={handleChange} />
              <Input label="Stadt" name="city" value={editData.city} onChange={handleChange} />
              <div className="flex flex-col">
  <label className="font-semibold mb-1">Service</label>
  <select className="border rounded px-3 py-2 bg-gray-100" disabled>
    {editData.services.map((s) => (
      <option key={s.id} value={s.id}>
        {s.name}
      </option>
    ))}
  </select>
</div>
<div className="flex flex-col">
  <label className="font-semibold mb-1">Subservice</label>
  <select className="border rounded px-3 py-2 bg-gray-100" disabled>
    {editData.subServices.map((s) => (
      <option key={s.id} value={s.id}>
        {s.name}
      </option>
    ))}
  </select>
</div>

              <Input label="Notfall Kontakt Name" name="emergencyContactName" value={editData.emergencyContactName} onChange={handleChange} />

<Input label="Notfall Kontakt Telefon" name="emergencyContactPhone" value={editData.emergencyContactPhone} onChange={handleChange} />

<Input label="Pflege Telefon" name="carePhone" value={editData.carePhone} onChange={handleChange} />

<Input label="Straße" name="careStreet" value={editData.careStreet} onChange={handleChange} />

<Input label="Personen im Haushalt" name="householdPeople" value={editData.householdPeople} onChange={handleChange} />

<Input label="Zimmer Anzahl" name="householdRooms" value={editData.householdRooms} onChange={handleChange} />

<Textarea label="Hilfsmittel" name="mobilityAids" value={editData.mobilityAids} onChange={handleChange} />

<Textarea label="Körperlicher Zustand" name="physicalState" value={editData.physicalState} onChange={handleChange} />
<Textarea label="Mentale Diagnosen" name="mentalDiagnoses" value={editData.mentalDiagnoses} onChange={handleChange} />

<Textarea label="Inkontinenz Typen" name="incontinenceTypes" value={editData.incontinenceTypes} onChange={handleChange} />

<Textarea label="Einkaufen mit Klient" name="shoppingWithClient" value={editData.shoppingWithClient} onChange={handleChange} />

<Textarea label="Transport" name="transport" value={editData.transport} onChange={handleChange} />

<Textarea label="Ausflüge" name="outings" value={editData.outings} onChange={handleChange} />

<Textarea label="Lesen" name="reads" value={editData.reads} onChange={handleChange} />

<Textarea label="Kartenspiele" name="playsCards" value={editData.playsCards} onChange={handleChange} />



              <Select label="Parkplatz vorhanden?" name="hasParking" value={editData.hasParking} onChange={handleChange} />

              <Select label="Haustiere?" name="hasPets" value={editData.hasPets} onChange={handleChange} />

              <Select label="Allergien?" name="hasAllergies" value={editData.hasAllergies} onChange={handleChange} />

              {editData.hasAllergies === "Ja" && (
                <Input
                  label="Allergie Details"
                  name="allergyDetails"
                  value={editData.allergyDetails}
                  onChange={handleChange}
                />
              )}

              <Textarea label="Ankunftsbedingungen" name="arrivalConditions" value={editData.arrivalConditions} onChange={handleChange} />

              <Textarea label="Sprachen (z.B. Deutsch, Englisch)" name="languages" value={editData.languages} onChange={handleChange} />

              <Textarea label="Verhalten" name="behaviorTraits" value={editData.behaviorTraits} onChange={handleChange} />

              <Textarea label="Gesundheitliche Hinweise" name="healthFindings" value={editData.healthFindings} onChange={handleChange} />

              <Textarea label="Zusätzliche Hinweise" name="additionalNotes" value={editData.additionalNotes} onChange={handleChange} />

            </div>

            <button
              onClick={handleSave}
              className="mt-10 bg-[#B99B5F] text-white px-8 py-3 rounded-lg hover:bg-[#a6884a]"
            >
              Speichern
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

/* COMPONENTS */

function Input({ label, ...props }) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold mb-1">{label}</label>
      <input {...props} className="border rounded px-3 py-2" />
    </div>
  )
}

function Textarea({ label, ...props }) {
  return (
    <div className="flex flex-col md:col-span-2">
      <label className="font-semibold mb-1">{label}</label>
      <textarea {...props} rows="3" className="border rounded px-3 py-2" />
    </div>
  )
}

function Select({ label, ...props }) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold mb-1">{label}</label>
      <select {...props} className="border rounded px-3 py-2">
        <option value="Nein">Nein</option>
        <option value="Ja">Ja</option>
      </select>
    </div>
  )
}
