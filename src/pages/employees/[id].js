import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function EmployeeDetails() {
  const router = useRouter();
  const { id } = router.query; // Get employee ID from the URL query
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      // Fetch employee data when ID is available
      async function fetchEmployee() {
        try {
          const res = await fetch(`/api/employees/${id}`);
          if (!res.ok) {
            throw new Error("Error fetching employee details");
          }
          const data = await res.json();
          setEmployee(data); // Store the fetched data in state
        } catch (error) {
          setError("Failed to fetch employee details");
        } finally {
          setLoading(false); // Stop loading once data is fetched
        }
      }

      fetchEmployee();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>; // Show loading state while data is being fetched
  }

  if (error) {
    return <div>{error}</div>; // Show error message if there's an issue fetching the data
  }

  if (!employee) {
    return <div>Employee not found</div>; // Show message if no employee is found
  }

  return (
    <div className="mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-semibold text-[#04436F]">Employee Details</h1>

      <div className="mt-6">
        <p><strong>Name:</strong> {employee.firstName} {employee.lastName}</p>
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Phone:</strong> {employee.phone}</p>
        <p><strong>Address:</strong> {employee.address}</p>
        <p><strong>Experience (Years):</strong> {employee.experienceYears}</p>
        <p><strong>Status:</strong> {employee.status}</p>
        <p><strong>Availability From:</strong> {employee.availabilityFrom}</p>
        <p><strong>Services Offered:</strong> {employee.servicesOffered.join(", ")}</p>
        <p><strong>How Far Can You Travel:</strong> {employee.howFarCanYouTravel}</p>
        <p><strong>Resume:</strong> <a href={employee.resumeUrl} target="_blank" rel="noopener noreferrer">View Resume</a></p>
        <p><strong>Photo:</strong> <img src={employee.photoUrl} alt="Employee photo" className="w-32 h-32 rounded-full" /></p>

        {/* Display health question details if available */}
        {employee.healthQuestion && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Health Questions</h2>
            <p><strong>Allergies:</strong> {employee.healthQuestion.allergies || "N/A"}</p>
            <p><strong>Special Requests:</strong> {employee.healthQuestion.specialRequests || "N/A"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
