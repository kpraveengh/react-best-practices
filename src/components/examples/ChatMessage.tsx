import React from 'react';

interface ChatMessageProps {
  message: { sender: string; text: string };
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`chat-message ${message.sender.toLowerCase()}`}>
      <strong>{message.sender}:</strong> {message.text}
    </div>
  );
};