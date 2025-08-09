import React from 'react';

function MessageList({ messages }) {
  return (
    <div className="message-list">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`message ${msg.from === 'user' ? 'user' : 'bot'}`}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
}

export default MessageList;