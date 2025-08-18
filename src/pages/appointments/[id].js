// pages/appointments/[id].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AppointmentDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!router.isReady || !id) return;

    async function fetchAppointment() {
      try {
        const res = await fetch(`/api/appointments/${id}`);
        if (!res.ok) throw new Error("Termin nicht gefunden.");
        const data = await res.json();
        setAppointment(data);
      } catch (err) {
        const msg = err && err.message ? err.message : "Fehler beim Laden.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }

    fetchAppointment();
  }, [router.isReady, id]);

  if (loading) return <div className="p-6 text-gray-600">⏳ Lade Termin...</div>;
  if (error) return <div className="p-6 text-red-600">❌ {error}</div>;
  if (!appointment) return null;

  const { date, startTime, hours, user, notes, employee } = appointment;

  const employeeName =
    employee ? `${employee.firstName || ""} ${employee.lastName || ""}`.trim() : "—";
  const clientName =
    user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "—";

  const languages =
    Array.isArray(employee?.languages) && employee.languages.length
      ? employee.languages.join(", ")
      : (employee?.languages || "–");

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 bg-white border rounded-2xl shadow-md mt-6">
      <h1 className="text-2xl font-bold text-[#04436F] mb-6">📅 Termin Details</h1>

      {/* Quick mapping: Employee → Client */}
      <div className="mb-6 text-sm">
        <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1 rounded-lg border border-blue-200">
          🧑‍⚕️ {employeeName}
          <span className="mx-1">→</span>
          👤 {clientName}
        </span>
      </div>

      {/* Appointment Info */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">🗓️ Termin-Infos</h2>
        <ul className="space-y-2 text-sm text-gray-800">
          <li>
            <span className="font-medium text-gray-600">📆 Datum:</span>{" "}
            {date ? new Date(date).toLocaleDateString() : "–"}
          </li>
          <li>
            <span className="font-medium text-gray-600">🕒 Uhrzeit:</span>{" "}
            {startTime || "–"}
          </li>
          <li>
            <span className="font-medium text-gray-600">⏱️ Dauer:</span>{" "}
            {hours} Stunden
          </li>
          {notes && (
            <li>
              <span className="font-medium text-gray-600">📝 Notizen:</span>
              <p className="mt-1 bg-gray-50 border border-gray-200 p-3 rounded-md text-gray-700 whitespace-pre-line">
                {notes}
              </p>
            </li>
          )}
        </ul>
      </section>

      {/* Client Info */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">👤 Klient</h2>
        <ul className="space-y-2 text-sm text-gray-800">
          <li>
            <span className="font-medium text-gray-600">🧑‍💼 Name:</span> {clientName}
          </li>
          <li>
            <span className="font-medium text-gray-600">📍 Adresse:</span>{" "}
            {(user?.address || "–")}, {(user?.careCity || "–")}
          </li>
          <li>
            <span className="font-medium text-gray-600">📞 Telefon:</span>{" "}
            {user?.phone || "–"}
          </li>
        </ul>
      </section>

      {/* Employee Info */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">🧑‍⚕️ Mitarbeitende</h2>
        {employee ? (
          <div className="flex items-start gap-4">
            {employee.profilePhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={employee.profilePhoto}
                alt="Profilfoto"
                className="w-16 h-16 rounded-full border object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full border flex items-center justify-center text-gray-400">
                🙍
              </div>
            )}
            <ul className="space-y-2 text-sm text-gray-800">
              <li>
                <span className="font-medium text-gray-600">🧑‍💼 Name:</span>{" "}
                {employeeName || "–"}
              </li>
              <li>
                <span className="font-medium text-gray-600">📍 Stadt:</span>{" "}
                {employee.city || "–"}
              </li>
              <li>
                <span className="font-medium text-gray-600">📞 Telefon:</span>{" "}
                {employee.phone || "–"}
              </li>
              <li>
                <span className="font-medium text-gray-600">🗣️ Sprachen:</span>{" "}
                {languages}
              </li>
            </ul>
          </div>
        ) : (
          <div className="text-sm text-gray-500">Kein/e Mitarbeitende/r zugewiesen.</div>
        )}
      </section>

      {/* Back button */}
      <div className="text-center mt-8">
        <Link href="/admin-dashboard">
          <button className="px-5 py-2 bg-[#04436F] text-white rounded-xl hover:bg-[#033252] text-sm font-medium">
            ⬅️ Zurück zum Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
