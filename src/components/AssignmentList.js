import moment from "moment";

export default function AssignmentsList({ confirmedAssignments = [] }) {
  // Fillimi dhe fundi i intervalit (ky muaj + muaji tjetër)
  const startOfCurrentMonth = moment().startOf("month");
  const endOfNextMonth = moment().add(1, "month").endOf("month");

  // Mbledhim të gjitha oraret
  const schedules = confirmedAssignments
    .flatMap((assignment) => {
      const client = assignment.user;

      return (client?.schedules || []).map((schedule) => {
        // Parse datën nga API ("DD.MM.YYYY" ose "YYYY-MM-DD")
        const date = moment(schedule.day, ["DD.MM.YYYY", "YYYY-MM-DD"], true);

        if (
          !date.isValid() ||
          !date.isBetween(startOfCurrentMonth, endOfNextMonth, null, "[]")
        ) {
          return null;
        }

        return {
          id: `${assignment.id}-${schedule.id}`,
          clientName: `${client.firstName} ${client.lastName}`,
          service: client.services?.map((s) => s.name).join(", ") || "—",
          date,
          startTime: schedule.startTime,
        };
      });
    })
    .filter(Boolean);

  // Grupimi sipas muajit
  const grouped = schedules.reduce((acc, s) => {
    const month = s.date.format("MMMM YYYY");
    if (!acc[month]) acc[month] = [];
    acc[month].push(s);
    return acc;
  }, {});

  return (
    <div className="my-6">
      <h3 className="text-xl font-bold mb-4 text-[#04436F]">
        📋 Einsätze: Diesen Monat & Nächsten Monat
      </h3>

      {Object.entries(grouped).map(([month, list]) => (
        <div key={month} className="mb-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">{month}</h4>
          <ul className="space-y-3">
            {list.map((s) => (
              <li
                key={s.id}
                className="p-4 bg-white border rounded shadow-sm hover:shadow-md transition"
              >
                <p>
                  <strong>Datum:</strong> {s.date.format("DD.MM.YYYY")},{" "}
                  {s.startTime} Uhr
                </p>
                <p>
                  <strong>Kunde:</strong> {s.clientName}
                </p>
                <p>
                  <strong>Service:</strong> {s.service}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {schedules.length === 0 && (
        <p className="text-sm text-gray-500">
          Keine Einsätze in diesem Zeitraum.
        </p>
      )}
    </div>
  );
}
