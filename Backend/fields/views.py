from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import *
from .serializers import *
# Create your views here.

class FieldViewSet(viewsets.ModelViewSet):
    serializer_class = FieldSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return Field.objects.all()
        else:
            return Field.objects.filter(assigned_agent=user)
        
    def perform_create(self, serializer):
        return super().perform_create(serializer)

class FieldUpdateViewSet(viewsets.ModelViewSet):
    serializer_class = FieldUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return FieldUpdate.objects.all()
        else:
            return FieldUpdate.objects.filter(agent=user)

    def perform_create(self, serializer):
        return super().perform_create(serializer)