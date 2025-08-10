import React, { useEffect, useRef } from 'react';

function MessageList({ messages }) {
  const audioRefs = useRef({});

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.from === 'bot' && lastMessage.audioUrl) {
      const audioEl = audioRefs.current[messages.length - 1];
      if (audioEl) {
        audioEl.play().catch(err => console.warn('Audio autoplay failed:', err));
      }
    }
  }, [messages]);

  return (
    <div className="message-list">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`message ${msg.from === 'user' ? 'user' : 'bot'}`}
        >
          <div>{msg.text}</div>
          {msg.from === 'bot' && msg.audioUrl && (
            <audio
              controls
              ref={el => (audioRefs.current[index] = el)}
              src={msg.audioUrl}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default MessageList;
