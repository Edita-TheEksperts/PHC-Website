import { useState, useEffect } from "react";

export default function SystemMaintenanceEmail({ clients }) {
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");  // e.g. "25.07.2025"
  const [timeStart, setTimeStart] = useState(""); // e.g. "08:00"
  const [timeEnd, setTimeEnd] = useState("");     // e.g. "12:00"

  // Email preview text with placeholders replaced
  const emailSubject = "Information: Vorübergehende Systemwartung";
  const emailBody = `
Guten Tag,

Am ${date} zwischen ${timeStart} und ${timeEnd} führen wir geplante Wartungsarbeiten an unserem System durch.

In diesem Zeitraum ist das Kundenportal vorübergehend nicht erreichbar. Bei dringenden Anliegen erreichen Sie uns telefonisch unter ${process.env.NEXT_PUBLIC_SUPPORT_PHONE || "[Telefonnummer]"}.

Vielen Dank für Ihr Verständnis.

Freundliche Grüsse

Ihr Prime Home Care Team
`.trim();

  async function sendMaintenanceEmail() {
    if (!date || !timeStart || !timeEnd) {
      setMessage("Bitte Datum und Uhrzeiten ausfüllen.");
      return;
    }
    setSending(true);
    setMessage("");

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
    <div className="bg-white rounded-xl shadow p-6 max-w-xl mx-auto space-y-6">
      <h2 className="text-xl font-bold text-[#04436F]">Systemwartung E-Mail an alle Kunden</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="flex flex-col">
          <span className="font-semibold mb-1">Datum (z.B. 25.07.2025)</span>
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded px-3 py-2"
            placeholder="TT.MM.JJJJ"
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
        disabled={sending}
        className={`w-full py-3 rounded-lg text-white font-semibold ${
          sending ? "bg-gray-400 cursor-not-allowed" : "bg-[#04436F] hover:bg-[#03314f]"
        } transition-colors duration-200`}
      >
        {sending ? "Sende E-Mail..." : `E-Mail an alle ${clients.length} Kunden senden`}
      </button>

      {message && (
        <p className={`text-center text-sm mt-2 ${message.startsWith("❌") ? "text-red-600" : "text-green-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
