import React, { useState } from 'react';
import './Privacy.css';

const Privacy = () => {
    const [privacySettings, setPrivacySettings] = useState({
        dataCollection: true,
        modelPersonalization: true,
        chatHistory: true,
    });

    const handleToggle = (setting) => {
        setPrivacySettings(prev => ({ ...prev, [setting]: !prev[setting] }));
    };

    const handleClearHistory = () => {
        alert('Chat history cleared!');
    };

    return (
        <div className="privacy-container">
            <div className="privacy-header">
                <h2>Privacy Settings</h2>
                <p>Manage how your data is used to improve your experience.</p>
            </div>

            <div className="privacy-section">
                <div className="setting-item">
                    <div>
                        <h3>Data Collection & Usage</h3>
                        <p>Allow us to collect and use your data to improve our AI models and provide a better experience. This includes chat history and user feedback.</p>
                    </div>
                    <label className="switch">
                        <input type="checkbox" checked={privacySettings.dataCollection} onChange={() => handleToggle('dataCollection')} />
                        <span className="slider round"></span>
                    </label>
                </div>
                <div className="setting-item">
                    <div>
                        <h3>Model Personalization</h3>
                        <p>Allow the AI model to be personalized based on your past interactions. This can improve the model's performance and relevance.</p>
                    </div>
                    <label className="switch">
                        <input type="checkbox" checked={privacySettings.modelPersonalization} onChange={() => handleToggle('modelPersonalization')} />
                        <span className="slider round"></span>
                    </label>
                </div>
                <div className="setting-item">
                    <div>
                        <h3>Chat History</h3>
                        <p>Save your chat history for your reference. You can clear your history at any time.</p>
                    </div>
                    <div className="chat-history-actions">
                        <label className="switch">
                            <input type="checkbox" checked={privacySettings.chatHistory} onChange={() => handleToggle('chatHistory')} />
                            <span className="slider round"></span>
                        </label>
                        <button onClick={handleClearHistory} className="clear-history-btn">Clear History</button>
                    </div>
                </div>
            </div>

            <div className="privacy-section">
                <h3>Data Retention Policy</h3>
                <p>We store your data for a limited time to improve our services. Chat history is retained for 90 days, unless you clear it.</p>
            </div>

            <div className="privacy-section">
                <h3>Third-Party Sharing</h3>
                <p>We do not share your personal data with third parties for marketing purposes. We may share anonymized data with our partners to improve our AI models.</p>
            </div>

            <div className="privacy-section">
                <h3>Security Measures</h3>
                <p>We use industry-standard security measures to protect your data, including encryption and access controls.</p>
            </div>
        </div>
    );
};

export default Privacy;
