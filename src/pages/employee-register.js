import { useState } from "react";
import { useRouter } from "next/router";

export default function RegisterEmployee() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    residencePermit: "",
    experienceYears: "",
    experienceWhere: "",
    hasLicense: false,
    availabilityFrom: "",
    availabilityDays: [],
    servicesOffered: [],
    howFarCanYouTravel: "",
    resumeUrl: "",
    photoUrl: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle form input change for all types
  const handleChange = (e) => {
    const { name, value, type, checked, selectedOptions } = e.target;

    // Handle different input types
    setForm((f) => ({
      ...f,
      [name]:
        type === "checkbox"
          ? checked
          : type === "select-multiple"
          ? Array.from(selectedOptions, (o) => o.value) // for multi-select
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/employee-register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);

    if (res.ok) {
      setMessage("Check your email to schedule the interview.");
      setTimeout(() => router.push("/"), 3000);
    } else {
      const errorData = await res.json();
      setMessage(errorData.message || "Error registering.");
    }
  };

  const StepWrapper = ({ children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">{children}</div>
  );

  const Button = ({ onClick, children, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3 rounded-md text-white font-semibold transition ${
        disabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-[#04436F] hover:bg-[#032A4B]"
      }`}
    >
      {children}
    </button>
  );

  const validateStep1 = () => form.email && form.firstName && form.lastName && form.phone;
  const validateStep2 = () => form.experienceYears && form.experienceWhere;
  const validateStep3 = () => form.availabilityFrom && form.availabilityDays.length > 0;

  return (
    <div className="max-w-xl mx-auto py-10 px-4 space-y-6">
      {/* Step 1: Personal Information */}
      {step === 1 && (
        <StepWrapper>
          <h2 className="text-2xl font-semibold text-[#04436F]">Persönliche Informationen</h2>
          <input
            name="firstName"
            value={form.firstName}
            placeholder="Vorname"
            onChange={handleChange}
            className="w-full h-12 px-4 border rounded-md focus:ring-2 focus:ring-[#04436F]"
          />
          <input
            name="lastName"
            value={form.lastName}
            placeholder="Familienname"
            onChange={handleChange}
            className="w-full h-12 px-4 border rounded-md focus:ring-2 focus:ring-[#04436F]"
          />
          <input
            name="email"
            type="email"
            value={form.email}
            placeholder="Email"
            onChange={handleChange}
            className="w-full h-12 px-4 border rounded-md focus:ring-2 focus:ring-[#04436F]"
          />
          <input
            name="phone"
            value={form.phone}
            placeholder="Telefon"
            onChange={handleChange}
            className="w-full h-12 px-4 border rounded-md focus:ring-2 focus:ring-[#04436F]"
          />
          <input
            name="address"
            value={form.address}
            placeholder="Adresse"
            onChange={handleChange}
            className="w-full h-12 px-4 border rounded-md focus:ring-2 focus:ring-[#04436F]"
          />
          <Button onClick={() => setStep(2)} disabled={!validateStep1()}>
            Weiter
          </Button>
        </StepWrapper>
      )}

      {/* Step 2: Work Experience */}
      {step === 2 && (
        <StepWrapper>
          <h2 className="text-2xl font-semibold text-[#04436F]">Arbeitserfahrung</h2>
          <input
            name="experienceYears"
            type="number"
            value={form.experienceYears}
            placeholder="Erfahrung (Jahre)"
            onChange={handleChange}
            className="w-full h-12 px-4 border rounded-md focus:ring-2 focus:ring-[#04436F]"
          />
          <input
            name="experienceWhere"
            value={form.experienceWhere}
            placeholder="Ort der Erfahrung"
            onChange={handleChange}
            className="w-full h-12 px-4 border rounded-md focus:ring-2 focus:ring-[#04436F]"
          />
          <label className="inline-flex items-center space-x-2">
            <input
              name="hasLicense"
              type="checkbox"
              checked={form.hasLicense}
              onChange={handleChange}
              className="form-checkbox h-5 w-5 text-[#04436F]"
            />
            <span>Führerschein vorhanden</span>
          </label>
          <Button onClick={() => setStep(3)} disabled={!validateStep2()}>
            Weiter
          </Button>
        </StepWrapper>
      )}

      {/* Step 3: Availability */}
      {step === 3 && (
        <StepWrapper>
          <h2 className="text-2xl font-semibold text-[#04436F]">Arbeitsbereitschaft</h2>
          <input
            name="availabilityFrom"
            type="date"
            value={form.availabilityFrom}
            onChange={handleChange}
            className="w-full h-12 px-4 border rounded-md focus:ring-2 focus:ring-[#04436F]"
          />
          <select
            name="availabilityDays"
            multiple
            value={form.availabilityDays}
            onChange={handleChange}
            className="w-full h-32 px-4 border rounded-md focus:ring-2 focus:ring-[#04436F]"
          >
            {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            name="servicesOffered"
            multiple
            value={form.servicesOffered}
            onChange={handleChange}
            className="w-full h-32 px-4 border rounded-md focus:ring-2 focus:ring-[#04436F]"
          >
            {["Cleaning", "Cooking", "Care"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            name="howFarCanYouTravel"
            value={form.howFarCanYouTravel}
            placeholder="Wie weit Sie reisen können"
            onChange={handleChange}
            className="w-full h-12 px-4 border rounded-md focus:ring-2 focus:ring-[#04436F]"
          />
          <Button onClick={() => setStep(4)} disabled={!validateStep3()}>
            Weiter
          </Button>
        </StepWrapper>
      )}

      {/* Step 4: Documents & Review */}
      {step === 4 && (
        <StepWrapper>
          <h2 className="text-2xl font-semibold text-[#04436F]">Unterlagen & Review</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="resumeUrl"
              value={form.resumeUrl}
              placeholder="Link zu Ihrem Lebenslauf"
              onChange={handleChange}
              required
              className="w-full h-12 px-4 border rounded-md focus:ring-2 focus:ring-[#04436F]"
            />
            <input
              name="photoUrl"
              value={form.photoUrl}
              placeholder="Foto-URL (optional)"
              onChange={handleChange}
              className="w-full h-12 px-4 border rounded-md focus:ring-2 focus:ring-[#04436F]"
            />
            <button
              type="submit"
              className="w-full py-3 bg-[#04436F] text-white rounded-md font-semibold hover:bg-[#032A4B] transition"
              disabled={loading}
            >
              {loading ? "Bitte warten..." : "Registrierung abschließen"}
            </button>
          </form>
          {message && <p className="mt-4 text-center text-[#04436F]">{message}</p>}
        </StepWrapper>
      )}
    </div>
  );
}
