import Link from "next/link";
import { useState } from "react";

export default function AdminLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Mobile toggle button */}
      <div className="flex lg:hidden justify-between items-center bg-[#0F1F38] text-white px-4 py-3">
        <h1 className="text-xl font-bold">Admin</h1>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-[#0F1F38] text-white w-full lg:w-60 p-4 space-y-6 ${
          menuOpen ? "block" : "hidden"
        } lg:block`}
      >
        <h1 className="text-2xl font-bold hidden lg:block">Admin</h1>
        <nav className="flex flex-col space-y-4">
          <Link href="/admin-dashboard" className="hover:text-blue-400">
            Dashboard
          </Link>
          <Link href="/admin/employees" className="hover:text-blue-400">
            Employees
          </Link>
          <Link href="/admin/clients" className="hover:text-blue-400">
            Clients
          </Link>
          <Link href="/admin/settings" className="hover:text-blue-400">
            Settings
          </Link>
          <Link href="/admin/system-email" className="hover:text-blue-400">
            System Maintenance
          </Link>
          <Link href="/admin/feedback-email" className="hover:text-blue-400">
            Feedback Email
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 bg-gray-50">{children}</main>
    </div>
  );
}
