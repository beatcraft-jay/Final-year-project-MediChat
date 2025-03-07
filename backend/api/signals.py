# api/signals.py
from django.db import IntegrityError
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model

User = get_user_model()

@receiver(post_save, sender=User, dispatch_uid="create_auth_token")
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        try:
            Token.objects.create(user=instance)
        except IntegrityError:
            # Handle existing token gracefully
            existing_token = Token.objects.get(user=instance)
            print(f"Token already exists for user {instance.username}: {existing_token.key}")