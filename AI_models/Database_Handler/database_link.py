import requests
import os
import io
import json
class database:
    def __init__(self,email_id):
        self.email_id=email_id
    def download_document_from_api(self):
        """
        Downloads a document from a Node.js API endpoint and stores it in memory (buffer).
        """
        response = requests.get("http://localhost:3000/download/test1@gamil.com", stream=True)

        if response.status_code == 200:
            buffer = io.BytesIO()
            buffer.seek(0)
            for chunk in response.iter_content(chunk_size=8192):
                buffer.write(chunk)
            buffer.seek(0)  # rewind pointer to start
            print("✅ PDF loaded into memory buffer")
            return buffer   # <-- send this to other file
        else:
            raise Exception(f"❌ Error: {response.status_code} - {response.text}")



    def get_user_data(self):
        """
        Fetches user resume data in JSON format from a Node.js API endpoint.
        """
        response = requests.get(f"http://localhost:3000/getUserData/{self.email_id}")

        if response.status_code == 200:
            return response.json()
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
            return None


    def send_matched_applications_resume(self, unique_id, json_data):
        """
        Sends user resume data in JSON format to a Node.js API endpoint.
        """
        response = requests.post(f"http://localhost:3000/sendMatchedApplicationsResume/{unique_id}", json=json_data)

        if response.status_code == 200:
            return response.json()
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
            return None


    