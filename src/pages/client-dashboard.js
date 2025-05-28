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

 const mockUserData = {
  fullName: "John Doe",
  email: "john.doe@example.com",
  phone: "123-456-7890",
  address: "123 Main St, Anytown, USA",
  service: "Haushaltshilfe und Wohnpflege", // ✅ Add this line
  emergencyContact: {
    name: "Jane Doe",
    phone: "987-654-3210",
  },
  healthQuestions: {
    allergies: "None",
    specialRequests: "None",
  },
  resumeUrl: "https://example.com/resume.pdf",
  photoUrl: "https://example.com/photo.jpg",
};


useEffect(() => {
  const getUserData = async () => {
    try {
      const selectedService = localStorage.getItem("selectedService");

      setUserData(mockUserData);
      setUpdatedData(mockUserData);

      // Use service from user data if available
      if (mockUserData.service) {
        setService(mockUserData.service);
      } else if (selectedService) {
        setService(selectedService);
      }

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setLoading(false);
    }
  };
  getUserData();
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "allergies" || name === "specialRequests") {
      setUpdatedData((prevData) => ({
        ...prevData,
        healthQuestions: {
          ...prevData.healthQuestions,
          [name]: value,
        },
      }));
    } else {
      setUpdatedData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/updateUserData", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
    if (res.ok) {
      alert("Your data has been successfully updated!");
    } else {
      alert("Error updating your data. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="relative">
      {showOverlayForm && (
        <div className="absolute top-0 left-0 w-full h-full bg-white/80 backdrop-blur-sm z-50 flex justify-center items-start">
<div className="bg-white shadow-lg rounded-xl w-full max-w-3xl max-h-[130vh] overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-[#B99B5F]">
            <h2 className="text-xl font-semibold mb-4 text-[#B99B5F]">Bitte füllen Sie das Serviceformular aus</h2>
             {service === "Haushaltshilfe und Wohnpflege" && <RegisterForm1 onComplete={() => setShowOverlayForm(false)} />}
            {service === "Freizeit und Soziale Aktivitäten" && <RegisterForm2 onComplete={() => setShowOverlayForm(false)} />}
            {service === "Gesundheitsführsorge" && <RegisterForm3 onComplete={() => setShowOverlayForm(false)} />}
            {service === "Alltagsbegleitung und Besorgungen" && <RegisterForm4 onComplete={() => setShowOverlayForm(false)} />}

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
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
              <h2 className="text-xl font-semibold text-[#B99B5F]">Personal Information</h2>
              <div className="space-y-2">
                <p><strong>Name:</strong> {userData?.fullName}</p>
                <p><strong>Email:</strong> {userData?.email}</p>
                <p><strong>Phone:</strong> {userData?.phone}</p>
                <p><strong>Address:</strong> {userData?.address}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
              <h2 className="text-xl font-semibold text-[#B99B5F]">Health Information</h2>
              <div className="space-y-2">
                <p><strong>Allergies:</strong> {userData?.healthQuestions?.allergies}</p>
                <p><strong>Special Requests:</strong> {userData?.healthQuestions?.specialRequests}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
              <h2 className="text-xl font-semibold text-[#B99B5F]">Emergency Contact</h2>
              <div className="space-y-2">
                <p><strong>Name:</strong> {userData?.emergencyContact?.name}</p>
                <p><strong>Phone:</strong> {userData?.emergencyContact?.phone}</p>
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
    <div className="flex items-center justify-between">
      <p className="text-base text-gray-700">
        Aktueller Service: <span className="text-[#04436F] font-semibold">{userData?.service || "Nicht angegeben"}</span>
      </p>
      <button
        onClick={() => router.push("/register")}
        className="px-4 py-2 bg-[#04436F] text-white text-sm rounded hover:bg-[#033553]"
      >
        Service ändern
      </button>
    </div>

    <div className="space-y-3">
      {[
        "Alltagsbegleitung und Besorgungen",
        "Freizeit und Soziale Aktivitäten",
        "Gesundheitsführsorge",
        "Haushaltshilfe und Wohnpflege"
      ]
        .filter((s) => s !== userData?.service)
        .map((s, i) => (
          <div key={i} className="flex items-center justify-between border p-3 rounded-md bg-gray-50">
            <span className="text-sm font-medium text-gray-800">{s}</span>
            <button
              onClick={() => {
                localStorage.setItem("selectedService", s);
                router.push("/register");
              }}
              className="text-sm px-3 py-1 rounded bg-[#B99B5F] text-white hover:bg-[#a68a53]"
            >
              Auswählen
            </button>
          </div>
        ))}
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
              <input type="text" name="emergencyContact" value={updatedData.emergencyContact?.name || ""} onChange={handleChange} className="h-[48px] w-full rounded-[12px] border px-4" placeholder="Emergency Contact Name" />
              <input type="text" name="allergies" value={updatedData.healthQuestions.allergies} onChange={handleChange} className="h-[48px] w-full rounded-[12px] border px-4" placeholder="Allergies" />
              <input type="text" name="specialRequests" value={updatedData.healthQuestions.specialRequests} onChange={handleChange} className="h-[48px] w-full rounded-[12px] border px-4" placeholder="Special Requests" />
              <button type="submit" className="w-full py-4 bg-[#B99B5F] text-white font-semibold text-lg rounded-md shadow-lg hover:bg-[#A6884A]">Save Changes</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}