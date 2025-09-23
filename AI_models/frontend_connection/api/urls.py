# myapp/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('updateResume/', views.UpdateResume, name='update_resume'),
    path('documentUpload/', views.document_uploaded, name='document_uploaded'),
    path('external_resume/', views.external_resume_update, name='resume_update_for_externaljob'),
    path('chat_bot/', views.chatbot, name='chat_bot')
]