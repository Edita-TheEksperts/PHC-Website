export default function RegisterForm1({ onComplete }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6 max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-bold text-[#04436F]">Form für Haushaltshilfe & Wohnpflege</h2>
     <form onSubmit={handleSubmit} className="space-y-6">
        {/* Haushaltsaufgaben */}

        {/* Allgemeine Angaben */}
        <div>
          <label className="font-semibold block mb-1">Anzahl Zimmer</label>
          <input type="number" className="w-full border px-4 py-2 rounded" placeholder="z. B. 3" />

          <label className="font-semibold block mt-4 mb-1">Wieviel-Personen-Haushalt?</label>
          <input type="number" className="w-full border px-4 py-2 rounded" placeholder="z. B. 2" />
        </div>

        {/* Haushaltsaufgaben mit Ja/Nein + Freitext */}
        {[
          "Balkon und Blumenpflege",
          "Waschen / Bügeln",
          "Kochen",
          "Fenster Putzen",
          "Bettwäsche wechseln",
          "Aufräumen",
          "Trennung / Entsorgung Abfall",
          "Kleider waschen/Bügeln/verräumen",
          "Abstauben",
          "Staubsaugen",
          "Boden wischen",
          "Vorhänge reinigen"
        ].map((task) => (
          <div key={task}>
            <label className="font-semibold block mb-1">{task}</label>
            <select className="w-full border px-4 py-2 rounded mb-2">
              <option value="">Bitte wählen</option>
              <option value="Ja">Ja</option>
              <option value="Nein">Nein</option>
            </select>
            {task.includes("Kochen") && (
              <input type="text" className="w-full border px-4 py-2 rounded" placeholder="Für wieviele Personen?" />
            )}
            <input type="text" className="w-full border px-4 py-2 rounded" placeholder="Weitere Details (optional)" />
          </div>
        ))}

        <button type="submit" className="bg-[#04436F] text-white px-6 py-3 rounded w-full mt-4">
          Speichern
        </button>
      </form>
    </div>
  );
}