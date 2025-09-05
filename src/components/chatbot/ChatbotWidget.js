import { useState, useEffect, useRef } from "react";
import Chatbot from "react-chatbot-kit";
import config from "./config";
import MessageParser from "./MessageParser";
import ActionProvider from "./ActionProvider";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const chatContainerRef = useRef(null);
useEffect(() => {
  const interval = setInterval(() => {
    const input = document.querySelector(".react-chatbot-kit-chat-input");
    if (input) {
      input.placeholder = "Ihre Nachricht eingeben..."; // ✅ German
      clearInterval(interval);
    }
  }, 100);

  return () => clearInterval(interval);
}, []);

  // Auto scroll sa herë që hapet chat
  useEffect(() => {
    if (isOpen && chatContainerRef.current) {
      const container = chatContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [isOpen]);

  // Auto scroll kur ka mesazhe të reja
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
const [showWelcome, setShowWelcome] = useState(false);

useEffect(() => {
  const timer = setTimeout(() => {
    if (!isOpen) {
      setShowWelcome(true);
    }
  }, 5000); // 30 sec

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
