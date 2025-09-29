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


Agents=AgentConnector()


@api_view(['POST']) 
def UpdateResume(request):
    """
    A view that receives user name, company name, job description, and job requirements.
    """
    if request.method == 'POST':
        # Safely get the data variables from the request body
        user_email = request.data.get('user_email')
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
        print(f"Received data for user: {user_email}")
        print(f"User name: {user_name}")
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


            json_resume=DatabaseAPI(user_email).fetch_resume()
            json_resume="""
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
            json_data=Agents.parse_resume(json.loads(json_resume))
            print("resume parsed successfully",json_data)
            Updated_resume_json=Agents.update_resume(json_data, job_description_json, job_requirements_json)
            # print("resume parsed successfully",Updated_resume_json)
            buffer = io.BytesIO()
            print("resume updated successfully",Updated_resume_json)
            if Updated_resume_json:
                print("resume updated successfully")

                resume_pdf_buffer=Agents.build_pdf_resume(json.loads(Updated_resume_json))#sending json data which already changed to json using json.loads
                if resume_pdf_buffer:
                    print(f"PDF '{user_name}.pdf' generated successfully.")
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
        user_email=request.data.get('user_email')
        print(user_email)
        question=request.data.get('question')
        print(question)
        answer = Agents.chat_with_ai( question)
        print("answer from chat bot",answer)
        return JsonResponse({"success": "got data", "answer": answer})
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


