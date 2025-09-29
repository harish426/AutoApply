import React, { useState, useRef } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaPaperPlane } from 'react-icons/fa';
import './AiAssistant.css';

const AiAssistant = ({ closeAssistant }) => {
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobRequirements, setJobRequirements] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const resumePreviewRef = useRef(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const userData = JSON.parse(localStorage.getItem("user"));
  if (!userData) {
    // Handle the case where userData is null (e.g., redirect to login)
    console.error("User data not found. Please log in.");
  }
  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setIsAsking(true);
    setAnswer('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat_bot/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          
          user_email: userData?.email,
          question: question 
        }),
          
      });

      if (response.ok) {
        const data = await response.json();
        setAnswer(data.answer);
      } else {
        setAnswer('Sorry, I could not get an answer. Please try again.');
      }
    } catch (error) {
      console.error("Error asking question:", error);
      setAnswer('Sorry, there was an error processing your request.');
    } finally {
      setQuestion('');
      setIsAsking(false);
    }
  };


const handleGenerateResume = async () => {
  setIsGenerating(true);

  try {
    const response = await fetch("http://127.0.0.1:8000/api/updateResume/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_email: "test1@gmail.com",
        user_name: userData?.name,
        company_name: companyName,
        job_title: jobTitle,
        job_description: jobDescription,
        job_requirements: jobRequirements,
      }),
    });

    if (!response.ok) {
      console.error("Failed to generate resume");
      setIsGenerating(false);
      return;
    }

    // ✅ Get PDF buffer as blob
    const pdfBlob = await response.blob();
    const pdfObjectURL = URL.createObjectURL(pdfBlob);

    // ✅ If you want to open PDF in new tab:
    window.open(pdfObjectURL, "_blank");

    // ✅ Or if you want to store it for preview/download button:
    setPdfUrl(pdfObjectURL);

    console.log("Resume generated successfully");
  } catch (error) {
    console.error("Error generating resume:", error);
  } finally {
    setIsGenerating(false);
  }
};


  const downloadPdf = () => {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'optimized-resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }

  const handleBackToForm = () => {
    setPdfUrl(null);
    setIsGenerating(false);
  };

  return (
    <div className="ai-assistant-container">
        <button className="close-assistant-btn" onClick={closeAssistant}>x</button>
      <Tabs>
        <TabList>
          <Tab>Q&A</Tab>
          <Tab>Resume Optimizer</Tab>
        </TabList>

        <TabPanel>
          <div className="qa-section">
            <h2>Q&A</h2>
            <p>Ask a question and get an answer.</p>
            <form className="qa-input-container" onSubmit={handleAskQuestion}>
              <textarea
                placeholder="Your question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={isAsking}
              />
              <button type="submit" className="ask-btn" disabled={isAsking}>
                <FaPaperPlane />
              </button>
            </form>
            {isAsking && <div className="spinner-qa"></div>}
            {answer && (
                <div className="qa-answer">
                    <p>{answer}</p>
                </div>
            )}
          </div>
        </TabPanel>
        <TabPanel>
          <div className="resume-optimizer-section">
            <h2>Resume Optimizer</h2>
            {isGenerating ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Generating your optimized resume...</p>
              </div>
            ) : pdfUrl ? (
              <div className="pdf-preview-container">
                <button className="back-button" onClick={handleBackToForm}>x</button>
                <iframe src={pdfUrl} title="Optimized Resume"></iframe>
                <button className="download-btn" onClick={downloadPdf}>↓</button>
              </div>
            ) : (
              <>
                <div className="form">
                  <input type="text" placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                  <input type="text" placeholder="Job Title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                  <textarea placeholder="Job Description" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)}></textarea>
                  <textarea placeholder="Job Requirements" value={jobRequirements} onChange={(e) => setJobRequirements(e.target.value)}></textarea>
                </div>
                <button className="submit-btn" onClick={handleGenerateResume}>Generate Resume</button>
                <div style={{ position: 'absolute', left: '-9999px', top: '0' }}>
                    <div ref={resumePreviewRef} className="resume-preview-for-pdf">
                      <h3>Optimized Resume</h3>
                      <p><strong>Company:</strong> {companyName}</p>
                      <p><strong>Title:</strong> {jobTitle}</p>
                      <h4>Description:</h4>
                      <p>{jobDescription}</p>
                      <h4>Requirements:</h4>
                      <p>{jobRequirements}</p>
                    </div>
                </div>
              </>
            )}
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default AiAssistant;
