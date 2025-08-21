# myapp/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('updateResume/', views.UpdateResume, name='update_resume'),
]