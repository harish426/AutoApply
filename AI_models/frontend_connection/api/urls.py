# myapp/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('updateResume/', views.UpdateResume, name='update_resume'),
    path('documentUpload/', views.document_uploaded, name='document_uploaded'),
   
]