import React from "react";

const Impressum = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-center">Impressum</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Angaben gemäß § 5 TMG</h2>
        <p>
          Musterfirma GmbH <br />
          Musterstraße 12 <br />
          12345 Musterstadt
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Vertreten durch</h2>
        <p>Max Mustermann</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Kontakt</h2>
        <p>
          Telefon: +49 (0)123 456789 <br />
          E-Mail: info@musterfirma.de
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Registereintrag</h2>
        <p>
          Eintragung im Handelsregister. <br />
          Registergericht: Amtsgericht Musterstadt <br />
          Registernummer: HRB 12345
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Umsatzsteuer-ID</h2>
        <p>
          Umsatzsteuer-Identifikationsnummer gemäß §27a Umsatzsteuergesetz: DE123456789
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Haftungsausschluss</h2>
        <p>
          Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die
          Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine
          Gewähr übernehmen.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Urheberrecht</h2>
        <p>
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
          unterliegen dem deutschen Urheberrecht. Vervielfältigung, Bearbeitung,
          Verbreitung und jede Art der Verwertung außerhalb der Grenzen des
          Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw.
          Erstellers.
        </p>
      </section>
    </div>
  );
};

export default Impressum;
