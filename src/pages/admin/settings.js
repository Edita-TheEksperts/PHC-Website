import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";

export default function SettingsPage() {
  const [admin, setAdmin] = useState({ firstName: "", lastName: "", email: "", phone: "" });

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch("/api/admin/profile");
      const data = await res.json();
      setAdmin(data);
    }

    fetchProfile();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-[#04436F]">Settings</h1>
      <div className="space-y-8">

        {/* Profile Info */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold text-[#04436F]">Profile Info</h2>
          <form className="space-y-3">
            <input className="w-full border p-2 rounded" placeholder="First Name" value={admin.firstName || ""} readOnly />
            <input className="w-full border p-2 rounded" placeholder="Last Name" value={admin.lastName || ""} readOnly />
            <input className="w-full border p-2 rounded" placeholder="Email" value={admin.email || ""} readOnly />
            <input className="w-full border p-2 rounded" placeholder="Phone" value={admin.phone || ""} readOnly />
          </form>
        </div>

        {/* Password */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold text-[#04436F]">Change Password</h2>
          <form className="space-y-3">
            <input type="password" className="w-full border p-2 rounded" placeholder="Current Password" />
            <input type="password" className="w-full border p-2 rounded" placeholder="New Password" />
            <input type="password" className="w-full border p-2 rounded" placeholder="Confirm New Password" />
            <button className="bg-green-600 text-white px-4 py-2 rounded">Update Password</button>
          </form>
        </div>

        {/* Appearance */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold text-[#04436F]">Appearance</h2>
          <label className="flex items-center gap-3">
            <input type="checkbox" />
            <span>Enable Dark Mode</span>
          </label>
        </div>

        {/* Notifications */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold text-[#04436F]">Notifications</h2>
          <label className="block">
            <input type="checkbox" className="mr-2" /> Email Notifications
          </label>
          <label className="block">
            <input type="checkbox" className="mr-2" /> SMS Notifications
          </label>
        </div>

      </div>
    </AdminLayout>
  );
}
