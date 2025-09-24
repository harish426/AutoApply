import React from 'react';
import './ApplicationData.css';

const applicationData = [
    {
        id: 1,
        jobTitle: 'Software Engineer',
        company: 'Google',
        status: 'Applied',
        date: '2023-10-26',
        skills: ['React', 'Node.js', 'Firebase']
    },
    {
        id: 2,
        jobTitle: 'Product Manager',
        company: 'Facebook',
        status: 'Interviewing',
        date: '2023-10-25',
        skills: ['Agile', 'Jira', 'Confluence']
    },
    {
        id: 3,
        jobTitle: 'Data Scientist',
        company: 'Amazon',
        status: 'Offer',
        date: '2023-10-24',
        skills: ['Python', 'TensorFlow', 'scikit-learn']
    },
    {
        id: 4,
        jobTitle: 'UX Designer',
        company: 'Apple',
        status: 'Rejected',
        date: '2023-10-23',
        skills: ['Figma', 'Sketch', 'Adobe XD']
    },
];

const ApplicationData = ({ onBackClick }) => {
    return (
        <div className="application-data-container">
            <button onClick={onBackClick} className="back-button">Back to Jobs</button>
            <h2>Application Data</h2>
            <table className="application-table">
                <thead>
                    <tr>
                        <th>Job Title</th>
                        <th>Company</th>
                        <th>Status</th>
                        <th>Date Applied</th>
                    </tr>
                </thead>
                <tbody>
                    {applicationData.map((application) => (
                        <tr key={application.id}>
                            <td>{application.jobTitle}</td>
                            <td>{application.company}</td>
                            <td>{application.status}</td>
                            <td>{application.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ApplicationData;
