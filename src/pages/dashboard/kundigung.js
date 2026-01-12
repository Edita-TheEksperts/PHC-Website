import React, { useState } from "react";
import { useRouter } from "next/router";
import { Menu, X } from "lucide-react";

export default function KundigungPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const [confirmTermination, setConfirmTermination] = useState(false);
  const [terminationReason, setTerminationReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTerminate = async () => {
    if (!confirmTermination || !terminationReason) return;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("userToken");

      await fetch("/api/terminate-contract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reason: terminationReason,
        }),
      });

      // 🔐 revoke access
      localStorage.removeItem("userToken");

      // redirect to login
      router.replace("/login");
    } catch (err) {
      alert("❌ Fehler bei der Kündigung. Bitte versuchen Sie es erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">

      {/* MOBILE NAVBAR */}
      <div className="lg:hidden bg-[#B99B5F] text-white fixed top-0 left-0 w-full z-50">
        <div className="flex items-center justify-between p-4">
          <h1
            className="text-xl font-bold cursor-pointer"
            onClick={() => router.push("/client-dashboard")}
          >
            PHC
          </h1>
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-72 bg-[#B99B5F] text-white flex-col p-6">
        <h1
          className="text-4xl font-bold text-center mb-12 cursor-pointer"
          onClick={() => router.push("/client-dashboard")}
        >
          PHC
        </h1>

        <ul className="space-y-6 text-lg">
          <li onClick={() => router.push("/client-dashboard")}>Dashboard</li>
          <li onClick={() => router.push("/dashboard/formular")}>
            Persönliche Informationen
          </li>
                  <li onClick={() => router.push("/dashboard/finanzen")}>
Finanzen          </li>
                                  <li
                onClick={() => {
                  router.push("/dashboard/kundigung");
                  setIsOpen(false);
                }}
                className="cursor-pointer hover:text-red-400"
              >
                Kündigung
              </li>
        </ul>
      </aside>

      {/* MAIN CONTENT */}
<main className="flex-1 pt-24 lg:pt-12 px-6 flex justify-center">
        <div className="max-w-3xl">

          <h1 className="text-3xl lg:text-4xl font-bold text-[#B99B5F] mb-8">
            Kündigung & Vertragsbeendigung
          </h1>

          <section className="bg-white rounded-3xl shadow-xl p-8 space-y-8 border-l-8 border-[#B99B5F]/80">

            {/* QUESTION */}
            <p className="text-lg font-semibold text-gray-800">
              Sind Sie sicher, dass Sie den Vertrag kündigen möchten?
            </p>

            {/* WARNING */}
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
              <strong>Wichtige Information:</strong><br />
              Bei Kündigung wird Ihr Profil dauerhaft gelöscht und Sie verlieren
              den Zugriff auf Ihr Konto sowie alle Services.
            </div>

            {/* CONFIRM */}
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={confirmTermination}
                onChange={(e) => setConfirmTermination(e.target.checked)}
                className="mt-1"
              />
              <span>
                Ja, ich bestätige, dass ich den Vertrag endgültig kündigen möchte.
              </span>
            </label>

            {/* REASON */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Grund der Kündigung
              </label>
              <textarea
                rows={4}
                value={terminationReason}
                onChange={(e) => setTerminationReason(e.target.value)}
                placeholder="Bitte teilen Sie uns den Grund Ihrer Kündigung mit..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-400"
              />
            </div>

            {/* SUBMIT */}
            <button
              onClick={handleTerminate}
              disabled={!confirmTermination || !terminationReason || isSubmitting}
              className={`w-full py-3 rounded-full font-semibold text-white transition
                ${
                  confirmTermination && terminationReason
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
            >
              Vertrag endgültig kündigen
            </button>

            <p className="text-xs text-gray-500">
              Nach der Kündigung erhalten Sie eine Bestätigungs-E-Mail.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
