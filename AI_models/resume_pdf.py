# resume_generator_io_buffer.py

import json
from fpdf import FPDF
import io 

# --- PDF Styling Class (Encapsulated) ---
class ResumePDF(FPDF):
    """FPDF subclass for resume-specific formatting and font handling."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.set_margins(20, 15, 20)
        self.set_auto_page_break(auto=True, margin=15)
        self.set_font("Times") 
        self.set_font_size(10)

    def sanitize_text(self, text):
        """Replaces unsupported Unicode characters with safe ASCII equivalents."""
        if not isinstance(text, str):
            return text
        
        # Replace EN-DASH (– or \u2013) and EM-DASH (— or \u2014) with a hyphen
        text = text.replace('\u2013', '-').replace('\u2014', '-')
        
        # Replace smart quotes with standard straight quotes
        text = text.replace('\u2018', "'").replace('\u2019', "'")
        text = text.replace('\u201c', '"').replace('\u201d', '"')
        
        text = text.replace('\u2022', '*') # Replace Unicode bullet

        return text

    def _get_font_name(self):
        return 'Times'

    def header_style(self, text):
        """Style for Section Headers: Times Bold, line underneath."""
        self.set_font(self._get_font_name(), "B", 13)
        self.cell(0, 7, self.sanitize_text(text.upper()), 0, 1, "L", 0) 
        
        self.set_line_width(0.4) 
        self.line(self.get_x(), self.get_y(), self.w - self.r_margin, self.get_y()) 
        
        self.ln(3)

    def title_style(self, text, size=11):
        """Style for job/project titles."""
        self.set_font(self._get_font_name(), "B", size)
        self.cell(0, 5, self.sanitize_text(text), 0, 1)

    def subtitle_style(self, text):
        """Style for institution/company names."""
        self.set_font(self._get_font_name(), "I", 10)
        self.cell(0, 4, self.sanitize_text(text), 0, 1)

    def detail_line(self, left_text, right_text):
        """Style for date/location lines."""
        self.set_font(self._get_font_name(), "", 9.5)
        line_height = 4.5
        width_total = self.w - self.l_margin - self.r_margin
        
        width_left = width_total * 0.7 
        self.cell(width_left, line_height, self.sanitize_text(left_text), 0, 0, "L")
        
        self.cell(width_total - width_left, line_height, self.sanitize_text(right_text), 0, 1, "R")
        self.ln(0.5)

    def bullet_point(self, text):
        """Style for bullet points."""
        self.set_font(self._get_font_name(), "", 10)
        indent = 5 
        
        self.cell(indent, 4, "*", 0, 0, "L") 
        
        self.set_x(self.get_x())
        self.multi_cell(self.w - self.l_margin - self.r_margin - indent, 4, self.sanitize_text(text), 0, "L")
        self.ln(1)


# --- Resume Generation Class ---
class ResumeGenerator:
    """A class to handle loading JSON and generating a PDF resume."""

    def __init__(self):
        self.data = None
        self.font_name = 'Times'

    def _render_contact_info(self, pdf):
        name = self.data["contact_info"].get("name", "Name Not Provided")
        email = self.data["contact_info"].get("email", "")
        phone = self.data["contact_info"].get("phone", "")
        address = self.data["contact_info"].get("address", "")
        
        pdf.set_font(self.font_name, "B", 26) 
        pdf.cell(0, 12, pdf.sanitize_text(name), 0, 1, "C")

        pdf.set_font(self.font_name, "", 9)
        contact_str = " | ".join(filter(None, [address, phone, email]))
        pdf.cell(0, 4, pdf.sanitize_text(contact_str), 0, 1, "C")
        pdf.ln(5)

    def _render_summary(self, pdf):
        if self.data.get("summary"):
            pdf.header_style("Summary")
            pdf.set_font(self.font_name, "", 10)
            pdf.multi_cell(0, 4.5, pdf.sanitize_text(self.data["summary"]), 0, "L")
            pdf.ln(5)

    def _render_education(self, pdf):
        if self.data.get("education"):
            pdf.header_style("Education")
            for edu in self.data["education"]:
                pdf.title_style(edu.get("degree", "Degree"))
                
                left_text = edu.get("institution", "")
                right_text = f"GPA: {edu['gpa']}" if edu.get("gpa") else ""
                
                pdf.detail_line(left_text, right_text)

    def _render_experience(self, pdf):
        if self.data.get("experience"):
            pdf.header_style("Experience")
            for exp in self.data["experience"]:
                pdf.title_style(exp.get("title", "Job Title"))
                pdf.subtitle_style(exp.get("company", "Company Name"))
                
                pdf.detail_line(exp.get("location", ""), exp.get("dates", ""))
                
                for bullet in exp.get("description", []):
                    if bullet:
                        pdf.bullet_point(bullet)
                pdf.ln(2)

    def _render_projects(self, pdf):
        if self.data.get("projects"):
            pdf.header_style("Projects")
            for proj in self.data["projects"]:
                pdf.title_style(proj.get("title", "Project Title"), size=10.5)
                for bullet in proj.get("description", []):
                    if bullet:
                        pdf.bullet_point(bullet)
                pdf.ln(2)

    def _render_skills(self, pdf):
        if self.data.get("skills"):
            pdf.header_style("Skills")
            pdf.set_font(self.font_name, "", 10)
            
            for category, items in self.data["skills"].items():
                if items:
                    pdf.set_font(self.font_name, "B", 10)
                    pdf.write(5, f"{pdf.sanitize_text(category)}: ", link='')
                    
                    pdf.set_font(self.font_name, "", 10)
                    pdf.write(5, f"{pdf.sanitize_text(', '.join(items))} | ", link='')

            pdf.ln()

    def _render_additional_info(self, pdf):
        certifications = self.data.get("certifications", [])
        publications = [pub.get("name") for pub in self.data.get("publications", []) if pub.get("name")]
        
        if certifications or publications:
            pdf.header_style("Additional Info")
            
            if certifications:
                pdf.set_font(self.font_name, "B", 10)
                pdf.cell(0, 5, "Certifications:", 0, 1)
                pdf.set_font(self.font_name, "", 10)
                pdf.multi_cell(0, 5, pdf.sanitize_text(", ".join(certifications)), 0, "L")
                pdf.ln(2)
                
            if publications:
                pdf.set_font(self.font_name, "B", 10)
                pdf.cell(0, 5, "Publications:", 0, 1)
                pdf.set_font(self.font_name, "", 10)
                pdf.multi_cell(0, 5, pdf.sanitize_text(", ".join(publications)), 0, "L")
                pdf.ln(2)

    def create_pdf(self, json_data):
        """
        Public method to generate the PDF resume and return it as an io.BytesIO buffer.
        
        Returns:
            io.BytesIO: An in-memory buffer containing the PDF file data.
        """
        self.data = json_data
        print(json_data)
        pdf = ResumePDF("P", "mm", "A4")
        pdf.add_page()
        
        self._render_contact_info(pdf)
        self._render_summary(pdf)
        self._render_education(pdf)
        self._render_experience(pdf)
        self._render_projects(pdf)
        self._render_skills(pdf)
        self._render_additional_info(pdf)

        # Output to a string ('S'). 
        pdf_string = pdf.output(dest='S')
        
        # FIX: Explicitly encode the string output to bytes using 'latin-1'
        pdf_buffer = io.BytesIO(pdf_string.encode('latin-1'))
        
        # Reset buffer pointer to the beginning (important for reading/streaming)
        pdf_buffer.seek(0)
        print("PDF generation complete, returning io.BytesIO buffer.")
        return pdf_buffer


# --- Execution Block (for demonstration) ---
if __name__ == "__main__":
    # JSON data for Harish Jamallamudi
    json_data = {
      "contact_info": {
        "name": "Harish Jamallamudi",
        "email": "harishjamallamudi888@gmail.com",
        "phone": "3145996836",
        "address": ""
      },
      "summary": "AI Engineer with hands-on experience integrating AI solutions into scalable applications and optimizing machine learning workflows. Proficient in Python, CI/CD pipelines, and cloud deployment on AWS, with a strong foundation in deep learning and computer vision. Adept at collaborating across functions to develop innovative, end-to-end AI systems and automate complex workflows.",
      "education": [
        {
          "degree": "Master's, Computer Science",
          "institution": "Saint Louis University",
          "gpa": "3.86/4"
        },
        {
          "degree": "Bachelor's of Technology, Computer Science",
          "institution": "Vignan's Lara Institute of Technology & Science",
          "gpa": "7.91/10"
        }
      ],
      "experience": [
        {
          "title": "Graduate Research Assistant and Teaching Assistant",
          "company": "Saint Louis University",
          "dates": "Apr 2023 - May 2025",
          "location": "Saint Louis, US",
          "description": [
            "Collaborated with Dr. Hadi Akbharpur, PhD, to apply deep learning and computer vision techniques for real-time data processing and statistical analysis, reinforcing innovative problem-solving in a fast-paced research setting.",
            "Explored cutting-edge event camera technology and WAMI simulation within virtual environments such as Unreal Engine and CARLA, aligning experimental frameworks with scalable data evaluation for AI-driven optimization.",
            "Engineered and managed research datasets using event cameras in CARLA and Unreal Engine, demonstrating proficiency in C++, Python, and R for robust data handling and model evaluation; integrated new virtual worlds including Matrix City and Towns 11 & 12 to support simulation experiments.",
            "Mentored students in deep learning as a Teaching Assistant, fostering teamwork and analytical skills essential for adapting and growing in data-driven projects."
          ]
        },
        {
          "title": "Software Engineer",
          "company": "Somish Blockchain Labs.",
          "dates": "Dec 2021- Jun 2023",
          "location": "New Delhi, India",
          "description": [
            "Commenced as a 6-month intern during the third year of B.Tech and transitioned to a full-time role based on strong performance and contribution to a critical project, exemplifying the internship experience sought by employers.",
            "Developed full-stack applications using Java, Spring Boot, and SQL, while integrating AI-driven features to optimize data processing and user-facing functionalities.",
            "Built and maintained APIs and CI/CD pipelines to support the integration of machine learning models, demonstrating strong programming skills and collaborative agility in Agile sprints.",
            "Resolved software bugs and enhanced features to improve application stability and user experience, showcasing effective cross-functional collaboration.",
            "Contributed to code reviews and adhered to SDLC best practices for both software and machine learning development cycles, emphasizing teamwork and communication.",
            "Applied robust software engineering principles to maintain reliable model-serving logic and data pre-processing pipelines for AI models, underlining adaptability in evolving environments.",
            "Optimized systems for both batch processing and real-time triggers in high-throughput data streams feeding AI services, thereby enhancing operational efficiency.",
            "Managed infrastructure provisioning with Terraform, building reusable modules and automating deployments to create scalable environments for model serving and inference."
          ]
        },
        {
          "title": "Software Developer",
          "company": "Verzo Private. Lmt",
          "dates": "Jun 2021-Aug 2021",
          "location": "Bengaluru, India",
          "description": [
            "Developed full-stack web applications during internship projects, leveraging front-end and back-end technologies (HTML, CSS, AngularJS, Java Servlets, JavaScript, PHP) and SQL to build responsive, data-centric solutions.",
            "Worked remotely on parking information and fully developed the Event Management Web Application for the University.",
            "Applied hands-on experience in setting up web-based databases and data pipelines, supporting efficient data retrieval similar to real-time data processing frameworks."
          ]
        }
      ],
      "projects": [
        {
          "title": "MULTI-DRONE VIRTUAL CAMERA GENERATION (Thesis Project)",
          "description": [
            "Designed a multi-drone virtual image generation system in AirSim for large-area aerial imaging.",
            "Optimized drone flight paths and camera orientations for panoramic image capture.",
            "Implemented Leight-Field Dynamic Homography (LDH) to improve alignment with minimal overlap and gained expertise in image stitching, homography estimation, and drone swarm coordination.",
            "Successfully generated high-resolution stitched views, demonstrating potential for remote sensing and 3D reconstruction."
          ]
        },
        {
          "title": "CREATING FARMER COLLABORATION COMMUNITIES USING SOCIAL NETWORK",
          "description": [
            "Developed a web application using Angular, NodeJS, and MongoDB to help farmers share crop disease updates and preventive measures.",
            "Implemented a user-friendly feed and chat feature based on crop types.",
            "Built a collaborative platform for real-time agricultural information sharing.",
            "Gained strong proficiency in backend development and database management with NodeJS and MongoDB."
          ]
        },
        {
          "title": "CROP DISEASE DETECTION USING CONVENTIONAL NEURAL NETWORK",
          "description": [
            "Developed a deep learning model using CNNs for early-stage crop disease prediction.",
            "Collected and processed image data, enhancing skills in image analysis and preprocessing.",
            "Achieved high accuracy in disease identification, validating model performance.",
            "Strengthened expertise in deep learning and agricultural AI applications."
          ]
        },
        {
          "title": "Churn Prediction",
          "description": [
            "Worked on customer churn prediction in the banking sector using various machine learning algorithms, with logistic regression delivering the best results.",
            "Enabled proactive identification of customers likely to switch accounts.",
            "Gained strong skills in machine learning and data preparation, supporting customer retention strategies."
          ]
        },
        {
          "title": "Book Your Tickets",
          "description": [
            "Worked on developing a decentralized ticket booking platform using Solidity for smart contract creation, MetaMask for secure wallet integration, and a custom front end for user interaction.",
            "Enabled transparent, tamper-proof ticket purchases and ownership verification through blockchain technology.",
            "Gained strong skills in full-stack web development, blockchain integration, and smart contract deployment, reinforcing expertise in secure, decentralized application design."
          ]
        }
      ],
      "publications": [],
      "skills": {
        "Programming": [
          "Java",
          "Springboot",
          "C++",
          "Solidity",
          "Python",
          "R",
          "SQL",
          "Java servlets",
          "NodeJS",
          "AngularJS",
          "TensorFlow",
          "PyTorch",
          "FastAPI",
          "Next.js/React"
        ],
        "Tools": [
          "Control version (Git)",
          "CI/CD (CircleCI & Cloud(Azure & AWS))",
          "Docker",
          "JUnit",
          "Azure AI Foundry",
          "Amazon Kinesis"
        ],
        "Relevant Courses": [
          "Full-stack Development",
          "Machine Learning",
          "Deep Learning",
          "Computer Vision",
          "Probability and Statistics",
          "Data Structures & Algorithms",
          "Database Management System",
          "MLOps",
          "LLMs",
          "Natural Language Processing"
        ]
      },
      "certifications": [
        "Programming in Java (NPTEL)",
          "JavaScript (Udemy)",
          "Web Development Internship (Verzeo)",
          "Database Management System from NPTEL (NPTEL)",
          "Master's in Web Development (Udemy)",
          "Social Network Analysis (NPTEL)"
      ]
    }
    
    # --- DEMONSTRATION OF USAGE ---
    generator = ResumeGenerator()
    
    try:
        pdf_buffer = generator.create_pdf(json_data)
        
        print("✅ PDF successfully generated into an io.BytesIO buffer.")
        print(f"Buffer type: {type(pdf_buffer)}")
        print(f"Buffer size: {pdf_buffer.getbuffer().nbytes} bytes")
        
        # OPTIONAL: Read the buffer's content and save it to a file for verification
        temp_filename = "resume_io_buffer_output_fixed.pdf"
        with open(temp_filename, 'wb') as f:
            f.write(pdf_buffer.read())
        print(f"\n(Buffer content read and saved to '{temp_filename}' for visual verification.)")
        
    except Exception as e:
        print(f"An error occurred: {e}")