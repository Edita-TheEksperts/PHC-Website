import { useState } from "react";
import faqData from "../data/faqData";


export default function FAQ() {
  // FAQ Data with Questions & Answers
  const faqData = [
    {
      category: "FAQ - Frequently asked questions",
      questions: [
       {
        question: "Was sind unsere Stornierungsbedingungen?",
        answer:
          "Um eine reibungslose Planung sicherzustellen und Änderungen im Einsatz unserer Betreuungskräfte möglichst gering zu halten, gelten folgende Stornierungsregelungen:\n\n" +
          "Stornierungen, die mindestens 14 Tage vor dem Termin erfolgen, sind kostenlos.\n\n" +
          "Für Stornierungen zwischen 14 und 7 Tagen vor dem Betreuungstermin fällt eine Gebühr von 50% der Buchung an.\n\n" +
          "Stornierungen weniger als 7 Tage vor der gebuchten Dienstleistung werden mit dem gesamten Betrag belastet.\n\n" +
          "Falls Sie Ihren Betreuungsplan beenden möchten, finden Sie dazu Informationen im Artikel: „Wie kann ich meinen Betreuungsplan kündigen?“ Wenn Sie Ihren Vertrag auflösen möchten, beachten Sie bitte den Artikel: „Wie kann ich meinen Vertrag kündigen?“"
      },
      {
        question: "Kann ich meine Buchung bearbeiten?",
        answer:
          "Um eine Änderung an einer bestehenden Buchung vorzunehmen, loggen Sie sich bitte in Ihr Kundenprofil ein.\n\n" +
          "Navigieren Sie zu „Meine Buchungen“ und wählen Sie anschliessend „Bevorstehende Buchungen“. Klicken Sie dort auf „Buchung ändern“.\n\n" +
          "Bitte beachten Sie, dass Änderungen nur möglich sind, wenn Ihre Buchung mindestens 48 Stunden im Voraus geplant ist. Ausserdem kann eine Anpassung der Uhrzeit im Tagesverlauf dazu führen, dass eine andere Betreuungskraft zugewiesen wird, da unsere Betreuungskräfte stark ausgelastet sind."
      },
      {
        question: "Wie kann ich eine Buchung vornehmen?",
        answer:
          "Eine zuverlässige Betreuungskraft zu engagieren ist ganz einfach:\n\n" +
          "Besuchen Sie unsere Webseite phc.ch und geben Sie Ihre Postleitzahl ein.\n" +
          "Wählen Sie Ihre gewünschten Dienstleistungen und die gewünschte Häufigkeit aus.\n" +
          "Legen Sie den Zeitpunkt für Ihre Betreuung fest – das System zeigt Ihnen die Verfügbarkeit der Betreuungskräfte in Ihrer Region an.\n" +
          "Geben Sie Ihre persönlichen Daten ein.\n" +
          "Wählen Sie eine Zahlungsmethode.\n\n" +
          "Anschliessend erhalten Sie eine Bestätigung an die angegebene E-Mail-Adresse."
      },
      {
        question: "Kann ich meine Buchung stornieren?",
        answer:
          "Um eine bestehende Buchung zu stornieren, melden Sie sich bitte in Ihrem Profil an. Gehen Sie zu „Meine Buchungen“, wählen Sie „Bevorstehende Settings“ und klicken Sie auf „Buchung stornieren“.\n\n" +
          "Beachten Sie bitte, dass durch das Aktualisieren Ihrer Verfügbarkeiten mehr als 14 Tage vor der Buchung – etwa bei geplanten Urlauben oder Abwesenheiten – Stornierungsgebühren vermieden werden können.\n" +
          "Um uns über eine Abwesenheit frühzeitig zu informieren, gehen Sie in Ihrem Profil zum Abschnitt „Optionen“ und wählen Sie „Abwesenheiten hinzufügen“."
      },
      {
        question: "Wie kann ich eine Betreuungsdienstleistung umbuchen?",
        answer:
          "Sie können den Zeitpunkt Ihrer Betreuung verschieben, indem Sie sich in Ihr Prime Home Care AG-Konto einloggen und auf die Registerkarte „Meine Betreuungen“ zugreifen. Unter dem Abschnitt „Bevorstehende“ klicken Sie auf „Mehr“ und wählen im Dropdown-Menü „Betreuung bearbeiten“. Folgen Sie den Anweisungen, um Ihre Änderungen anzufordern.\n\n" +
          "Bitte beachten Sie, dass eine Änderung der Dauer oder des Zeitplans möglicherweise dazu führen kann, dass Ihre Betreuungskraft aufgrund von Verfügbarkeitsengpässen Ihre Anfrage nicht mehr erfüllen kann. Ist Ihre bevorzugte Betreuungskraft verfügbar, wird sie automatisch durch den Algorithmus der Plattform ausgewählt."
      },
      {
        question: "Kann ich die Adresse meiner gebuchten Betreuung ändern?",
        answer:
          "Sie können Ihre Adresse online unter «Adressänderung» selbständig anpassen.\n\n" +
          "Bitte beachten Sie, dass wenn Sie Ihre Adresse anpassen, es möglich sein kann, dass Ihnen nicht mehr dieselbe Betreuungskraft zur Verfügung steht."
      },
      {
        question: "Kann ich kurzfristig eine Betreuungskraft buchen?",
        answer:
          "Für die Bereitstellung einer neuen Betreuungskraft benötigen wir eine Vorlaufzeit von 14 Tagen.\n\n" +
          "Sollten Sie jedoch kurzfristiger Unterstützung benötigen, benutzen Sie hierfür das Kontaktformular – wir werden unser Bestes tun, um eine individuelle Lösung für Sie zu finden. Bitte beachten Sie, dass in solchen Fällen zusätzliche Gebühren anfallen können."
      },
      {
        question: "Kann ich bei meiner Buchung Zeit und Datums-Präferenzen angeben?",
        answer:
          "Die Reservierung einer passenden Zeit für Ihr Betreuungssetting war noch nie so einfach. Geben Sie zunächst die gewünschten Dienstleistungen an und die bevorzugte Häufigkeit. Überprüfen Sie danach die Verfügbarkeiten, bevor Sie Datum und Uhrzeit festlegen.\n\n" +
          "Bitte beachten Sie, dass nicht alle Zeitfenster immer verfügbar sind, da das System die aktuellen Kapazitäten der Betreuungskräfte in Ihrer Region in Echtzeit anzeigt. Die Verfügbarkeit hängt somit auch von der Anzahl an Betreuungsskräften in Ihrer Nähe ab."
      },
      {
        question: "Wie setzt sich der Preis zusammen?",
        answer:
          "Der ausgewiesene Preis für ein Betreuungssetting richtet sich nach der Anzahl der gebuchten Stunden und dem entsprechenden Stundensatz. Bitte beachten Sie, dass eine Mindestbuchung von 2 Stunden erforderlich ist.\n\n" +
          "Ihr Preis ist komplett transparent – alle Kosten sind inklusive Mehrwertsteuer, ohne versteckte Gebühren.\n\n" +
          "Bei der Prime Home Care AG zahlen Sie ausschliesslich für die reservierte Zeit.\n" +
          "Zusätzliche gebuchte Leistungen werden entsprechend auf der Rechnung ausgewiesen."
      },
      {
        question: "Kann ich eine Betreuungskraft welche bereits bei mir war nochmals anfragen?",
        answer:
          "Für regelmässige Betreuungseinsätze (wöchentlich oder alle zwei Wochen), wird immer, wenn möglich, dieselbe Betreuungskraft eingesetzt. Im Falle der Abwesenheit Ihrer persönlichen Betreuungskraft bieten wir Ihnen einen vorübergehenden Ersatz an.\n" +
          "Bitte beachten Sie, dass wir bei monatlichen Buchungen nicht immer den Einsatz derselben Betreuungskraft garantieren können."
      },
      {
        question: "Kann ich meiner Betreuungskraft zusätzliche Aufgaben zuweisen?",
        answer:
          "Sie können Ihrer Betreuungskraft direkt während des Buchungsvorgangs oder vor jedem Betreuungseinsatz unter \"Spezialanweisungen\" besondere Anweisungen geben. Je klarer Ihre Angaben sind, desto besser wird die Betreuung sein."
      },
      {
        question: "Wie erhält meine Betreuungskraft einen Hausschlüssel?",
        answer:
          "Um Ihrer Betreuungskraft einen Hausschlüssel zu übergeben, können Sie direkt mit ihr eine sichere Übergabemethode vereinbaren. Alternativ bietet Prime Home Care AG auch unterstützende Lösungen an, um den Schlüssel sicher und unkompliziert zur Verfügung zu stellen."
      },
      {
        question: "Wie bewerte ich meine Betreuungsdienstleistung?",
        answer:
          "Sie können Ihre Betreuungskraft ganz einfach über die Prime Home Care AG Plattform bewerten. Nach jedem Einsatz haben Sie die Möglichkeit, eine Bewertung abzugeben und Feedback zu hinterlassen. Dies hilft uns, die Qualität unserer Dienstleistungen aufrechtzuerhalten und kontinuierlich zu verbessern."
      },
      {
        question: "Was passiert, nachdem ich gebucht habe?",
        answer:
          "Sobald die Zahlung autorisiert und bestätigt wurde, erhalten Sie eine Bestätigungs-E-Mail mit der Uhrzeit, zu der Ihre Betreuungskraft eintreffen wird, um den Einsatz entsprechend Ihren Wünschen durchzuführen."
      },
      {
        question: "Kann ich Betreuung für mehrere Adressen buchen?",
        answer:
          "Ja, bei Prime Home Care AG können Sie Betreuungseinsätze für mehrere Adressen buchen. Bitte geben Sie bei der Buchung die jeweiligen Adressen und spezifischen Anforderungen für jeden Einsatz an. Unser Team wird die Betreuung entsprechend Ihrer Wünsche organisieren."
      },
      {
        question: "Was ist Ihre Schadenversicherungspolice?",
        answer:
          "Informationen zur Schadenversicherungspolice erhalten Sie auf Anfrage oder in den allgemeinen Geschäftsbedingungen von Prime Home Care AG."
      },
      {
        question: "Was tun, wenn ich mit der stundenweisen Betreuung unzufrieden bin?",
        answer:
          "Sollten Sie mit dem Betreuungsservice nicht zufrieden sein, senden Sie uns bitte direkt eine Nachricht über Ihr Kundenprofil, damit wir die Situation mit Ihrer Betreuungskraft überprüfen können. Wir werden Sie so schnell wie möglich mit einer geeigneten Lösung kontaktieren."
      },
      ],
    },
    {
    category: "MEIN KONTO",
      questions: [
       {
        question: "Wie erstelle ich eine Zusammenfassung meiner Betreuungsdienstleistungen?",
        answer:
          "Falls Sie eine Zusammenfassung Ihrer Betreuungen im PDF-Format benötigen, um den Überblick zu behalten oder sie an Dritte weiterzugeben, befolgen Sie diese Schritte:\n\n" +
          "- Besuchen Sie unsere Website unter phc.ch\n" +
          "- Melden Sie sich bei Ihrem Profil an\n" +
          "- Gehen Sie zu „Optionen“\n" +
          "- Wählen Sie „Betreuungszusammenfassung“ und klicken Sie auf „Zusammenfassung erstellen“\n" +
          "- Wählen Sie aus, welche Art von Zusammenfassung Sie benötigen: monatlich, jährlich oder für einen bestimmten Zeitraum\n\n" +
          "Nachdem Sie den gewünschten Zeitraum bestätigt haben, wird die Zusammenfassung als PDF-Datei an die E-Mail-Adresse gesendet, die mit Ihrem Konto verknüpft ist."
      },
      {
        question: "Wie kann ich die Checkliste für die stundenweise Betreuung nutzen?",
        answer:
          "Unsere Betreuungs-Checkliste ist für Kundinnen und Kunden gedacht, die regelmässige stundenweise Betreuungsleistungen in Anspruch nehmen. Sie hilft Ihnen, die Betreuung nach Ihren individuellen Wünschen zu gestalten.\n\n" +
          "Auf Basis Ihrer Angaben erstellen wir eine persönliche Checkliste, die Sie jederzeit in Ihrem Profil unter „Meine Betreuungen“ oder „Optionen“ anpassen können. Änderungen gelten für die gesamte Vertragsdauer.\n\n" +
          "Diese Checkliste bietet Ihrer Betreuungskraft klare Anweisungen, um sicherzustellen, dass die Betreuung Ihren Vorstellungen entspricht. Sie ermöglicht Ihnen, Prioritäten festzulegen und besondere Wünsche zu kommunizieren, wodurch die Betreuung gezielt auf Ihre Anforderungen abgestimmt wird."
      },
      {
        question: "Wie kann ich mich auf der Plattform einloggen?",
        answer:
          "Nachdem Sie Ihre erste Buchung abgeschlossen haben, wird Ihr Konto automatisch erstellt. Um sich anzumelden, klicken Sie einfach auf die Schaltfläche „Login“."
      },
      {
        question: "Wie kann ich mein Passwort ändern?",
        answer:
          "Gehen Sie in Ihr Konto und wählen Sie Ihr Profil aus. Dort können Sie Ihr Passwort ändern."
      },
      {
        question: "Was beinhaltet mein Konto?",
        answer:
          "Ihr Konto hat 3 Seiten: „Meine Buchungen“, „Profil“ und „Optionen“.\n\n" +
          "- Die Seite „Meine Buchungen“ ist in zwei Bereiche unterteilt: „vorhergehende“ und „bevorstehende“ Buchungen.\n" +
          "  - Unter „vorhergehende Buchungen“ können Sie frühere Buchungen bewerten, Details einsehen und Rechnungen herunterladen.\n" +
          "  - Im Bereich „bevorstehende Buchungen“ sehen Sie alle geplanten Buchungen und können unter dem Dropdown-Menü „mehr“ Änderungen vornehmen.\n\n" +
          "- Auf der Seite „Profil“ können Sie Ihre persönlichen Daten ändern, eine bestehende Adresse auswählen und Zahlungsdetails aktualisieren. Hier finden Sie auch Ihren persönlichen Empfehlungslink.\n\n" +
          "- Im Bereich „Optionen“ verwalten Sie Benachrichtigungen, Haustierinformationen, automatische Vertretungen bei Abwesenheiten Ihrer Betreuungskraft und Ihre eigenen Urlaubstage."
      },
      {
        question: "Wo kann ich melden wenn ich im Urlaub bin und keine Betreuung benötige?",
        answer:
          "Besuchen Sie Ihr Konto und wählen Sie „Optionen“ aus. Danach gehen Sie zur Sparte „Urlaub“ und klicken auf „Urlaub hinzufügen“."
      },
      {
        question: "Wo habe ich eine Übersicht über meine bevorstehenden und laufenden Buchungen?",
        answer:
          "Um Ihre Buchungen zu sehen, müssen Sie in Ihrem Konto eingeloggt sein. Gehen Sie dann auf „Buchungen“ und wählen Sie entweder „Bevorstehend“ oder „Vorhergehend“."
      },
      ],
    },
     {
    category: "DRINGENDE FRAGEN",
      questions: [
        {
        question: "Ich benötige dringend Hilfe, kann ich kurzfristig eine Betreuung buchen?",
        answer:
          "Wenden Sie sich direkt per Telefon, 043 200 10 20 an den Kundendienst. Wir werden unser Bestes tun, um Ihren Bedarf zu erfüllen. Bitte beachten Sie ausserdem, dass dies nicht immer möglich ist und dass ein Aufpreis anfällt."
      },
      {
        question: "Was kann ich tun, wenn meine Betreuungskraft zu spät kommt?",
        answer:
          "Sollte sich Ihre Betreuungskraft verspäten, kontaktieren Sie bitte unseren Kundenservice und wir werden unser Bestes tun, um die bestmögliche Lösung für Sie zu finden. Wir entschuldigen uns aufrichtig für die Unannehmlichkeiten."
      },
      {
        question: "Was kann ich tun, wenn meine Betreuungskraft nicht erscheint?",
        answer:
          "Bitte kontaktieren Sie uns unter 043 200 10 20, damit wir die Betreuung kostenfrei stornieren und Ihnen die bestmögliche Lösung anbieten können."
      },
      {
        question: "Was kann ich tun, wenn meine Betreuungskraft mehr Zeit benötigt?",
        answer:
          "Sollte eine längere Betreuungsdauer notwendig sein, können Sie dies direkt mit der anwesenden Betreuungskraft besprechen. Wenn sie länger bleiben kann, hat die Betreuungskraft sowie Sie die Möglichkeit, die zusätzlichen Stunden direkt in der App anzupassen. Danach werden wir die Dauer und die Verrechnung entsprechend aktualisieren."
      },
      {
        question: "Was kann ich tun, wenn etwas beschädigt wurde?",
        answer:
          "Wir bieten Ihnen die Schadenversicherung, Baloise mit Batmaid an. Sie deckt bis zu 1000,- CHF pro Jahr im Falle eines anerkannten Schadens. Wir bitten Sie, ein Bild des beschädigten Gegenstandes zusammen mit einem Kaufbeleg einzureichen. Wenn der Betrag 1000,- CHF übersteigt, werden wir Ihren Fall individuell behandeln und mit der bestmöglichen Lösung auf Sie zurückkommen."
      },
      {
        question: "Was kann ich tun, wenn ich das Gefühl habe, bestohlen worden zu sein?",
        answer:
          "Bitte setzen Sie sich umgehend mit uns in Verbindung. Wir werden die Situation mit Ihrer Betreuungskraft besprechen und Sie zeitnah über die nächsten Schritte informieren."
      },
      {
        question: "Was kann ich tun, wenn ich den Schlüssel vergessen habe bereitzulegen?",
        answer:
          "Bitte benachrichtigen Sie Ihre Betreuungskraft umgehend. Beachten Sie bitte, dass in diesem Fall der volle Betrag berechnet wird, um die Betreuungskraft zu entschädigen."
      },
      {
        question: "Wie erreiche ich die Prime Home Care AG am besten?",
        answer:
          "Wenn Sie Fragen haben, können Sie uns eine E-Mail an info@phc.ch senden oder uns unter der Nummer 043 200 10 20 anrufen. Wir nehmen Ihre Anrufe von Montag bis Freitag, zwischen 8:30 und 11:00 und 13:30 und 16:00 Uhr, entgegen."
      },
      ],
    },
    {
    category: "MEINE ZAHLUNGEN",
      questions: [
        {
        question: "Zahlungsabwicklung, wie funktioniert dies genau?",
        answer:
          "Die Zahlungsabwicklung bei Prime Home Care AG erfolgt unkompliziert und sicher. Sie benötigen eine gültige Kreditkarte, um unsere Dienstleistungen in Anspruch zu nehmen. Der Betrag wird 24 Stunden nach der Betreuung automatisch von Ihrer Kreditkarte abgebucht. So stellen wir sicher, dass die Zahlung bequem und rechtzeitig erfolgt. "
      },
      {
        question: "Welche Zahlungsmethoden stehen mir zur Verfügung? ",
        answer:
          "Sie können alle gängigen Kreditkarten als Zahlungsmethode verwenden. Dazu gehören Visa, MasterCard, American Express"
      },
      {
        question: "Kann ich meine Zahlungsmethode anpassen? ",
        answer:
          "Ja, dies können Sie auf unserer online Plattform in Ihrem Kundenkonto unter Zahlungen unkompliziert und schnell erledigen "
      },
      {
        question: "Stundenweise Seniorenbetreuung: Was bedeutet das? ",
        answer:
          "Stundenweise Seniorenbetreuung bezieht sich auf eine Art von Pflege- und Unterstützungsdienst, bei dem Betreuungspersonen für eine bestimmte Anzahl von Stunden pro Tag oder Woche bei hilfsbedürftigen Menschen zu Hause im Einsatz sind. "
      },
      {
  question: "Flexible Einsatzzeiten",
  answer:
    "Die Betreuung erfolgt nicht rund um die Uhr, sondern für eine im Voraus festgelegte Anzahl von Stunden, die je nach Bedarf variieren kann. Dies kann täglich, mehrmals pro Woche oder auch nur gelegentlich sein."
},
{
  question: "Individuell angepasste Unterstützung",
  answer:
    "Die Betreuungsleistungen werden auf die individuellen Bedürfnisse zugeschnitten. Dazu können Aufgaben wie Unterstützung bei der Körperpflege, Haushaltsarbeiten, Begleitung zu Arztterminen oder einfach Gesellschaft leisten gehören."
},
{
  question: "Entlastung für Angehörige",
  answer:
    "Stundenweise Betreuung kann Angehörigen eine dringend benötigte Pause bieten und sie unterstützen, wenn sie selbst Verpflichtungen haben. Es ermöglicht Familienmitgliedern, ihre eigenen Aufgaben und Freizeitaktivitäten zu bewältigen, während sie wissen, dass ihr Familienmitglied bestens versorgt ist."
},
{
  question: "Erhaltung der Selbstständigkeit",
  answer:
    "Diese Art der stundenweisen Betreuung hilft Senioren, so lange wie möglich in ihrer vertrauten Umgebung zu bleiben. Sie erhalten die Unterstützung, die sie benötigen, ohne vollständig auf Fremdpflege angewiesen zu sein."
},
{
  question: "Soziale Interaktion",
  answer:
    "Stundenweise Betreuungsmitarbeiter bieten nicht nur praktische Hilfe im eigenen Zuhause, sondern auch soziale Interaktionen, die für das emotionale Wohlbefinden sehr wichtig ist. Gemeinsame Aktivitäten wie Gespräche, Spaziergänge oder Spiele können Einsamkeit und Isolation reduzieren. Insgesamt bietet die stundenweise Seniorenbetreuung eine flexible und bedarfsgerechte Lösung für Menschen und ihre Familien, um Unterstützung und Entlastung im Alltag zu erhalten."
}
,
      ],
    },
  ];

  // State to manage open FAQ
  const [openIndex, setOpenIndex] = useState(null);

  // Toggle FAQ Answer
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="p-4 lg:p-2 max-w-[1430px] bg-[#FAFCFF] mx-auto" >
      
      {/* Header Section */}
      <div className="bg-[#B99B5F] text-center  rounded-[20px] py-[90px] max-w-[1390px] mx-auto">
      <h2 className="text-[#FAFCFF] text-center text-[55px] font-semibold leading-[66px] font-['Instrument Sans']">
 Häufige Fragen

</h2>

        <p className="text-white text-[20px] font-normal leading-[25.6px] font-['Inter'] mt-2">
        Finden Sie Antworten auf die am häufigsten gestellten Fragen zu unseren Dienstleistungen, Richtlinien und mehr.
                </p>
      </div>

      {/* FAQ Content */}
      <div className="max-w-[1150px] mx-auto mt-20 lg:mt-[120px] lg:px-6 mb-[80px]">
        {faqData.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mt-8 lg:mt-[60px]">
            
            {/* Section Title */}
            <h3 className="text-[#04436F] text-[36px] font-[700] leading-[43px] font-['Metropolis'] mb-4 lg:mb-[40px]">
              {section.category}
            </h3>

            {/* FAQ List */}
            <div className="space-y-4 lg:space-y-[30px]">
              {section.questions.map((item, index) => {
                const isOpen = openIndex === `${sectionIndex}-${index}`;
                return (
                  <div key={index} className="bg-[#ECF2FF] rounded-[20px]">
                    {/* Question */}
                    <div
                      onClick={() => toggleFAQ(`${sectionIndex}-${index}`)}
                      className="lg:p-6 p-3 flex justify-between items-center cursor-pointer transition duration-300  hover:bg-[#E1E8F0] rounded-[20px]"
                    >
                      <h4 className="text-[#04436F] text-[14px] lg:text-[20px] font-[600] lg:font-[700] leading-[26px]">{item.question}</h4>

                      {/* Dropdown Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="26"
                        viewBox="0 0 24 26"
                        fill="none"
                        className={`transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      >
                        <g clipPath="url(#clip0_1352_2251)">
                          <path
                            d="M12 0.630859C5.37258 0.630859 0 6.00344 0 12.6309C0 19.2583 5.37258 24.6309 12 24.6309C18.6274 24.6309 24 19.2583 24 12.6309C24 6.00344 18.6274 0.630859 12 0.630859Z"
                            fill="#04436F"
                          />
                          <path
                            d="M16.4443 10.409L11.9999 14.8535L7.5554 10.409"
                            stroke="white"
                            strokeWidth="1.33333"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_1352_2251">
                            <rect
                              width="24"
                              height="25"
                              fill="white"
                              transform="matrix(-1 0 0 -1 24 25.1309)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>

                    {/* Answer Section (Only shown if open) */}
                    {isOpen && (
                      <div className="p-4 text-[#04436F] text-[14px] lg:text-[18px] font-normal leading-[26px] font-['Metropolis'] bg-[#F1F1F1] rounded-b-[10px]">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        ))}
      </div>
  
<p className="text-[#04436F] text-[18px] font-medium leading-[28px] text-center mt-16">
  Falls Sie die Antwort auf Ihre Frage nicht finden, kontaktieren Sie uns gerne über das <a href="/contact" className="underline hover:text-[#B99B5F] transition-colors">Kontaktformular</a>.
</p>

    </div>
  );
}
