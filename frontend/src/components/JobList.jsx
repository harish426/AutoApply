import React, { useState } from 'react';

const allJobs = [
    {
        id: 1,
        title: 'Software Engineer',
        company: 'Google',
        location: 'Mountain View, CA',
        posted: '2 days ago',
        relevance: 95,
        experience: '5+ years',
        sponsorship: true,
        skills: ['React', 'Node.js', 'Firebase']
    },
    {
        id: 2,
        title: 'Product Manager',
        company: 'Facebook',
        location: 'Menlo Park, CA',
        posted: '1 day ago',
        relevance: 80,
        experience: '3-5 years',
        sponsorship: false,
        skills: ['Agile', 'Jira', 'Confluence']
    },
    {
        id: 3,
        title: 'Data Scientist',
        company: 'Amazon',
        location: 'Seattle, WA',
        posted: '5 days ago',
        relevance: 70,
        experience: '2+ years',
        sponsorship: true,
        skills: ['Python', 'TensorFlow', 'scikit-learn']
    },
    {
        id: 4,
        title: 'UX Designer',
        company: 'Apple',
        location: 'Cupertino, CA',
        posted: '3 days ago',
        relevance: 60,
        experience: '3+ years',
        sponsorship: false,
        skills: ['Figma', 'Sketch', 'Adobe XD']
    },
];

const likedJobs = [
    {
        id: 5,
        title: 'Frontend Developer',
        company: 'Microsoft',
        location: 'Redmond, WA',
        posted: '1 week ago',
        relevance: 85,
        experience: '2-4 years',
        sponsorship: true,
        skills: ['React', 'TypeScript', 'Azure']
    },
];

const appliedJobs = [
    {
        id: 1,
        title: 'Software Engineer',
        company: 'Google',
        location: 'Mountain View, CA',
        posted: '2 days ago',
        relevance: 95,
        experience: '5+ years',
        sponsorship: true,
        skills: ['React', 'Node.js', 'Firebase']
    },
    {
        id: 6,
        title: 'Backend Engineer',
        company: 'Netflix',
        location: 'Los Gatos, CA',
        posted: '3 days ago',
        relevance: 90,
        experience: '4+ years',
        sponsorship: false,
        skills: ['Java', 'Spring', 'AWS']
    },
];

const inProgressJobs = [
    {
        id: 2,
        title: 'Product Manager',
        company: 'Facebook',
        location: 'Menlo Park, CA',
        posted: '1 day ago',
        relevance: 80,
        experience: '3-5 years',
        sponsorship: false,
        skills: ['Agile', 'Jira', 'Confluence']
    },
    {
        id: 7,
        title: 'Full Stack Developer',
        company: 'Tesla',
        location: 'Palo Alto, CA',
        posted: '2 weeks ago',
        relevance: 75,
        experience: '3+ years',
        sponsorship: true,
        skills: ['React', 'Node.js', 'MongoDB']
    },
];

const RelevanceCircle = ({ percentage }) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <svg height={radius * 2} width={radius * 2} style={{ transform: 'rotate(-90deg)' }}>
            <circle
                stroke="#e6e6e6"
                fill="transparent"
                strokeWidth="4"
                r={radius - 2}
                cx={radius}
                cy={radius}
            />
            <circle
                stroke="#667eea"
                fill="transparent"
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                r={radius - 2}
                cx={radius}
                cy={radius}
            />
            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dy=".3em"
                style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}
            >
                {`${percentage}%`}
            </text>
        </svg>
    );
};


