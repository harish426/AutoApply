import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import JobView from "./JobView";
import Chatbot from "./Chatbot";
import Resume from "./Resume";
import Settings from "./Settings";
import About from "./About";
import AiAssistant from "./AiAssistant";
import "./Home.css";

const Home = ({ user }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [isAiAssistantOpen, setAiAssistantOpen] = useState(false);

  // const [resumeData, setResumeData] = useState({
  //   contact_info: {
  //     // ✅ fallback values if no user is logged in
  //     name: user?.name || "Guest User",
  //     email: user?.email || "guest@example.com",
  //     phone: "123-456-7890",
  //     address: "123 Main St, Anytown, USA",
  //   },
  //   summary:
  //     "A passionate developer with experience in React and building web applications.",
  //   experience: [
  //     {
  //       id: 1,
  //       title: "Software Engineer",
  //       company: "Tech Corp",
  //       dates: "2020 - Present",
  //       location: "Anytown, USA",
  //       description: [
  //         "Developed and maintained web applications using React.",
  //         "Collaborated with cross-functional teams.",
  //       ],
  //     },
  //   ],
  //   education: [
  //     {
  //       id: 1,
  //       degree: "B.S. in Computer Science",
  //       institution: "University of Technology",
  //       gpa: "3.8",
  //     },
  //   ],
  //   skills: {
  //     Programming: ["JavaScript", "Python", "HTML", "CSS"],
  //     Tools: ["React", "Node.js", "Git", "Webpack"],
  //     "Relevant Courses": ["Data Structures", "Algorithms", "Web Development"],
  //   },
  //   projects: [
  //     {
  //       id: 1,
  //       title: "Personal Portfolio",
  //       description: [
  //         "Designed and built a personal portfolio website using React.",
  //       ],
  //     },
  //   ],
  //   certifications: [{ id: 1, name: "React Nanodegree" }],
  //   publications: [
  //     { id: 1, name: "My Awesome Publication", link: "http://example.com" },
  //   ],
  // });
  const [resumeData, setResumeData] = useState({
    contact_info: {
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      address: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: {},
    projects: [],
    certifications: [],
    publications: [],
  });

  const handleResumeChange = (newResumeData) => {
    setResumeData(newResumeData);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleAiAssistant = () => {
    setAiAssistantOpen(!isAiAssistantOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="container">
      <button className="hamburger" onClick={toggleSidebar}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </button>

      {/* ✅ Pass user into Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        toggleAiAssistant={toggleAiAssistant}
        user={user}
      />

      {isAiAssistantOpen && <AiAssistant closeAssistant={toggleAiAssistant} />}

      <main className="mainContent">
        <Routes>
          <Route path="/" element={<JobView />} />
          <Route path="/jobs" element={<JobView />} />
          <Route
            path="/resume"
            element={
              <Resume
                resumeData={resumeData}
                userEmail={user?.email}
                onResumeChange={handleResumeChange}
              />
            }
          />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      <Chatbot />
    </div>
  );
};

export default Home;
