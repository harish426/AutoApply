"""resume_pdf.py is a module that generates a PDF resume from JSON data. generated from resume_agent.py."""

import json
import io
from resume_Parser import ResumeAIParser

from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, ListFlowable, ListItem
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.colors import black
# The following imports are no longer needed as we are not registering custom fonts.
# from reportlab.pdfbase import pdfmetrics
# from reportlab.pdfbase.ttfonts import TTFont

class ResumeGenerator:
    """
    A class to generate a PDF resume from a JSON object.
    """

    def __init__(self, filename="resume.pdf"):
        """
        Initializes the document with the specified filename and page size.
        """
        self.buffer = io.BytesIO()
        self.doc = SimpleDocTemplate(self.buffer, pagesize=letter)
        self.story = []
        self.styles = getSampleStyleSheet()

        # Define custom paragraph styles for the resume using a standard font
        self.styles.add(ParagraphStyle(
            name='TitleStyle',
            fontName='Times-Bold',  # Changed to Times-Bold
            fontSize=18,
            alignment=TA_CENTER,
            spaceAfter=6
        ))
        self.styles.add(ParagraphStyle(
            name='SubtitleStyle',
            fontName='Times-Roman',  # Changed to Times-Roman
            fontSize=9,
            alignment=TA_CENTER,
            textColor=black,
            spaceAfter=4
        ))
        # Renamed 'Heading1' to 'SectionHeading' to avoid the KeyError
        self.styles.add(ParagraphStyle(
            name='SectionHeading',
            fontName='Times-Bold',  # Changed to Times-Bold
            fontSize=12,
            spaceBefore=6,
            spaceAfter=3,
            textColor=black
        ))
        self.styles.add(ParagraphStyle(
            name='SectionTitle',
            fontName='Times-Bold',  # Changed to Times-Bold
            fontSize=10,
            spaceAfter=1
        ))
        self.styles.add(ParagraphStyle(
            name='SectionSubtitle',
            fontName='Times-Roman',  # Changed to Times-Roman
            fontSize=8,
            spaceAfter=3,
            leading=9
        ))
        self.styles.add(ParagraphStyle(
            name='Body',
            fontName='Times-Roman',  # Changed to Times-Roman
            fontSize=8,
            leading=9,
            spaceAfter=3
        ))
        self.styles.add(ParagraphStyle(
            name='ListBullet',
            fontName='Times-Roman',  # Changed to Times-Roman
            fontSize=8,
            spaceBefore=1,
            leftIndent=12,
            bulletIndent=0
        ))

    def _add_section(self, title):
        """Adds a section heading and a horizontal line."""
        self.story.append(Spacer(1, 6))
        self.story.append(Paragraph(title, self.styles['SectionHeading']))
        self.story.append(HRFlowable(width="100%", thickness=1, color=black, spaceAfter=4))

    def _add_contact_info(self, data):
        """Adds the contact information section."""
        name = data.get('name', 'N/A')
        email = data.get('email', 'N/A')
        phone = data.get('phone', 'N/A')
        address = data.get('address', 'N/A')

        self.story.append(Paragraph(name, self.styles['TitleStyle']))
        contact_info_str = f"{address} | {email} | {phone}"
        self.story.append(Paragraph(contact_info_str, self.styles['SubtitleStyle']))

    def _add_summary(self, data):
        """Adds the professional summary section."""
        summary_text = data.get('summary')
        if summary_text:
            self._add_section("SUMMARY")
            self.story.append(Paragraph(summary_text, self.styles['Body']))

    def _add_education(self, data):
        """Adds the education section."""
        education_list = data.get('education')
        if education_list:
            self._add_section("EDUCATION")
            for education in education_list:
                degree = education.get('degree', 'N/A')
                institution = education.get('institution', 'N/A')
                gpa = education.get('gpa', 'N/A')

                self.story.append(Paragraph(f"<b>{degree}</b>, {institution}", self.styles['SectionTitle']))
                self.story.append(Paragraph(f"GPA: {gpa}", self.styles['SectionSubtitle']))
                self.story.append(Spacer(1, 3))

    def _add_work_experience(self, data):
        """Adds the work experience section."""
        experience_list = data.get('experience')
        if experience_list:
            self._add_section("WORK EXPERIENCE")
            for job in experience_list:
                title = job.get('title', 'N/A')
                company = job.get('company', 'N/A')
                dates = job.get('dates', 'N/A')
                location = job.get('location', 'N/A')
                description = job.get('description', [])

                self.story.append(Paragraph(f"<b>{title}</b>, {company}", self.styles['SectionTitle']))
                self.story.append(Paragraph(f"{dates} | {location}", self.styles['SectionSubtitle']))

                list_items = [ListItem(Paragraph(bullet, self.styles['Body'])) for bullet in description]
                self.story.append(ListFlowable(list_items, bulletType='bullet', spaceAfter=3))
                self.story.append(Spacer(1, 3))

    def _add_academic_projects(self, data):
        """Adds the academic projects section."""
        projects_list = data.get('projects')
        if projects_list:
            self._add_section("ACADEMIC PROJECTS")
            for project in projects_list:
                title = project.get('title', 'N/A')
                description = project.get('description', [])

                self.story.append(Paragraph(f"<b>{title}</b>", self.styles['SectionTitle']))
                
                list_items = [ListItem(Paragraph(bullet, self.styles['Body'])) for bullet in description]
                self.story.append(ListFlowable(list_items, bulletType='bullet', spaceAfter=3))
                self.story.append(Spacer(1, 3))

    def _add_skills(self, data):
        """Adds the skills section."""
        skills_dict = data.get('skills')
        if skills_dict:
            self._add_section("SKILLS")
            for category, skills in skills_dict.items():
                category_str = f"<b>{category}:</b> {', '.join(skills)}"
                self.story.append(Paragraph(category_str, self.styles['Body']))
                self.story.append(Spacer(1, 3))

    def _add_certifications(self, data):
        """Adds the certifications section."""
        certifications_list = data.get('certifications')
        if certifications_list:
            self._add_section("CERTIFICATIONS")
            certifications_str = ', '.join(certifications_list)
            self.story.append(Paragraph(certifications_str, self.styles['Body']))
            self.story.append(Spacer(1, 3))

    def generate_pdf(self, resume_json, output_filename):
        """
        Parses the JSON and generates the PDF in memory.
        Returns the PDF as bytes instead of writing to disk.
        """
        # try:
        updated_resume_json  = json.loads(resume_json)
        #     rap = ResumeAIParser()
        #     updated_resume_json = rap.parse_resume_with_ai(resume_data)
        #     if updated_resume_json:
        #         updated_resume_json = json.loads(updated_resume_json)
        #     else:
        #         print("Error: AI parser returned None")
        #         return None
        # except json.JSONDecodeError as e:
        #     print(f"Error decoding JSON: {e}")
            # return None

        # Add all sections to the document
        self._add_contact_info(updated_resume_json.get('contact_info', {}))
        self._add_summary(updated_resume_json)
        self._add_education(updated_resume_json)
        self._add_work_experience(updated_resume_json)
        self._add_academic_projects(updated_resume_json)
        self._add_skills(updated_resume_json)
        self._add_certifications(updated_resume_json)
        
        # Build PDF into memory
        self.doc.build(self.story)

        # Get PDF bytes
        try: 
            pdf_bytes = self.buffer.getvalue()
            self.buffer.close()
            return pdf_bytes
        except Exception as e:
            print(f"Error generating PDF: {e}")
            return None


