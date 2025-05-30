import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import RegisterForm1 from "../components/RegisterForm1";
import RegisterForm2 from "../components/RegisterForm2";
import RegisterForm3 from "../components/RegisterForm3";
import RegisterForm4 from "../components/RegisterForm4";

export default function ClientDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatedData, setUpdatedData] = useState({});
  const [showOverlayForm, setShowOverlayForm] = useState(true);
  const [service, setService] = useState("");
  const router = useRouter();

useEffect(() => {
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        router.push("/");
        return;
      }

      const res = await fetch("/api/user/getUserData", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch user");

      const user = await res.json();
      setUserData(user);
      setUpdatedData(user);

      const selectedService = localStorage.getItem("selectedService");
      const userService = user?.service?.name?.trim();
      const storedService = selectedService?.trim().toLowerCase();

      if (userService) {
        setService(userService);
      } else if (storedService) {
        setService(storedService);
      } else {
        console.warn("No service found");
      }

const normalizedService = normalize(user?.service?.name || selectedService || "");
const formCompleted = user?.form4Completed === true;

if (normalizedService === "alltagsbegleitungundbesorgungen" && !formCompleted) {
  setShowOverlayForm(true);
} else {
  setShowOverlayForm(false);
}



      setLoading(false);
    } catch (err) {
      console.error("Error loading user data:", err);
      setLoading(false);
    }
  };

  fetchUserData();
}, []);


const normalize = (str) =>
  str
    ?.toLowerCase()
    .normalize("NFD") // separates accents
    .replace(/[\u0300-\u036f]/g, "") // removes accents
    .replace(/ä/g, "ae") // specific fix
    .replace(/ü/g, "ue")
    .replace(/ö/g, "oe")
    .replace(/ß/g, "ss")
    .replace(/\s+/g, "")
    .replace(/[^\w]/g, "") || "";

const formMap = {
  haushaltshilfeundwohnpflege: RegisterForm1,
  freizeitundsozialeaktivitaeten: RegisterForm2,
  gesundheitsfuhrsorge: RegisterForm3,
  alltagsbegleitungundbesorgungen: RegisterForm4,
};


const handleChange = (e) => {
  const { name, value } = e.target;
  setUpdatedData((prev) => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const res = await fetch("/api/updateUserData", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: userData.id, ...updatedData }),
  });
  if (res.ok) {
    alert("Daten erfolgreich aktualisiert!");
  } else {
    alert("Fehler beim Aktualisieren der Daten.");
  }
};


  if (loading) return <div>Loading...</div>;
