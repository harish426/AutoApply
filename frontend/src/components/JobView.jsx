import React, { useState } from 'react';
import JobList from './JobList';
import ApplicationData from './ApplicationData';
import ResumeView from './ResumeView';

const JobView = () => {
    const [view, setView] = useState('list'); // 'list', 'data', or 'resume'
    const [previousView, setPreviousView] = useState('list');
    const [selectedJob, setSelectedJob] = useState(null);

    const showApplicationData = () => {
        setPreviousView(view);
        setView('data');
    };

    const showJobList = () => {
        setPreviousView(view);
        setView('list');
    }

    const handleApplyClick = (job) => {
        setSelectedJob(job);
        setPreviousView(view);
        setView('resume');
    }

    const handleBackFromResume = () => {
        setView(previousView);
    }

    if (view === 'list') {
        return <JobList onJobClick={showApplicationData} onApplyClick={handleApplyClick} />;
    } else if (view === 'data') {
        return <ApplicationData onBackClick={showJobList} onApplyClick={handleApplyClick} />;
    } else { // view === 'resume'
        return <ResumeView job={selectedJob} onClose={handleBackFromResume} />
    }
};

export default JobView;
