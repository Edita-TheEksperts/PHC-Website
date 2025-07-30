import React from "react";

const AGB = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-center">Allgemeine Geschäftsbedingungen (AGB)</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Geltungsbereich</h2>
        <p>
          Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Bestellungen
          und Nutzungen unserer Dienstleistungen über unsere Webseite.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Vertragspartner</h2>
        <p>
          Der Kaufvertrag kommt zustande mit:
          <br />
          <span className="font-medium">Dein Firmenname</span>
          <br />
          Deine Adresse
          <br />
          Deine E-Mail-Adresse
          <br />
          Deine Telefonnummer
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Vertragsabschluss</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Durch Anklicken des Bestellbuttons geben Sie eine verbindliche Bestellung ab.</li>
          <li>Der Vertrag kommt zustande, sobald Sie eine Bestellbestätigung per E-Mail erhalten.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Preise und Zahlung</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Alle Preise enthalten die gesetzliche Mehrwertsteuer.</li>
          <li>Zahlung möglich per PayPal, Kreditkarte oder Überweisung.</li>
          <li>Zahlung ist sofort nach Vertragsabschluss fällig.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Lieferung</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Die Lieferung erfolgt an die angegebene Adresse.</li>
          <li>Lieferzeit beträgt in der Regel 2–5 Werktage.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Widerrufsrecht</h2>
        <p>
          Sie haben das Recht, binnen 14 Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.
          Weitere Informationen erhalten Sie in unserer Widerrufsbelehrung.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. Haftung</h2>
        <p>
          Wir haften nur für Schäden, die durch vorsätzliches oder grob fahrlässiges Verhalten verursacht wurden.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">8. Schlussbestimmungen</h2>
        <p>
          Es gilt das Recht der Bundesrepublik Deutschland. Sollten einzelne Bestimmungen unwirksam sein,
          bleibt der Vertrag im Übrigen wirksam.
        </p>
      </section>
    </div>
  );
};

export default AGB;
