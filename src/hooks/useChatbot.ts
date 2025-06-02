import { useCallback } from 'react';
import { queryLocalLLM } from '../utils/localLLM'; // Assuming a utility function to query the local LLM

export const useChatbot = (
  setMessages: React.Dispatch<React.SetStateAction<{ sender: string; text: string }[]>>,
  fetchAppContent: (query: string) => Promise<string> // New function to fetch app content based on query
) => {
  const handleUserMessage = useCallback(async (text: string) => {
    let botResponse;

    try {
      // First, try to fetch content related to the application
      botResponse = await fetchAppContent(text);

      // If no relevant content is found, fall back to querying the local LLM
      if (!botResponse) {
        botResponse = await queryLocalLLM(text);
      }
    } catch (error) {
      botResponse = "I'm sorry, I couldn't process your request at the moment.";
    }

    setMessages((prev) => [
      ...prev,
      { sender: 'User', text },
      { sender: 'Bot', text: botResponse },
    ]);
  }, [setMessages, fetchAppContent]);

  return { handleUserMessage };
};