const JobList = ({ onJobClick, onApplyClick }) => {
    const [activeTab, setActiveTab] = useState('All');
    const [keywords, setKeywords] = useState([]);
    const [searchInput, setSearchInput] = useState('');

    const handleApplyButtonClick = (e, job) => {
        e.stopPropagation();
        onApplyClick(job);
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newKeyword = searchInput.trim();
            if (newKeyword && keywords.length < 10 && newKeyword.split(' ').length <= 2 && !keywords.includes(newKeyword)) {
                setKeywords([...keywords, newKeyword]);
                setSearchInput('');
            }
        }
    };

    const removeKeyword = (keywordToRemove) => {
        setKeywords(keywords.filter(keyword => keyword !== keywordToRemove));
    };

    const renderJobs = () => {
        const appliedJobIds = appliedJobs.map(job => job.id);
        const inProgressJobIds = inProgressJobs.map(job => job.id);

        let jobsToRender = [];
        switch (activeTab) {
            case 'All':
                jobsToRender = allJobs;
                break;
            case 'Liked':
                jobsToRender = likedJobs;
                break;
            case 'Applied':
                jobsToRender = appliedJobs;
                break;
            case 'In Progress':
                jobsToRender = inProgressJobs;
                break;
            default:
                jobsToRender = allJobs;
        }

        return jobsToRender.map((job) => {
            const showApplyButton = !appliedJobIds.includes(job.id) && !inProgressJobIds.includes(job.id);

            return (
                <div key={job.id} style={styles.jobCard} onClick={() => onJobClick(job)}>
                    <div>
                        <h3 style={styles.jobTitle}>{job.title}</h3>
                        <div style={styles.jobInfo}>{job.company} - {job.location}</div>
                        <div style={styles.jobInfo}>Experience: {job.experience}</div>
                        <div style={styles.jobInfo}>Sponsorship: {job.sponsorship ? 'Yes' : 'No'}</div>
                        <div style={styles.jobPosted}>{job.posted}</div>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <RelevanceCircle percentage={job.relevance} />
                        {showApplyButton && (
                            <button style={styles.applyButton} onClick={(e) => handleApplyButtonClick(e, job)}>Apply</button>
                        )}
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="center-panel">
            <div style={styles.searchBarContainer}>
                <input 
                    type="text" 
                    placeholder="Search for jobs..." 
                    style={styles.searchBar} 
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                />
            </div>
            <div style={styles.keywordsContainer}>
                {keywords.map(keyword => (
                    <div key={keyword} style={styles.keyword}>
                        {keyword}
                        <button onClick={() => removeKeyword(keyword)} style={styles.removeKeywordButton}>x</button>
                    </div>
                ))}
            </div>
            <div style={styles.tabs}>
                <button
                    style={activeTab === 'All' ? styles.activeTab : styles.tab}
                    onClick={() => setActiveTab('All')}
                >
                    All ({allJobs.length})
                </button>
                <button
                    style={activeTab === 'Liked' ? styles.activeTab : styles.tab}
                    onClick={() => setActiveTab('Liked')}
                >
                    Liked ({likedJobs.length})
                </button>
                <button
                    style={activeTab === 'Applied' ? styles.activeTab : styles.tab}
                    onClick={() => setActiveTab('Applied')}
                >
                    Applied ({appliedJobs.length})
                </button>
                <button
                    style={activeTab === 'In Progress' ? styles.activeTab : styles.tab}
                    onClick={() => setActiveTab('In Progress')}
                >
                    In Progress ({inProgressJobs.length})
                </button>
            </div>
            <div>
                {renderJobs()}
            </div>
        </div>
    );
};

const styles = {
    searchBarContainer: {
        marginBottom: '10px',
    },
    searchBar: {
        width: '100%',
        padding: '15px',
        borderRadius: '10px',
        border: '1px solid #e0e0e0',
        fontSize: '16px',
    },
    keywordsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        marginBottom: '20px',
    },
    keyword: {
        backgroundColor: '#e0e0e0',
        borderRadius: '5px',
        padding: '5px 10px',
        margin: '5px',
        display: 'flex',
        alignItems: 'center',
    },
    removeKeywordButton: {
        marginLeft: '10px',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    tabs: {
        display: 'flex',
        marginBottom: '20px',
    },
    tab: {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        border: 'none',
        borderBottom: '2px solid transparent',
        color: '#555',
    },
    activeTab: {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        border: 'none',
        borderBottom: '2px solid #667eea',
        color: '#667eea',
        fontWeight: '600',
    },
    jobCard: {
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid #e0e0e0',
        cursor: 'pointer',
    },
    jobTitle: {
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '5px',
    },
    jobInfo: {
        fontSize: '14px',
        color: '#555',
        marginBottom: '5px',
    },
    jobPosted: {
        fontSize: '12px',
        color: '#888',
    },
    applyButton: {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#667eea',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        marginLeft: '20px',
    },
};

export default JobList;
