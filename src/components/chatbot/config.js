import { createChatBotMessage } from "react-chatbot-kit";
import CategoryOptions from "./widgets/CategoryOptions";
import QuestionOptions from "./widgets/QuestionOptions";
import React from "react";

// --- Custom Avatars ---
const BotAvatar = () => (
  <div className="bot-avatar">
    <img src="/Agent_Yellow.png" alt="Bot" style={{ width: "25px", height: "25px" }} />
  </div>
);

const UserAvatar = () => (
  <div className="hidden user-avatar">
    <img src="/Speaking_Blue.png" alt="User" style={{ width: "32px", height: "32px" }} />
  </div>
);

// --- Custom Input (mit deutschem Placeholder + Icon) ---
const CustomInput = (props) => {
  return (
    <form
      className="react-chatbot-kit-chat-input-form"
      onSubmit={props.onSubmit}
    >
      <input
        className="react-chatbot-kit-chat-input"
        placeholder="Ihre Nachricht eingeben..."   // ✅ German
        value={props.value}
        onChange={props.onChange}
      />
      <button className="react-chatbot-kit-chat-btn-send" type="submit">
        {/* ✅ schönes SVG-Icon statt nur Text */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="white">
          <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
        </svg>
      </button>
    </form>
  );
};

const config = {
  botName: "PHC Support Agent",

  initialMessages: [
    createChatBotMessage(
      "Hallo! 👋 Wie kann ich Ihnen helfen? Bitte wählen Sie eine Kategorie:",
      { widget: "categoryOptions" }
    ),
  ],

  customStyles: {
    botMessageBox: { backgroundColor: "#04436F" },
    chatButton: { backgroundColor: "#B99B5F" },
  },

  customComponents: {
    header: () => <></>,  // kein Header
    botAvatar: (props) => <BotAvatar {...props} />,
    userAvatar: (props) => <UserAvatar {...props} />,
    input: (props) => <CustomInput {...props} />,   // ✅ Input überschrieben
  },

  widgets: [
    {
      widgetName: "categoryOptions",
      widgetFunc: (props) => <CategoryOptions {...props} />,
    },
    {
      widgetName: "questionOptions",
      widgetFunc: (props) => <QuestionOptions {...props} />,
      mapStateToProps: ["faqData"],
    },
  ],

state: {
  knowledgeBase: [
    // --- Preise ---
     {
      keywords: ["preise", "kosten", "tarif", "gebühren", "kosten stunde", "preis berechnung", "preisinfo"],
  answer: "Unsere Preise: Einmalige Einsätze ab CHF 75.–/Stunde, regelmässige Betreuung ab CHF 59.–/Stunde. Preise ansehen: https://phc.ch/preise"
    },

    // Konto löschen
    {
      keywords: ["konto löschen", "account löschen", "profil entfernen", "benutzerkonto", "account entfernen"],
      answer: "Um Ihr Konto zu löschen, gehen Sie bitte in die Kontoeinstellungen."
    },

    // FAQ
    {
      keywords: ["faq", "häufige fragen", "hilfe", "support fragen", "informationen"],
      answer: "In unseren FAQ finden Sie Antworten auf die häufigsten Fragen: [Link zur FAQ-Seite]"
    },

    // AGB / AVB
    {
      keywords: ["agb", "avb", "bedingungen", "vertrag", "vertragsbedingungen", "avb seite"],
      answer: "Unsere Allgemeinen Vertragsbedingungen (AVB) können Sie hier einsehen: [Link zu AVB-Seite]"
    },

    // Kontakt
    {
      keywords: ["kontakt", "telefon", "email", "support", "hotline", "kundendienst"],
      answer: "Sie erreichen uns unter: +41 44 123 45 67 oder per E-Mail an info@phc.ch"
    },

    // Über uns
    {
      keywords: ["über uns", "unternehmen", "prime home care ag", "wer sind wir", "phc firma"],
      answer: "Willkommen bei der Prime Home Care AG – Ihrem zuverlässigen Partner für individuelle und professionelle stundenweise Betreuung zu Hause. Seit unserer Gründung verfolgen wir das Ziel, Menschen in ihrem vertrauten Umfeld bestmögliche Betreuung und Unterstützung zu bieten."
    },
    {
      keywords: ["philosophie", "werte", "grundsätze"],
      answer: "Unsere Philosophie basiert auf Empathie, Respekt und Kompetenz. Jede Person hat einzigartige Bedürfnisse, deshalb legen wir Wert auf eine persönliche und flexible Betreuung – von Gesellschaft bis hin zu hauswirtschaftlichen Dienstleistungen."
    },
    {
      keywords: ["vision", "ziel", "strategie"],
      answer: "Als digitales Unternehmen verbinden wir Betreuung mit modernster Technologie. Über unsere Plattform finden und buchen Sie flexibel und unkompliziert die passende Betreuung – individuell abgestimmt und genau dann, wenn sie gebraucht wird."
    },
    {
      keywords: ["qualität", "vertrauen", "standards"],
      answer: "Qualität und Vertrauen sind die Grundlage unseres Handelns. Wir setzen auf kontinuierliche Weiterbildung, hohe Standards und eine transparente, digitale Plattform – von der Buchung bis zur Abrechnung."
    },
    {
      keywords: ["zufriedenheit", "lebensqualität"],
      answer: "Ihre Zufriedenheit ist unser Antrieb. Wir sind stolz darauf, Ihnen Lebensqualität und Selbstständigkeit zurückzugeben – in Ihrem Zuhause, wo Sie sich am wohlsten fühlen."
    },

    // Dienstleistungen
    {
      keywords: ["dienstleistung", "dienstleistungen", "angebot", "services", "diensliestung", "dienleistung", "dienstleistng", "hilfe zuhause"],
      answer: "Unser Dienstleistungsangebot: Alltagsbegleitung & Besorgungen, Freizeit & soziale Aktivitäten, Gesundheitsfürsorge & Grundpflege sowie Haushaltshilfe & Wohnpflege."
    },
    {
      keywords: ["alltagsbegleitung", "besorgungen", "arzttermin", "einkauf", "postgang"],
      answer: "Unsere Alltagsbegleitung & Besorgungen umfasst: Begleitung zu Terminen, Einkäufe erledigen, Postgänge und weitere Erledigungen."
    },
    {
      keywords: ["freizeit", "soziale aktivitäten", "ausflüge", "reisebegleitung", "kochen"],
      answer: "Unsere Freizeit- & Sozialangebote beinhalten: Gesellschaft leisten, gemeinsames Kochen, Vorlesen, Kartenspiele sowie Ausflüge und Reisebegleitung."
    },
    {
      keywords: ["gesundheitsfürsorge", "pflege", "körperpflege", "nahrungsaufnahme"],
      answer: "Unsere Gesundheitsfürsorge & Grundpflege umfasst: körperliche Unterstützung, Hilfe bei Nahrungsaufnahme, grundpflegerische Tätigkeiten, gesundheitsfördernde Aktivitäten und geistige Unterstützung."
    },
    {
      keywords: ["haushaltshilfe", "wohnpflege", "putzen", "wäsche", "staubsaugen", "haushalt"],
      answer: "Unsere Haushaltshilfe & Wohnpflege beinhaltet: Kochen, Waschen, Bügeln, Fenster putzen, Bettwäsche wechseln, Aufräumen, Abfall entsorgen, Abstauben, Staubsaugen, Boden wischen und Vorhänge reinigen sowie Balkon- und Blumenpflege."
    },

    // Vorteile
    {
      keywords: ["vorteile", "warum prime home care", "warum phc", "gründe", "warum uns"],
      answer: "Warum Prime Home Care? Weil Vertrauen, Herzlichkeit und Verlässlichkeit im Mittelpunkt stehen. Unsere Vorteile: individuell & flexibel, vertraute Gesichter, mehr Lebensfreude zu Hause und einfach & zuverlässig organisiert."
    },

    // FAQ Erweiterungen
    {
      keywords: ["stornierung", "stornieren", "kündigen", "absagen"],
      answer: "Stornierungen bis 14 Tage vorher sind kostenlos. Zwischen 14 und 7 Tagen fallen 50% Gebühren an, weniger als 7 Tage vorher 100%."
    },
    {
      keywords: ["buchung bearbeiten", "buchung ändern"],
      answer: "Melden Sie sich in Ihrem Kundenprofil an, gehen Sie zu 'Meine Buchungen' → 'Bevorstehende Buchungen' und klicken Sie auf 'Buchung ändern'."
    },
    {
      keywords: ["buchung vornehmen", "betreuung buchen"],
      answer: "Besuchen Sie unsere Webseite phc.ch, geben Sie Ihre Postleitzahl ein, wählen Sie die gewünschte Dienstleistung und Häufigkeit und bestätigen Sie Ihre Buchung online."
    },
    {
      keywords: ["buchung stornieren", "betreuung absagen"],
      answer: "Melden Sie sich in Ihrem Profil an, gehen Sie zu 'Meine Buchungen' → 'Bevorstehende Settings' → 'Buchung stornieren'."
    },
    {
      keywords: ["umbuchen", "betreuung verschieben"],
      answer: "Loggen Sie sich in Ihr PHC-Konto ein, gehen Sie zu 'Meine Betreuungen' → 'Bevorstehende' und wählen Sie 'Betreuung bearbeiten'."
    },
    {
      keywords: ["adresse ändern", "adressänderung"],
      answer: "Ihre Adresse können Sie jederzeit im Kundenprofil unter 'Adressänderung' anpassen."
    },
    {
      keywords: ["kurzfristig buchen", "sofort betreuung", "dringend"],
      answer: "Wir benötigen normalerweise 14 Tage Vorlaufzeit. Kontaktieren Sie uns bei dringendem Bedarf, wir versuchen eine Lösung zu finden."
    },
    {
      keywords: ["preis zusammensetzung", "kosten berechnung"],
      answer: "Der Preis richtet sich nach Anzahl der Stunden und dem Stundensatz. Mindestbuchung sind 2 Stunden. Alle Preise sind inkl. MwSt. und ohne versteckte Gebühren."
    },
    {
      keywords: ["schaden", "versicherung", "versicherungspolice"],
      answer: "Unsere Schadenversicherung deckt bis zu 1000 CHF pro Jahr. Reichen Sie bei einem Schaden ein Foto und den Kaufbeleg ein."
    },
    {
      keywords: ["betreuungskraft erneut", "gleiche betreuungskraft"],
      answer: "Bei regelmässigen Einsätzen wird möglichst dieselbe Betreuungskraft zugeteilt. Bei monatlichen Buchungen kann es Abweichungen geben."
    },
    {
      keywords: ["aufgaben zuweisen", "zusätzliche aufgaben"],
      answer: "Sie können während der Buchung oder im Kundenprofil unter 'Spezialanweisungen' Aufgaben hinzufügen."
    },
    {
      keywords: ["hausschlüssel", "schlüsselübergabe"],
      answer: "Die Schlüsselübergabe können Sie direkt mit der Betreuungskraft vereinbaren oder eine sichere PHC-Lösung nutzen."
    },
    {
      keywords: ["bewertung", "feedback", "erfahrungen"],
      answer: "Nach jedem Einsatz können Sie Ihre Betreuungskraft in Ihrem Kundenprofil bewerten. Kunden sagen: 'Die Unterstützung gibt mir Sicherheit und Freiheit' (Markus S., Zürich), 'Sehr herzlich und professionell' (Claudia H., Bern), 'Stundenweise Betreuung bringt viel Entlastung' (Peter K., Luzern)."
    },
    {
      keywords: ["nach buchung", "buchung bestätigt"],
      answer: "Nach der Buchung erhalten Sie eine Bestätigung per E-Mail mit allen Details und der Uhrzeit der Betreuung."
    },
    {
      keywords: ["mehrere adressen", "adressen buchen"],
      answer: "Sie können Betreuungseinsätze für mehrere Adressen buchen. Bitte geben Sie bei der Buchung alle relevanten Daten an."
    },
    {
      keywords: ["unzufrieden", "beschwerde"],
      answer: "Falls Sie unzufrieden sind, kontaktieren Sie uns bitte direkt über Ihr Kundenprofil. Wir finden gemeinsam eine Lösung."
    }
  ]
}


};

export default config;
