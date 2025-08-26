import requests
import os
import json
class database:
    def __init__(self,user, endpoint):
        self.user_name=user
        self.endpoint=endpoint
    def download_document_from_api(self, save_filename):
        """
        Downloads a document from a Node.js API endpoint and saves it locally.
        """
        response = requests.get(self.endpoint, stream=True)

        if response.status_code == 200:
            file_path = os.path.join(os.getcwd(), save_filename)
            with open(file_path, "wb") as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            print(f"✅ File saved to: {file_path}")
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")



    def get_user_resume_json(self,endpoint):
        """
        Fetches user resume data in JSON format from a Node.js API endpoint.
        """
        response = requests.get(endpoint)

        if response.status_code == 200:
            return response.json()
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
            return None
    

    def json_resume(self,user_name):
        """
        Fetches user resume data in JSON format from a Node.js API endpoint.
        """
        response = requests.get("endpoint")

        if response.status_code == 200:
            return response.json()
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
            return None

   
   
# Example usage
db = database("username", "http://localhost:3000/api/download")
db.download_document_from_api("Resume.pdf")