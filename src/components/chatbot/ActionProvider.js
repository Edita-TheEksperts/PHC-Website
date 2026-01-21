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
    const message = this.createChatBotMessage(`❓ ${question}\n\n${answer}`);

    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  giveAnswer = (answer) => {
    const message = this.createChatBotMessage(answer);

    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  handleMoreQuestions = () => {
    const message = this.createChatBotMessage(
      "Finden Sie die passenden Antworten in der FAQ Sektion 😊. Alternativ über unser Kontaktformular:",
      { widget: "categoryOptions" }
    );

    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  handleGoodbye = () => {
    const message = this.createChatBotMessage(
      "Vielen Dank, bis zum nächsten Mal! 👋"
    );

    hasEndedSession = true; // ✅ block idle timer after Nein

    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };
}

// --- Idle Timer logic ---
let idleTimer;
let hasEndedSession = false; // ✅ new flag

function resetIdleTimer(addMessage, createChatBotMessage) {
  clearTimeout(idleTimer);

  // ✅ don't ask again if user clicked "Nein"
  if (hasEndedSession) return;

  idleTimer = setTimeout(() => {
    const msg = createChatBotMessage("Haben Sie noch Fragen?", {
      widget: "yesNoOptions",
    });
    addMessage(msg);
  }, 10000); // adjust delay here
}

// --- Extend ActionProvider with idle timer ---
class IdleTimerActionProvider extends ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    super(createChatBotMessage, setStateFunc);

    const originalSetState = this.setState;
this.setState = (updateFn) => {
  originalSetState((prev) => {
    const newState =
      typeof updateFn === "function" ? updateFn(prev) : updateFn;

    const lastMsg = newState.messages[newState.messages.length - 1];

    // 🚫 If session ended with Nein (Goodbye message), don't restart timer
  if (
  hasEndedSession &&
  typeof lastMsg.message === "string" &&
  lastMsg.message.includes("Vielen Dank")
) {
  return newState;
}
    if (hasEndedSession) {
      if (newState.messages.length > prev.messages.length) {
        hasEndedSession = false; // reopen session
        resetIdleTimer(
          (msg) => {
            originalSetState((p) => ({
              ...p,
              messages: [...p.messages, msg],
            }));
          },
          this.createChatBotMessage
        );
      }
    } else {
      // Normal case → always reset idle timer
      resetIdleTimer(
        (msg) => {
          originalSetState((p) => ({
            ...p,
            messages: [...p.messages, msg],
          }));
        },
        this.createChatBotMessage
      );
    }

    return newState;
  });
};

  }

  addMessage = (message) => {
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  createMessage = (text, options = {}) => {
    return this.createChatBotMessage(text, options);
  };

  handleInvoice = () => {
    const message = this.createChatBotMessage(
      <span>
        Sie können Ihre Rechnungen hier einsehen:{" "}
        <a
          href="http://phc.ch/client-dashboard"
          target="_blank"
          rel="noopener noreferrer"
        >
          Zum Dashboard
        </a>. <br />
        Falls Sie nicht eingeloggt sind, werden Sie automatisch zur{" "}
        <a
          href="http://phc.ch/login"
          target="_blank"
          rel="noopener noreferrer"
        >
          Login
        </a>{" "}
        -Seite weitergeleitet.
      </span>
    );

    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };
}

export default IdleTimerActionProvider;
