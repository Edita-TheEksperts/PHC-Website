export default function RegisterForm1({ onComplete }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
      <h2 className="text-xl font-bold text-[#04436F]">Form für Alltagsbegleitung und Besorgungen</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onComplete();
        }}
        className="space-y-6"
      >
        {/* Mobilitätsmittel */}
        <div>
          <label className="font-semibold">Sind Mobilitätsmittel vorhanden?</label>
          <div className="space-y-2 mt-2">
            <label><input type="checkbox" name="mobility" value="Rollstuhl" /> Rollstuhl</label><br />
            <label><input type="checkbox" name="mobility" value="Rollator" /> Rollator</label><br />
            <label><input type="checkbox" name="mobility" value="Gehstock" /> Gehstock</label>
          </div>
        </div>

        {/* Transportmittel */}
        <div>
          <label className="font-semibold">Wie kommen wir von A nach B?</label>
          <div className="space-y-2 mt-2">
            <label><input type="checkbox" name="transport" value="Eigenes Auto" /> Eigenes Auto</label><br />
            <label><input type="checkbox" name="transport" value="Automatik" /> Automatik</label><br />
            <label><input type="checkbox" name="transport" value="Manuell" /> Manuell</label><br />
            <label><input type="checkbox" name="transport" value="Mitarbeiter Auto" /> Muss vom Mitarbeiter gestellt werden (CHF 1/km)</label><br />
            <label><input type="checkbox" name="transport" value="ÖV" /> Öffentliche Verkehrsmittel (Kosten für Mitarbeiter übernimmt Kunde)</label><br />
            <label><input type="checkbox" name="transport" value="Taxi" /> Taxi</label>
          </div>
        </div>

        {/* Begleitung zu Terminen */}
        <div>
          <label className="font-semibold">Begleitung zu Terminen</label>
          <div className="space-y-2 mt-2">
            <label><input type="checkbox" name="appointments" value="Arzt" /> Arzt</label><br />
            <label><input type="checkbox" name="appointments" value="Physiotherapie" /> Physiotherapien</label><br />
            <label><input type="checkbox" name="appointments" value="Behörde" /> Behördengänge</label><br />
            <label>Andere: <input type="text" name="appointments_other" className="border w-full mt-1 px-3 py-2 rounded" /></label>
          </div>
        </div>

        {/* Einkäufe erledigen */}
        <div>
          <label className="font-semibold">Einkäufe erledigen</label>
          <div className="mt-2 space-y-2">
            <label className="block">Begleiten Sie die Betreuungskraft?
              <select name="shopping_assist" className="w-full border mt-1 px-3 py-2 rounded">
                <option value="">Bitte wählen</option>
                <option value="Ja">Ja</option>
                <option value="Nein">Nein</option>
              </select>
            </label>

            <label className="block font-medium mt-2">Welche Einkäufe?</label>
            <label><input type="checkbox" name="shopping_type" value="Lebensmittel" /> Lebensmittel</label><br />
            <label><input type="checkbox" name="shopping_type" value="Apotheke" /> Apotheke</label><br />
            <label><input type="checkbox" name="shopping_type" value="Garten" /> Garten</label><br />
            <label><input type="checkbox" name="shopping_type" value="Kleidung" /> Kleidung</label>
          </div>
        </div>

        {/* Postgänge */}
        <div>
          <label className="font-semibold">Postgänge</label>
          <div className="space-y-2 mt-2">
            <input type="text" name="briefkasten" placeholder="Wo befindet sich der Briefkastenschlüssel?" className="w-full border px-3 py-2 rounded" />
            <input type="text" name="postfach" placeholder="Welches Postfach gehört Ihnen?" className="w-full border px-3 py-2 rounded" />
          </div>
        </div>

        {/* Sonstige Begleitungen */}
        <div>
          <label className="font-semibold">Sonstige Begleitungen</label>
          <textarea name="sonstige" className="w-full border px-3 py-2 rounded mt-2" rows="3" placeholder="Andere Wünsche oder Informationen"></textarea>
        </div>

        <button type="submit" className="bg-[#04436F] text-white px-6 py-3 rounded w-full">
          Speichern & Fortfahren
        </button>
      </form>
    </div>
  );
}
