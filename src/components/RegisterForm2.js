export default function RegisterForm2({ onComplete }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6 max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-bold text-[#04436F]">Form für Freizeit & Soziale Aktivitäten</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onComplete();
        }}
        className="space-y-4"
      >

        {/* Mobilitätsmittel */}
        <div>
          <label className="block font-semibold mb-1">Sind Mobilitätsmittel vorhanden? Wenn ja, welche?</label>
          <div className="space-y-2">
            <label><input type="checkbox" className="mr-2" />Rollstuhl</label><br />
            <label><input type="checkbox" className="mr-2" />Rollator</label><br />
            <label><input type="checkbox" className="mr-2" />Gehstock</label>
          </div>
        </div>

        {/* Transportmittel */}
        <div>
          <label className="block font-semibold mb-1">Wie kommen wir von A nach B?</label>
          <div className="space-y-2">
            <label><input type="checkbox" className="mr-2" />Eigenes Auto (Automat)</label><br />
            <label><input type="checkbox" className="mr-2" />Eigenes Auto (Manuell)</label><br />
            <label><input type="checkbox" className="mr-2" />Auto vom Mitarbeiter (CHF 1.--/km)</label><br />
            <label><input type="checkbox" className="mr-2" />ÖV (Kosten vom Kunden)</label><br />
            <label><input type="checkbox" className="mr-2" />Taxi</label>
          </div>
        </div>

        {/* Gesellschaft */}
        <div>
          <label className="block font-semibold mb-1">Gesellschaft leisten?</label>
          <select className="w-full border px-4 py-2 rounded">
            <option value="">Bitte wählen</option>
            <option>Ja</option>
            <option>Nein</option>
          </select>
        </div>

        {/* Kochen & Allergien */}
        <div>
          <label className="block font-semibold mb-1">Gemeinsames Kochen?</label>
          <select className="w-full border px-4 py-2 rounded">
            <option value="">Bitte wählen</option>
            <option>Ja</option>
            <option>Nein</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Leiden Sie an Allergien?</label>
          <select className="w-full border px-4 py-2 rounded">
            <option value="">Bitte wählen</option>
            <option>Ja</option>
            <option>Nein</option>
          </select>
          <input type="text" placeholder="Welche?" className="w-full border mt-2 px-4 py-2 rounded" />
        </div>

        {/* Biographiearbeit */}
        <div>
          <label className="block font-semibold mb-1">Biographiearbeit – Sind technische Mittel vorhanden?</label>
          <select className="w-full border px-4 py-2 rounded">
            <option value="">Bitte wählen</option>
            <option>Ja</option>
            <option>Nein</option>
          </select>
        </div>

        {/* Weitere Aktivitäten */}
        <div>
          <label className="block font-semibold mb-1">Vorlesen?</label>
          <select className="w-full border px-4 py-2 rounded">
            <option value="">Bitte wählen</option>
            <option>Ja</option>
            <option>Nein</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Kartenspiele?</label>
          <select className="w-full border px-4 py-2 rounded">
            <option value="">Bitte wählen</option>
            <option>Ja</option>
            <option>Nein</option>
          </select>
        </div>

        {/* Ausflüge */}
        <div>
          <label className="block font-semibold mb-1">
            Ausflüge & Reisebegleitung (Kosten vom Kunden)
          </label>
          <div className="space-y-2">
            <label><input type="checkbox" className="mr-2" />Theaterbesuch</label><br />
            <label><input type="checkbox" className="mr-2" />Kinobesuch</label><br />
            <label><input type="checkbox" className="mr-2" />Konzertbesuch</label><br />
            <label><input type="checkbox" className="mr-2" />Fussballspiel</label><br />
            <label><input type="checkbox" className="mr-2" />Urlaubsbegleitung</label>
          </div>
        </div>

        <button type="submit" className="bg-[#04436F] text-white px-6 py-3 rounded w-full mt-4">
          Speichern
        </button>
      </form>
    </div>
  );
}
