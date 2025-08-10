import React, { useState } from 'react';
import { sendMessage } from '../api';

function ChatForm({ onNewMessage }) {
  const [customerId, setCustomerId] = useState('');
  const [text, setText] = useState('');
  const [lang, setLang] = useState('en');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerId || !text) return;

    // Show user message immediately
    onNewMessage({ from: 'user', text });

    try {
      const result = await sendMessage(customerId, text, lang);
      onNewMessage({ from: 'bot', text: result.reply, audioUrl: result.audioUrl });
    } catch (err) {
      onNewMessage({ from: 'bot', text: 'Error: ' + err.message });
    }

    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="chat-form">
      <input
        type="text"
        placeholder="Customer ID"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        required
        className="chat-input"
      />

      <textarea
        placeholder="Type your question..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
        className="chat-textarea"
      />

      <div className="chat-controls">
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="chat-select"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="hi">Hindi</option>
          <option value="ta">Tamil</option>
        </select>

        <button type="submit" className="chat-button">Ask</button>
      </div>
    </form>
  );
}

export default ChatForm;
