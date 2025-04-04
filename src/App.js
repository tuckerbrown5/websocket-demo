import React, { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const conversationId = "abc123";
  const ws = useRef(null);

  useEffect(() => {
    // Replace localhost with your computer’s IP if testing across devices
    ws.current = new WebSocket(`ws://localhost:8000/ws/${conversationId}`);

    ws.current.onopen = () => {
      console.log("✅ WebSocket connection established");
    };

    ws.current.onmessage = (event) => {
      console.log("💬 Message from server:", event.data);
      const msg = JSON.parse(event.data);
      setMessages((prev) => [...prev, msg]);
    };

    ws.current.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
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
          <div key={index} className="chat-bubble">
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
