export default function RegisterForm3({ onComplete }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6 max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-bold text-[#04436F]">Form für Gesundheitsführsorge</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onComplete();
        }}
        className="space-y-4"
      >
        {/* Körperliche Unterstützung */}
        <div>
          <label className="font-semibold block mb-1">Größe (cm)</label>
          <input type="number" className="w-full border px-4 py-2 rounded" placeholder="Größe" />

          <label className="font-semibold block mt-4 mb-1">Gewicht (kg)</label>
          <input type="number" className="w-full border px-4 py-2 rounded" placeholder="Gewicht" />
        </div>

        <div>
          <label className="font-semibold block mb-1">Person ist / braucht:</label>
          <div className="space-y-2">
            {[
              "vollständig mobil",
              "sturzgefährdet",
              "Bettlägerig",
              "Hilfe beim Aufstehen",
              "Hilfe beim Toilettengang",
              "Hilfe beim Umlagern"
            ].map((item) => (
              <label key={item}><input type="checkbox" className="mr-2" />{item}</label>
            ))}
          </div>
        </div>

        {/* Hilfsmittel */}
        <div>
          <label className="font-semibold block mb-1">Hilfsmittel vorhanden:</label>
          <div className="space-y-2">
            {[
              "Gehstock", "Rollator", "Rollstuhl", "Hebesitz",
              "Pflegebett", "Patientenlift", "Badewannenlift", "Toilettenstuhl"
            ].map((item) => (
              <label key={item}><input type="checkbox" className="mr-2" />{item}</label>
            ))}
            <input type="text" className="w-full border px-4 py-2 rounded mt-2" placeholder="Sonstige Hilfsmittel" />
          </div>
        </div>

        {/* Inkontinenz */}
        <div>
          <label className="font-semibold block mb-1">Inkontinenz</label>
          <div className="space-y-2">
            {["Urin", "Stuhl", "Dauerkatheter", "Stoma"].map((item) => (
              <label key={item}><input type="checkbox" className="mr-2" />{item}</label>
            ))}
          </div>
        </div>

        {/* Kommunikationsfähigkeiten */}
        <div>
          <label className="font-semibold block mb-2">Kommunikationsfähigkeiten</label>
          {["Sehen", "Hören", "Sprechen"].map((sense) => (
            <div key={sense} className="mb-3">
              <label className="block mb-1">{sense}</label>
              <select className="w-full border px-4 py-2 rounded">
                <option value="">Bitte wählen</option>
                <option value="gut">Keine Probleme</option>
                <option value="eingeschränkt">Eingeschränkt</option>
                <option value="schlecht">{sense === "Sehen" ? "Nahezu blind" : sense === "Hören" ? "Nahezu taub" : "Kaum möglich"}</option>
              </select>
            </div>
          ))}
        </div>

        {/* Nahrungsaufnahme */}
        <div>
          <label className="font-semibold block mb-1">Nahrungsaufnahme</label>
          <div className="space-y-2">
            {[
              "Unterstützung notwendig",
              "Nahrung anreichen notwendig",
              "Flüssigkeitsaufnahme kontrollieren",
              "Probleme beim Schlucken",
              "Appetitlosigkeit"
            ].map((item) => (
              <label key={item}><input type="checkbox" className="mr-2" />{item}</label>
            ))}
          </div>
        </div>

        {/* Allergien */}
        <div>
          <label className="font-semibold block mb-1">Leiden Sie an Allergien?</label>
          <input type="text" className="w-full border px-4 py-2 rounded" placeholder="Welche?" />
        </div>

        {/* Grundpflegerische Tätigkeiten */}
        <div>
          <label className="font-semibold block mb-1">Grundpflegerische Tätigkeiten</label>
          <div className="space-y-2">
            {["Körperhygiene", "An-/Auskleiden"].map((item) => (
              <label key={item}><input type="checkbox" className="mr-2" />{item}</label>
            ))}
            <input type="text" className="w-full border px-4 py-2 rounded mt-2" placeholder="Sonstige Tätigkeiten" />
          </div>
        </div>

        {/* Gesundheitsfördernde Aktivitäten */}
        <div>
          <label className="font-semibold block mb-1">Gesundheitsfördernde Aktivitäten</label>
          <div className="space-y-2">
            {["Gymnastik", "Spaziergänge", "Aktivierende Betreuung"].map((item) => (
              <label key={item}><input type="checkbox" className="mr-2" />{item}</label>
            ))}
            <input type="text" className="w-full border px-4 py-2 rounded mt-2" placeholder="Sonstiges" />
          </div>
        </div>

        {/* Geistige Unterstützung */}
        <div>
          <label className="font-semibold block mb-1">Geistige Unterstützung notwendig?</label>
          <select className="w-full border px-4 py-2 rounded">
            <option value="">Bitte wählen</option>
            <option>Ja</option>
            <option>Nein</option>
          </select>

          <div className="space-y-2 mt-2">
            {[
              "Depressionen",
              "Demenz-Diagnose",
              "Alzheimer-Diagnose",
              "Gestörter Tag-/Nachtrhythmus",
              "Weglauf Tendenz",
              "Persönlichkeitsveränderungen",
              "Aggressivität",
              "Apathie",
              "Starke Unruhe"
            ].map((item) => (
              <label key={item}><input type="checkbox" className="mr-2" />{item}</label>
            ))}
          </div>
        </div>

        {/* Gesundheitsbefunde */}
        <div>
          <label className="font-semibold block mb-1">Gesundheitsbefunde</label>
          <textarea className="w-full border px-4 py-2 rounded" rows="3" placeholder="Bitte angeben..." />
        </div>

        <button type="submit" className="bg-[#04436F] text-white px-6 py-3 rounded w-full mt-4">
          Speichern
        </button>
      </form>
    </div>
  );
}
