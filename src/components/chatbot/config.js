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
    // Preise
    {
      keywords: ["preise", "kosten", "tarif", "gebühren"],
      answer: "Unsere Preise beginnen ab 25€/Stunde. Details finden Sie im Bereich 'Meine Zahlungen'."
    },

    // Konto löschen
    {
      keywords: ["konto löschen", "account löschen", "profil entfernen"],
      answer: "Um Ihr Konto zu löschen, gehen Sie bitte in die Kontoeinstellungen."
    },

    // FAQ (Allgemein)
    {
      keywords: ["faq", "häufige fragen", "hilfe"],
      answer: "In unseren FAQ finden Sie Antworten auf die häufigsten Fragen: [Link zur FAQ-Seite]"
    },

    // AGB / AVB
    {
      keywords: ["agb", "avb", "bedingungen", "vertrag"],
      answer: "Unsere Allgemeinen Vertragsbedingungen (AGB) können Sie hier einsehen: [Link zu AGB-Seite]"
    },

    // Kontakt
    {
      keywords: ["kontakt", "telefon", "email", "support"],
      answer: "Sie erreichen uns unter: +49 123 456 789 oder per E-Mail an support@phc.de"
    },

    // --- FAQ Erweiterungen ---
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
      answer: "Besuchen Sie unsere Webseite phc.ch, geben Sie Ihre Postleitzahl ein, wählen Sie Leistungen und Häufigkeit und bestätigen Sie Ihre Buchung online."
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
      keywords: ["kurzfristig buchen", "sofort betreuung"],
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
      keywords: ["bewertung", "feedback"],
      answer: "Nach jedem Einsatz können Sie Ihre Betreuungskraft in Ihrem Kundenprofil bewerten."
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
