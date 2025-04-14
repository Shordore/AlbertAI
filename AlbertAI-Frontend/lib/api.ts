interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  message: string;
  conversationHistory: ChatMessage[];
}

interface ChatResponse {
  response: string;
}

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5051';

export async function sendMessage(message: string, conversationHistory: ChatMessage[] = []) {
  console.log(`Sending message to ${API_URL}/api/chat/message`);
  try {
    const response = await fetch(`${API_URL}/api/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversationHistory,
      } as ChatRequest),
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Server error response:', errorData);
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
    }

    const data: ChatResponse = await response.json();
    console.log('Chat response received:', data);
    return data.response || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error('Error sending message:', error);
    // Return a fallback message on error
    return "I apologize, but I'm having trouble connecting to the server. Please try again later.";
  }
}

export async function generateFlashcards(topic: string) {
  console.log(`Generating flashcards for: ${topic} to ${API_URL}/api/flashcards/generate`);
  try {
    const response = await fetch(`${API_URL}/api/flashcards/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic }),
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Server error response:', errorData);
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Flashcards data received:', data);
    return data;
  } catch (error) {
    console.error('Error generating flashcards:', error);
    // Return some default flashcards on error so the UI doesn't break
    return [
      { question: "What is the capital of France?", answer: "Paris" },
      { question: "What is the largest organ in the human body?", answer: "Skin" },
      { question: "What is the chemical symbol for gold?", answer: "Au" },
      { question: "Who wrote Romeo and Juliet?", answer: "William Shakespeare" },
      { question: "What is the formula for water?", answer: "H2O" }
    ];
  }
} 