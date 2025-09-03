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
      <h1 className="text-3xl font-bold text-[#04436F]">Einstellungen</h1>
      <div className="space-y-8">

        {/* Profile Info */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold text-[#04436F]">Profilinformationen</h2>
          <form className="space-y-3">
            <input className="w-full border p-2 rounded" placeholder="First Name" value={admin.firstName || ""} readOnly />
            <input className="w-full border p-2 rounded" placeholder="Last Name" value={admin.lastName || ""} readOnly />
            <input className="w-full border p-2 rounded" placeholder="Email" value={admin.email || ""} readOnly />
            <input className="w-full border p-2 rounded" placeholder="Phone" value={admin.phone || ""} readOnly />
          </form>
        </div>

        {/* Password */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold text-[#04436F]">Passwort ändern</h2>
          <form className="space-y-3">
            <input type="password" className="w-full border p-2 rounded" placeholder="Aktuelles Passwort" />
            <input type="password" className="w-full border p-2 rounded" placeholder="Neues Passwort" />
            <input type="password" className="w-full border p-2 rounded" placeholder="Neues Passwort bestätigen" />
            <button className="bg-green-600 text-white px-4 py-2 rounded">Passwort aktualisieren</button>
          </form>
        </div>




      </div>
    </AdminLayout>
  );
}
