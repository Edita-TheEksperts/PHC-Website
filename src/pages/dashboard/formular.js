// pages/dashboard/formular.js
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Menu, X } from "lucide-react"

export default function FormularPage() {
  const [userData, setUserData] = useState(null)
  const [editData, setEditData] = useState({})
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-[#B99B5F]">
        Lädt Formular-Daten…
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ================= MOBILE TOP NAV ================= */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-[#B99B5F] text-white z-50">
        <div className="flex items-center justify-between p-4">
          <h1
            className="text-xl font-bold cursor-pointer"
            onClick={() => router.push("/client-dashboard")}
          >
            PHC
          </h1>
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-[#B99B5F] text-white z-40">
          <ul className="p-8 space-y-6 text-lg">
            <li onClick={() => router.push("/client-dashboard")}>Dashboard</li>
            <li onClick={() => router.push("/dashboard/formular")}>
              Persönliche Informationen
            </li>
                        <li onClick={() => router.push("/dashboard/finanzen")}>
Finanzen            </li>
          </ul>
        </div>
      )}

      {/* ================= SIDEBAR ================= */}
      <aside className="hidden lg:flex w-72 bg-[#B99B5F] text-white flex-col p-6">
        <h1
          className="text-4xl font-bold text-center mb-12 cursor-pointer"
          onClick={() => router.push("/client-dashboard")}
        >
          PHC
        </h1>

        <ul className="space-y-6 text-lg">
          <li
            className="cursor-pointer hover:text-[#A6884A]"
            onClick={() => router.push("/client-dashboard")}
          >
            Dashboard
          </li>
          <li
            className="cursor-pointer hover:text-[#A6884A]"
            onClick={() => router.push("/dashboard/formular")}
          >
            Persönliche Informationen
          </li>
        </ul>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 pt-24 lg:pt-12 px-6">
        {/* 👇 width kontrollohet këtu, JO me mx-auto në main */}
        <div className="max-w-5xl">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-4xl font-bold mb-10 border-b pb-4">
              Formulardaten
            </h2>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(editData).map((key) => (
                <div key={key} className="flex flex-col">
                  <label className="font-semibold mb-1">{key}</label>
                  <input
                    name={key}
                    value={
                      Array.isArray(editData[key])
                        ? editData[key].join(", ")
                        : editData[key] || ""
                    }
                    onChange={handleChange}
                    className="border rounded px-3 py-2"
                  />
                </div>
              ))}
            </section>

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
