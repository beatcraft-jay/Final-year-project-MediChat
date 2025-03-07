from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import *

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = [
            'user',
            'first_name',
            'last_name',
            'email',
            'profile_image',
            'hospital',
            'specialty',
            'phone_number']
        depth = 1

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    
class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['title', 'first_name', 'last_name', 'profile_image', 'date_of_birth', 'phone_number', 'medical_history']
        read_only_fields = ['user']
        depth = 1

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class DoctorSignupSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password2'):
            raise serializers.ValidationError("Passwords do not match")
        return attrs

    def create(self, validated_data):
        # Create user first
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_doctor=True
        )
        # Create doctor profile
        Doctor.objects.create(user=user)
        return user

class PatientSignupSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password2'):
            raise serializers.ValidationError("Passwords do not match")
        return attrs

    def create(self, validated_data):
        # Create user first
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_patient=True
        )
        # Create patient profile
        Patient.objects.create(user=user)
        return user

    
class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'


class StatusSerializer(serializers.ModelSerializer):
    is_active = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Status
        fields = '__all__'
        read_only_fields = ['doctor', 'status_posted_at', 'status_expires_at']

        extra_kwargs = {
            'status_image': {'required': False},
            'status_video': {'required': False},
            'status_text': {'required': False}
        }

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        user = User.objects.filter(email=email).first()
        if user and user.check_password(password):
            return user
        raise serializers.ValidationError("Incorrect email or password")

class ChatMessageSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()
    
    class Meta:
        model = ChatMessage
        fields = ['id', 'content', 'timestamp', 'sender', 'is_read']

    def get_sender(self, obj):
        sender = obj.sender
        profile = None
        
        # Check if sender is a doctor
        if hasattr(sender, 'doctor'):
            profile = sender.doctor
            name = f"Dr. {profile.first_name} {profile.last_name}"
        # Check if sender is a patient
        elif hasattr(sender, 'patient'):
            profile = sender.patient
            name = f"{profile.title} {profile.first_name} {profile.last_name}"
        else:
            name = sender.get_full_name() or sender.username
        
        return {
            'id': sender.id,
            'name': name,
            'profile_image': self.get_profile_image(profile),
            'type': 'doctor' if hasattr(sender, 'doctor') else 'patient'
        }

    def get_profile_image(self, profile):
        if profile and profile.profile_image:
            return self.context['request'].build_absolute_uri(profile.profile_image.url)
        return None

class ConsultationSerializer(serializers.ModelSerializer):
    doctor = serializers.SerializerMethodField()
    patient = serializers.SerializerMethodField()
    latest_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Consultation
        fields = '__all__'
        read_only_fields = ['doctor', 'patient', 'latest_message', 'unread_count']

    def get_doctor(self, obj):
        return self._get_profile_data(obj.doctor)

    def get_patient(self, obj):
        return self._get_profile_data(obj.patient)

    def _get_profile_data(self, profile):
        return {
            'id': profile.id,
            'name': str(profile),
            'profile_image': self._get_profile_image(profile),
            'specialty': getattr(profile, 'specialty', None)
        }

    def _get_profile_image(self, profile):
        if profile.profile_image:
            return self.context['request'].build_absolute_uri(profile.profile_image.url)
        return None

    def get_latest_message(self, obj):
        message = obj.messages.order_by('-timestamp').first()
        return ChatMessageSerializer(message, context=self.context).data if message else None

    def get_unread_count(self, obj):
        return obj.messages.filter(
            is_read=False
        ).exclude(
            sender=self.context['request'].user
        ).count()