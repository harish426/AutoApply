import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    // Mock sign-in function that just navigates to the main app
    const handleMockSignIn = () => {
        console.log("Simulating login and navigating to the main application.");
        navigate('/'); // Redirect to home page
    };

    return (
        <div style={styles.card}>
            <div style={styles.logo}>Auto Apply</div>
            <h1 style={styles.title}>Welcome to the Future of Job Applications</h1>
            <p style={styles.subtitle}>Streamline your job search and apply to multiple positions with a single click.</p>
            <button onClick={handleMockSignIn} style={styles.button}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google logo" style={styles.googleLogo} />
                Proceed to App
            </button>
        </div>
    );
};

const styles = {
    card: {
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px 60px',
        textAlign: 'center',
        color: 'white',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
    },
    logo: {
        fontWeight: '800',
        fontSize: '24px',
        marginBottom: '20px',
        background: 'linear-gradient(to right, #fbc2eb 0%, #a6c1ee 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    title: {
        fontWeight: '600',
        fontSize: '36px',
        marginBottom: '10px',
        lineHeight: '1.2',
    },
    subtitle: {
        fontWeight: '400',
        fontSize: '18px',
        marginBottom: '30px',
        maxWidth: '500px',
        opacity: '0.8',
    },
    button: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '12px 24px',
        fontSize: '18px',
        fontWeight: '600',
        cursor: 'pointer',
        backgroundColor: 'white',
        color: '#333',
        border: 'none',
        borderRadius: '50px',
        boxShadow: '0 4px 15px 0 rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s',
    },
    googleLogo: {
        width: '24px',
        height: '24px',
        marginRight: '12px',
    },
};

export default Login;
