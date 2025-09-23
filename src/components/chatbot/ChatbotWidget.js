import { useState, useEffect, useRef } from "react";
import Chatbot, { createChatBotMessage } from "react-chatbot-kit";
import config from "./config";
import MessageParser from "./MessageParser";
import ActionProvider from "./ActionProvider";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const chatContainerRef = useRef(null);

  // --- German Placeholder fix ---
  useEffect(() => {
    const interval = setInterval(() => {
      const input = document.querySelector(".react-chatbot-kit-chat-input");
      if (input) {
        input.placeholder = "Ihre Nachricht eingeben...";
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // --- Idle Timer Setup ---
  let idleTimer;
function resetIdleTimer(addMessage) {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    const msg = createChatBotMessage("Haben Sie noch Fragen?", {
      widget: "yesNoOptions",
    });
    addMessage(msg);   // ✅ nur Message-Objekt
  }, 30000);
}


  // --- Auto Scroll when chat opens ---
  useEffect(() => {
    if (isOpen && chatContainerRef.current) {
      const container = chatContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [isOpen]);

  // --- Auto Scroll on new messages ---
  useEffect(() => {
    if (!isOpen) return;

    const container = document.querySelector(
      ".react-chatbot-kit-chat-message-container"
    );
    if (!container) return;

    chatContainerRef.current = container;

    const observer = new MutationObserver(() => {
      container.scrollTop = container.scrollHeight;
    });

    observer.observe(container, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [isOpen]);

  // --- Show welcome bubble ---
  const [showWelcome, setShowWelcome] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setShowWelcome(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  return (
    <div className="chatbot-container">
      {isOpen ? (
        <div className="chatbot-box">
          {/* Header */}
          <div className="chatbot-header">
            <span className="chatbot-title">💬 PHC Support Agent</span>
            <button onClick={() => setIsOpen(false)} className="chatbot-close">
              ✕
            </button>
          </div>

          {/* Chat content */}
          <div className="chatbot-content">
            <div className="chatbot-inner">
            <Chatbot
  config={config}
  messageParser={MessageParser}
  actionProvider={ActionProvider}
/>

            </div>
          </div>
        </div>
      ) : (
        <>
          {showWelcome && (
            <div className="chatbot-welcome">Haben Sie Fragen?</div>
          )}
          <button onClick={() => setIsOpen(true)} className="chatbot-toggle">
            💬
          </button>
        </>
      )}
    </div>
  );
}
