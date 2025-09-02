import { useState } from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import config from "./config";
import MessageParser from "./MessageParser";
import ActionProvider from "./ActionProvider";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div className="relative w-[380px] h-[520px] bg-white shadow-2xl rounded-xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-[#04436F] text-white px-4 py-2 flex justify-between items-center">
            <span className="font-semibold">💬 PHC Bot</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-red-400 text-lg font-bold"
            >
              ✕
            </button>
          </div>

          {/* Chatbot container */}
          <div className="flex-1 overflow-hidden">
            <Chatbot
              config={config}
              messageParser={MessageParser}
              actionProvider={ActionProvider}
            />
          </div>
        </div>
      ) : (
        
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-[#B99B5F] text-white flex items-center justify-center shadow-xl hover:bg-[#8C7545] transition-all duration-300"
        >
          💬
        </button>
      )}
    </div>
  );
}
