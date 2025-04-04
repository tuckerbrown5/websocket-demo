import React, { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false); // 👈 track connection state
  const conversationId = "abc123";
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(`ws://localhost:8000/ws/${conversationId}`);

    ws.current.onopen = () => {
      console.log("✅ WebSocket connection established");
      setConnected(true); // 👈 mark connection as ready
    };

    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      console.log("💬 Message from server:", msg);
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
    if (
      input.trim() &&
      ws.current &&
      ws.current.readyState === WebSocket.OPEN
    ) {
      const message = { text: input };
      ws.current.send(JSON.stringify(message));
      setInput("");
    } else {
      console.warn("WebSocket not ready — message not sent");
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
          placeholder={
            connected ? "Type a message..." : "Connecting to chat..."
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={!connected} // 👈 disable until connected
        />
        <button onClick={sendMessage} disabled={!connected}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
