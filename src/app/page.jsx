"use client"
import React, { useState, useEffect, useRef } from "react";
import { FiSend } from "react-icons/fi";
import morse from "@ozdemirburak/morse-code-translator";

const TerminalChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const chatboxRef = useRef(null);

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setError("");

    // Check for Enter key press
    if (e.key === 'Enter') {
        handleSend();
    }
  };

  const handleSend = () => {
    if (input.trim() === "") return;

    let translatedText = "";
    let originalText = input;

    try {
      if (/(^[.\- /]+$)/.test(input)) {
        translatedText = morse.decode(input);
      } else {
        translatedText = morse.encode(input);
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        { original: originalText, translated: translatedText },
      ]);
      setInput(""); 
    } catch (err) {
      setError("Translation Error: Invalid input");
      console.log(err)
    }
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setError("Message copied to clipboard!"); // Optional: Show a success message
      setTimeout(() => setError(""), 2000); // Clear the message after 2 seconds
    }).catch(() => {
      setError("Failed to copy message."); // Optional: Show an error message
    });
  };

  return (
    <div className="flex flex-col h-screen bg-black p-4 sm:p-6 md:p-8">
      <div
        ref={chatboxRef}
        className="flex-grow overflow-y-auto mb-4 p-4 bg-gray-900 rounded-lg shadow-lg transition-all duration-300 ease-in-out"
        style={{ fontFamily: "'Courier New', monospace" }}
        aria-label="Chat messages"
      >
        {messages.map((msg, index) => (
          <div key={index} className="mb-4 animate-fade-in" onClick={() => handleCopyToClipboard(msg.translated)}>
            <p className="text-green-500">&gt; {msg.original}</p>
            <p className="text-green-300 ml-4">{msg.translated}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="relative flex-grow">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleInputChange}
            className="w-full px-4 py-2 bg-gray-800 text-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ease-in-out"
            placeholder="Type a message or Morse code..."
            aria-label="Message input"
          />
          <span className="absolute top-1/2 right-2 transform -translate-y-1/2 w-2 h-4 bg-green-500 animate-blink"></span>
        </div>
        <button
          onClick={handleSend}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ease-in-out"
          aria-label="Send message"
        >
          <FiSend className="inline-block mr-2" />
          Send
        </button>
      </div>
      {error && (
        <div
          className="mt-2 p-2 text-red-500 bg-red-100 border border-red-500 rounded-lg animate-shake"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default TerminalChat;
