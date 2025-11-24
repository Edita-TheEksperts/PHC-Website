import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


export default function AdminLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter(); 

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
            Mitarbeiter
          </Link>
          <Link href="/admin/clients" className="hover:text-blue-400">
            Kunden
          </Link>
                  <Link href="/admin/mitarbeiter" className="hover:text-blue-400">
New Mitarbeiter
</Link>
        <Link href="/admin/newEmployee" className="hover:text-blue-400">
 Employee List
</Link>
                <Link href="/admin/kunden" className="hover:text-blue-400">
New Kunden
</Link>
<Link href="/admin/einsaetze" className="hover:text-blue-400">
  Einsätze
</Link>
<Link href="/admin/finanzen" className="hover:text-blue-400">
  Finanzen
</Link>
          <Link href="/admin/settings" className="hover:text-blue-400">
Einstellungen          </Link>
          <Link href="/admin/system-email" className="hover:text-blue-400">
Systemwartung          </Link>
          <Link href="/admin/feedback-email" className="hover:text-blue-400">
            Feedback E-Mail
          </Link>
          <Link href="/admin/email-templates" className="hover:text-blue-400">
 E-Mail-Vorlagen
</Link>
<Link
  href="/admin/create"
  className="hover:text-blue-400"
>
   Gutschein erstellen
</Link>




        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-2 lg:p-4 bg-gray-50">{children}</main>
    </div>
  );
}
