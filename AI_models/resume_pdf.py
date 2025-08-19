"""resume_pdf.py is a module that generates a PDF resume from JSON data. generated from resume_agent.py."""

import json
from annotated_types import doc
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.enums import TA_RIGHT 
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.shapes import Line


class ResumeBuilder:
    def __init__(self, json_data_str, output_filename="resume.pdf"):
        """
        Initializes the ResumeBuilder with JSON data and output filename.

        Args:
            json_data_str (str): A JSON string containing the resume data.
            output_filename (str): The name of the output PDF file.
        """
        self.json_data_str = json_data_str
        self.output_filename = output_filename


    def create_resume_pdf(self):
        """
        Generates a PDF resume from JSON data, formatted to resemble the provided sample.

        Args:
            json_data_str (str): A JSON string containing the resume data.
            output_filename (str): The name of the output PDF file.
        """
        # Parse the JSON data
        data = json.loads(self.json_data_str)

        doc = SimpleDocTemplate(self.output_filename, pagesize=letter,
                                rightMargin=0.4*inch, leftMargin=0.4*inch,
                                topMargin=0.4*inch, bottomMargin=0.4*inch)
        styles = getSampleStyleSheet()
        story = []

        # --- Define Custom Styles ---
        # Name style
        styles.add(ParagraphStyle(name='NameStyle',
                                fontName='Helvetica-Bold',
                                fontSize=24,
                                leading=28,
                                alignment=0, # Align left side
                                spaceAfter=0))

        # Title style
        styles.add(ParagraphStyle(name='TitleStyle',
                                fontName='Helvetica',
                                fontSize=14,
                                leading=16,
                                alignment=0, # Align left side
                                spaceAfter=0.0 * inch))

        # Section Heading Style (e.g., SUMMARY, EDUCATION)
        styles.add(ParagraphStyle(name='SectionHeading',
                                fontName='Helvetica-Bold',
                                fontSize=12,
                                leading=14,
                                spaceBefore=0.2 * inch,
                                spaceAfter=0 * inch,
                                textColor=colors.HexColor('#333333'))) # Dark grey

        # Sub-heading style (e.g., Degree, Company Name)
        styles.add(ParagraphStyle(name='SubHeading',
                                fontName='Helvetica-Bold',
                                fontSize=10,
                                leading=12,
                                spaceAfter=0))

        # Normal text style
        styles.add(ParagraphStyle(name='NormalText',
                                fontName='Helvetica',
                                fontSize=9,
                                leading=11,
                                spaceAfter=0))

        # Bullet point style
        styles.add(ParagraphStyle(name='BulletPoint',
                                fontName='Helvetica',
                                fontSize=9,
                                leading=11,
                                leftIndent=0.6 * inch,
                                firstLineIndent=-0.2 * inch,
                                spaceAfter=0.0 * inch))

        # Link style
        styles.add(ParagraphStyle(name='LinkStyle',
                                fontName='Helvetica',
                                fontSize=9,
                                textColor=colors.blue,
                                alignment=2, # Left alignment
                                spaceAfter=0))
        styles.add(ParagraphStyle(name='rightAlign',
                                fontName='Helvetica-Bold',
                                fontSize=9,
                                leading=11,
                                textColor=colors.black,
                                alignment=TA_RIGHT, # Right alignment
                                spaceAfter=0))
        # --- Header Section: Name, Title, Contact Info ---
        header_data = [
            [Paragraph(data['name'], styles['NameStyle']), Paragraph(f"Email: {data['contact']['email']}", styles['rightAlign'])],
            [Paragraph(data['title'], styles['TitleStyle']), Paragraph(f"Phone: {data['contact']['phone']}", styles['rightAlign'])],
            [Spacer(1, 0.0 * inch), Paragraph(f"<link href='{data['contact']['linkedin']}'>LinkedIn</link>", styles['LinkStyle'])],
            [Spacer(1, 0.0 * inch), Paragraph(f"<link href='{data['contact']['github']}'>GitHub</link>", styles['LinkStyle'])]
        ]

        # Define column widths for the header table
        # Adjust these values as needed to control spacing between left and right sections
        header_table = Table(header_data, colWidths=[4.5*inch, 3.0*inch])
        header_table.setStyle(TableStyle([
            ('ALIGN', (0,0), (0,-1), 'LEFT'),      # Left column content aligned left
            ('ALIGN', (1,0), (1,-1), 'RIGHT'),     # Right column content aligned right
            ('VALIGN', (0,0), (-1,-1), 'TOP'),     # Align content to the top of cells
            ('BOTTOMPADDING', (0,0), (-1,-1), 0),  # Remove default bottom padding
            ('TOPPADDING', (0,0), (-1,-1), 0),     # Remove default top padding
            ('LEFTPADDING', (1,0), (1,-1), 0.1*inch), # Add slight left padding to right column
        ]))
        story.append(header_table)
        story.append(Spacer(1, 0.1 * inch))
        # contact_table = Table(contact_data, colWidths=[3.5*inch, 3.5*inch])
        # contact_table.setStyle(TableStyle([
        #     ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        #     ('VALIGN', (0,0), (-1,-1), 'TOP'),
        #     ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        #     ('TOPPADDING', (0,0), (-1,-1), 0),
        # ]))
        # story.append(contact_table)
        # story.append(Spacer(1, 0.0 * inch)) # Small space after header

        # --- Summary Section ---
        story.append(Paragraph("SUMMARY", styles['SectionHeading']))
        line_drawing = Drawing(doc.width, 1) # Width of the line, height of the drawing container
        line_drawing.add(Line(0, 0, doc.width, 0)) # Draw a line from (x1, y1) to (x2, y2) within the drawing
        story.append(line_drawing)# Horizontal line
        story.append(Paragraph(data['summary'], styles['NormalText']))
        story.append(Spacer(1, 0.0 * inch))

        # --- Education Section ---
        story.append(Paragraph("EDUCATION", styles['SectionHeading']))
        line_drawing = Drawing(doc.width, 1) # Width of the line, height of the drawing container
        line_drawing.add(Line(0, 0, doc.width, 0)) # Draw a line from (x1, y1) to (x2, y2) within the drawing
        story.append(line_drawing)
        for edu in data['education']:
            story.append(Paragraph(f"<b>{edu['degree']}</b>", styles['SubHeading']))
            duration_data=[ [Paragraph(edu['institution'], styles['NormalText']),
                             Paragraph(edu['duration'], styles['rightAlign'])],
                              [Paragraph(f"GPA: {edu['gpa']}", styles['NormalText'])] ]
            duration_table = Table(duration_data, colWidths=[3.5*inch, 3.5*inch])
            duration_table.setStyle(TableStyle([
                ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                ('VALIGN', (0,0), (-1,-1), 'TOP'),
                ('BOTTOMPADDING', (0,0), (-1,-1), 0),
                ('TOPPADDING', (0,0), (-1,-1), 0),
            ]))
            story.append(duration_table)
            story.append(Spacer(1, 0.0 * inch))

        # --- Skills Section ---
        story.append(Paragraph("SKILLS", styles['SectionHeading']))
        line_drawing = Drawing(doc.width, 1) # Width of the line, height of the drawing container
        line_drawing.add(Line(0, 0, doc.width, 0)) # Draw a line from (x1, y1) to (x2, y2) within the drawing
        story.append(line_drawing)
        story.append(Paragraph(f"<b>Programming:</b> {', '.join(data['skills']['programming'])}", styles['NormalText']))
        story.append(Paragraph(f"<b>BI Tools:</b> {', '.join(data['skills']['bi_tools'])}", styles['NormalText']))
        story.append(Paragraph(f"<b>Relevant Courses:</b> {', '.join(data['skills']['relevant_courses'])}", styles['NormalText']))
        story.append(Spacer(1, 0.0 * inch))

        # --- Work Experience Section ---
        story.append(Paragraph("WORK EXPERIENCE", styles['SectionHeading']))
        line_drawing = Drawing(doc.width, 1) # Width of the line, height of the drawing container
        line_drawing.add(Line(0, 0, doc.width, 0)) # Draw a line from (x1, y1) to (x2, y2) within the drawing
        story.append(line_drawing)
        for exp in data['experience']:
            story.append(Paragraph(f"<b>{exp['company']}</b>, {exp['location']}", styles['SubHeading']))
            duration_data = [
                [Paragraph(exp['title'], styles['NormalText']),
                 Paragraph(exp['duration'], styles['rightAlign'])]
            ]
            duration_table = Table(duration_data, colWidths=[3.5*inch, 3.5*inch])
            duration_table.setStyle(TableStyle([
                ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                ('VALIGN', (0,0), (-1,-1), 'TOP'),
                ('BOTTOMPADDING', (0,0), (-1,-1), 0),
                ('TOPPADDING', (0,0), (-1,-1), 0),
            ]))
            story.append(duration_table)
            for resp in exp['responsibilities']:
                story.append(Paragraph(f"• {resp}", styles['BulletPoint']))
            story.append(Spacer(1, 0.0 * inch))

        # --- Projects Section ---
        story.append(Paragraph("PROJECTS", styles['SectionHeading']))
        line_drawing = Drawing(doc.width, 1) # Width of the line, height of the drawing container
        line_drawing.add(Line(0, 0, doc.width, 0)) # Draw a line from (x1, y1) to (x2, y2) within the drawing
        story.append(line_drawing)
        for proj in data['projects']:
            story.append(Paragraph(f"<b>{proj['title']}:</b>", styles['SubHeading']))
            story.append(Paragraph(proj['description'], styles['NormalText']))
            story.append(Spacer(1, 0.1 * inch))

        # --- Certifications Section ---
        story.append(Paragraph(f"<b>CERTIFICATIONS:</b> {', '.join(data['certifications'])}", styles['NormalText']))
        # story.append(Paragraph("CERTIFICATIONS", styles['SectionHeading']))
        # for cert in data['certifications']:
        #     story.append(Paragraph(f"{cert},", styles['BulletPoint']))
        # story.append(Spacer(1, 0.1 * inch))


        # Build the PDF
        try:
            doc.build(story)
            print(f"Resume PDF '{self.output_filename}' created successfully!")
        except Exception as e:
            print(f"Error building PDF: {e}")

