import React, { useState } from 'react';
import ChatForm from './components/ChatForm';
import MessageList from './components/MessageList';
import './styles.css';

function App() {
  const [messages, setMessages] = useState([]);

  const handleNewMessage = (message) => {
    setMessages(prev => [...prev, message]);
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