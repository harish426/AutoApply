import React, { useState } from 'react';
import './Chatbot.css';

const Chatbot = () => {
    const [prompt, setPrompt] = useState('');
    const response = 'The response from the AI will appear here.';

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Prompt submitted:', prompt);
        // Here you would typically send the prompt to a backend API
        // and update the response state with the result.
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
                <button type="submit" className="button">Ask AI</button>
            </form>
            <div className="promptContainer">
                <div className="promptHeader">AI Response:</div>
                <p className="promptText">{response}</p>
            </div>
        </div>
    );
};

export default Chatbot;