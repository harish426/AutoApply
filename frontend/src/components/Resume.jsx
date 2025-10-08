import React, { useState, useEffect } from "react";
import "./Resume.css";
import ResumeForm from "./ResumeForm";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { getResume } from "../api/api"; // ✅ import your API

const Resume = ({ userEmail, onResumeChange }) => {
  const [resumeData, setResumeData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch resume data from API when component mounts
  useEffect(() => {
    console.log("🔍 useEffect triggered with userEmail:", userEmail);

    const fetchResume = async () => {
      try {
        const data = await getResume(userEmail);
        setResumeData(data);
        onResumeChange?.(data);
      } catch (err) {
        console.error("Failed to fetch resume:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchResume();
    } else {
      console.warn("⚠️ No userEmail provided — skipping API call.");
      setLoading(false);
    }
  }, [onResumeChange, userEmail]);

  // Edit handlers
  const handleEdit = () => setIsEditing(true);
  const handleSave = (newResumeData) => {
    setResumeData(newResumeData);
    onResumeChange?.(newResumeData);
    setIsEditing(false);
  };
  const handleClose = () => setIsEditing(false);

  // ✅ PDF download logic (unchanged)
  const downloadPdf = () => {
    const input = document.getElementById("resume-content");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      pdf.save("resume.pdf");
    });
  };

  // Generic section renderer
  const renderSection = (title, data, renderItem) => (
    <div className="resume-section card">
      <h2>{title}</h2>
      {Array.isArray(data) && data.length > 0 ? (
        data.map((item, idx) => renderItem(item, idx))
      ) : (
        <p className="placeholder">No {title.toLowerCase()} added yet.</p>
      )}
    </div>
  );

  // ✅ Show loading state until resume is fetched
  if (loading) {
    return <div className="loading-text">Loading resume...</div>;
  }

  return (
    <div className="editable-resume">
      <button onClick={handleEdit} className="edit-button">
        Edit Resume
      </button>

      {/* Editing Mode */}
      {isEditing && (
        <ResumeForm
          resumeData={resumeData}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}

      {/* Display Mode */}
      <div id="resume-content">
        {/* Contact Info */}
        <div className="resume-section card">
          <h2>
            {resumeData.contact_info?.name || (
              <span className="placeholder">Your Name</span>
            )}
          </h2>
          <div className="contact-info">
            <div>
              {resumeData.contact_info?.email || "your.email@example.com"}
            </div>
            <div>{resumeData.contact_info?.phone || "Your Phone"}</div>
            <div>{resumeData.contact_info?.address || "Your Address"}</div>
          </div>
        </div>

        {/* Summary */}
        <div className="resume-section card">
          <h2>Summary</h2>
          <p>
            {resumeData.summary || (
              <span className="placeholder">
                Add a short professional summary...
              </span>
            )}
          </p>
        </div>

        {/* Experience */}
        {renderSection("Experience", resumeData.experience, (item, idx) => (
          <div key={idx} className="job">
            <h3>
              {item.title} at {item.company}
            </h3>
            <p>
              {item.dates} | {item.location}
            </p>
            <ul>
              {item.description?.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        ))}

        {/* Education */}
        {renderSection("Education", resumeData.education, (item, idx) => (
          <div key={idx} className="education-item">
            <h3>{item.degree}</h3>
            <p>
              {item.institution} | GPA: {item.gpa}
            </p>
          </div>
        ))}

        {/* Skills */}
        <div className="resume-section card">
          <h2>Skills</h2>
          {["Programming", "Tools", "Relevant_Courses"].map((category) => (
            <div key={category} className="skills-category">
              <h3>{category}</h3>
              <div className="skills-container">
                {(resumeData.skills?.[category] || []).map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
                {/* Show placeholder if empty */}
                {(!resumeData.skills?.[category] ||
                  resumeData.skills[category].length === 0) && (
                  <span className="placeholder">
                    No {category.toLowerCase()} added yet.
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Projects */}
        {renderSection("Projects", resumeData.projects, (item, idx) => (
          <div key={idx} className="project-item">
            <h3>{item.title}</h3>
            <ul>
              {item.description?.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        ))}

        {/* Certifications */}
        {renderSection(
          "Certifications",
          resumeData.certifications,
          (item, idx) => (
            <div key={idx} className="certification-item">
              <p>
                {item.name} {/* Certification Name */}
                {item.organization ? ` -  ${item.organization}` : ""}{" "}
                {/* Organization if present */}
              </p>
            </div>
          )
        )}

        {/* Publications */}
        {renderSection("Publications", resumeData.publications, (item, idx) => (
          <div key={idx} className="publication-item">
            {item.link ? (
              <p>
                <a href={item.link} target="_blank" rel="noreferrer">
                  {item.name}
                </a>
              </p>
            ) : (
              <p>{item.name || item}</p>
            )}
          </div>
        ))}
      </div>

      <button onClick={downloadPdf} className="download-button">
        Download PDF
      </button>
    </div>
  );
};

export default Resume;
