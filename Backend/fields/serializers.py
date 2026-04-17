from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'role']

class FieldUpdateSerializer(serializers.ModelSerializer):
    agent_name = serializers.ReadOnlyField(source='agent.username')
    class Meta:
        model = FieldUpdate
        fields = ['id', 'field', 'agent', 'agent_name', 'stage_at_update','notes', 'timestamp']

class FieldSerializer(serializers.ModelSerializer):
    updates = FieldUpdateSerializer(many=True, read_only=True)
    assigned_agent_name = serializers.ReadOnlyField(source='assigned_agent.username')
    status = serializers.ReadOnlyField()
    class Meta:
        model = Field
        fields = ['id', 'name', 'crop_type', 'planting_date','current_stage', 'assigned_agent', 'assigned_agent_name', 'updates', 'status']
