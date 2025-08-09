import React, { useState, useEffect, useRef } from "react";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || "https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/query";

export default function App() {
  const [customerId, setCustomerId] = useState("");
  const [formRefNo, setFormRefNo] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]); // {from: 'user'|'bot', text, audio}
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const r = new SpeechRecognition();
      r.lang = "en-US";
      r.interimResults = false;
      r.maxAlternatives = 1;
      r.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setInput(text);
        handleSend(text);
      };
      r.onerror = (e) => {
        console.warn("Speech recognition error", e);
        setListening(false);
      };
      r.onend = () => setListening(false);
      recognitionRef.current = r;
    } else {
      recognitionRef.current = null;
    }
  }, []);

  async function handleSend(text) {
    if (!text || !customerId) {
      alert("Please enter Customer ID first and a question.");
      return;
    }
    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");

    try {
      const payload = {
        customerId,
        formRefNo,
        text
      };
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "API error");
      }
      const data = await res.json();
      setMessages((m) => [...m, { from: "bot", text: data.answer, audio: data.audioUrl }]);
      if (data.audioUrl) {
        const audio = new Audio(data.audioUrl);
        audio.play().catch((e) => console.warn("playback failed", e));
      }
    } catch (err) {
      console.error(err);
      setMessages((m) => [...m, { from: "bot", text: "Sorry, something went wrong." }]);
    }
  }

  function startListening() {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported in this browser. Please type your question.");
      return;
    }
    setListening(true);
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.warn(e);
    }
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: 900, margin: "20px auto" }}>
      <h1>DebtBot — Voice Q&A</h1>

      <div style={{ marginBottom: 12 }}>
        <label>Customer ID: </label>
        <input value={customerId} onChange={(e) => setCustomerId(e.target.value)} placeholder="eg: CUST1234" />
        <label style={{ marginLeft: 12 }}>Reference No: </label>
        <input value={formRefNo} onChange={(e) => setFormRefNo(e.target.value)} placeholder="optional" />
      </div>

      <div style={{ border: "1px solid #ddd", padding: 12, minHeight: 300 }}>
        <div style={{ marginBottom: 8 }}>
          <button onClick={startListening} disabled={listening} style={{ marginRight: 8 }}>
            {listening ? "Listening..." : "Speak (microphone)"}
          </button>
          <span style={{ color: "#666" }}>or type your question below</span>
        </div>

        <div style={{ maxHeight: 160, overflow: "auto", border: "1px solid #eee", padding: 8, marginBottom: 8 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: "#888" }}>{m.from === "user" ? "You" : "DebtBot"}</div>
              <div style={{
                background: m.from === "user" ? "#e6f7ff" : "#f6f6f6",
                padding: 8,
                borderRadius: 6
              }}>
                <div>{m.text}</div>
                {m.audio && <button onClick={() => new Audio(m.audio).play()}>Play speech</button>}
              </div>
            </div>
          ))}
        </div>

        <div>
          <input
            style={{ width: "70%", padding: 8 }}
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSend(input); }}
          />
          <button onClick={() => handleSend(input)} style={{ marginLeft: 8 }}>Send</button>
        </div>
      </div>

      <footer style={{ marginTop: 12, color: "#666", fontSize: 12 }}>
        This is a prototype. Replace API endpoint with your deployed API and configure Cognito/auth as needed.
      </footer>
    </div>
  );
}
