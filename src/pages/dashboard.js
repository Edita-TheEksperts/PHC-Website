import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Example: get the user name from localStorage after login
    const storedName = localStorage.getItem("name") || "User";
    setUserName(storedName);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAFCFF] p-10">
      {/* Welcome Message */}
      <h1 className="text-4xl font-bold text-[#04436F] mb-10">
        Welcome, {userName}!
      </h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        
        {/* Card 1 */}
        <div className="flex flex-col items-center justify-center p-8 bg-white shadow rounded-xl">
          <h2 className="text-2xl font-bold text-[#04436F]">42</h2>
          <p className="text-gray-500">Total Users</p>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col items-center justify-center p-8 bg-white shadow rounded-xl">
          <h2 className="text-2xl font-bold text-[#04436F]">15</h2>
          <p className="text-gray-500">Active Subscriptions</p>
        </div>

        {/* Card 3 */}
        <div className="flex flex-col items-center justify-center p-8 bg-white shadow rounded-xl">
          <h2 className="text-2xl font-bold text-[#04436F]">7</h2>
          <p className="text-gray-500">Pending Requests</p>
        </div>

      </div>
    </div>
  );
}
