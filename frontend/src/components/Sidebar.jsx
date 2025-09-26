import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar, toggleAiAssistant }) => {
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem("user"));
    const handleLogout = async () => {
        navigate('/login');
    };

    return (
        <>
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="logo">Auto Apply</div>
                <div className="profile">
                    <img src={userData?.photo || 'https://via.placeholder.com/40'} alt="Profile" className="profileImage" />
                    <div>
                        <div className="profileName">{userData?.name || 'AutoApply User'}</div>
                        <div className="profileEmail">{userData?.email || 'auto@example.com'}</div>
                    </div>
                </div>
                <nav className="nav">
                    <a href="#" onClick={(e) => { e.preventDefault(); toggleAiAssistant(); }} className="navLink">AI Assistant</a>
                    <Link to="/home/jobs" className="navLink">Jobs</Link>
                    <Link to="/home/resume" className="navLink">Resume</Link>
                    <Link to="/home/settings" className="navLink">Settings</Link>
                    <Link to="/home/about" className="navLink">About</Link>
                </nav>
                <button onClick={handleLogout} className="logoutButton">Logout</button>
            </div>
            {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}
        </>
    );
};

export default Sidebar;