# Your provided JSON data
json_data = """
{
    "name": "Chaitanya Kaul",
    "title": "Associate Analyst - Network Operations",
    "contact": {
      "email": "xyz@yahoo.com",
      "phone": "99999999",
      "linkedin": "https://www.linkedin.com/in/chaitanya-kaul/",
      "github": "https://github.com/Chaitanyakaul97"
    },
    "summary": "Working as an Associate Analyst with over 6 months of experience in analyzing data with SQL, Python, Tableau/Spotfire and Excel. Proficient knowledge in Statistics, Mathematics and other Analytics tools and technologies.",
    "education": [
      {
        "degree": "MTech in Data Science",
        "institution": "Amity School of Engineering and Technology (ASET), Amity University, Gurugram",
        "duration": "July 2019 - May 2021",
        "gpa": "9.26/10"
      },
      {
        "degree": "B.E. in Information Technology",
        "institution": "University Institute of Engineering and Technology (UIET), Panjab University, Chandigarh",
        "duration": "July 2015 - May 2019",
        "gpa": "6.91/10"
      }
    ],
    "skills": {
      "programming": ["Python", "R", "SQL", "MySQL", "Hive", "TensorFlow"],
      "bi_tools": ["Tableau", "Power BI", "MS-Excel"],
      "relevant_courses": [
        "Machine Learning",
        "Natural Language Processing",
        "Probability and Statistics",
        "Data Analytics and Data Mining",
        "Data Structures",
        "Database Management System",
        "Big Data Technologies"
      ]
    },
    "experience": [
      {
        "company": "United Airlines Business Services Pvt. Ltd.",
        "location": "Gurugram, HR",
        "title": "Associate Analyst",
        "duration": "Apr 2021 - Present",
        "responsibilities": [
          "Worked on project 'Miss Connect Rates' to reduce missed connections by 2%.",
          "Executed SQL queries using Teradata and Microsoft SQL Server.",
          "Analyzed data and created reports using MS-Excel.",
          "Created visualizations using Tableau/Spotfire.",
          "Automated reports using Python scripting."
        ]
      },
      {
        "company": "Exposys Data Labs",
        "location": "Bengaluru, KR",
        "title": "Data Science Intern",
        "duration": "Sep 2020 - Oct 2020",
        "responsibilities": [
          "Worked on 'Customer Segmentation' project.",
          "Analyzed gender, age, income, and spending scores.",
          "Used K-means, Hierarchical, and DBSCAN clustering techniques."
        ]
      }
    ],
    "projects": [
      {
        "title": "Air Quality Index Prediction",
        "description": "Regression problem; web scraping, EDA, feature engineering and selection, model comparison. Random Forest Regressor achieved RMSE of 38.85. Deployed with Flask and Heroku."
      },
      {
        "title": "Cotton Plant Disease Prediction",
        "description": "Deep Learning classification using VGG19. Achieved 94.6% accuracy. Web app developed with Flask."
      },
      {
        "title": "Apple Stock Price Prediction and Forecasting",
        "description": "Used Tingo API and stacked LSTM RNN to forecast 30-day stock prices based on 100-day history. RMSE: 239.6."
      },
      {
        "title": "Fraud Transaction Classification",
        "description": "Classification of fraudulent transactions. Used feature engineering, data balancing, and model comparison. Random Forest achieved 94% accuracy."
      }
    ],
    "certifications": [
      "Data Analysis with Python (IBM, Coursera)",
      "SQL for Data Science (IBM, Coursera)",
      "Neural Networks & Deep Learning (deeplearning.ai, Coursera)",
      "Python for Data Science (IBM, Coursera)",
      "Fundamentals of Visualization with Tableau (UCDAVIS, Coursera)",
      "Microsoft Excel from Beginner to Advanced (Udemy)",
      "Machine Learning A-Z (Udemy)"
    ]
}
"""

if __name__ == "__main__":
    resume_builder = ResumeBuilder(json_data)
    resume_builder.create_resume_pdf()  # Default output filename is 'resume.pdf'
