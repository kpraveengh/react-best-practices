import React, { useState, useCallback } from 'react';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { useChatbot } from '../../hooks/useChatbot';
import FileUpload from './FileUpload';
import '../../styles/Chatbot.css';

interface Message {
  sender: string;
  text: string;
}

const fetchAppContent = async (query: string): Promise<string> => {
  // Enhanced logic to fetch app-specific content dynamically
  if (query.toLowerCase().includes('react')) {
    return 'React is a JavaScript library for building user interfaces.';
  } else if (query.toLowerCase().includes('typescript')) {
    return 'TypeScript is a strongly typed programming language that builds on JavaScript.';
  }
  return '';
};

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const { handleUserMessage } = useChatbot(setMessages, fetchAppContent);

  const handleSendMessage = useCallback((text: string) => {
    handleUserMessage(text);
  }, [handleUserMessage]);

  const handleFileUpload = (file: File) => {
    // Placeholder for file upload logic
    console.log('File uploaded:', file.name);
  };

  return (
    <div className="chatbot">
      <FileUpload onFileUpload={handleFileUpload} />
      <div className="messages">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
      </div>
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default React.memo(Chatbot);