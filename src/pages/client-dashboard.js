import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function ClientDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatedData, setUpdatedData] = useState({});
  const router = useRouter();

  // Mock Client Data (this will be used as the default data)
  const mockUserData = {
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    address: "123 Main St, Anytown, USA",
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
        const email = localStorage.getItem("email"); // Ensure the email is saved in localStorage after login/register
        
        // Simulate fetching user data (replace this with real API call)
        setUserData(mockUserData);
        setUpdatedData(mockUserData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setLoading(false);
      }
    };
  
    getUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle changes in the form data
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
    console.log(updatedData);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-[#B99B5F] text-white p-6">
        <h2 className="text-3xl font-bold text-center">PHC</h2>
        <ul className="mt-8 space-y-4">
          <li className="hover:bg-[#B99B5F] p-3 rounded-md cursor-pointer">Dashboard</li>
          <li className="hover:bg-[#B99B5F] p-3 rounded-md cursor-pointer">Profile</li>
          <li className="hover:bg-[#B99B5F] p-3 rounded-md cursor-pointer">Settings</li>
          <li className="hover:bg-[#B99B5F] p-3 rounded-md cursor-pointer">Logout</li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-50 p-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-semibold text-[#B99B5F]">Client Dashboard</div>
          <div>
            <button
              onClick={() => router.push("/edit-client-profile")}
              className="py-2 px-4 bg-[#B99B5F] text-white font-semibold rounded-md hover:bg-[#B99B5F]"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Client Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Personal Information Card */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold text-[#B99B5F]">Personal Information</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {userData?.fullName}</p>
              <p><strong>Email:</strong> {userData?.email}</p>
              <p><strong>Phone:</strong> {userData?.phone}</p>
              <p><strong>Address:</strong> {userData?.address}</p>
            </div>
          </div>

          {/* Health Information Card */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold text-[#B99B5F]">Health Information</h2>
            <div className="space-y-2">
              <p><strong>Allergies:</strong> {userData?.healthQuestions?.allergies}</p>
              <p><strong>Special Requests:</strong> {userData?.healthQuestions?.specialRequests}</p>
            </div>
          </div>

          {/* Emergency Contact Card */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold text-[#B99B5F]">Emergency Contact</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {userData?.emergencyContact?.name}</p>
              <p><strong>Phone:</strong> {userData?.emergencyContact?.phone}</p>
            </div>
          </div>

          {/* Documents Card */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4 col-span-1 md:col-span-2 lg:col-span-3">
            <h2 className="text-xl font-semibold text-[#B99B5F]">Documents</h2>
            <div className="space-y-2">
              <p><strong>Resume:</strong> <a href={userData?.resumeUrl} target="_blank" className="text-[#B99B5F] underline">View Resume</a></p>
              {userData?.photoUrl && (
                <p><strong>Photo:</strong> <a href={userData?.photoUrl} target="_blank" className="text-[#B99B5F] underline">View Photo</a></p>
              )}
            </div>
          </div>
        </div>

        {/* Update Profile Form */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-[#B99B5F] mb-4">Update Your Information</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex justify-between">
              <label className="font-medium">Full Name:</label>
              <input
                type="text"
                name="fullName"
                value={updatedData.fullName}
                onChange={handleChange}
                className="h-[48px] w-full rounded-[12px] border border-[rgba(3,16,41,0.12)] px-4 text-[16px]"
              />
            </div>

            <div className="flex justify-between">
              <label className="font-medium">Email Address:</label>
              <input
                type="email"
                name="email"
                value={updatedData.email}
                onChange={handleChange}
                className="h-[48px] w-full rounded-[12px] border border-[rgba(3,16,41,0.12)] px-4 text-[16px]"
              />
            </div>

            <div className="flex justify-between">
              <label className="font-medium">Phone Number:</label>
              <input
                type="tel"
                name="phone"
                value={updatedData.phone}
                onChange={handleChange}
                className="h-[48px] w-full rounded-[12px] border border-[rgba(3,16,41,0.12)] px-4 text-[16px]"
              />
            </div>

            <div className="flex justify-between">
              <label className="font-medium">Emergency Contact:</label>
              <input
                type="text"
                name="emergencyContact"
                value={updatedData.emergencyContact}
                onChange={handleChange}
                className="h-[48px] w-full rounded-[12px] border border-[rgba(3,16,41,0.12)] px-4 text-[16px]"
              />
            </div>

            <div className="flex justify-between">
              <label className="font-medium">Allergies:</label>
              <input
                type="text"
                name="allergies"
                value={updatedData.healthQuestions.allergies}
                onChange={handleChange}
                className="h-[48px] w-full rounded-[12px] border border-[rgba(3,16,41,0.12)] px-4 text-[16px]"
              />
            </div>

            <div className="flex justify-between">
              <label className="font-medium">Special Requests:</label>
              <input
                type="text"
                name="specialRequests"
                value={updatedData.healthQuestions.specialRequests}
                onChange={handleChange}
                className="h-[48px] w-full rounded-[12px] border border-[rgba(3,16,41,0.12)] px-4 text-[16px]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#B99B5F] text-white font-semibold text-lg rounded-md shadow-lg hover:bg-[#A6884A] transition duration-300 ease-in-out mt-6"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
