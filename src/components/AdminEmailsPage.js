import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";

function AdminEmailsPage() {
  const [clients, setClients] = useState([]);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  // Feedback email states
  const [caregiverName, setCaregiverName] = useState("");
  const [feedbackLink, setFeedbackLink] = useState("");

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

  const feedbackSubject = "Wie zufrieden sind Sie mit unserer Betreuung?";
  const feedbackBody = (client) => `
Guten Tag ${client.firstName} ${client.lastName},

Wir hoffen, dass Sie mit der Betreuung durch ${caregiverName} zufrieden waren.

Wir freuen uns über Ihre Rückmeldung: ${feedbackLink}

Ihr Feedback hilft uns, unsere Dienstleistung weiter zu verbessern.

Danke für Ihr Vertrauen!

Prime Home Care AG
`.trim();

  async function sendFeedbackEmail() {
    if (!caregiverName || !feedbackLink) {
      setMessage("Bitte Betreuername und Feedback-Link ausfüllen.");
      return;
    }
    setSending(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/send-feedback-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caregiverName, feedbackLink }),
      });

      if (res.ok) {
        setMessage(`✅ Feedback-Mail wurde an ${clients.length} Kunden gesendet.`);
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
      <div className="max-w-3xl mx-auto space-y-12 p-6">
        <section className="bg-white rounded-xl shadow p-6 space-y-6">
          <h2 className="text-xl font-bold text-[#04436F]">Feedbackanfrage E-Mail an alle Kunden</h2>

          <label className="flex flex-col max-w-md">
            <span className="font-semibold mb-1">Betreuername</span>
            <input
              type="text"
              value={caregiverName}
              onChange={(e) => setCaregiverName(e.target.value)}
              placeholder="Name der Betreuungsperson"
              className="border rounded px-3 py-2"
            />
          </label>

          <label className="flex flex-col max-w-md">
            <span className="font-semibold mb-1">Feedback-Link</span>
            <input
              type="url"
              value={feedbackLink}
              onChange={(e) => setFeedbackLink(e.target.value)}
              placeholder="https://example.com/feedback"
              className="border rounded px-3 py-2"
            />
          </label>

          <div className="bg-gray-50 border border-gray-300 rounded p-4 whitespace-pre-wrap text-gray-800 text-sm">
            <strong>Betreff:</strong> {feedbackSubject}
            <br />
            <br />
            {caregiverName && feedbackLink ? (
              clients.length > 0 ? (
                clients.map(client => (
                  <div key={client.id}>
                    {feedbackBody(client)}
                    <hr className="my-3" />
                  </div>
                ))
              ) : (
                "Keine Kunden gefunden."
              )
            ) : (
              "Bitte Betreuername und Feedback-Link eingeben."
            )}
          </div>

          <button
            onClick={sendFeedbackEmail}
            disabled={sending || clients.length === 0}
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              sending ? "bg-gray-400 cursor-not-allowed" : "bg-[#04436F] hover:bg-[#03314f]"
            } transition-colors duration-200`}
          >
            {sending ? "Sende Feedback-E-Mail..." : `Feedback-E-Mail an alle ${clients.length} Kunden senden`}
          </button>

          {message && (
            <p className={`text-center text-sm mt-4 ${message.startsWith("❌") ? "text-red-600" : "text-green-600"}`}>
              {message}
            </p>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}

export default AdminEmailsPage;
