import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState, useMemo } from "react";
import { useRouter } from "next/router";

export default function AppointmentCalendar({ schedules }) {
  console.log("✅ SCHEDULES RECEIVED", schedules);

  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const router = useRouter();

  const selectedISO = selectedDate
    ? selectedDate.toISOString().slice(0, 10)
    : null;

  const assignedAppointments = useMemo(
    () => schedules.filter((s) => s.employee),
    [schedules]
  );

  const filteredAppointments = useMemo(() => {
    if (!selectedISO) return schedules;
    return schedules.filter(
      (s) =>
        s.date &&
        new Date(s.date).toISOString().slice(0, 10) === selectedISO
    );
  }, [selectedISO, assignedAppointments]);

  function formatDate(d) {
    return new Date(d).toLocaleDateString("de-DE");
  }

  function handleAppointmentClick(id) {
    router.push(`/appointments/${id}`);
  }

  return (
    <div className="my-10 bg-white p-6 rounded-2xl shadow-md border border-gray-200">
      {/* ✅ ONLY CHANGE: override weekend red color */}
      <style jsx global>{`
        .react-calendar__month-view__days__day--weekend {
          color: #1f2937 !important;
        }
      `}</style>

      <h2 className="text-2xl font-bold text-[#04436F] mb-4">Termine</h2>

      <Calendar
        onChange={(date) => {
          setCalendarDate(date);
          setSelectedDate(date);
        }}
        value={calendarDate}
        className="w-full mb-4 border rounded-xl p-6"
        tileContent={({ date }) => {
          const hasAppointment = assignedAppointments.some(
            (s) =>
              s.date &&
              new Date(s.date).toISOString().slice(0, 10) ===
                date.toISOString().slice(0, 10)
          );
          return hasAppointment ? (
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 mx-auto" />
          ) : null;
        }}
      />

      <button
        onClick={() => setIsOpen((p) => !p)}
        className="mt-4 px-4 py-2 bg-[#04436F] text-white text-sm font-semibold rounded-xl hover:bg-[#033252] transition-all"
      >
        {isOpen
          ? "🔽 Termine ausblenden"
          : `📂 Termine (${filteredAppointments.length})`}
      </button>

      {selectedDate && (
        <button
          onClick={() => setSelectedDate(null)}
          className="ml-4 text-xs underline text-gray-500 hover:text-gray-700"
        >
          Reset date filter
        </button>
      )}

      {isOpen && (
        <div className="mt-6">
          {filteredAppointments.length === 0 ? (
            <p className="text-sm text-gray-500">Keine Termine geplant.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {filteredAppointments.map((a) => (
                <li
                  key={a.id}
                  onClick={() => handleAppointmentClick(a.id)}
                  className="cursor-pointer bg-gray-50 rounded-xl shadow-sm p-4 border border-gray-200 hover:bg-gray-100 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">
                        👤 Client: {a.user?.firstName} {a.user?.lastName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Employee: {a.employee?.firstName || "—"}{" "}
                        {a.employee?.lastName || ""}
                      </p>
                      <p className="text-xs text-gray-500">
                        {a.date ? formatDate(a.date) : "—"} — {a.startTime} (
                        {a.hours}h)
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/appointments/${a.id}`);
                      }}
                      className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                    >
                      Details
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
