from django.shortcuts import render

# Create your views here.
# myapp/views.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from AI_models.resume_agent import ResumeAIUpdater

@api_view(['POST']) 
def UpdateResume(request):
    """
    A view that receives company name, job description, and job requirements.
    """
    if request.method == 'POST':
        # Safely get the data variables from the request body
        company_name = request.data.get('company_name')
        job_description = request.data.get('job_description')
        job_requirements = request.data.get('job_requirements')

        # Check if the required data is present
        if not all([company_name, job_description, job_requirements]):
            return Response(
                {"error": "Missing one or more required fields: company_name, job_description, or job_requirements."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Log the received data for debugging purposes
        print(f"Received data for company: {company_name}")
        print(f"Job Description: {job_description}")
        print(f"Job Requirements: {job_requirements}")

        # You can now process this data. For now, we'll just return a confirmation.
        response_message = {
            "status": "success",
            "message": "Data received and processed successfully.",
            "data_received": {
                "company_name": company_name,
                "job_description": job_description,
                "job_requirements": job_requirements
            }
        }
    
        # Return the processed data as a JSON response
        return Response(response_message, status=status.HTTP_200_OK)

    # This handles requests that are not POST
    return Response(
        {"error": "This endpoint only accepts POST requests."},
        status=status.HTTP_405_METHOD_NOT_ALLOWED
    )

@api_view(['POST'])
def job_match_data(request):
    if request.method == 'POST':
        pass

@api_view(['POST'])
def document_uploaded(request):
    """
    A view that receives a document for analysis.
    """
    if request.method == 'POST':
        # Safely get the document from the request body
        document = request.data.get("status")

        # Check if the document is present
        if not status:
            return Response(
                {"error": "Missing required field: status."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Log the received document for debugging purposes
        print(f"Received document for analysis.")

        # You can now process this document. For now, we'll just return a confirmation.
        response_message = {
            "status": "success",
            "message": "Document received and processed successfully."
        }

        # Return the processed data as a JSON response
        return Response(response_message, status=status.HTTP_200_OK)

    # This handles requests that are not POST
    return Response(
        {"error": "This endpoint only accepts POST requests."},
        status=status.HTTP_405_METHOD_NOT_ALLOWED
    )
