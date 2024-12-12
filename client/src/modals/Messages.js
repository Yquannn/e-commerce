import React, { useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import "../styles/MessageModal.css";
import axios from "axios"; // Axios to handle HTTP requests

const MessageModal = ({ isOpen, toggleModal }) => {
  const [userMessage, setUserMessage] = useState(""); // State to store the user's message
  const [messages, setMessages] = useState([]); // State to store chat messages
  const [loading, setLoading] = useState(false); // State to track if the bot is replying

  // Add initial bot message when the modal is opened
  useEffect(() => {
    if (isOpen) {
      setMessages([
        { sender: "bot", text: "Hello! I'm Shopmee bot. Ask me anything about our products!" },
      ]);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!userMessage.trim()) return; // Don't send empty messages

    // Add user message to chat history
    const userInput = { sender: "user", text: userMessage };
    setMessages([...messages, userInput]);

    setLoading(true); // Set loading state to true while waiting for bot response

    try {
      // Send user message to backend API
      const response = await axios.post("http://localhost:3001/api/chat", {
        message: userMessage,
      });

      // Add bot response to chat history
      const botResponse = { sender: "bot", text: response.data.response };
      setMessages([...messages, userInput, botResponse]);
    } catch (error) {
      console.error("Error sending message:", error);

      const errorResponse = { sender: "bot", text: "Sorry, there was an error." };
      setMessages([...messages, userInput, errorResponse]);
    }

    setUserMessage(""); 
    setLoading(false); 
  };

  return (
    <CSSTransition
      in={isOpen}
      timeout={300}
      classNames="message-modal"
      unmountOnExit
    >
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h3>Shopmee Chatbot</h3>
            <button onClick={toggleModal} className="close-button">
              ✖
            </button>
          </div>
          <div className="modal-content">
            <div className="chat-window">
              {messages.length === 0 ? (
                <p>Ask anything about shopme products!</p>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.sender}`}>
                    <span className="sender-label">{msg.sender === "bot" ? "Shopmee bot" : "You"}</span>
                    <p>{msg.text}</p>
                  </div>
                ))
              )}

              {/* Show loading indicator if bot is replying */}
              {loading && <p className="loading">Bot is typing...</p>}
            </div>
            <div className="input-area">
              <input
                type="text"
                placeholder="Type your message..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage(); // Allow sending message with Enter key
                }}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default MessageModal;
