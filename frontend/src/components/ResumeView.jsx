import React, { useState } from 'react';
import './ResumeView.css';
import Resume from './Resume';

const ResumeView = ({ job, onClose }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [userSkills, setUserSkills] = useState(['JavaScript', 'HTML', 'CSS']);
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
    };

    const handleDragStart = (e, skill) => {
        e.dataTransfer.setData("skill", skill);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const skill = e.dataTransfer.getData("skill");
        if (skill && !userSkills.includes(skill)) {
            setUserSkills([...userSkills, skill]);
        }
        setIsDraggingOver(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDraggingOver(true);
    };

    const handleDragLeave = () => {
        setIsDraggingOver(false);
    }

    return (
        <div className="resume-view-container">
            <button onClick={onClose} className="close-button">X</button>
            <div className="resume-header">
                <h2>{job.title} at {job.company}</h2>
                {!isEditing && <button onClick={handleEdit}>Editable</button>}
                {isEditing && <button onClick={handleSave}>Save</button>}
            </div>
            <div className="resume-body">
                <div className="editable-resume">
                    {isEditing ? (
                        <Resume skills={userSkills} />
                    ) : (
                        <div className="resume-pdf">
                            <iframe src="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" width="100%" height="100%"></iframe>
                        </div>
                    )}
                </div>
                <div className="skills-section">
                    <h3>Required Skills</h3>
                    <ul className="required-skills">
                        {job.skills.map(skill => (
                            <li key={skill} draggable onDragStart={(e) => handleDragStart(e, skill)}>
                                {skill}
                            </li>
                        ))}
                    </ul>
                    <div
                        className={`user-skills ${isDraggingOver ? 'drag-over' : ''}`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                    >
                        <h3>Your Skills</h3>
                        <ul>
                            {userSkills.map(skill => <li key={skill}>{skill}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
            {!isEditing && (
                <div className="resume-footer">
                    <button>Apply Now</button>
                    <button>Download</button>
                </div>
            )}
        </div>
    );
};

export default ResumeView;
