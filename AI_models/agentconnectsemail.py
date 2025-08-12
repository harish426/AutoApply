import os
import base64
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
import pickle

class GmailReader:
    def __init__(self, creds_path, token_path='../token.pickle', scopes=None):
        self._creds_path = creds_path
        self._token_path = token_path
        self._scopes = scopes or ['https://www.googleapis.com/auth/gmail.modify']
        self._creds = None
        self._service = None
        self._authenticate()

    def _authenticate(self):
        if os.path.exists(self._token_path):
            with open(self._token_path, 'rb') as token:
                self._creds = pickle.load(token)
        if not self._creds or not self._creds.valid:
            if self._creds and self._creds.expired and self._creds.refresh_token:
                self._creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(self._creds_path, self._scopes)
                self._creds = flow.run_local_server(port=0)
            with open(self._token_path, 'wb') as token:
                pickle.dump(self._creds, token)
        self._service = build('gmail', 'v1', credentials=self._creds)

    def read_latest_email(self):
        results = self._service.users().messages().list(userId='me', maxResults=1).execute()
        messages = results.get('messages', [])
        
        if not messages:
            print('No emails found in your inbox.')
            return None
        msg_id = messages[0]['id']
        msg = self._service.users().messages().get(userId='me', id=msg_id, format='full').execute()
        payload = msg['payload']
        headers = payload.get('headers', [])

        # Extract fields
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '(No Subject)')
        email_from = next((h['value'] for h in headers if h['name'] == 'From'), '(No From)')
        parts = payload.get('parts', [])
        body = ''
        if parts:
            for part in parts:
                if part['mimeType'] == 'text/plain':
                    data = part['body']['data']
                    body = base64.urlsafe_b64decode(data).decode()
                    break
        else:
            data = payload['body'].get('data')
            if data:
                body = base64.urlsafe_b64decode(data).decode()

        # print(f"Email From: {email_from}\nEmail ID: {msg_id}\nSubject: {subject}\nBody:\n{body}")
        return email_from, msg_id, subject, body
    
    
    def delete_email_by_id(self, email_id):
        """
        Deletes an email from your Gmail account using its unique ID.

        Args:
            email_id (str): The unique ID of the email to delete.

        Returns:
            dict: The response from the Gmail API after deletion.
        """
        result = self._service.users().messages().trash(userId='me', id=email_id).execute()
        print(f"Email with ID {email_id} deleted.")
        return
    
    def star_email_by_id(self, email_id):
        """
        Stars (adds the 'STARRED' label to) an email using its unique ID.

        Args:
            email_id (str): The unique ID of the email to star.

        Returns:
            dict: The response from the Gmail API after modifying the labels.
        """
        result = self._service.users().messages().modify(
            userId='me',
            id=email_id,
            body={'addLabelIds': ['STARRED']}
        ).execute()
        print(f"Email with ID {email_id} starred.")
        return result
    


    def send_whatsapp_message(self,account_sid, auth_token, from_whatsapp, to_whatsapp, message):
        client = Client(account_sid, auth_token)
        message = client.messages.create(
            body=message,
            from_='whatsapp:' + from_whatsapp,
            to='whatsapp:' + to_whatsapp
        )
        print(f"WhatsApp message sent with SID: {message.sid}")

# Example usage:
# if __name__ == "__main__":
#     gmail_reader = GmailReader(creds_path='credentials2.json')
#     email_from, id, subject, body = gmail_reader.read_latest_email()
#     print(id)
#     # gmail_reader.delete_email_by_id(id)



from twilio.rest import Client
import os
from dotenv import load_dotenv

from resume_agent import ResumeAIUpdater
if __name__ == "__main__":
    # Initialize the ResumeAgent
    agent = ResumeAIUpdater()

    # Read the latest email
    gmail_reader = GmailReader(creds_path='../credentials.json')
    email_from, id, subject, body = gmail_reader.read_latest_email()

    # Process the email content
    if body:
        value = agent.update_process_email_content(body)

    # Optionally delete the email after processing
    if value == 0:
        print(f"Processed email with ID: {id} and value: {value}")
        gmail_reader.star_email_by_id(id)  # Star the latest email
    elif value == 0:
        gmail_reader.delete_email_by_id(id)
    else:
        print(f"Email with ID: {id} was not processed, value: {value}")
        ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID")
        AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN")
        FROM_WHATSAPP = '+14155238886'
        TO_WHATSAPP = '+13145996836'

        gmail_reader.send_whatsapp_message(ACCOUNT_SID, AUTH_TOKEN, FROM_WHATSAPP, TO_WHATSAPP, body)
