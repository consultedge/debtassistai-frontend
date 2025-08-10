import React, { useState, useEffect } from 'react';
import ChatForm from './components/ChatForm';
import MessageList from './components/MessageList';
import { sendMessage } from './api';
import './styles.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);

  const suggestions = [
    'How can I improve my credit score?',
    'Explain my debt repayment options',
    'Help me understand my rights'
  ];

  useEffect(() => {
    const stored = localStorage.getItem('chatHistory');
    if (stored) {
      setMessages(JSON.parse(stored));
    } else {
      setMessages([
        {
          from: 'bot',
          text:
            'Hi, I’m DebtAssistAI — your friendly guide to managing debt better. How can I help you today?'
        }
      ]);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  // Handler for incoming user messages (from ChatForm or suggestion chips)
  const handleNewMessage = async (message) => {
    setMessages(prev => [...prev, message]); // Add user message

    setIsThinking(true); // Show "DebtAssistAI is thinking…"
    setIsGeneratingVoice(false); // Reset voice indicator

    try {
      const reply = await sendMessage("customer1", message.text, "en");

      setIsThinking(false); // AI response received
      setMessages(prev => [
        ...prev,
        { from: 'bot', text: reply.answer, audioUrl: reply.audioUrl, lang: reply.lang }
      ]);

      // If audio is included in response, show "Generating voice…" briefly
      if (reply.audioUrl) {
        setIsGeneratingVoice(true);
        // Hide indicator after 1.5s (voice will typically start by then)
        setTimeout(() => setIsGeneratingVoice(false), 1500);
      }
    } catch (err) {
      setIsThinking(false);
      setIsGeneratingVoice(false);
      setMessages(prev => [
        ...prev,
        { from: 'bot', text: "Sorry, there was an error." }
      ]);
      console.error(err);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleNewMessage({ from: 'user', text: suggestion });
  };

  return (
    <div className="app-container">
      <h1>DebtAssistAI</h1>

      <MessageList messages={messages} />

      {/* Typing and audio indicators */}
      {isThinking && (
        <div className="status-indicator">💭 DebtAssistAI is thinking…</div>
      )}
      {isGeneratingVoice && (
        <div className="status-indicator">🎤 Generating voice…</div>
      )}

      <div className="suggestions">
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            className="suggestion-chip"
            onClick={() => handleSuggestionClick(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <ChatForm onNewMessage={txt => handleNewMessage({ from: 'user', text: txt })} />
    </div>
  );
}

export default App;
