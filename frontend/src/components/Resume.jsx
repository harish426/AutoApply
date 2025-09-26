import React, { useState } from 'react';
import './Resume.css';
import ResumeForm from './ResumeForm';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Resume = ({ resumeData, onResumeChange }) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = (newResumeData) => {
        onResumeChange(newResumeData);
    };

    const handleClose = () => {
        setIsEditing(false);
    };

    const downloadPdf = () => {
        const input = document.getElementById('resume-content');
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                const imgProps= pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save("resume.pdf");
            });
    };

    const renderSection = (title, data, renderItem) => (
        <div className="resume-section card">
            <h2>{title}</h2>
            {data && data.length > 0 ? (
                data.map(item => renderItem(item))
            ) : (
                <p>No information available.</p>
            )}
        </div>
    );

    return (
        <div className="editable-resume">
            <button onClick={handleEdit} className="edit-button">Edit Resume</button>
            {isEditing && (
                <ResumeForm 
                    resumeData={resumeData} 
                    onSave={handleSave} 
                    onClose={handleClose} 
                />
            )}
            <div id="resume-content">
                <div className="resume-section card">
                    <h2>{resumeData.contact_info.name}</h2>
                    <div className="contact-info">
                        <span>{resumeData.contact_info.email}</span>
                        <span>{resumeData.contact_info.phone}</span>
                        <span>{resumeData.contact_info.address}</span>
                    </div>
                </div>
                <div className="resume-section card">
                    <h2>Summary</h2>
                    <p>{resumeData.summary}</p>
                </div>
                {renderSection("Experience", resumeData.experience, (item) => (
                    <div key={item.id} className="job">
                        <h3>{item.title} at {item.company}</h3>
                        <p>{item.dates} | {item.location}</p>
                        <ul>
                            {item.description.map((point, index) => <li key={index}>{point}</li>)}
                        </ul>
                    </div>
                ))}
                {renderSection("Education", resumeData.education, (item) => (
                    <div key={item.id} className="education-item">
                        <h3>{item.degree}</h3>
                        <p>{item.institution} | GPA: {item.gpa}</p>
                    </div>
                ))}
                <div className="resume-section card">
                    <h2>Skills</h2>
                    {Object.entries(resumeData.skills).map(([category, skills]) => (
                        <div key={category} className="skills-category">
                            <h3>{category}</h3>
                            <div className="skills-container">
                                {skills.map((skill, index) => <span key={index} className="skill-tag">{skill}</span>)}
                            </div>
                        </div>
                    ))}
                </div>
                {renderSection("Projects", resumeData.projects, (item) => (
                    <div key={item.id} className="project-item">
                        <h3>{item.title}</h3>
                        <ul>
                            {item.description.map((point, index) => <li key={index}>{point}</li>)}
                        </ul>
                    </div>
                ))}
                {renderSection("Certifications", resumeData.certifications, (item) => (
                    <div key={item.id} className="certification-item">
                        <p>{item.name}</p>
                    </div>
                ))}
                {renderSection("Publications", resumeData.publications, (item) => (
                    <div key={item.id} className="publication-item">
                        <p><a href={item.link}>{item.name}</a></p>
                    </div>
                ))}
            </div>
            <button onClick={downloadPdf} className="download-button">Download PDF</button>
        </div>
    );
};

export default Resume;
