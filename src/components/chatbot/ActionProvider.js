class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  handleCategory = (category) => {
    const message = this.createChatBotMessage(
      `Sie haben die Kategorie **${category}** gewählt. Bitte wählen Sie eine Frage:`,
      {
        widget: "questionOptions",
        payload: { category }, 
      }
    );

    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };
  handleCategorySelection = () => {
    const message = this.createChatBotMessage(
      "Bitte wählen Sie eine Kategorie:",
      { widget: "categoryOptions" }
    );

    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  handleQuestion = (category, question, answer) => {
    const message = this.createChatBotMessage(
      `❓ ${question}\n\n${answer}`
    );

    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };
}

export default ActionProvider;
