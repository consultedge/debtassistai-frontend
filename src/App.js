import React, { useState, useEffect } from 'react';
import ChatForm from './components/ChatForm';
import MessageList from './components/MessageList';
import './styles.css';

function App() {
  const [messages, setMessages] = useState([]);

  // On first load, show welcome message
  useEffect(() => {
    setMessages([
      {
        from: 'bot',
        text: 'Hi, I’m DebtAssistAI — your friendly guide to managing debt better. How can I help you today?'
      }
    ]);
  }, []);

  // Send a new message (this can call API later)
  const handleNewMessage = (message) => {
    setMessages(prev => [...prev, message]);

    // TODO: Call your API here (sendMessage) and push bot response
  };

  return (
    <div className="app-container">
      <h1>DebtAssistAI</h1>
      <MessageList messages={messages} />
      <ChatForm onNewMessage={handleNewMessage} />
    </div>
  );
}

export default App;
