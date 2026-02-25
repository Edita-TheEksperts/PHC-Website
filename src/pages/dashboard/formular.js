
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

import Input from "./Input"

export default function FormularPage() {

  const [userData, setUserData] = useState(null)
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [editMode, setEditMode] = useState(false)
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
        setForm(data)
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
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleEdit = () => {
    setEditMode(true)
    setForm(userData)
    setMessage("")
  }

  const handleCancel = () => {
    setEditMode(false)
    setForm(userData)
    setMessage("")
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage("")
    try {
      const res = await fetch(`/api/clients/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setMessage("Gespeichert!")
        const updated = await res.json()
        setUserData(updated)
        setForm(updated)
        setEditMode(false)
      } else {
        const err = await res.json()
        setMessage(err.message || "Fehler beim Speichern")
      }
    } catch (err) {
      setMessage("Fehler beim Speichern")
    } finally {
      setSaving(false)
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

            {!form ? (
              <div className="text-gray-600">Keine Daten gefunden.</div>
            ) : (
              <>
                {!editMode ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* BASIC */}
                      <ReadOnly label="Anrede" value={form.anrede} />
                      <ReadOnly label="Vorname" value={form.firstName} />
                      <ReadOnly label="Nachname" value={form.lastName} />
                      <ReadOnly label="E-Mail" value={form.email} />
                      <ReadOnly label="Telefon" value={form.phone} />
                      <ReadOnly label="Sprachen" value={form.languages} />
                      <ReadOnly label="Andere Sprache" value={form.otherLanguage} />

                      {/* Address / Care */}
                      <ReadOnly label="Pflege Straße" value={form.careStreet} />
                      <ReadOnly label="Pflege PLZ" value={form.carePostalCode} />
                      <ReadOnly label="Pflege Stadt" value={form.careCity} />
                      <ReadOnly label="Pflege Telefon" value={form.carePhone} />
                      <ReadOnly label="Parkplatz vorhanden?" value={form.careHasParking} />
                      <ReadOnly label="Eingang" value={form.careEntrance} />
                      <ReadOnly label="Eingang Details" value={form.careEntranceDetails} />
                      <ReadOnly label="Briefkasten Schlüsselort" value={form.mailboxKeyLocation} />
                      <ReadOnly label="Briefkasten Details" value={form.mailboxDetails} />

                      {/* Request person */}
                      <ReadOnly label="Anfragende/r Vorname" value={form.requestFirstName} />
                      <ReadOnly label="Anfragende/r Nachname" value={form.requestLastName} />
                      <ReadOnly label="Anfragende/r E-Mail" value={form.requestEmail} />
                      <ReadOnly label="Anfragende/r Telefon" value={form.requestPhone} />

                      {/* Questionnaire – Health */}
                      <ReadOnly label="Größe (cm)" value={form.height} />
                      <ReadOnly label="Gewicht (kg)" value={form.weight} />
                      <ReadOnly label="Körperlicher Zustand" value={form.physicalState} />
                      <ReadOnly label="Mobilität" value={form.mobility} />
                      <ReadOnly label="Hilfsmittel" value={form.mobilityAids} />

                      {/* Pflegehilfsmittel */}
                      <ReadOnly label="Pflegehilfsmittel" value={form.toolsAvailable} />
                      <ReadOnly label="Andere Pflegehilfsmittel" value={form.toolsOther} />
                      <ReadOnly label="Hilfsmittel (aids)" value={form.aids} />
                      <ReadOnly label="Andere Hilfsmittel (aidsOther)" value={form.aidsOther} />

                      {/* Inkontinenz / Ernährung */}
                      <ReadOnly label="Inkontinenz" value={form.incontinence} />
                      <ReadOnly label="Inkontinenz Typen" value={form.incontinenceTypes} />
                      <ReadOnly label="Ernährungsunterstützung" value={form.foodSupport} />
                      <ReadOnly label="Ernährungsunterstützung Typen" value={form.foodSupportTypes} />

                      {/* Medical / Health */}
                      <ReadOnly label="Medizinische Hinweise" value={form.medicalFindings} />
                      <ReadOnly label="Gesundheitliche Hinweise" value={form.healthFindings} />
                      <ReadOnly label="Allergie Details" value={form.allergyDetails} />
                      <ReadOnly label="Allergien?" value={form.hasAllergies} />

                      {/* Mental / Verhalten */}
                      <ReadOnly label="Mentale Diagnosen" value={form.mentalDiagnoses} />
                      <ReadOnly label="Verhalten" value={form.behaviorTraits} />

                      {/* Household */}
                      <ReadOnly label="Zimmer Anzahl" value={form.householdRooms} />
                      <ReadOnly label="Personen im Haushalt" value={form.householdPeople} />
                      <ReadOnly label="Haustiere?" value={form.pets} />

                      {/* Activities */}
                      <ReadOnly label="Einkaufstyp" value={form.shoppingType} />
                      <ReadOnly label="Einkaufen mit Klient" value={form.shoppingWithClient} />
                      <ReadOnly label="Einkaufsartikel" value={form.shoppingItems} />
                      <ReadOnly label="Gemeinsames Kochen" value={form.jointCooking} />
                      <ReadOnly label="Kochen" value={form.cooking} />
                      <ReadOnly label="Begleitung" value={form.companionship} />
                      <ReadOnly label="Beruflicher Werdegang" value={form.biographyWork} />
                      <ReadOnly label="Lesen" value={form.reading} />
                      <ReadOnly label="Kartenspiele" value={form.cardGames} />
                      <ReadOnly label="Ausflüge" value={form.trips} />

                      {/* Appointments */}
                      <ReadOnly label="Terminarten" value={form.appointmentTypes} />
                      <ReadOnly label="Andere Termine" value={form.appointmentOther} />
                      <ReadOnly label="Zusätzliche Begleitung" value={form.additionalAccompaniment} />

                      {/* Emergency */}
                      <ReadOnly label="Notfall Kontakt Name" value={form.emergencyContactName} />
                      <ReadOnly label="Notfall Kontakt Telefon" value={form.emergencyContactPhone} />

                      {/* Misc */}
                      <ReadOnly label="Zusätzliche Hinweise" value={form.specialRequests} />
                    </div>
                    <div className="flex gap-4 mt-8">
                      <button
                        className="bg-[#B99B5F] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#A6884A] transition"
                        onClick={handleEdit}
                      >
                        Bearbeiten
                      </button>
                      {message && <span className="text-green-700 font-semibold">{message}</span>}
                    </div>
                  </>
                ) : (
                  <form
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    onSubmit={e => { e.preventDefault(); handleSave(); }}
                  >
                    {/* BASIC */}

                    {/* BASIC */}
                    <Input label="Anrede" name="anrede" value={form.anrede} onChange={handleChange} />
                    <Input label="Vorname" name="firstName" value={form.firstName} onChange={handleChange} />
                    <Input label="Nachname" name="lastName" value={form.lastName} onChange={handleChange} />
                    <Input label="E-Mail" name="email" value={form.email} onChange={handleChange} type="email" />
                    <Input label="Telefon" name="phone" value={form.phone} onChange={handleChange} />
                    <Input label="Sprachen" name="languages" value={form.languages} onChange={handleChange} />
                    <Input label="Andere Sprache" name="otherLanguage" value={form.otherLanguage} onChange={handleChange} />

                    {/* Address / Care */}
                    <Input label="Pflege Straße" name="careStreet" value={form.careStreet} onChange={handleChange} />
                    <Input label="Pflege PLZ" name="carePostalCode" value={form.carePostalCode} onChange={handleChange} />
                    <Input label="Pflege Stadt" name="careCity" value={form.careCity} onChange={handleChange} />
                    <Input label="Pflege Telefon" name="carePhone" value={form.carePhone} onChange={handleChange} />
                    <Input label="Parkplatz vorhanden?" name="careHasParking" value={form.careHasParking} onChange={handleChange} yesNo={true} />
                    <Input label="Eingang" name="careEntrance" value={form.careEntrance} onChange={handleChange} />
                    <Input label="Eingang Details" name="careEntranceDetails" value={form.careEntranceDetails} onChange={handleChange} />
                    <Input label="Briefkasten Schlüsselort" name="mailboxKeyLocation" value={form.mailboxKeyLocation} onChange={handleChange} />
                    <Input label="Briefkasten Details" name="mailboxDetails" value={form.mailboxDetails} onChange={handleChange} />

                    {/* Request person */}
                    <Input label="Anfragende/r Vorname" name="requestFirstName" value={form.requestFirstName} onChange={handleChange} />
                    <Input label="Anfragende/r Nachname" name="requestLastName" value={form.requestLastName} onChange={handleChange} />
                    <Input label="Anfragende/r E-Mail" name="requestEmail" value={form.requestEmail} onChange={handleChange} />
                    <Input label="Anfragende/r Telefon" name="requestPhone" value={form.requestPhone} onChange={handleChange} />

                    {/* Questionnaire – Health */}
                    <Input label="Größe (cm)" name="height" value={form.height} onChange={handleChange} />
                    <Input label="Gewicht (kg)" name="weight" value={form.weight} onChange={handleChange} />
                    <Input label="Körperlicher Zustand" name="physicalState" value={form.physicalState} onChange={handleChange} />
                    <Input label="Mobilität" name="mobility" value={form.mobility} onChange={handleChange} />
                    <Input label="Hilfsmittel" name="mobilityAids" value={form.mobilityAids} onChange={handleChange} />

                    {/* Pflegehilfsmittel */}
                    <Input label="Pflegehilfsmittel" name="toolsAvailable" value={form.toolsAvailable} onChange={handleChange} />
                    <Input label="Andere Pflegehilfsmittel" name="toolsOther" value={form.toolsOther} onChange={handleChange} />
                    <Input label="Hilfsmittel (aids)" name="aids" value={form.aids} onChange={handleChange} />
                    <Input label="Andere Hilfsmittel (aidsOther)" name="aidsOther" value={form.aidsOther} onChange={handleChange} />

                    {/* Inkontinenz / Ernährung */}
                    <Input label="Inkontinenz" name="incontinence" value={form.incontinence} onChange={handleChange} />
                    <Input label="Inkontinenz Typen" name="incontinenceTypes" value={form.incontinenceTypes} onChange={handleChange} />
                    <Input label="Ernährungsunterstützung" name="foodSupport" value={form.foodSupport} onChange={handleChange} />
                    <Input label="Ernährungsunterstützung Typen" name="foodSupportTypes" value={form.foodSupportTypes} onChange={handleChange} />

                    {/* Medical / Health */}
                    <Input label="Medizinische Hinweise" name="medicalFindings" value={form.medicalFindings} onChange={handleChange} />
                    <Input label="Gesundheitliche Hinweise" name="healthFindings" value={form.healthFindings} onChange={handleChange} />
                    <Input label="Allergie Details" name="allergyDetails" value={form.allergyDetails} onChange={handleChange} />
                    <Input label="Allergien?" name="hasAllergies" value={form.hasAllergies} onChange={handleChange} yesNo={true} />

                    {/* Mental / Verhalten */}
                    <Input label="Mentale Diagnosen" name="mentalDiagnoses" value={form.mentalDiagnoses} onChange={handleChange} />
                    <Input label="Verhalten" name="behaviorTraits" value={form.behaviorTraits} onChange={handleChange} />

                    {/* Household */}
                    <Input label="Zimmer Anzahl" name="householdRooms" value={form.householdRooms} onChange={handleChange} />
                    <Input label="Personen im Haushalt" name="householdPeople" value={form.householdPeople} onChange={handleChange} />
                    <Input label="Haustiere?" name="pets" value={form.pets} onChange={handleChange} yesNo={true} />

                    {/* Activities */}
                    <Input label="Einkaufstyp" name="shoppingType" value={form.shoppingType} onChange={handleChange} />
                    <Input label="Einkaufen mit Klient" name="shoppingWithClient" value={form.shoppingWithClient} onChange={handleChange} yesNo={true} />
                    <Input label="Einkaufsartikel" name="shoppingItems" value={form.shoppingItems} onChange={handleChange} yesNo={true} />
                    <Input label="Gemeinsames Kochen" name="jointCooking" value={form.jointCooking} onChange={handleChange} yesNo={true} />
                    <Input label="Kochen" name="cooking" value={form.cooking} onChange={handleChange} yesNo={true} />
                    <Input label="Begleitung" name="companionship" value={form.companionship} onChange={handleChange} yesNo={true} />
                    <Input label="Beruflicher Werdegang" name="biographyWork" value={form.biographyWork} onChange={handleChange} yesNo={true} />
                    <Input label="Lesen" name="reading" value={form.reading} onChange={handleChange} yesNo={true} />
                    <Input label="Kartenspiele" name="cardGames" value={form.cardGames} onChange={handleChange} yesNo={true} />
                    <Input label="Ausflüge" name="trips" value={form.trips} onChange={handleChange} yesNo={true} />

                    {/* Appointments */}
                    <Input label="Terminarten" name="appointmentTypes" value={form.appointmentTypes} onChange={handleChange} />
                    <Input label="Andere Termine" name="appointmentOther" value={form.appointmentOther} onChange={handleChange} />
                    <Input label="Zusätzliche Begleitung" name="additionalAccompaniment" value={form.additionalAccompaniment} onChange={handleChange} />

                    {/* Emergency */}
                    <Input label="Notfall Kontakt Name" name="emergencyContactName" value={form.emergencyContactName} onChange={handleChange} />
                    <Input label="Notfall Kontakt Telefon" name="emergencyContactPhone" value={form.emergencyContactPhone} onChange={handleChange} />

                    {/* Misc */}
                    <Input label="Zusätzliche Hinweise" name="specialRequests" value={form.specialRequests} onChange={handleChange} />

              
                    <div className="col-span-2 flex items-center gap-4 mt-6">
                      <button
                        type="submit"
                        className="bg-[#B99B5F] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#A6884A] transition"
                        disabled={saving}
                      >
                        {saving ? "Speichern…" : "Speichern"}
                      </button>
                      <button
                        type="button"
                        className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                        onClick={handleCancel}
                        disabled={saving}
                      >
                        Abbrechen
                      </button>
                      {message && <span className="text-green-700 font-semibold">{message}</span>}
                    </div>
                  </form>
                )}

              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

// ReadOnly field for view mode
function ReadOnly({ label, value }) {
  return (
    <div className="flex flex-col border-b border-gray-100 pb-2 mb-2">
      <span className="font-semibold text-gray-700">{label}</span>
      <span className="text-gray-900 whitespace-pre-line">{value || "-"}</span>
    </div>
  )
}