import json
import re
import os
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential
from resume_pdf import ResumeBuilder  # Assuming this is the function to create PDF resumes
import dotenv

dotenv.load_dotenv()

class ResumeAIParser:
    def __init__(self, connection_string=os.environ.get("Parser_Connection_String"), agent_id=os.environ.get("Parser_Agent_ID")):
        """
        Initializes the ResumeAIParser with Azure AI Project Client.

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

    def parse_resume_with_ai(self, resume):
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
        input_data = {
            "resume": resume
        }

        json_input_content = json.dumps(input_data, indent=2)

        thread = self.project_client.agents.create_thread()
        message = self.project_client.agents.create_message(
            thread_id=thread.id,
            role="user",
            content=(
                "Just follow instruction mentioned and don't add any '```json' or '```' in the response.\n"
                f"{json_input_content}"
            )
        )

        print("Sending message to agent and processing run...")
        run = self.project_client.agents.create_and_process_run(
            thread_id=thread.id,
            agent_id=self.agent.id
        )
        print("Run completed. Retrieving messages...")

        messages_list_response = self.project_client.agents.list_messages(thread_id=thread.id)
        print(messages_list_response.data)
        updated_resume = None
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
                    
                    return message_content






    
