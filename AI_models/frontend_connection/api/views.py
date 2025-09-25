from django.shortcuts import render
import json
import io
from django.http import JsonResponse, HttpResponse
# Create your views here.
# myapp/views.py
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from api.database import DatabaseAPI
from api.agent_connect import AgentConnector



@api_view(['POST']) 
def UpdateResume(request):
    """
    A view that receives user name, company name, job description, and job requirements.
    """
    if request.method == 'POST':
        # Safely get the data variables from the request body
        user_name = request.data.get('user_name')
        company_name = request.data.get('company_name')
        job_title = request.data.get('job_title')
        job_description = request.data.get('job_description')
        job_requirements = request.data.get('job_requirements')



        # Check if the required data is present
        if not all([company_name, job_title, job_description, job_requirements]):
            return Response(
                {"error": "Missing one or more required fields: company_name, job_description, or job_requirements."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Log the received data for debugging purposes
        print(f"Received data for company: {company_name}")
        print(f"Job Description: {job_description}")
        print(f"Job Requirements: {job_requirements}")
        print(f"Job Title: {job_title}")

        try:
            response_message="return updated resume"
            company_name_json=json.dumps(company_name)
            job_title_json=json.dumps(job_title)
            job_description_json=json.dumps(job_description)
            job_requirements_json=json.dumps(job_requirements)


            Agents=AgentConnector()
            json_resume=DatabaseAPI("test1@gmail.com").fetch_resume()
            json_data=Agents.parse_resume(json_resume)
            print("resume parsed successfully",json_data)
            Updated_resume_json=Agents.update_resume(json_data, job_description_json, job_requirements_json)
            buffer = io.BytesIO()
         
            if Updated_resume_json:
                print("resume updated successfully")

                resume_pdf_buffer=Agents.build_pdf_resume(user_name, job_title, Updated_resume_json)
                if resume_pdf_buffer:
                    print(f"PDF '{user_name}_{job_title}.pdf' generated successfully.")
                    response = HttpResponse(resume_pdf_buffer, content_type="application/pdf")
                    response['Content-Disposition'] = f'attachment; filename="{user_name}_{job_title}.pdf"'
                    return response
                else:
                    print("failed to create resume")
                    return Response({"error": "Failed to create resume PDF."}, status=status.HTTP_400_BAD_REQUEST)
            else:
                print("failed to update resume")
                return Response({"error": "Failed to update resume."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Exception occurred: {str(e)}")
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # This handles requests that are not POST
    return Response(
        {"error": "This endpoint only accepts POST requests."},
        status=status.HTTP_405_METHOD_NOT_ALLOWED
    )



@api_view(['POST'])
def chatbot(request):
    if request.method == 'POST':
        question=request.data.get('question')
        print(question)
        return JsonResponse({"sucess":"got data"})
    else:
        return JsonResponse({"error": "This endpoint only accepts POST requests."}, status=405)

@api_view(['POST'])
def external_resume_update(request):
    if request.method == 'POST':
        company_name = request.data.get('company_name')
        job_title = request.data.get('job_title')
        job_description = request.data.get('job_description')
        job_requirements = request.data.get('job_requirements')
        question = request.data.get('question')
        return JsonResponse({"sucess":"good"})
    
    else:
        return JsonResponse({"error": "This endpoint only accepts POST requests."}, status=405)

 
@api_view(['POST'])
def document_uploaded(request):
    """
    A view that handles file uploads (e.g., resumes).
    """
    if request.method == "POST" and request.FILES.get("resume"):
        uploaded_file = request.FILES["resume"]

        # Save into buffer (not disk)
        buffer = io.BytesIO(uploaded_file.read())

        # Optionally: process buffer (e.g. extract text, forward to AI, etc.)
        # Example: save it temporarily if needed
        # with open("resume.pdf", "wb") as f:
        #     f.write(buffer.getvalue())
        # read_resume = ResumeUnderstander()
        # read_resume.understand_resume(buffer)
        if buffer:
            # read_resume = ResumeUnderstander()
            # read_resume.understand_resume(buffer)
            print("file received successfully")

        return JsonResponse({"message": "Resume received successfully!"})
    return JsonResponse({"error": "No file uploaded"}, status=400)


