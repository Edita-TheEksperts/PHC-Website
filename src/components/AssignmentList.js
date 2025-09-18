export default function AssignmentsList({ confirmedAssignments = [] }) {
  const schedules = confirmedAssignments.flatMap((assignment) => {
    const client = assignment.user;

    if (!client?.schedules || client.schedules.length === 0) {
      // fallback: show assignment without schedule
      return [{
        id: assignment.id,
        clientName: `${client.firstName} ${client.lastName}`,
        service: client.services?.map((s) => s.name).join(", ") || "—",
        date: null,
        startTime: null,
      }];
    }

    return client.schedules.map((schedule) => ({
      id: `${assignment.id}-${schedule.id}`,
      clientName: `${client.firstName} ${client.lastName}`,
      service: client.services?.map((s) => s.name).join(", ") || "—",
      date: schedule.day,
      startTime: schedule.startTime,
    }));
  });

  return (
    <div className="my-6">
      <h3 className="text-xl font-bold mb-4 text-[#04436F]">
        📋 Einsätze
      </h3>

      {schedules.map((s) => (
        <div key={s.id} className="p-4 bg-white border rounded mb-3">
          <p><strong>Kunde:</strong> {s.clientName}</p>
          <p><strong>Service:</strong> {s.service}</p>
          {s.date ? (
            <p><strong>Datum:</strong> {new Date(s.date).toLocaleDateString("de-DE")} {s.startTime && `um ${s.startTime}`}</p>
          ) : (
            <p className="text-sm text-gray-500 italic">Kein Zeitplan vorhanden</p>
          )}
        </div>
      ))}

      {schedules.length === 0 && (
        <p className="text-sm text-gray-500">Keine bestätigten Einsätze.</p>
      )}
    </div>
  );
}
