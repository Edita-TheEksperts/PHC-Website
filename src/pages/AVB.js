import React, { useState } from "react";

const AVB = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const sections = [
    {
      title: "1. Zweck und Geltungsbereich der allgemeinen Vertragsbedingungen",
      content: (
        <>
          <p>
            Die Prime Home Care AG (nachfolgend „PHC AG“) bietet eine Plattform,
            über die Kunden verschiedene Dienstleistungen buchen und abrechnen
            können. Diese Allgemeinen Vertragsbedingungen (AVB) regeln den Zugang
            und die Nutzung der Plattform und legen die Rechte und Pflichten der
            PHC AG, ihrer Mitarbeitenden und der Kunden im Rahmen der
            Plattformnutzung fest.
          </p>
          <p>
            Die PHC AG agiert als Dienstleistungsanbieter und Arbeitgeber und
            stellt Kunden Unterstützung in Form von Begleitung, Einkäufen &
            Erledigungen, Freizeit & Kultur, Gesellschaft & Betreuung,
            Haushaltshilfe, Unterstützung bei der Grundpflege und Leistungen von
            Partnerunternehmen zur Verfügung.
          </p>
        </>
      ),
      text: `Die PHC AG bietet eine Plattform für Dienstleistungen. Diese AVB regeln Zugang und Nutzung. PHC AG agiert als Arbeitgeber und stellt Begleitung, Einkäufe, Freizeit, Betreuung, Haushaltshilfe, Grundpflege und Partnerleistungen bereit.`,
    },
    {
      title: "2. Definitionen",
      content: (
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>„Mitarbeiter“:</strong> Personen, die in einem
            Anstellungsverhältnis zur PHC AG stehen.
          </li>
          <li>
            <strong>„PHC AG“:</strong> Prime Home Care AG mit Sitz in
            Schindellegi, Schweiz.
          </li>
          <li>
            <strong>„Kunde“:</strong> Natürliche oder juristische Personen, die
            über die Plattform Dienstleistungen in Anspruch nehmen.
          </li>
          <li>
            <strong>„Dienstleistung“:</strong> Alle Leistungen, die die PHC AG
            für Kunden anbietet, darunter auch Partnerleistungen.
          </li>
        </ul>
      ),
      text: `Mitarbeiter = Personen im Anstellungsverhältnis. PHC AG = Prime Home Care AG in Schindellegi. Kunde = natürliche oder juristische Personen, die Dienstleistungen buchen. Dienstleistung = alle Leistungen inklusive Partnerleistungen.`,
    },
    {
      title: "3. Registrierung und Zustimmung zu den AVB",
      content: (
        <p>
          Zur Nutzung der Dienstleistungen muss der Kunde ein persönliches Konto
          erstellen und bei der Registrierung die erforderlichen Daten angeben.
          Mit der Kontoerstellung stimmt der Kunde den AVB zu und erhält eine
          Bestätigungs-E-Mail.
        </p>
      ),
      text: `Zur Nutzung muss ein persönliches Konto erstellt werden. Mit der Registrierung stimmt der Kunde den AVB zu und erhält eine Bestätigung.`,
    },
    {
      title: "4. Nutzung der Website und Inhalte",
      content: <p>Die Nutzung der Website erfolgt auf eigenes Risiko des Kunden.</p>,
      text: `Die Nutzung der Website erfolgt auf eigenes Risiko des Kunden.`,
    },
    {
      title: "5. Urheberrecht und geistiges Eigentum",
      content: (
        <p>
          Inhalte wie Texte, Marken, Logos, Bilder und audiovisuelle Medien sind
          Eigentum der PHC AG oder Dritter und geschützt. Keine Nutzung ohne
          Genehmigung.
        </p>
      ),
      text: `Alle Inhalte sind geistiges Eigentum von PHC AG oder Dritten und dürfen nicht ohne Erlaubnis genutzt werden.`,
    },
    {
      title: "6. Weiterentwicklung der Dienstleistungen und Änderungen der AVB",
      content: (
        <>
          <p>
            PHC AG darf die AVB und die Plattform anpassen. Über Änderungen
            werden Kunden informiert. Bei Widerspruch endet der Vertrag.
          </p>
          <p>
            Erfolgt kein Einspruch innerhalb von 30 Tagen, gelten die Änderungen
            als akzeptiert.
          </p>
        </>
      ),
      text: `Die PHC AG darf AVB und Plattform anpassen. Kunden werden informiert. Kein Einspruch = Zustimmung. Widerspruch = Vertragsende.`,
    },
    {
      title: "7. Zugang zum Konto und Sicherheit",
      content: (
        <p>
          Nur registrierte Nutzer haben Zugang. Benutzer sind für ihre
          Zugangsdaten verantwortlich und müssen Missbrauch sofort melden.
        </p>
      ),
      text: `Zugang nur für registrierte Nutzer. Jeder ist für seine Zugangsdaten verantwortlich. Missbrauch sofort melden.`,
    },
    {
      title: "8. Buchung und Durchführung der Dienstleistungen",
      content: (
        <p>
          Dienstleistungen können über die Plattform gebucht werden durch Auswahl
          der Leistung, Ort und Zeit.
        </p>
      ),
      text: `Dienstleistungen werden über die Plattform mit Auswahl von Leistung, Ort und Zeit gebucht.`,
    },
    {
      title: "9. Stornierung und Kündigung einer Buchung",
      content: (
        <>
          <p>Bis 14 Tage vorher kostenlos. 14–7 Tage = 50%. Unter 7 Tage = voller Betrag.</p>
          <p>Rückerstattung bei rechtzeitiger Stornierung innerhalb 48h.</p>
          <p>Fehlbuchungen bitte über Kontaktformular melden.</p>
          <p>Sonderaktionen können nicht stornierbar sein.</p>
          <p>Kündigung nach 3 Monaten mit 14 Tagen Frist möglich. Fristlose Kündigung mit Aufwandspauschale CHF 300 möglich.</p>
        </>
      ),
      text: `Stornierungen: bis 14 Tage kostenlos, 14–7 Tage 50%, unter 7 Tage voller Betrag. Rückerstattung bei rechtzeitiger Stornierung. Fehlbuchungen via Kontakt. Sonderaktionen evtl. nicht stornierbar. Kündigung nach 3 Monaten mit 14 Tagen Frist oder fristlos mit CHF 300.`,
    },
    {
      title: "10. Zahlungsbedingungen",
      content: (
        <p>
          Preise stehen auf der Plattform. Zahlung erfolgt per akzeptierter
          Zahlungsmethode. Belege sind 10 Jahre im Konto verfügbar.
        </p>
      ),
      text: `Preise auf der Plattform. Zahlung per Kreditkarte etc. Belege 10 Jahre verfügbar.`,
    },
    {
      title: "11. Verpflichtungen der PHC AG",
      content: (
        <p>
          PHC AG bemüht sich um Verfügbarkeit und Qualität. Störungen werden
          behoben.
        </p>
      ),
      text: `PHC AG sichert Qualität und behebt Störungen.`,
    },
    {
      title: "12. Haftungsbeschränkung der PHC AG",
      content: (
        <>
          <p>Website-Nutzung auf eigenes Risiko.</p>
          <p>Keine Haftung für direkte/indirekte Schäden, Dokumente oder Ausfälle.</p>
          <p>Unangemessenes Verhalten kann zu Sperrung führen.</p>
        </>
      ),
      text: `Nutzung auf eigenes Risiko. Keine Haftung für Schäden, Dokumente oder Ausfälle. Missbrauch kann Sperrung bewirken.`,
    },
    {
      title: "13. Allgemeine Pflichten für alle Benutzer",
      content: (
        <>
          <p>Benutzer müssen Gesetze beachten, keine falschen Daten oder Missbrauch.</p>
          <p>Verboten: Störungen, Eindringen in Systeme, Umleitungen, Überlastung, Verstöße gegen Sicherheit.</p>
        </>
      ),
      text: `Benutzer müssen Gesetze einhalten. Verboten: Verstöße, falsche Daten, Störungen, Eindringen, Überlastung, Sicherheitsverstöße.`,
    },
    {
      title: "14. Pflichten des Kunden",
      content: (
        <>
          <p>Kunden müssen Mitarbeiter respektvoll behandeln.</p>
          <ul className="list-disc list-inside">
            <li>Keine unberechtigten Stornierungen</li>
            <li>Materialien bereitstellen</li>
            <li>Über Haustiere informieren</li>
            <li>Kein Kontakt außerhalb der Plattform</li>
          </ul>
        </>
      ),
      text: `Kundenpflichten: Respektvoller Umgang, keine unberechtigten Stornierungen, Material bereitstellen, Mitarbeiter informieren, kein Direktkontakt.`,
    },
    {
      title: "15. Dauer der Vereinbarung",
      content: <p>Die AVB gelten unbefristet, bis zur Kündigung.</p>,
      text: `AVB gelten unbefristet bis zur Kündigung.`,
    },
    {
      title: "16. Versicherung",
      content: (
        <p>
          PHC AG hat eine Haftpflichtversicherung. Schäden müssen mit Foto und
          binnen 48h gemeldet werden.
        </p>
      ),
      text: `PHC AG hat Versicherung. Schäden mit Foto innerhalb von 48h melden.`,
    },
    {
      title: "17. Datenschutz",
      content: (
        <p>
          PHC AG behandelt Daten nach geltendem Datenschutzrecht und eigener
          Richtlinie.
        </p>
      ),
      text: `PHC AG verarbeitet Daten nach Datenschutzbestimmungen.`,
    },
    {
      title: "18. Anwendbares Recht",
      content: <p>Es gilt schweizerisches Recht.</p>,
      text: `Schweizerisches Recht gilt.`,
    },
    {
      title: "19. Streitbeilegung und Gerichtsstand",
      content: (
        <p>
          Streitigkeiten sollen gütlich beigelegt werden. Kunden sollen sich an
          den Support wenden.
        </p>
      ),
      text: `Streitigkeiten sollen gütlich beigelegt werden. Kunden wenden sich an den Kundendienst.`,
    },
  ];

  // Filter
  const filteredSections = sections.filter((s) => {
    const title = s.title?.toLowerCase() || "";
    const text = s.text?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();
    return title.includes(term) || text.includes(term);
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Allgemeine Vertragsbedingungen (AVB) der Prime Home Care AG (PHC AG)
      </h1>

      {/* 🔍 Suchleiste */}
      <div className="max-w-[1110px] mx-auto mt-6 mb-10 relative">
        <input
          type="text"
          placeholder="Suchen Sie nach Stichworten (z. B. Kündigung, Zahlung, Datenschutz)..."
          className="w-full rounded-full p-4 pl-12 text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-[#04436F]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          🔍
        </span>
      </div>

      {/* Ergebnisse */}
      <div className="space-y-6">
        {filteredSections.length > 0 ? (
          filteredSections.map((section, idx) => (
            <section key={idx} className="mb-6">
              <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
              <div>{section.content}</div>
            </section>
          ))
        ) : (
          <p className="text-center text-gray-500">
            Keine passenden Ergebnisse gefunden.
          </p>
        )}
      </div>
    </div>
  );
};

export default AVB;
