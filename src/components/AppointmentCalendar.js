import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState } from "react";

export default function AppointmentCalendar({ schedules }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(true);

  const selectedDateString = selectedDate.toDateString();

  const appointments = schedules.filter(
    (s) => new Date(s.date).toDateString() === selectedDateString
  );

  return (
    <div className="my-10 bg-white p-6 rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-[#04436F] mb-4"> Appointments</h2>

      <Calendar
  onChange={setSelectedDate}
  value={selectedDate}
  tileContent={({ date }) => {
    const hasSchedule = schedules.some(
      (s) => new Date(s.date).toDateString() === date.toDateString()
    );
    return hasSchedule ? (
      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 mx-auto" />
    ) : null;
  }}
  className="w-full mb-4 border rounded-xl p-6 max-w-5xl mx-auto"
/>


      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mt-4 px-4 py-2 bg-[#04436F] text-white text-sm font-semibold rounded-xl hover:bg-[#033252] transition-all"
      >
        {isOpen ? "🔽 Hide Appointments" : "📂 Show Appointments"}
      </button>

      {isOpen && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Appointments on {selectedDate.toLocaleDateString()}
          </h3>

          {appointments.length === 0 ? (
            <p className="text-sm text-gray-500">No appointments scheduled.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {appointments.map((a) => (
                <li
                  key={a.id}
                  className="bg-gray-50 rounded-xl shadow-sm p-4 border border-gray-200"
                >
                  <p className="font-medium text-gray-800">
                    {a.user?.firstName} {a.user?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Start: {a.startTime} | Duration: {a.hours}h
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
