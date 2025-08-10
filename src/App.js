import React, { useState, useEffect } from 'react';
import ChatForm from './components/ChatForm';
import MessageList from './components/MessageList';
import './styles.css';

function App() {
  const [messages, setMessages] = useState([]);

  // Suggestions for quick questions
  const suggestions = [
    'How can I improve my credit score?',
    'Explain my debt repayment options',
    'Help me understand my rights'
  ];

  // Load from localStorage OR show welcome message on first load
  useEffect(() => {
    const stored = localStorage.getItem('chatHistory');
    if (stored) {
      setMessages(JSON.parse(stored));
    } else {
      setMessages([
        {
          from: 'bot',
          text: 'Hi, I’m DebtAssistAI — your friendly guide to managing debt better. How can I help you today?'
        }
      ]);
    }
  }, []);

  // Save to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  const handleNewMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  // Handle suggestion chip click
  const handleSuggestionClick = (suggestion) => {
    // Pass this clicked suggestion to ChatForm as if user typed it
    setMessages(prev => [...prev, { from: 'user', text: suggestion }]);
    // You can also directly trigger API call here if you want
  };

  return (
    <div className="app-container">
      <h1>DebtAssistAI</h1>

      <MessageList messages={messages} />

      {/* Suggestion Chips */}
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

      <ChatForm onNewMessage={handleNewMessage} />
    </div>
  );
}

export default App;
