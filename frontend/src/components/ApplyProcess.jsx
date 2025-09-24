import React, { useState, useRef } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import Resume from './Resume';
import { SortableSkill } from './dnd';
import './ApplyProcess.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


// Helper to create unique IDs
const createId = () => Date.now() + Math.random();

const ApplyProcess = () => {
    const [jobDetails, setJobDetails] = useState({ title: 'Software Engineer', company: 'Google', location: 'Mountain View, CA' });
    const [requiredSkills] = useState(['JavaScript', 'React', 'Node.js', 'HTML', 'CSS', 'SQL', 'Firebase']);
    const resumeRef = useRef(null);

    const [resumeData, setResumeData] = useState({
        contact_info: { name: '', email: '', phone: '', address: '' },
        summary: '',
        education: [],
        experience: [],
        projects: [],
        skills: {
            Programming: [],
            Tools: [],
            "Relevant Courses": []
        },
        certifications: [],
        publications: []
    });

    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

    const allUserSkills = Object.values(resumeData.skills || {}).flat();
    const availableSkills = requiredSkills.filter(skill => !allUserSkills.includes(skill));

    const findContainer = (id) => {
        if (requiredSkills.includes(id) && !allUserSkills.includes(id)) return 'available-skills';
        if (resumeData.skills) {
            for (const category in resumeData.skills) {
                if (resumeData.skills[category].includes(id)) return category;
            }
        }
        return null;
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!active || !over) return;

        const activeId = active.id;
        const overId = over.id;

        const activeContainer = findContainer(activeId);
        let overContainer = findContainer(overId);

        if (!overContainer && resumeData.skills && resumeData.skills[overId]) {
            overContainer = overId;
        }

        if (!activeContainer || !overContainer) return;

        setResumeData(prevData => {
            if (!prevData.skills) return prevData; // Safeguard
            const newSkills = JSON.parse(JSON.stringify(prevData.skills));

            if (activeContainer === overContainer) {
                if (activeContainer === 'available-skills') return prevData;
                const activeIndex = newSkills[activeContainer].indexOf(activeId);
                const overIndex = newSkills[activeContainer].indexOf(overId);
                if (activeIndex !== -1 && overIndex !== -1) {
                    newSkills[activeContainer] = arrayMove(newSkills[activeContainer], activeIndex, overIndex);
                }
            } else {
                // Remove from active container
                if (activeContainer !== 'available-skills') {
                    const activeIndex = newSkills[activeContainer].indexOf(activeId);
                    if (activeIndex > -1) {
                        newSkills[activeContainer].splice(activeIndex, 1);
                    }
                }

                // Add to over container
                if (overContainer !== 'available-skills') {
                    if (!newSkills[overContainer]) {
                        newSkills[overContainer] = [];
                    }
                    const overIndex = newSkills[overContainer].indexOf(overId);
                    if (overIndex > -1) {
                        newSkills[overContainer].splice(overIndex, 0, activeId);
                    } else {
                        newSkills[overContainer].push(activeId);
                    }
                }
            }
            return { ...prevData, skills: newSkills };
        });
    };

    const handleDownloadPdf = () => {
        const input = resumeRef.current;
        // Before capturing, temporarily remove the box-shadow to prevent it from appearing in the PDF
        const originalShadow = input.style.boxShadow;
        input.style.boxShadow = 'none';

        html2canvas(input, {
            scale: 2, // Use a higher scale for better resolution
            useCORS: true,
            logging: false,
            windowWidth: input.scrollWidth,
            windowHeight: input.scrollHeight
        }).then(canvas => {
            // Restore the box-shadow after capturing
            input.style.boxShadow = originalShadow;

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save("resume.pdf");
        }).catch(err => {
            // In case of an error, ensure the shadow is restored
            input.style.boxShadow = originalShadow;
            console.error("Could not generate PDF: ", err);
        });
    };


    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="apply-process-container">
                <div className="job-details-header">
                    <h1>Apply for {jobDetails.title} at {jobDetails.company}</h1>
                    <p>{jobDetails.location}</p>
                    <div className="actions-toolbar">
                        <button className="action-btn download-btn" onClick={handleDownloadPdf}>Download as PDF</button>
                    </div>
                </div>
                <div className="resume-application-layout">
                    <div className="editable-resume-section" ref={resumeRef}>
                        <Resume resumeData={resumeData} onResumeChange={setResumeData} />
                    </div>
                    <div className="required-skills-section card">
                        <h3>Required Skills</h3>
                        <p>Drag to add to your resume</p>
                        <SortableContext id="available-skills" items={availableSkills}>
                            <div className="skills-container">
                                {availableSkills.map(skill => (
                                    <SortableSkill key={skill} id={skill} isRequired={true} />
                                ))}
                            </div>
                        </SortableContext>
                    </div>
                </div>
            </div>
        </DndContext>
    );
};

export default ApplyProcess;
