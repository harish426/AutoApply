from Database_Handler.database_link import database

class DatabaseAPI:
    def __init__(self, email):
        self.db = database(email)

    def fetch_resume(self):
        return self.db.get_resume()

    def fetch_document(self):
        return self.db.download_document_from_api()

    def upload_matched_applications(self, unique_id, json_data):
        return self.db.send_matched_applications_resume(unique_id, json_data)