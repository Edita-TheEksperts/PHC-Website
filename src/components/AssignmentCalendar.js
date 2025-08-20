import { Calendar, momentLocalizer } from "react-big-calendar";
import { useMemo } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

// Setup localization
const localizer = momentLocalizer(moment);

// ✅ Utility to compute actual Date for weekday + time
function getNextWeekdayDate(weekdayName, timeStr) {
  const weekdays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  const dayIndex = weekdays.indexOf(weekdayName);

  if (dayIndex === -1) return null;

  const now = new Date();
  const result = new Date(now);
  result.setDate(now.getDate() + ((dayIndex + 7 - now.getDay()) % 7));

  const [hour, minute] = timeStr.split(":").map(Number);
  result.setHours(hour);
  result.setMinutes(minute);
  result.setSeconds(0);
  result.setMilliseconds(0);

  return result;
}

export default function AssignmentCalendar({ assignments }) {
  const events = useMemo(() => {
    const startOfCurrentMonth = moment().startOf("month");
    const endOfNextMonth = moment().add(1, "month").endOf("month");

    return assignments.flatMap((assignment) => {
      const client = assignment.user;
      const schedules = client?.schedules || [];

      return schedules.map((schedule) => {
        const date = getNextWeekdayDate(schedule.day, schedule.startTime);
        if (!date) return null;

        const mDate = moment(date);
        if (!mDate.isBetween(startOfCurrentMonth, endOfNextMonth, null, "[]")) {
          return null; // ❌ skip events outside range
        }

        return {
          id: `${assignment.id}-${schedule.day}-${schedule.startTime}`,
          title: `${client.firstName} ${client.lastName}`,
          start: date,
          end: new Date(date.getTime() + 60 * 60 * 1000),
          resource: {
            email: client.email,
            services: client.services?.map((s) => s.name).join(", ") || "—",
          },
        };
      }).filter(Boolean);
    });
  }, [assignments]);

  return (
    <div className="my-6">
      <h3 className="text-xl font-bold mb-4 text-[#04436F]">
        🗓 Einsätze: Diesen Monat & Nächsten Monat
      </h3>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
}
