import React, { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const conversationId = "abc123";
  const ws = useRef(null);

  useEffect(() => {
    // CHANGE localhost to your IP for multi-computer testing
    ws.current = new WebSocket(`ws://localhost:8000/ws/${conversationId}`);

    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setMessages((prev) => [...prev, msg]);
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      const message = { text: input };
      ws.current.send(JSON.stringify(message));
      setInput("");
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">Anonymous Chat</header>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className="chat-bubble other-message">
            <div className="text">{msg.text}</div>
            <div className="timestamp">{msg.time}</div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
