export default function OvertimeAlerts({ employees, targetHours = 40 }) {
  const alerts = employees
    .map((e) => {
      const total = e.schedules?.reduce((sum, s) => sum + s.hours, 0) || 0;
      return { ...e, total };
    })
    .filter((e) => e.total > targetHours);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border my-6">
      <h2 className="text-xl font-bold text-red-700 mb-4"> Overtime Alerts</h2>

      {alerts.length === 0 ? (
        <p className="text-gray-600 text-sm">No overtime detected.</p>
      ) : (
        <ul className="space-y-2">
          {alerts.map((e) => (
            <li key={e.id} className="border p-3 rounded-md bg-red-50">
              <span className="font-medium">{e.firstName} {e.lastName}</span>
              <span className="ml-2 text-sm text-gray-700">→ {e.total} hrs (target: {targetHours})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
