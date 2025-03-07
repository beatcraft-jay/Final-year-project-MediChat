from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(User)
admin.site.register(Consultation)
admin.site.register(Doctor)
admin.site.register(Patient)
admin.site.register(Message)
admin.site.register(Status)
admin.site.register(ChatMessage)