import React, { useState } from 'react';
import Profile from './settings/Profile';
import Privacy from './settings/Privacy';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('Profile');

    const renderContent = () => {
        switch (activeTab) {
            case 'Profile':
                return <Profile />;
            case 'Privacy':
                return <Privacy />;
            default:
                return <Profile />;
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <button 
                    style={activeTab === 'Profile' ? styles.activeButton : styles.button}
                    onClick={() => setActiveTab('Profile')}
                >
                    Profile
                </button>
                <button 
                    style={activeTab === 'Privacy' ? styles.activeButton : styles.button}
                    onClick={() => setActiveTab('Privacy')}
                >
                    Privacy
                </button>
                {/* Add more buttons for other settings here */}
            </div>
            <div style={styles.content}>
                {renderContent()}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        height: '100%',
    },
    sidebar: {
        width: '200px',
        borderRight: '1px solid #ccc',
        padding: '20px',
        backgroundColor: '#f8f9fa',
    },
    content: {
        flex: 1,
        padding: '20px',
    },
    button: {
        display: 'block',
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        border: 'none',
        borderRadius: '5px',
        textAlign: 'left',
        cursor: 'pointer',
        backgroundColor: 'transparent',
    },
    activeButton: {
        display: 'block',
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        border: 'none',
        borderRadius: '5px',
        textAlign: 'left',
        cursor: 'pointer',
        backgroundColor: '#e9ecef',
        fontWeight: 'bold',
    },
};

export default Settings;