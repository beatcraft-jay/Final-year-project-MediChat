from rest_framework.permissions import BasePermission    
from rest_framework import permissions


class PatientPermissions(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_patient)
    

class DoctorPermissions(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_doctor)


class IsDoctor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_doctor