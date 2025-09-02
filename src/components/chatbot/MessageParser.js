// components/chatbot/MessageParser.js
class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message) {
    const lowerMsg = message.toLowerCase();
    const { knowledgeBase } = this.state;

    const found = knowledgeBase.find(item =>
      lowerMsg.includes(item.question.toLowerCase())
    );

    if (found) {
      this.actionProvider.giveAnswer(found.answer);
    } else {
      this.actionProvider.giveAnswer("Entschuldigung, ich habe dazu keine Information. Bitte schauen Sie in die FAQ oder AGB.");
    }
  }
}

export default MessageParser;
