import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Menu, X } from "lucide-react";

export default function EmployeeInfo() {
  const [employee, setEmployee] = useState(null);
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  /* ================= FETCH EMPLOYEE ================= */
  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) {
      router.push("/login");
      return;
    }

    const fetchEmployee = async () => {
      try {
        const res = await fetch("/api/get-employee", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();
        setEmployee(data);
        setFormData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [router]);

  /* ================= SAVE HANDLER ================= */
  const handleSave = async () => {
    try {
      const res = await fetch("/api/update-employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();
      setEmployee(updated);
      setFormData(updated);
      setEditMode(false);
      alert("✅ Daten erfolgreich gespeichert");
    } catch (err) {
      console.error(err);
      alert("❌ Fehler beim Speichern");
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Lade persönliche Informationen…</div>;
  }

  if (!employee) {
    return <div className="p-6 text-red-500">Keine Daten gefunden.</div>;
  }
  const fileFields = [
  "cvFile",
  "passportFile",
  "visaFile",
  "policeLetterFile",
  "certificateFile",
  "drivingLicenceFile",
  "profilePhoto"
];

const hiddenFields = [
  "id",
  "password",
  "passwordHash",
  "salesforceId",
  "createdAt",
  "updatedAt",
  "resetToken",
  "resetTokenExpiry",
   "iban",
  "bic",
  "bankName",
  "accountHolder"
];

const handleFileUpload = async (file, fieldName) => {
  if (!file) return;

  const email = employee.email;
  const form = new FormData();
  form.append("file", file);
  form.append("field", fieldName);
  form.append("email", email);

  try {
    const res = await fetch("/api/upload-employee-file", {
      method: "POST",
      body: form,
    });

    if (!res.ok) throw new Error("Upload failed");

    const { url } = await res.json();

    // update UI instantly
    setFormData((prev) => ({
      ...prev,
      [fieldName]: url,
    }));

  } catch (err) {
    console.error(err);
    alert("❌ Fehler beim Upload");
  }
};


  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* ================= MOBILE TOP NAV ================= */}
      <div className="lg:hidden bg-[#04436F] text-white fixed top-0 left-0 w-full z-50">
        <div className="flex items-center justify-between p-4">
          <h1
            className="text-xl font-bold cursor-pointer"
            onClick={() => router.push("/employee-dashboard")}
          >
            PHC
          </h1>
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-[#04436F] text-white z-40 flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-white/20">
            <h1
              className="text-xl font-bold cursor-pointer"
              onClick={() => {
                router.push("/employee-dashboard");
                setIsOpen(false);
              }}
            >
              PHC
            </h1>
            <button onClick={() => setIsOpen(false)}>
              <X />
            </button>
          </div>

          <nav className="flex flex-col space-y-6 px-6 py-8 text-lg font-medium">
            <SidebarLink
              label="Dashboard"
              onClick={() => {
                router.push("/employee-dashboard");
                setIsOpen(false);
              }}
            />
            <SidebarLink label="Persönliche Informationen" />
            <SidebarLink
              label="Logout"
              onClick={() => {
                localStorage.removeItem("email");
                router.push("/login");
              }}
            />
          </nav>
        </div>
      )}

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:flex w-64 bg-[#04436F] text-white p-6 space-y-8 shadow-xl flex-col">
        <h2 className="text-3xl font-extrabold text-center">PHC</h2>
        <nav className="space-y-2">
          <SidebarLink
            label="Dashboard"
            onClick={() => router.push("/employee-dashboard")}
          />
          <SidebarLink
            label="Persönliche Informationen"
            onClick={() => router.push("/employee-info")}
          />
          <SidebarLink
            label="Logout"
            onClick={() => {
              localStorage.removeItem("email");
              router.push("/login");
            }}
          />
        </nav>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 mt-[64px] lg:mt-0 px-6 py-10">
        <h1 className="text-2xl font-bold text-[#04436F] mb-6">
          Persönliche Informationen
        </h1>

        <div className="bg-white rounded-2xl shadow-md border p-6">
   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {Object.entries(formData)
    .filter(([key]) => !hiddenFields.includes(key))
    .map(([key, value]) => (
      <div
        key={key}
        className="flex justify-between items-center border rounded-lg px-4 py-2 text-sm"
      >
        <span className="text-gray-600 font-medium">
          {formatLabel(key)}
        </span>

{fileFields.includes(key) ? (
  editMode ? (
    <input
      type="file"
      className="text-sm w-1/2"
      onChange={(e) =>
        handleFileUpload(e.target.files[0], key)
      }
    />
  ) : value ? (
    <a
      href={value}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#04436F] underline font-medium"
    >
      Datei öffnen
    </a>
  ) : (
    <span className="text-gray-400">—</span>
  )
) : editMode ? (
  <input
    className="border rounded px-2 py-1 text-sm w-1/2"
    value={Array.isArray(value) ? value.join(", ") : value ?? ""}
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        [key]: Array.isArray(value)
          ? e.target.value.split(",").map((v) => v.trim())
          : e.target.value,
      }))
    }
  />
) : (
  <span className="text-right break-words max-w-[60%]">
    {formatValue(value)}
  </span>
)}



      </div>
    ))}
</div>


          {/* ================= BUTTONS ================= */}
          <div className="mt-6 flex gap-4">
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="bg-[#04436F] text-white px-6 py-2 rounded-lg"
              >
                Bearbeiten
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg"
                >
                  Speichern
                </button>
                <button
                  onClick={() => {
                    setFormData(employee);
                    setEditMode(false);
                  }}
                  className="bg-gray-400 text-white px-6 py-2 rounded-lg"
                >
                  Abbrechen
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ================= HELPERS ================= */

function formatLabel(label) {
  return label.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}

function formatValue(value) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Ja" : "Nein";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  if (typeof value === "object") return JSON.stringify(value);
  return value.toString();
}

function SidebarLink({ label, onClick }) {
  return (
    <div
      onClick={onClick}
      className="px-4 py-2 rounded-lg cursor-pointer font-medium text-sm hover:bg-[#05507F] transition"
    >
      {label}
    </div>
  );
}
