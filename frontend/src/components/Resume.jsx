// import React, { useState } from "react";
// import "./Resume.css";
// import ResumeForm from "./ResumeForm";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// const Resume = ({ resumeData, onResumeChange }) => {
//   const [isEditing, setIsEditing] = useState(false);

//   const handleEdit = () => setIsEditing(true);
//   const handleSave = (newResumeData) => {
//     onResumeChange(newResumeData);
//     setIsEditing(false); // ✅ close form after save
//   };
//   const handleClose = () => setIsEditing(false);

//   const downloadPdf = () => {
//     const input = document.getElementById("resume-content");
//     html2canvas(input).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF();
//       const imgProps = pdf.getImageProperties(imgData);
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//       pdf.save("resume.pdf");
//     });
//   };

//   // ✅ Generic section renderer with fallback
//   const renderSection = (title, data, renderItem) => (
//     <div className="resume-section card">
//       <h2>{title}</h2>
//       {data && data.length > 0 ? (
//         data.map((item) => renderItem(item))
//       ) : (
//         <p className="placeholder">No {title.toLowerCase()} added yet.</p>
//       )}
//     </div>
//   );

//   return (
//     <div className="editable-resume">
//       {/* ✅ Only keep edit button here */}
//       <button onClick={handleEdit} className="edit-button">
//         Edit Resume
//       </button>

//       {/* Editing Mode */}
//       {isEditing && (
//         <ResumeForm
//           resumeData={resumeData}
//           onSave={handleSave}
//           onClose={handleClose} // ✅ passed properly
//         />
//       )}

//       {/* Display Mode */}
//       <div id="resume-content">
//         {/* Contact Info */}
//         <div className="resume-section card">
//           <h2>
//             {resumeData.contact_info?.name || (
//               <span className="placeholder">Your Name</span>
//             )}
//           </h2>
//           <div className="contact-info">
//             <div>{resumeData.contact_info.email}</div>
//             <div>{resumeData.contact_info.phone}</div>
//             <div>{resumeData.contact_info.address}</div>
//           </div>
//         </div>

//         {/* Summary */}
//         <div className="resume-section card">
//           <h2>Summary</h2>
//           <p>
//             {resumeData.summary || (
//               <span className="placeholder">
//                 Add a short professional summary...
//               </span>
//             )}
//           </p>
//         </div>

//         {/* Experience */}
//         {renderSection("Experience", resumeData.experience, (item) => (
//           <div key={item.id} className="job">
//             <h3>
//               {item.title} at {item.company}
//             </h3>
//             <p>
//               {item.dates} | {item.location}
//             </p>
//             <ul>
//               {item.description?.map((point, index) => (
//                 <li key={index}>{point}</li>
//               ))}
//             </ul>
//           </div>
//         ))}

//         {/* Education */}
//         {renderSection("Education", resumeData.education, (item) => (
//           <div key={item.id} className="education-item">
//             <h3>{item.degree}</h3>
//             <p>
//               {item.institution} | GPA: {item.gpa}
//             </p>
//           </div>
//         ))}

//         {/* Skills */}
//         <div className="resume-section card">
//           <h2>Skills</h2>
//           {resumeData.skills && Object.keys(resumeData.skills).length > 0 ? (
//             Object.entries(resumeData.skills).map(([category, skills]) => (
//               <div key={category} className="skills-category">
//                 <h3>{category}</h3>
//                 <div className="skills-container">
//                   {skills.map((skill, index) => (
//                     <span key={index} className="skill-tag">
//                       {skill}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="placeholder">No skills added yet.</p>
//           )}
//         </div>

//         {/* Projects */}
//         {renderSection("Projects", resumeData.projects, (item) => (
//           <div key={item.id} className="project-item">
//             <h3>{item.title}</h3>
//             <ul>
//               {item.description?.map((point, index) => (
//                 <li key={index}>{point}</li>
//               ))}
//             </ul>
//           </div>
//         ))}

//         {/* Certifications */}
//         {renderSection("Certifications", resumeData.certifications, (item) => (
//           <div key={item.id} className="certification-item">
//             <p>{item.name}</p>
//           </div>
//         ))}

//         {/* Publications */}
//         {renderSection("Publications", resumeData.publications, (item) => (
//           <div key={item.id} className="publication-item">
//             <p>
//               <a href={item.link}>{item.name}</a>
//             </p>
//           </div>
//         ))}
//       </div>

//       <button onClick={downloadPdf} className="download-button">
//         Download PDF
//       </button>
//     </div>
//   );
// };

// export default Resume;
import React, { useState } from "react";
import "./Resume.css";
import ResumeForm from "./ResumeForm";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Resume = ({ resumeData = {}, onResumeChange }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => setIsEditing(true);
  const handleSave = (newResumeData) => {
    onResumeChange(newResumeData);
    setIsEditing(false);
  };
  const handleClose = () => setIsEditing(false);

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
          {resumeData.skills && Object.keys(resumeData.skills).length > 0 ? (
            Object.entries(resumeData.skills).map(([category, skills]) => (
              <div key={category} className="skills-category">
                <h3>{category}</h3>
                <div className="skills-container">
                  {skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="placeholder">No skills added yet.</p>
          )}
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
              <p>{item.name || item}</p>
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