const normalizedService = normalize(service);
const SelectedForm = formMap[normalizedService];
  return (
    <div className="relative">
  {showOverlayForm && SelectedForm && (
  <div className="absolute top-0 left-0 w-full h-full bg-white/80 backdrop-blur-sm z-50 flex justify-center items-start">
    <div className="bg-white shadow-lg rounded-xl w-full max-w-3xl max-h-[130vh] overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-[#B99B5F]">
      <h2 className="text-xl font-semibold mb-4 text-[#B99B5F]">
        Bitte füllen Sie das Serviceformular aus
      </h2>
      <SelectedForm onComplete={() => setShowOverlayForm(false)} />
    </div>
  </div>
)}




      <div className={`flex min-h-screen ${showOverlayForm ? "blur-sm pointer-events-none" : ""}`}>
        <div className="w-64 bg-[#B99B5F] text-white p-6">
          <h2 className="text-3xl font-bold text-center">PHC</h2>
          <ul className="mt-8 space-y-4">
            <li className="hover:bg-[#B99B5F] p-3 rounded-md cursor-pointer">Dashboard</li>
            <li className="hover:bg-[#B99B5F] p-3 rounded-md cursor-pointer">Profile</li>
            <li className="hover:bg-[#B99B5F] p-3 rounded-md cursor-pointer">Settings</li>
           <li
  onClick={() => {
    localStorage.removeItem("userToken"); // or whatever key you use
    localStorage.removeItem("selectedService");
    router.push("/"); // redirect to login page
  }}
  className="hover:bg-[#B99B5F] p-3 rounded-md cursor-pointer"
>
  Logout
</li>

          </ul>
        </div>

        <div className="flex-1 bg-gray-50 p-10">
          
          <div className="flex justify-between items-center mb-6">
            <div className="text-2xl font-semibold text-[#B99B5F]">Client Dashboard</div>
            <div>
              <button
                onClick={() => router.push("/edit-client-profile")}
                className="py-2 px-4 bg-[#B99B5F] text-white font-semibold rounded-md hover:bg-[#B99B5F]"
              >Edit Profile</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4 w-full col-span-1 md:col-span-2 lg:col-span-3">
              <h2 className="text-xl font-semibold text-[#B99B5F]">Welcome, {userData?.fullName || "User"}!</h2>
              <h2 className="text-xl font-semibold text-[#B99B5F]">Personal Information</h2>
              <div className="space-y-2">
                <p><strong>Name:</strong> {userData?.fullName}</p>
                <p><strong>Email:</strong> {userData?.email}</p>
                <p><strong>Phone:</strong> {userData?.phone}</p>
                <p><strong>Address:</strong> {userData?.address}</p>
              </div>
            </div>
          
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4 col-span-1 md:col-span-2 lg:col-span-3">
              <h2 className="text-xl font-semibold text-[#B99B5F]">Documents</h2>
              <div className="space-y-2">
                <p><strong>Resume:</strong> <a href={userData?.resumeUrl} target="_blank" className="text-[#B99B5F] underline">View Resume</a></p>
                {userData?.photoUrl && <p><strong>Photo:</strong> <a href={userData?.photoUrl} target="_blank" className="text-[#B99B5F] underline">View Photo</a></p>}
              </div>
            </div>
  <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
    <h2 className="text-xl font-bold text-[#B99B5F]">Gewählter Service</h2>
    
 <div className="space-y-4">
  {/* Selected Service Display */}
  <div className="p-4 bg-green-50 border border-green-200 rounded-md shadow-sm">
    <p className="text-sm text-gray-700 font-medium">Gewählter Service:</p>
    <p className="text-lg font-bold text-[#04436F]">
      {userData?.service?.name || "Nicht angegeben"}
    </p>
  </div>

  {/* List other services */}
  <div className="space-y-3">
    {[
      "Alltagsbegleitung und Besorgungen",
      "Freizeit und Soziale Aktivitäten",
      "Gesundheitsführsorge",
      "Haushaltshilfe und Wohnpflege"
    ]
      .filter((s) => s !== userData?.service?.name)
      .map((s, i) => (
        <div
          key={i}
          className="flex items-center justify-between border p-3 rounded-md bg-gray-50"
        >
          <span className="text-sm font-medium text-gray-800">{s}</span>
          <button
            onClick={() => {
              localStorage.setItem("selectedService", s);
              router.push("/"); // Changed from /register to /
            }}
            className="text-sm px-3 py-1 rounded bg-[#B99B5F] text-white hover:bg-[#a68a53]"
          >
            Auswählen
          </button>
        </div>
      ))}
  </div>
</div>

  </div>

  {/* === Service History === */}
  <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
    <h2 className="text-xl font-bold text-[#B99B5F]">Serviceverlauf</h2>
    <ul className="space-y-3 text-sm text-gray-700">
      <li className="bg-gray-50 border p-4 rounded">15. Mai 2025 · Haushaltshilfe für 4 Stunden</li>
      <li className="bg-gray-50 border p-4 rounded">10. Mai 2025 · Freizeitaktivitäten - Theaterbesuch</li>
      <li className="bg-gray-50 border p-4 rounded">03. Mai 2025 · Begleitung zum Arzttermin</li>
    </ul>
  </div>

  {/* === New Booking === */}
  <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
    <h2 className="text-xl font-bold text-[#B99B5F]">Neue Buchung planen</h2>
    <div className="space-y-3">
      <input
        type="date"
        className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-[#B99B5F]"
      />
      <input
        type="time"
        className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-[#B99B5F]"
      />
      <select
        className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-[#B99B5F]"
      >
        <option>Service auswählen</option>
        <option>Haushaltshilfe</option>
        <option>Gesundheitsführung</option>
        <option>Freizeit</option>
        <option>Begleitung</option>
      </select>
      <button className="w-full mt-2 bg-[#04436F] text-white py-3 rounded-md hover:bg-[#033553]">
        Termin buchen
      </button>
    </div>
  </div>

          </div>

          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-[#B99B5F] mb-4">Update Your Information</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input type="text" name="fullName" value={updatedData.fullName} onChange={handleChange} className="h-[48px] w-full rounded-[12px] border px-4" placeholder="Full Name" />
              <input type="email" name="email" value={updatedData.email} onChange={handleChange} className="h-[48px] w-full rounded-[12px] border px-4" placeholder="Email Address" />
              <input type="tel" name="phone" value={updatedData.phone} onChange={handleChange} className="h-[48px] w-full rounded-[12px] border px-4" placeholder="Phone Number" />
<input
  type="text"
  name="emergencyContactName"
  value={updatedData.emergencyContactName || ""}
  onChange={handleChange}
  placeholder="Emergency Contact Name"
  className="h-[48px] w-full rounded-[12px] border px-4"
/>

<input
  type="tel"
  name="emergencyContactPhone"
  value={updatedData.emergencyContactPhone || ""}
  onChange={handleChange}
  placeholder="Emergency Contact Phone"
  className="h-[48px] w-full rounded-[12px] border px-4"
/>
              <button type="submit" className="w-full py-4 bg-[#B99B5F] text-white font-semibold text-lg rounded-md shadow-lg hover:bg-[#A6884A]">Save Changes</button>
            </form>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
  {userData &&
    Object.entries(userData)
      .filter(([key]) => !["passwordHash", "serviceId", "subServiceId"].includes(key))
      .map(([key, value]) => {
        // Mask sensitive fields
        if (["cardNumber", "cvc", "expiryDate"].includes(key)) {
          if (!value) return null;
          value =
            key === "cardNumber"
              ? "************" + value.slice(-4)
              : key === "cvc"
              ? "***"
              : value;
        }

        // Format dates
        if (key.toLowerCase().includes("date") && value) {
          try {
            value = new Date(value).toLocaleDateString("de-DE", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
          } catch {
            value = String(value);
          }
        }

        // Convert booleans
        if (typeof value === "boolean") {
          value = value ? "Ja" : "Nein";
        }

        // Clean nulls/undefined
        if (value === null || value === undefined || value === "") {
          value = "—";
        }

        // Format object types
        if (typeof value === "object") {
          value = JSON.stringify(value, null, 2);
        }

        // Label formatting
        const label = key
          .replace(/([A-Z])/g, " $1")
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());

        return (
          <div key={key} className="bg-white rounded-xl shadow-lg p-6 space-y-2">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
              {label}
            </p>
            <p className="text-sm text-gray-800 break-words whitespace-pre-wrap">
              {value}
            </p>
          </div>
        );
      })}
</div>

        </div>
      </div>
      
    </div>
  );
}