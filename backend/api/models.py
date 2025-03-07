from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
from django.db import models
from rest_framework.authtoken.models import Token
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings



class User(AbstractUser):
    is_superuser = models.BooleanField(default=False)
    is_doctor = models.BooleanField(default=False)
    is_patient = models.BooleanField(default=False)

    def __str__(self):
        return self.username

@receiver(post_save, sender=settings.AUTH_USER_MODEL)    
def create_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
    

class Doctor(models.Model):
    SPECIALITY = (
    ("psychiatry", "Psychiatry"), 
    ("dental", "Dental"), 
    ("cardiology", "Cardiology"),
    ("family Medicine", "Family Medicine"), 
    ("oncology", "Oncology"), 
    ("geriatrics", "Geriatrics"),
    ("radiology", "Radiology"), 
    ("surgery", "Surgery"), 
    ("general Medicine", "General Medicine"),
    ("orthopedics", "Orthopedics"),  
    ("pediatrics", "Pediatrics"),
)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, related_name="doctor",
        primary_key=True, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(unique=True, blank=True, null=True)
    profile_image = models.ImageField(upload_to='doctor_profiles/images/', blank=True, null=True)
    hospital = models.CharField(max_length=100, blank=True, null=True)
    specialty = models.CharField(max_length=100, choices=SPECIALITY, default='Pediatrics')
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    is_available = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "Dr. " + f"{self.first_name} {self.last_name}"
    
from django.utils import timezone

class Status(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    
    STATUS_TYPES = (
        ('text', 'Text'),
        ('image', 'Image'),
        ('video', 'Video'),
        ('audio', 'Audio'),
    )

    caption = models.CharField(max_length=505, default="No caption provided")
    status_type = models.CharField(max_length=10, choices=STATUS_TYPES)
    status_text = models.TextField(blank=True, null=True)
    background_color = models.CharField(max_length=7, default='#e8f4ff')
    status_image = models.ImageField(upload_to='status/images/', blank=True, null=True)
    status_video = models.FileField(upload_to='status/videos/', blank=True, null=True)
    status_audio = models.FileField(upload_to='status/audios/', blank=True, null=True)
    status_posted_at = models.DateTimeField(auto_now_add=True)
    status_expires_at = models.DateTimeField(default=timezone.now() + timezone.timedelta(hours=24))

    def save(self, *args, **kwargs):
        if not self.id: 
            self.status_expires_at = timezone.now() + timezone.timedelta(hours=24)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.doctor.user.username}'s status"

    def is_active(self):
        return timezone.now() < self.status_expires_at




class Patient(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, related_name="patient", primary_key=True, on_delete=models.CASCADE)
    TITLE = (
        ('Mr.', 'Mr.'),
        ('Mrs.', 'Mrs.'),
        ('Miss.', 'Miss.'),
    )
    title = models.CharField(max_length=7, choices=TITLE, default='Mr.')
    first_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(unique=True, blank=True, null=True)
    profile_image = models.ImageField(upload_to='patient_profiles/images/', blank=True, null=True)
    date_of_birth = models.DateField(null=True, blank=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    medical_history = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} {self.first_name} {self.last_name}"

class Consultation(models.Model):
    CONSULTATION_TYPES = (
        ('phone', 'Phone'),
        ('video', 'Video'),
        ('chat', 'Chat'),
    )
    STATUS_CHOICES = (
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    consultation_type = models.CharField(max_length=10, choices=CONSULTATION_TYPES)  # ✅ Fixed max_length
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=12, choices=STATUS_CHOICES, default='scheduled')
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Consultation {self.id} - {self.patient.user.username} with Dr. {self.doctor.user.username}"

class Message(models.Model):
    SENDER_TYPES = (
        ('doctor', 'Doctor'),
        ('patient', 'Patient'),
    )

    consultation = models.ForeignKey(Consultation, on_delete=models.CASCADE)
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='%(class)s_sender'
    )
    sender_type = models.CharField(max_length=7, choices=SENDER_TYPES)
    content = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Message from {self.get_sender_type_display()} at {self.timestamp}"
    
class ChatMessage(models.Model):
    consultation = models.ForeignKey(
        'Consultation', 
        on_delete=models.CASCADE, 
        related_name='messages' 
    )
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Message from {self.sender} at {self.timestamp}"
