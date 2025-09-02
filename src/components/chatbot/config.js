import { createChatBotMessage } from "react-chatbot-kit";
import CategoryOptions from "./widgets/CategoryOptions";
import QuestionOptions from "./widgets/QuestionOptions";

const config = {
  botName: "PHC Bot",

  initialMessages: [
    createChatBotMessage("Hallo! 👋 Wie kann ich Ihnen helfen? Bitte wählen Sie eine Kategorie:", {
      widget: "categoryOptions",
    })
  ],

  customStyles: {
    botMessageBox: { backgroundColor: "#04436F" },
    chatButton: { backgroundColor: "#B99B5F" },
  },

  customComponents: {
    header: () => <></>, 
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
};

export default config;
