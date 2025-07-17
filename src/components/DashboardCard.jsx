export default function DashboardCard({ title, icon, children, className = "" }) {
  return (
    <div className={`rounded-2xl bg-white p-5 shadow-sm border border-gray-100 transition hover:shadow-md ${className}`}>
      {title && (
        <div className="flex items-center gap-2 text-gray-800 font-semibold text-base mb-4">
          {icon && <span className="text-lg">{icon}</span>}
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
