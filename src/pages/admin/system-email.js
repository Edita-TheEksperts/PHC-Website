import { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";

function SystemMaintenanceEmailPage() {
  const [clients, setClients] = useState([]);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [dateStart, setDateStart] = useState("");  // maintenance start date
  const [dateEnd, setDateEnd] = useState("");      // maintenance end date
  const [timeStart, setTimeStart] = useState("");  // e.g. "08:00"
  const [timeEnd, setTimeEnd] = useState("");      // e.g. "12:00"

  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await fetch("/api/admin/clients");
        if (!res.ok) throw new Error("Fehler beim Laden der Clients");
        const data = await res.json();
        setClients(data.clients || []);
      } catch (error) {
        console.error(error);
        setMessage("Fehler beim Laden der Kunden.");
      }
    }
    fetchClients();
  }, []);
const formatDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}.${month}.${year}`;
};

  const emailSubject = "Information: Vorübergehende Systemwartung";
  const emailBody = `
Guten Tag,

Vom ${formatDate(dateStart)} bis zum ${formatDate(dateEnd)} zwischen ${timeStart} und ${timeEnd}
 führen wir geplante Wartungsarbeiten an unserem System durch.

In diesem Zeitraum ist das Kundenportal vorübergehend nicht erreichbar. Bei dringenden Anliegen erreichen Sie uns telefonisch unter ${process.env.NEXT_PUBLIC_SUPPORT_PHONE || "[Telefonnummer]"}.

Vielen Dank für Ihr Verständnis.

Freundliche Grüsse

Ihr Prime Home Care Team
`.trim();

  async function sendMaintenanceEmail() {
    if (!dateStart || !dateEnd || !timeStart || !timeEnd) {
      setMessage("Bitte Start- und Enddatum sowie Uhrzeiten ausfüllen.");
      return;
    }
    setSending(true);
    setMessage("");
const date = `${dateStart} bis ${dateEnd}`;

    // fetch POST remains same, just send dateStart and dateEnd instead of date
    try {
      
const res = await fetch("/api/admin/send-maintenance-email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ date, timeStart, timeEnd }),
});

      if (res.ok) {
        setMessage(`✅ Wartungs-Mail wurde an ${clients.length} Kunden gesendet.`);
      } else {
        const err = await res.json();
        setMessage("❌ Fehler: " + err.message);
      }
    } catch (error) {
      setMessage("❌ Serverfehler. Bitte später erneut versuchen.");
    } finally {
      setSending(false);
    }
  }

  return (
    <AdminLayout>
      <div className="bg-white rounded-xl shadow p-6 max-w-xl mx-auto space-y-6">
        <h2 className="text-xl font-bold text-[#04436F]">Systemwartung E-Mail</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <label className="flex flex-col">
            <span className="font-semibold mb-1">Startdatum</span>
            <input
              type="date"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              className="border rounded px-3 py-2"
            />
          </label>
          <label className="flex flex-col">
            <span className="font-semibold mb-1">Enddatum</span>
            <input
              type="date"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              className="border rounded px-3 py-2"
            />
          </label>
          <label className="flex flex-col">
            <span className="font-semibold mb-1">Startzeit</span>
            <input
              type="time"
              value={timeStart}
              onChange={(e) => setTimeStart(e.target.value)}
              className="border rounded px-3 py-2"
            />
          </label>
          <label className="flex flex-col">
            <span className="font-semibold mb-1">Endzeit</span>
            <input
              type="time"
              value={timeEnd}
              onChange={(e) => setTimeEnd(e.target.value)}
              className="border rounded px-3 py-2"
            />
          </label>
        </div>

        <div className="bg-gray-50 border border-gray-300 rounded p-4 whitespace-pre-wrap text-gray-800 text-sm">
          <strong>Betreff:</strong> {emailSubject}
          <br />
          <br />
          {emailBody}
        </div>

        <button
          onClick={sendMaintenanceEmail}
          disabled={sending || clients.length === 0}
          className={`w-full py-3 rounded-lg text-white font-semibold ${
            sending ? "bg-gray-400 cursor-not-allowed" : "bg-[#04436F] hover:bg-[#03314f]"
          } transition-colors duration-200`}
        >
{sending
  ? "Sende E-Mail..."
  : "E-Mail an alle Mitarbeiter und Kunden senden"}
        </button>

        {message && (
          <p className={`text-center text-sm mt-2 ${message.startsWith("❌") ? "text-red-600" : "text-green-600"}`}>
            {message}
          </p>
        )}
      </div>
    </AdminLayout>
  );
}

export default SystemMaintenanceEmailPage;
