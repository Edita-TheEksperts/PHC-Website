import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("client");
  const [service, setService] = useState("");
  const [subService, setSubService] = useState("");
  const [frequency, setFrequency] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [address, setAddress] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [canSelectService, setCanSelectService] = useState(false);

  const router = useRouter();

  const servicesData = {
    1: ["Sub-Service 1.1", "Sub-Service 1.2", "Sub-Service 1.3"],
    2: ["Sub-Service 2.1", "Sub-Service 2.2"],
    3: ["Sub-Service 3.1", "Sub-Service 3.2"],
    4: ["Sub-Service 4.1", "Sub-Service 4.2"],
  };

  // Load saved data from localStorage
  useEffect(() => {
    setCanSelectService(true); // Always allow service selection for now
  
    setService(localStorage.getItem("service") || "");
    setSubService(localStorage.getItem("subService") || "");
    setStartTime(localStorage.getItem("startTime") || "");
    setEndTime(localStorage.getItem("endTime") || "");
    setFrequency(localStorage.getItem("frequency") || "");
    setAddress(localStorage.getItem("address") || "");
  }, []);
  

  // Save to localStorage when user changes anything
  const handleServiceChange = (e) => {
    setService(e.target.value);
    localStorage.setItem("service", e.target.value);
    setSubService("");
    localStorage.removeItem("subService");
  };

  const handleSubServiceChange = (e) => {
    setSubService(e.target.value);
    localStorage.setItem("subService", e.target.value);
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
    localStorage.setItem("startTime", e.target.value);
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
    localStorage.setItem("endTime", e.target.value);
  };

  const handleFrequencyChange = (e) => {
    setFrequency(e.target.value);
    localStorage.setItem("frequency", e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    localStorage.setItem("address", e.target.value);
  };

  const calculateHours = (start, end) => {
    const [startHour, startMin] = start.split(":").map(Number);
    const [endHour, endMin] = end.split(":").map(Number);

    const startTotal = startHour * 60 + startMin;
    const endTotal = endHour * 60 + endMin;
    return (endTotal - startTotal) / 60;
  };

  const calculatePrice = () => {
    const basePricePerHour = 50; // Example: $50/hour
    const hours = calculateHours(startTime, endTime);
    return Math.max(0, hours) * basePricePerHour;
  };

  const goToNextStep = () => {
    if (step === 2) {
      const hours = calculateHours(startTime, endTime);
      if (hours < 2) {
        alert("Minimum booking is 2 hours.");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      fullName,
      email,
      phone,
      password,
      service,
      subService,
      frequency,
      timeWindow: `${startTime} - ${endTime}`,
      address,
      role,
    };

    const res = await fetch("/api/client-register-api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (res.ok) {
      localStorage.clear(); // 🔵 (optional) Clear old stuff first
      localStorage.setItem("email", email); // 🟢 Save the email after clearing
    
      setMessage("Registration successful! Redirecting...");
      setTimeout(() => router.push("/client-dashboard"), 3000);
    } else {
      setMessage("Something went wrong, please try again.");
    }
    
  };

  // Step 1: Service Selection
  const serviceSelection = (
    <div className="flex flex-col space-y-6">
      <h1 className="text-center text-[#031029] font-semibold text-[24px] mb-8">
        What Service Are You Interested In?
      </h1>
      <div className="space-y-4 w-full max-w-[400px] mx-auto">
        <select
          value={service}
          onChange={handleServiceChange}
          disabled={!canSelectService}
          className="w-full p-4 bg-[#F5F5F5] rounded-md shadow-md"
        >
          <option value="">Select Service</option>
          {Object.keys(servicesData).map((key) => (
            <option key={key} value={key}>
              Service {key}
            </option>
          ))}
        </select>

        {service && (
          <select
            value={subService}
            onChange={handleSubServiceChange}
            className="w-full p-4 bg-[#F5F5F5] rounded-md shadow-md"
          >
            <option value="">Select Sub-Service</option>
            {servicesData[service].map((sub, index) => (
              <option key={index} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        )}

        <button
          onClick={goToNextStep}
          disabled={!subService}
          className="w-full py-4 bg-[#B99B5F] text-white font-semibold text-lg rounded-md shadow-lg"
        >
          Next
        </button>
      </div>
    </div>
  );

  // Step 2: Time and Address
  const frequencyAndAddress = (
    <div className="flex flex-col space-y-6">
      <h2 className="text-center text-[#031029] font-semibold text-[24px] mb-6">
        How Often and When Do You Need The Service?
      </h2>

      <select
        value={frequency}
        onChange={handleFrequencyChange}
        className="w-full p-4 bg-[#F5F5F5] rounded-md shadow-md"
      >
        <option value="">Select Frequency</option>
        <option value="weekly">Weekly</option>
        <option value="bi-weekly">Bi-weekly</option>
        <option value="monthly">Monthly</option>
      </select>

      <div className="flex gap-4">
        <input
          type="time"
          value={startTime}
          onChange={handleStartTimeChange}
          className="w-1/2 p-4 bg-[#F5F5F5] rounded-md shadow-md"
        />
        <input
          type="time"
          value={endTime}
          onChange={handleEndTimeChange}
          className="w-1/2 p-4 bg-[#F5F5F5] rounded-md shadow-md"
        />
      </div>

      <input
        type="text"
        value={address}
        onChange={handleAddressChange}
        placeholder="Address"
        className="w-full p-4 bg-[#F5F5F5] rounded-md shadow-md"
      />

      <button
        onClick={goToNextStep}
        className="w-full py-4 bg-[#B99B5F] text-white font-semibold text-lg rounded-md shadow-lg"
      >
        Next
      </button>
    </div>
  );

  // Step 3: Summary & Next Decision
  const summaryAndAccount = (
    <div className="flex flex-col space-y-6">
      <h2 className="text-center text-[#031029] font-semibold text-[24px] mb-6">
        Summary & Account Setup
      </h2>

      <div className="bg-[#F5F5F5] p-4 rounded-md shadow-md space-y-2">
        <p>Service: {service}</p>
        <p>Sub-Service: {subService}</p>
        <p>Frequency: {frequency}</p>
        <p>Time: {startTime} - {endTime}</p>
        <p>Hours: {calculateHours(startTime, endTime)}</p>
        <p>Price: ${calculatePrice()}</p>
        <p>Address: {address}</p>
      </div>

      <h2 className="text-center text-[#031029] font-semibold text-[24px] mt-8">
        Do You Have an Account?
      </h2>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => router.push("/login")}
          className="w-full py-4 bg-[#031029] text-white font-semibold text-lg rounded-md"
        >
          Yes, Login
        </button>

        <button
          onClick={() => setStep(4)}
          className="w-full py-4 bg-[#B99B5F] text-white font-semibold text-lg rounded-md"
        >
          No, Create New
        </button>
      </div>
    </div>
  );

  // Step 4: Create Account
  const accountCreation = (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
      <h2 className="text-center text-[#031029] font-semibold text-[24px] mb-6">
        Create Your Account
      </h2>

      <input
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Full Name"
        className="w-full p-4 bg-[#F5F5F5] rounded-md shadow-md"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email Address"
        className="w-full p-4 bg-[#F5F5F5] rounded-md shadow-md"
      />
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone Number"
        className="w-full p-4 bg-[#F5F5F5] rounded-md shadow-md"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-4 bg-[#F5F5F5] rounded-md shadow-md"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-[#B99B5F] text-white font-semibold text-lg rounded-md"
      >
        {loading ? "Registering..." : "Register"}
      </button>

      {message && <p className="text-center text-red-500">{message}</p>}
    </form>
  );

  return (
    <div className="flex flex-col max-w-3xl mx-auto py-10 px-4">
      {step === 1 && serviceSelection}
      {step === 2 && frequencyAndAddress}
      {step === 3 && summaryAndAccount}
      {step === 4 && accountCreation}
    </div>
  );
}
