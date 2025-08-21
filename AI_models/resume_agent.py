"""resume_agent.py which uses Azure AI to analyze resumes and update them based on job requirements and descriptions.
which is key in updating and send the json resume to the agent for updating. and send the result to resume_pdf.py to create a PDF resume. in well formatted template"""

import json
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential
from resume_pdf import ResumeBuilder  # Assuming this is the function to create PDF resumes
import os
import dotenv
dotenv.load_dotenv()

class ResumeAIUpdater:
    def __init__(self, connection_string=os.environ.get("Updating_Connection_String"), agent_id=os.environ.get("Updating_Agent_ID")):
        """
        Initializes the ResumeAIUpdater with Azure AI Project Client.

        Args:
            connection_string (str): The connection string for the AI Project Client.
            agent_id (str): The ID of the AI agent to use for resume updates.
        """
        self.project_client = AIProjectClient.from_connection_string(
            credential=DefaultAzureCredential(),
            conn_str=connection_string
        )
        self.agent_id = agent_id
        self.agent = self.project_client.agents.get_agent(self.agent_id)


    def update_process_email_content(self, body):
      """
      Sends the provided message body to the Azure AI agent and instructs it to classify the message:
      - Return 1 if it is a job application reply which is qualifying or moving forward.
      - Return 0 if it is a rejecting mail.
      - Return 2 if it is not a job application reply or just an applied message.

      Args:
        body (str): The message body to be classified.

      Returns:
        int: 1 for qualifying/moving forward, 0 for rejection, 2 for not a job application reply/applied message.
      """
      thread = self.project_client.agents.create_thread()
      message = self.project_client.agents.create_message(
        thread_id=thread.id,
        role="user",
        content=(
          "Classify the following message body. "
          "Return ONLY a single integer value: "
          "1 if this is a job application reply which is qualifying or moving forward, "
          "0 if it is a rejecting mail, "
          "2 if it is not a job application reply or just an applied message. "
          "Do not return any explanation or text, only the integer.\n\n"
          f"{body}"
        )
      )

      run = self.project_client.agents.create_and_process_run(
        thread_id=thread.id,
        agent_id=self.agent.id
      )

      messages_list_response = self.project_client.agents.list_messages(thread_id=thread.id)
      result = None
      if messages_list_response.data:
        for message_obj in messages_list_response.data:
          message_role = getattr(message_obj, 'role', 'unknown_role_from_message_obj')
          message_content = ""
          if hasattr(message_obj, 'content') and message_obj.content:
            for content_part in message_obj.content:
              if getattr(content_part, 'type', None) == 'text':
                text_value_dict = getattr(content_part, 'text', {})
                message_content = getattr(text_value_dict, 'value', '')
                break
          if message_role == 'assistant':
            try:
              result = int(message_content.strip())
            except Exception as e:
              print(f"Error parsing agent response: {e}")
              print("Agent's raw response content:")
              print(message_content)
      return result

    def get_resume_match_score_with_ai(self, job_requirements_json, job_description_json, resume_json, instruction):
      """
      Evaluates how well the resume matches the job requirements and description using an Azure AI agent.

      Args:
          job_requirements_json (str): JSON string of job requirements (list of strings).
          job_description_json (str): JSON string of the job description (string).
          resume_json (str): JSON string of the original resume data.
          instruction (str): Instruction to the AI agent describing what output to return.

      Returns:
          dict: {
              "match_percentage": float,
              "matched_skills": list of strings
          }
          or None if an error occurs.
      """
      try:
          job_requirements = json.loads(job_requirements_json)
          job_description = json.loads(job_description_json)
          resume = json.loads(resume_json)
      except json.JSONDecodeError as e:
          print(f"Error decoding input JSON: {e}")
          return None

      input_data = {
          "job_requirements": job_requirements,
          "job_description": job_description,
          "resume": resume
      }

      json_input_content = json.dumps(input_data, indent=2)

      # Create a new agent thread
      thread = self.project_client.agents.create_thread()

      # Send message with the given instruction and data
      message = self.project_client.agents.create_message(
          thread_id=thread.id,
          role="user",
          content=(
              instruction +
              f"{json_input_content}"
          )
      )

      print("Sending message to agent and processing run...")
      run = self.project_client.agents.create_and_process_run(
          thread_id=thread.id,
          agent_id=self.agent.id
      )
      print("Run completed. Retrieving messages...")

      # Retrieve messages from the agent
      messages_list_response = self.project_client.agents.list_messages(thread_id=thread.id)
      
      match_result = None
      if not messages_list_response.data:
          print("No messages found in the thread after run completion.")
      else:
          for message_obj in messages_list_response.data:
              message_role = getattr(message_obj, 'role', 'unknown_role_from_message_obj')
              message_content = ""
              if hasattr(message_obj, 'content') and message_obj.content:
                  for content_part in message_obj.content:
                      if getattr(content_part, 'type', None) == 'text':
                          text_value_dict = getattr(content_part, 'text', {})
                          message_content = getattr(text_value_dict, 'value', '')
                          break
              if message_role == 'assistant':
                  try:
                      parsed_response = json.loads(message_content)
                      match_result = {
                          "match_percentage": parsed_response.get('match_percentage', 0.0),
                          "matched_skills": parsed_response.get('matched_skills', [])
                      }
                  except json.JSONDecodeError as e:
                      print(f"\nError decoding JSON from agent's response: {e}")
                      print("Agent's raw response content:")
                      print(message_content)
                  except Exception as e:
                      print(f"\nAn unexpected error occurred while processing assistant message: {e}")
                      print("Agent's raw response content:")
                      print(message_content)

      return match_result




    def update_resume_with_ai(self, job_requirements_json, job_description_json, resume_json, instruction):
      """
      Updates the resume JSON by incorporating relevant keywords from job requirements and description
      using an Azure AI agent.

      Args:
          job_requirements_json (str): JSON string of job requirements (list of strings).
          job_description_json (str): JSON string of the job description (string).
          resume_json (str): JSON string of the original resume data.

      Returns:
          dict: The updated resume data as a Python dictionary, or None if an error occurs.
      """
      try:
          job_requirements = json.loads(job_requirements_json)
          job_description = json.loads(job_description_json)
          resume = json.loads(resume_json)
      except json.JSONDecodeError as e:
          print(f"Error decoding input JSON: {e}")
          return None

      input_data = {
          "job_requirements": job_requirements,
          "job_description": job_description,
          "resume": resume
      }

      json_input_content = json.dumps(input_data, indent=2)

      # create thread & send message
      thread = self.project_client.agents.create_thread()
      self.project_client.agents.create_message(
          thread_id=thread.id,
          role="user",
          content=instruction + f"{json_input_content}"
      )

      print("Sending message to agent and processing run...")
      run = self.project_client.agents.create_and_process_run(
          thread_id=thread.id,
          agent_id=self.agent.id
      )
      print("Run completed. Retrieving messages...")

      messages_list_response = self.project_client.agents.list_messages(thread_id=thread.id)
      updated_resume = None
      if not messages_list_response.data:
          print("No messages found in the thread after run completion.")
      for message_list in messages_list_response.data:
          # Only process assistant messages
          if getattr(message_list, "role", None) == "assistant":
              for content_part in getattr(message_list, "content", []):
                  if getattr(content_part, "type", None) == "text":
                      text_value_dict = getattr(content_part, "text", {})
                      message_content = getattr(text_value_dict, "value", "")

                      try:
                          updated_resume = json.loads(message_content)
                      except json.JSONDecodeError as e:
                          print(f"Error decoding JSON from agent's response: {e}")
                          print("Agent's raw response content:")
                          print(message_content)
                      except Exception as e:
                          print(f"An unexpected error occurred while processing assistant message: {e}")
                          print("Agent's raw response content:")
                          print(message_content)
            
      
      if updated_resume is None:
         raise ValueError("No valid updated resume data received from the AI agent.")
      else:
          print("Updated resume received from AI agent:")
          # print(updated_resume)   
          return updated_resume

    

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

    # Example usage of the ResumeAIUpdater class
    # Replace with your actual connection string and agent ID
    connection_string = os.environ.get("Updating_Connection_String")
    agent_id = os.environ.get("Updating_Agent_ID")

    resume_updater = ResumeAIUpdater(connection_string, agent_id)

    # Define your job requirements, job description, and resume as JSON strings
    job_requirements_str = json.dumps([
        "Strong Python skills",
        "Experience with cloud platforms (Azure preferred), and ETL design",
        "Knowledge of machine learning concepts",
        "Excellent communication skills",
        "Familiarity with data analysis tools"
    ])

    job_description_str = json.dumps(
        "We are seeking a highly motivated and skilled Python Developer with "
        "proven expertise in Azure cloud services and machine learning. "
        "The ideal candidate will contribute to the development of scalable "
        "applications, analyze data, and possess excellent communication skills. "
        "Experience with data analysis tools is a plus."
    )

    # Use the existing json_data for the resume
    original_resume_str = json_data
    instruction = "Given the following job requirements, job description, and my resume in JSON format,please update the 'resume' section by incorporating relevant keywords from the 'job_description' and 'job_requirements' into the 'summary', 'projects description' and 'skills' sections. Ensure the updated resume is returned ONLY as a valid JSON object. Do not include any explanations, Markdown formatting, or code fences. The response must start with { and end with }\n\n"
    # instruction = "Match the job requirments and description with key words. return percentage of match that profile and job, and also return skills required for the job which are not present in resume i.e keywords. Just return percentage and skills in JSON format. Do not include any additional text or formatting outside the JSON.\n\n"
    updated_resume_data = resume_updater.update_resume_with_ai(
        job_requirements_str,
        job_description_str,
        original_resume_str,
        instruction
    )

    # if updated_resume_data:
    #     print("\n--- Final Updated Resume Data ---")
    #     print(json.dumps(updated_resume_data, indent=2))
    #     # You can now use updated_resume_data to generate a new PDF if needed
    #     resume_builder = ResumeBuilder(json.dumps(updated_resume_data), "updated_resume.pdf")
    #     resume_builder.create_resume_pdf()
    #     rsbuilder=ResumeBuilder(json.dumps(updated_resume_data), "updated_resume.pdf")
    #     rsbuilder.create_resume_pdf()
    # else:
    #     print("Failed to get an updated resume.")

    
