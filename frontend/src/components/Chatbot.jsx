import React, { useState } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]); // store user + AI messages
  const [isAsking, setIsAsking] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Add user message to chat history
    const userMessage = { sender: 'user', text: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setIsAsking(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat_bot/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_email: "test1@gmail.com", // replace with dynamic userData?.email if available
          question: prompt,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Add AI response to chat history
        const aiMessage = { sender: 'ai', text: data.answer };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: 'ai', text: 'Sorry, I could not get an answer. Please try again.' },
        ]);
      }
    } catch (error) {
      console.error("Error asking question:", error);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Sorry, there was an error processing your request.' },
      ]);
    } finally {
      setPrompt('');
      setIsAsking(false);
    }
  };

  return (
    <div className="chatbot">
      <div className="header">AI Assistant</div>
      
      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="prompt" className="label">Ask a question:</label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="textarea"
          placeholder="e.g., How can I improve my resume?"
        />
        <button type="submit" className="button" disabled={isAsking}>
          {isAsking ? "Asking..." : "Ask AI"}
        </button>
      </form>

      <div className="promptContainer">
        <div className="promptHeader">AI Response:</div>
        <div className="promptText">
          {messages.map((msg, index) => (
            <div key={index} className={msg.sender === 'user' ? 'userMsg' : 'aiMsg'}>
              <strong>{msg.sender === 'user' ? 'You' : 'AI'}:</strong> {msg.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
