import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))
from AI_models.resume_agent import ResumeAIUpdater
from AI_models.resume_pdf import ResumeGenerator  # Assuming this is the function to create PDF resumes
from AI_models.resume_understander import ResumeUnderstander
from AI_models.resume_Parser import ResumeAIParser
class AgentConnector:
    def __init__(self):
        self.resume_updater = ResumeAIUpdater()
        self.resume_generator = ResumeGenerator()
        self.resume_understander = ResumeUnderstander()
        self.resume_parser = ResumeAIParser()


    def parse_resume(self, resume_text):
        # Call the resume parser to parse the resume text, takes rawtext resume and returns ordered and structured json resume
        print('parse data is running')
        return self.resume_parser.parse_resume_with_ai(resume_text)
    

    def understand_resume(self, resume_text):
        # Call the resume understander to extract key information from the doc and return it as structured resume
        return self.resume_understander.understand_resume(resume_text)
    
    def update_resume(self, resume_json, job_requirements_json, job_description_json):
        # Call the resume updater to update the resume based on job requirements and description
        return self.resume_updater.update_resume_with_ai(resume_json, job_requirements_json, job_description_json)

    def build_pdf_resume(self, resume_json):
        # Call the resume generator to create a PDF resume from structured JSON data
        return self.resume_generator.create_pdf(resume_json)
    
    def chat_with_ai(self, question):
        # Placeholder for chat functionality
        return self.resume_updater.answer_question(question)