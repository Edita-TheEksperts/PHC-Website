import { useState } from 'react';
import { useRouter } from 'next/router';

const RegisterClient = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  
  // Form data states
  const [service, setService] = useState('');
  const [frequency, setFrequency] = useState('');
  const [timeWindow, setTimeWindow] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  
  // Loading state
  const [loading, setLoading] = useState(false);

  const handleNextStep = () => setStep((prevStep) => prevStep + 1);
  const handlePrevStep = () => setStep((prevStep) => prevStep - 1);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Call the API to register the user
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName, email, phone, address, service, frequency, timeWindow, paymentMethod
      }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/dashboard");  // Redirect to dashboard after successful registration
    } else {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <h1>Client Registration</h1>

      {/* Step 1: Service Selection */}
      {step === 1 && (
        <div>
          <h2>What Service Do You Need?</h2>
          <div>
            <button onClick={() => { setService('homeCleaning'); handleNextStep(); }}>Home Cleaning</button>
            <button onClick={() => { setService('businessCleaning'); handleNextStep(); }}>Business Cleaning</button>
            <button onClick={() => { setService('endOfTenancy'); handleNextStep(); }}>End of Tenancy</button>
          </div>
        </div>
      )}

      {/* Step 2: Frequency and Time Selection */}
      {step === 2 && (
        <div>
          <h2>How Often Should We Clean?</h2>
          <div>
            <button onClick={() => { setFrequency('weekly'); handleNextStep(); }}>Weekly</button>
            <button onClick={() => { setFrequency('biWeekly'); handleNextStep(); }}>Every 2 Weeks</button>
            <button onClick={() => { setFrequency('monthly'); handleNextStep(); }}>Once a Month</button>
          </div>
          <div>
            <h2>Preferred Time Slot</h2>
            <input
              type="text"
              placeholder="Preferred time window (e.g., 10 AM - 12 PM)"
              value={timeWindow}
              onChange={(e) => setTimeWindow(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Step 3: Personal Details and Payment */}
      {step === 3 && (
        <div>
          <h2>Enter Your Personal Details</h2>
          <form onSubmit={handleNextStep}>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <div>
              <h3>Choose Payment Method</h3>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="creditCard">Credit Card</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>
            <button type="submit">{loading ? 'Submitting...' : 'Next'}</button>
          </form>
        </div>
      )}

      {/* Final Step: Confirmation and Submit */}
      {step === 4 && (
        <div>
          <h2>Confirm Your Details</h2>
          <p>Service: {service}</p>
          <p>Frequency: {frequency}</p>
          <p>Time Window: {timeWindow}</p>
          <p>Name: {fullName}</p>
          <p>Email: {email}</p>
          <p>Phone: {phone}</p>
          <p>Address: {address}</p>
          <p>Payment: {paymentMethod}</p>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Processing...' : 'Submit Registration'}
          </button>
        </div>
      )}

      {/* Navigation Buttons */}
      <div>
        {step > 1 && step < 4 && (
          <button onClick={handlePrevStep}>Back</button>
        )}
      </div>
    </div>
  );
};

export default RegisterClient;
