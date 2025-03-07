from rest_framework.permissions import IsAuthenticated
from rest_framework import permissions
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import PermissionDenied
from .models import *
from .serializers import *
from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken, APIView
from .permissions import *
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework import status
from django.contrib.auth import logout
from .models import ChatMessage
from django.db.models import Q
from django.db.models import Prefetch
from rest_framework.decorators import api_view, permission_classes


class DoctorViewSet(ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    @action(detail=False, methods=['get', 'put'])
    def me(self, request):
        try:
            doctor = request.user.doctor
            if request.method == 'PUT':
                serializer = DoctorSerializer(doctor, data=request.data, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response(serializer.data)
            serializer = DoctorSerializer(doctor)
            return Response(serializer.data)
        except Doctor.DoesNotExist:
            return Response(
                {"detail": "Doctor profile not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

class PatientViewSet(ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    @action(detail=False, methods=['get', 'put'])
    def me(self, request):
        try:
            patient = request.user.patient
            if request.method == 'PUT':
                serializer = PatientSerializer(patient, data=request.data, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response(serializer.data)
            serializer = PatientSerializer(patient)
            return Response(serializer.data)
        except Patient.DoesNotExist:
            return Response(
                {"detail": "Patient profile not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

"""class ConsultationViewSet(viewsets.ModelViewSet):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = (TokenAuthentication,)"""

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = (TokenAuthentication,)

class StatusViewSet(viewsets.ModelViewSet):
    serializer_class = StatusSerializer
    authentication_classes = [TokenAuthentication]
    
    def get_permissions(self):
        if self.action == 'create':
            return [IsAuthenticated(), IsDoctor()]
        return [IsAuthenticated()]

    def get_queryset(self):
        return Status.objects.filter(
            status_expires_at__gt=timezone.now()
        ).order_by('-status_posted_at')

    def perform_create(self, serializer):
        if not hasattr(self.request.user, 'doctor'):
            raise PermissionDenied("Only doctors can create statuses")
        serializer.save(doctor=self.request.user.doctor)

class DoctorSignUpView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        serializer = DoctorSignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        token, _ = Token.objects.get_or_create(user=user)
        
        return Response({
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_doctor": user.is_doctor
            },
            "doctor": DoctorSerializer(user.doctor).data,
            "token": token.key,
            "message": "Account created successfully"
        }, status=status.HTTP_201_CREATED)

class PatientSignUpView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        serializer = PatientSignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        token, _ = Token.objects.get_or_create(user=user)
        
        return Response({
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_patient": user.is_patient
            },
            "patient": PatientSerializer(user.patient).data,
            "token": token.key,
            "message": "Account created successfully"
        }, status=status.HTTP_201_CREATED)

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)

        patient_data = {}
        if user.is_patient:
            try:
                patient = Patient.objects.get(user=user)
                patient_data = PatientSerializer(patient).data
            except Patient.DoesNotExist:
                pass

        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'is_doctor': user.is_doctor,
                'is_patient': user.is_patient,
            },
            'patient': patient_data
        })
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    request.user.auth_token.delete()
    return Response({"detail": "Successfully logged out."})
    
class DoctorsOnlyView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated&DoctorPermissions]
    serializer_class = UserSerializer
    
    authentication_classes = (TokenAuthentication,)

    def get_object(self):
        return self.request.user
    
class PatientsOnlyView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated&PatientPermissions]
    serializer_class = UserSerializer
    
    authentication_classes = (TokenAuthentication,)

    def get_object(self):
        return self.request.user

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'is_doctor': user.is_doctor,
            'is_patient': user.is_patient
        })

class ConsultationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ConsultationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Consultation.objects.filter(
            Q(doctor__user=user) | Q(patient__user=user)
        ).select_related(
            'doctor', 'doctor__user',
            'patient', 'patient__user'
        ).prefetch_related(
            Prefetch('messages', queryset=ChatMessage.objects.order_by('-timestamp'))
        ).distinct().order_by('-start_time')

    def get_serializer_context(self):
        return {'request': self.request}

class ChatMessageList(generics.ListAPIView):
    serializer_class = ChatMessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        consultation_id = self.kwargs['consultation_id']
        return ChatMessage.objects.filter(
            consultation_id=consultation_id
        ).select_related(
            'sender', 'sender__doctor', 'sender__patient'
        ).order_by('timestamp')

    def get_serializer_context(self):
        return {'request': self.request}