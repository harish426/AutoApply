import requests
import os

def download_document_from_api(api_url, save_filename):
    """
    Downloads a document from a Node.js API endpoint and saves it locally.
    """
    response = requests.get(api_url, stream=True)

    if response.status_code == 200:
        file_path = os.path.join(os.getcwd(), save_filename)
        with open(file_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"✅ File saved to: {file_path}")
    else:
        print(f"❌ Error: {response.status_code} - {response.text}")

# Example usage
api_url = "http://localhost:3000/download/test1@gamil.com"
download_document_from_api(api_url, "Resume.pdf")
