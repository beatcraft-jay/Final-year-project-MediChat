from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register('doctors', DoctorViewSet, basename='doctors')
router.register('patients', PatientViewSet, basename='patients')
router.register('consultations', ConsultationViewSet, basename='consultations')
router.register('status', StatusViewSet, basename='status')

urlpatterns = [
    path('', include(router.urls)),
    path('users/me/', CurrentUserView.as_view(), name='current-user'),
    path('signup/patient/', PatientSignUpView.as_view(), name='patientsignup'),
    path('signup/doctor/', DoctorSignUpView.as_view(), name='doctorsignup'),
    path('login/', CustomAuthToken.as_view(), name='login'),
    path('logout/', logout, name='logout'),
    path('patient/app/', PatientsOnlyView.as_view(), name='patientAPP'),
    path('doctor/app/', DoctorsOnlyView.as_view(), name='doctorAPP'),
    path('consultations/<int:consultation_id>/messages/', ChatMessageList.as_view(), name='chat-messages'),
]