# --- Updated JSON data based on your uploaded resume ---
updated_resume_json = """
{
  "contact_info": {
    "name": "Harish Jamallamudi",
    "email": "harishjamallamudi888@gmail.com",
    "phone": "3145996836",
    "address": ""
  },
  "summary": "AI Engineer with a strong foundation in deep learning, computer vision, and AI model integration. Demonstrated experience using Python, C++, and PyTorch to develop and optimize models for scalable applications. Proficient in MLOps workflows, cloud deployments on AWS, and CI/CD pipelines, bridging cross-functional teams to drive innovative AI solutions in real-time and embedded environments.",
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
        "Collaborated with Dr. Hadi Akbharpur, PhD, to apply deep learning and computer vision techniques for real-time data processing, aligning with emerging AI/ML applications.",
        "Explored event camera technology and WAMI simulation within virtual environments such as Unreal Engine and CARLA, supporting scalable data evaluation and model optimization.",
        "Engineered and managed research datasets using event cameras in CARLA & Unreal Engine, demonstrating proficiency in C++, Python, and R for data handling, model evaluation, and integration of AI-driven simulation experiments.",
        "Mentored students in deep learning methodologies, fostering analytical skills and experimental practices that support data-driven optimizations in AI systems."
      ]
    },
    {
      "title": "Software Engineer",
      "company": "Somish Blockchain Labs.",
      "dates": "Dec 2021- Jun 2023",
      "location": "New Delhi, India",
      "description": [
        "Joined as a 6-month intern during the third year of B.Tech and transitioned to a full-time role, contributing to AI-driven data processing and model integration.",
        "Developed full-stack applications using Java, Spring Boot, and SQL, integrating AI features to support intelligent data processing and real-time analytics.",
        "Engineered and maintained APIs and CI/CD pipelines, facilitating machine learning model integration, model serving logic, and data ingestion workflows.",
        "Enhanced software stability and user experience by resolving bugs and refining features in applications that incorporated AI and data processing pipelines.",
        "Collaborated in Agile sprints, performing code reviews and applying SDLC best practices to ensure seamless integration of AI models and data pipelines.",
        "Optimized systems for batch processing and real-time triggers to support high-throughput AI services, aligning with efficient model training and edge computing requirements.",
        "Managed infrastructure provisioning using Terraform, automating scalable deployments and establishing environments for reliable AI model serving and inference."
      ]
    },
    {
      "title": "Software Developer",
      "company": "Verzo Private. Lmt",
      "dates": "Jun 2021 - Aug 2021",
      "location": "Bengaluru, India",
      "description": [
        "Developed full-stack web applications during internship projects, leveraging front-end and back-end technologies (HTML, CSS, AngularJS, Java Servlets, JavaScript, PHP) and SQL to build responsive, data-centric solutions. Worked remotely on parking information and fully developed the Event Management Web Application for the University.",
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
        "Gained strong skills in full-stack web development, blockchain integration, and smart contract deployment, reinforcing expertise in secure, decentralized application design"
      ]
    }
  ],
  "skills": {
    "Programming": ["Java", "Springboot", "C++", "Solidity", "Python", "R", "SQL", "Java Servlets", "NodeJS", "AngularJS", "TensorFlow", "PyTorch"],
    "Tools": ["Control Version (Git)", "CI/CD (CircleCI & Cloud (Azure & AWS))", "Docker", "JUnit", "Azure AI Foundry", "Amazon Kinesis"],
    "Relevant Courses": ["Full-stack Development", "Machine Learning", "Deep Learning", "Computer Vision", "Probability And Statistics", "Data Structures & Algorithms", "Database Management System", "MLOps", "LLMs", "Natural Language Processing"]
  },
  "certifications": [
    "Programming in Java (NPTEL)",
    "JavaScript (Udemy)",
    "Web Development Internship(Verzeo)",
    "Database Management System from NPTEL (NPTEL)",
    "Master's in Web Development (Udemy)",
    "Social Network Analysis (NPTEL)"
  ]
}
"""

if __name__ == "__main__":
    generator = ResumeGenerator()
    generator.generate_pdf(updated_resume_json, "Harish_Jamallamudi_AI_Engineer_Resume.pdf")
