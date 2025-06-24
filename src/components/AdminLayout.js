import Link from "next/link";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <aside className="bg-[#0F1F38] text-white w-60 p-4 space-y-6">
        <h1 className="text-2xl font-bold">Admin</h1>
        <nav className="flex flex-col space-y-4">
          <Link href="/admin-dashboard" className="hover:text-blue-400">Dashboard</Link>
          <Link href="/admin/employees" className="hover:text-blue-400">Employees</Link>
          <Link href="/admin/clients" className="hover:text-blue-400">Clients</Link>
          <Link href="/admin/settings" className="hover:text-blue-400">Settings</Link>
          <Link href="/admin/system-email" className="hover:text-blue-400">System Maintenance</Link>
          <Link href="/admin/feedback-email" className="hover:text-blue-400">Feedback Email</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-50">
        {children}
      </main>
    </div>
  );
}
