import React, { useState, useEffect } from "react";
import "./ResumeForm.css";
import { saveResume } from "../api/api";

const ResumeForm = ({ resumeData, onClose }) => {
  const [formData, setFormData] = useState(resumeData);
  const [newSkill, setNewSkill] = useState({
    Programming: "",
    Tools: "",
    "Relevant Courses": "",
  });
  const [isModified, setIsModified] = useState(false);
  const [countryCodes, setCountryCodes] = useState([]);

  useEffect(() => {
    setIsModified(JSON.stringify(formData) !== JSON.stringify(resumeData));
  }, [formData, resumeData]);
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,idd,flags")
      .then((res) => res.json())
      .then((data) => {
        const codes = data
          .filter((c) => c.idd?.root) // only those with dial codes
          .map((c) => ({
            name: c.name.common,
            code: c.idd.root + (c.idd.suffixes?.[0] || ""),
            flag: c.flags?.png,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountryCodes(codes);
      })
      .catch((err) => console.error("Failed to load country codes", err));
  }, []);

  const handleSimpleFieldChange = (section, field, value) => {
    setFormData((prevData) => {
      if (field) {
        return {
          ...prevData,
          [section]: { ...prevData[section], [field]: value },
        };
      }
      return { ...prevData, [section]: value };
    });
  };

  const handleFieldChange = (section, id, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: prevData[section].map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addArrayItem = (section, newItemTemplate) => {
    const newItem = { ...newItemTemplate, id: Date.now() + Math.random() };
    setFormData((prevData) => ({
      ...prevData,
      [section]: [...(prevData[section] || []), newItem],
    }));
  };

  const removeArrayItem = (section, id) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: prevData[section].filter((item) => item.id !== id),
    }));
  };

  const handleNewSkillChange = (e, category) => {
    setNewSkill({ ...newSkill, [category]: e.target.value });
  };

  const handleAddNewSkill = (category) => {
    const skillToAdd = newSkill[category].trim();
    if (
      !skillToAdd ||
      (formData.skills?.[category] &&
        formData.skills[category].includes(skillToAdd))
    ) {
      setNewSkill({ ...newSkill, [category]: "" });
      return;
    }
    setFormData((prevData) => {
      const newSkills = { ...(prevData.skills || {}) };
      newSkills[category] = [...(newSkills[category] || []), skillToAdd];
      return { ...prevData, skills: newSkills };
    });
    setNewSkill({ ...newSkill, [category]: "" });
  };

  const removeSkill = (category, index) => {
    setFormData((prevData) => {
      const newSkills = { ...prevData.skills };
      newSkills[category] = newSkills[category].filter((_, i) => i !== index);
      return { ...prevData, skills: newSkills };
    });
  };

  const handleSave = async () => {
    try {
      //console.log("Resume data:", formData);
      const data = await saveResume(formData, formData.contact_info.email); // call API
      console.log("Resume saved successfully:", data);
      onClose(); // close modal
    } catch (err) {
      console.error("Error saving resume:", err);
      alert(`Error saving resume. Please try again.\n${err.message || err}`);
    }
  };

  const formatPhone = (value) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, "");

    // Format as 123-456-7890
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) return value;

    let formatted = match[1];
    if (match[2]) formatted += "-" + match[2];
    if (match[3]) formatted += "-" + match[3];
    return formatted;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Resume</h2>
          <button onClick={onClose} className="close-button">
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="resume-section card">
            <h2>Contact Information</h2>
            <div className="contact-grid">
              <input
                type="text"
                value={formData.contact_info.name}
                onChange={(e) =>
                  handleSimpleFieldChange(
                    "contact_info",
                    "name",
                    e.target.value
                  )
                }
                placeholder="Name"
              />
              <input
                type="email"
                value={formData.contact_info.email}
                onChange={(e) =>
                  handleSimpleFieldChange(
                    "contact_info",
                    "email",
                    e.target.value
                  )
                }
                placeholder="Email"
              />
              <div className="phone-input">
                <select
                  value={formData.contact_info.countryCode || "+1"}
                  onChange={(e) =>
                    handleSimpleFieldChange(
                      "contact_info",
                      "countryCode",
                      e.target.value
                    )
                  }
                >
                  {countryCodes.map((c, i) => (
                    <option key={i} value={c.code}>
                      {c.flag ? " " : ""} {c.name} ({c.code})
                    </option>
                  ))}
                </select>

                <input
                  type="tel"
                  value={formData.contact_info.phone}
                  onChange={(e) =>
                    handleSimpleFieldChange(
                      "contact_info",
                      "phone",
                      formatPhone(e.target.value)
                    )
                  }
                  placeholder="123-456-7890"
                  maxLength={12} // keeps format length like 123-456-7890
                />
              </div>

              <input
                type="text"
                value={formData.contact_info.address}
                onChange={(e) =>
                  handleSimpleFieldChange(
                    "contact_info",
                    "address",
                    e.target.value
                  )
                }
                placeholder="Address"
                className="full-width"
              />
            </div>
          </div>

          <div className="resume-section card">
            <h2>Summary</h2>
            <textarea
              value={formData.summary}
              onChange={(e) =>
                handleSimpleFieldChange("summary", null, e.target.value)
              }
              placeholder="A brief summary of your professional background..."
            ></textarea>
          </div>

          <div className="resume-section card">
            <div className="section-header">
              <h2>Experience</h2>
              <button
                className="add-btn"
                onClick={() =>
                  addArrayItem("experience", {
                    title: "",
                    company: "",
                    dates: "",
                    location: "",
                    description: [""],
                  })
                }
              >
                Add
              </button>
            </div>
            {(!formData.experience || formData.experience.length === 0) && (
              <p className="empty-section-message">
                Click "Add" to start building your experience section.
              </p>
            )}
            {formData.experience &&
              formData.experience.map((exp) => (
                <div key={exp.id} className="array-item">
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) =>
                      handleFieldChange(
                        "experience",
                        exp.id,
                        "title",
                        e.target.value
                      )
                    }
                    placeholder="Job Title"
                  />
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) =>
                      handleFieldChange(
                        "experience",
                        exp.id,
                        "company",
                        e.target.value
                      )
                    }
                    placeholder="Company"
                  />
                  <input
                    type="text"
                    value={exp.dates}
                    onChange={(e) =>
                      handleFieldChange(
                        "experience",
                        exp.id,
                        "dates",
                        e.target.value
                      )
                    }
                    placeholder="Dates (e.g., 2020 - Present)"
                  />
                  <input
                    type="text"
                    value={exp.location}
                    onChange={(e) =>
                      handleFieldChange(
                        "experience",
                        exp.id,
                        "location",
                        e.target.value
                      )
                    }
                    placeholder="Location"
                  />
                  <textarea
                    value={exp.description.join("\n")}
                    onChange={(e) =>
                      handleFieldChange(
                        "experience",
                        exp.id,
                        "description",
                        e.target.value.split("\n")
                      )
                    }
                    placeholder="Job description (one point per line)."
                  />
                  <button
                    className="remove-btn"
                    onClick={() => removeArrayItem("experience", exp.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
          </div>

          <div className="resume-section card">
            <div className="section-header">
              <h2>Education</h2>
              <button
                className="add-btn"
                onClick={() =>
                  addArrayItem("education", {
                    degree: "",
                    institution: "",
                    gpa: "",
                  })
                }
              >
                Add
              </button>
            </div>
            {(!formData.education || formData.education.length === 0) && (
              <p className="empty-section-message">
                Click "Add" to provide your education details.
              </p>
            )}
            {formData.education &&
              formData.education.map((edu) => (
                <div key={edu.id} className="array-item">
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) =>
                      handleFieldChange(
                        "education",
                        edu.id,
                        "degree",
                        e.target.value
                      )
                    }
                    placeholder="Degree (e.g., B.S. in Computer Science)"
                  />
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) =>
                      handleFieldChange(
                        "education",
                        edu.id,
                        "institution",
                        e.target.value
                      )
                    }
                    placeholder="Institution"
                  />
                  <input
                    type="text"
                    value={edu.gpa}
                    onChange={(e) =>
                      handleFieldChange(
                        "education",
                        edu.id,
                        "gpa",
                        e.target.value
                      )
                    }
                    placeholder="GPA"
                  />
                  <button
                    className="remove-btn"
                    onClick={() => removeArrayItem("education", edu.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
          </div>

          <div className="resume-section card">
            <h2>Skills</h2>
            {["Programming", "Tools", "Relevant_Courses"].map((category) => {
              // Ensure category exists in formData.skills
              const categorySkills = formData.skills?.[category] || [];

              return (
                <div key={category} className="skill-category-container">
                  <h3>{category}</h3>

                  {/* Existing Skills */}
                  <div className="skills-list">
                    {categorySkills.length > 0 ? (
                      categorySkills.map((skill, index) => (
                        <div key={index} className="skill-tag">
                          {skill}
                          <button
                            onClick={() => removeSkill(category, index)}
                            className="remove-skill-btn"
                          >
                            &times;
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="empty-skill-message">No skills added</p>
                    )}
                  </div>

                  {/* Add New Skill */}
                  <div className="add-skill-input-group">
                    <input
                      type="text"
                      placeholder={`Add a new ${category} skill`}
                      value={newSkill[category] || ""}
                      onChange={(e) => handleNewSkillChange(e, category)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleAddNewSkill(category)
                      }
                    />
                    <button onClick={() => handleAddNewSkill(category)}>
                      Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="resume-section card">
            <div className="section-header">
              <h2>Projects</h2>
              <button
                className="add-btn"
                onClick={() =>
                  addArrayItem("projects", { title: "", description: [""] })
                }
              >
                Add
              </button>
            </div>
            {(!formData.projects || formData.projects.length === 0) && (
              <p className="empty-section-message">
                Showcase your work by adding a project.
              </p>
            )}
            {formData.projects &&
              formData.projects.map((proj) => (
                <div key={proj.id} className="array-item">
                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) =>
                      handleFieldChange(
                        "projects",
                        proj.id,
                        "title",
                        e.target.value
                      )
                    }
                    placeholder="Project Title"
                  />
                  <textarea
                    value={proj.description.join("\n")}
                    onChange={(e) =>
                      handleFieldChange(
                        "projects",
                        proj.id,
                        "description",
                        e.target.value.split("\n")
                      )
                    }
                    placeholder="Project description (one point per line)."
                  />
                  <button
                    className="remove-btn"
                    onClick={() => removeArrayItem("projects", proj.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
          </div>

          <div className="resume-section card">
            <div className="section-header">
              <h2>Certifications</h2>
              <button
                className="add-btn"
                onClick={() =>
                  addArrayItem("certifications", { name: "", id: Date.now() })
                }
              >
                Add
              </button>
            </div>

            {(!formData.certifications ||
              formData.certifications.length === 0) && (
              <p className="empty-section-message">
                List any relevant certifications you have earned.
              </p>
            )}

            {formData.certifications?.map((cert) => (
              <div key={cert.id} className="array-item-single">
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) =>
                    handleFieldChange(
                      "certifications",
                      cert.id,
                      "name",
                      e.target.value
                    )
                  }
                  placeholder="Certification Name"
                />
                <button
                  className="remove-btn-single"
                  onClick={() => removeArrayItem("certifications", cert.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="resume-section card">
            <div className="section-header">
              <h2>Publications</h2>
              <button
                className="add-btn"
                onClick={() =>
                  addArrayItem("publications", { name: "", link: "" })
                }
              >
                Add
              </button>
            </div>
            {(!formData.publications || formData.publications.length === 0) && (
              <p className="empty-section-message">
                Add any publications you have authored.
              </p>
            )}
            {formData.publications &&
              formData.publications.map((pub) => (
                <div key={pub.id} className="array-item">
                  <input
                    type="text"
                    value={pub.name}
                    onChange={(e) =>
                      handleFieldChange(
                        "publications",
                        pub.id,
                        "name",
                        e.target.value
                      )
                    }
                    placeholder="Publication Name"
                  />
                  <input
                    type="text"
                    value={pub.link}
                    onChange={(e) =>
                      handleFieldChange(
                        "publications",
                        pub.id,
                        "link",
                        e.target.value
                      )
                    }
                    placeholder="Link to publication"
                  />
                  <button
                    className="remove-btn"
                    onClick={() => removeArrayItem("publications", pub.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
          </div>
        </div>
        <div className="modal-footer">
          <button
            onClick={handleSave}
            className="save-button"
            disabled={!isModified}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeForm;
