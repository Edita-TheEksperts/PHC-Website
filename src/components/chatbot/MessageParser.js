class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message) {
    const lowerMsg = message.toLowerCase();
    const { knowledgeBase = [] } = this.state;

    // --- 👋 Greeting check first ---
    if (["hallo", "hi", "hey", "hello", "guten tag"].some(g => lowerMsg.includes(g))) {
      this.actionProvider.giveAnswer(
        "👋 Hallo! Willkommen beim PHC Support. Wie kann ich Ihnen helfen?"
      );
      return; // stop here so we don't also trigger KB
    }

    // --- KnowledgeBase check ---
    const found = knowledgeBase.find(item =>
      (item.keywords || []).some(keyword =>
        lowerMsg.includes(keyword.toLowerCase())
      )
    );

    if (found) {
      this.actionProvider.giveAnswer(found.answer);
    } else {
      this.actionProvider.giveAnswer(
        "Entschuldigung, ich habe dazu keine Information. Bitte schauen Sie in die FAQ oder AVB."
      );
    }
  }
}

export default MessageParser;
