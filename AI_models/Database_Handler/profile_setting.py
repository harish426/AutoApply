from pymongo import MongoClient

class ProfileDatabaseHandler:


    def get_resume_by_name(self, resume_name):
        """
        Fetches the document (resume) from MongoDB by its name.

        Args:
            resume_name (str): The name of the resume/document to search for.

        Returns:
            dict or None: The resume record as a dictionary if found, else None.
        """
        result = self.resumes.find_one({'name': resume_name})
        return result
