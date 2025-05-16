import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function EmployeeDashboard() {
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Mock Employee Data (for now)
  const mockEmployeeData = {
    email: "john.doe@example.com",
    firstName: "John",
    lastName: "Doe",
    phone: "123-456-7890",
    address: "123 Main St, Anytown, USA",
    experienceYears: 5,
    experienceWhere: "ABC Corp",
    hasLicense: true,
    availabilityFrom: "2023-06-01",
    availabilityDays: ["Mon", "Wed", "Fri"],
    servicesOffered: ["Cleaning", "Cooking"],
    resumeUrl: "https://example.com/resume.pdf",
    photoUrl: "https://example.com/photo.jpg"
  };

  // Simulate fetching employee data
  useEffect(() => {
    const fetchEmployeeData = async () => {
      const email = localStorage.getItem("email"); // Get the logged-in user's email

      if (!email) {
        router.push("/login"); // Redirect if not logged in
        return;
      }

      try {
        // Simulate fetching employee data
        setEmployeeData(mockEmployeeData);
      } catch (error) {
        console.error(error);
        setEmployeeData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [router]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!employeeData) {
    return <div className="text-center">Error loading employee data. Please try again later.</div>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-[#04436F] text-white p-6">
        <h2 className="text-3xl font-bold text-center">PHC</h2>
        <ul className="mt-8 space-y-4">
          <li className="hover:bg-[#032A4B] p-3 rounded-md cursor-pointer">Dashboard</li>
          <li className="hover:bg-[#032A4B] p-3 rounded-md cursor-pointer">Profile</li>
          <li className="hover:bg-[#032A4B] p-3 rounded-md cursor-pointer">Settings</li>
          <li className="hover:bg-[#032A4B] p-3 rounded-md cursor-pointer">Logout</li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-50 p-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-semibold text-[#04436F]">Employee Dashboard</div>
          <div>
            <button
              onClick={() => router.push("/edit-employee-profile")}
              className="py-2 px-4 bg-[#04436F] text-white font-semibold rounded-md hover:bg-[#032A4B]"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Employee Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Personal Information Card */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold text-[#04436F]">Personal Information</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {employeeData.firstName} {employeeData.lastName}</p>
              <p><strong>Email:</strong> {employeeData.email}</p>
              <p><strong>Phone:</strong> {employeeData.phone}</p>
              <p><strong>Address:</strong> {employeeData.address}</p>
            </div>
          </div>

          {/* Work Experience Card */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold text-[#04436F]">Work Experience</h2>
            <div className="space-y-2">
              <p><strong>Years of Experience:</strong> {employeeData.experienceYears}</p>
              <p><strong>Experience Location:</strong> {employeeData.experienceWhere}</p>
              <p><strong>Has License:</strong> {employeeData.hasLicense ? "Yes" : "No"}</p>
            </div>
          </div>

          {/* Availability Card */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold text-[#04436F]">Availability</h2>
            <div className="space-y-2">
              <p><strong>Available From:</strong> {employeeData.availabilityFrom}</p>
              <p><strong>Available Days:</strong> {employeeData.availabilityDays.join(", ")}</p>
            </div>
          </div>

          {/* Services Offered Card */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold text-[#04436F]">Services Offered</h2>
            <div className="space-y-2">
              {employeeData.servicesOffered.length > 0 ? (
                employeeData.servicesOffered.map((service, index) => (
                  <p key={index}>{service}</p>
                ))
              ) : (
                <p>No services offered yet.</p>
              )}
            </div>
          </div>

          {/* Documents Card */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4 col-span-1 md:col-span-2 lg:col-span-3">
            <h2 className="text-xl font-semibold text-[#04436F]">Documents</h2>
            <div className="space-y-2">
              <p><strong>Resume:</strong> <a href={employeeData.resumeUrl} target="_blank" className="text-[#04436F] underline">View Resume</a></p>
              {employeeData.photoUrl && (
                <p><strong>Photo:</strong> <a href={employeeData.photoUrl} target="_blank" className="text-[#04436F] underline">View Photo</a></p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
