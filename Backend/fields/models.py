from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from datetime import timedelta

# Create your models here.
class User(AbstractUser):
    class Roles(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        AGENT = 'AGENT', 'Field Agent'
    role = models.CharField(max_length=10, choices=Roles.choices, default=Roles.AGENT)

class Field(models.Model):
    class Stages(models.TextChoices):
        PLANTED = 'PLANTED', 'Planted'
        GROWING = 'GROWING', 'Growing'
        READY = 'READY', 'Ready'
        HARVESTED = 'HARVESTED', 'Harvested'    
    name = models.CharField(max_length=100)
    crop_type = models.CharField(max_length=100)
    planting_date = models.DateField()
    current_stage = models.CharField(max_length=20, choices=Stages.choices, default=Stages.PLANTED)
    assigned_agent = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='assigned_fields')
    created_at = models.DateTimeField(default=timezone.now)

    @property
    def status(self):
        if self.current_stage == self.Stages.HARVESTED:
            return "COMPLETED"
        last_update = self.updates.order_by('-timestamp').first()

        if last_update:
            one_week_ago = timezone.now() - timedelta(days=7)
            if last_update.timestamp < one_week_ago:
                return "AT RISK"
            if any (word in last_update.notes.lower() for word in ["disease", "pest", "wilt"]):
                return "AT RISK"
        return "ACTIVE"

class FieldUpdate(models.Model):
    field = models.ForeignKey(Field, on_delete=models.CASCADE, related_name='updates')
    agent = models.ForeignKey(User, on_delete=models.CASCADE)
    stage_at_update = models.CharField(max_length=20, choices=Field.Stages.choices)
    notes = models.TextField(blank=True)
    timestamp = models.DateTimeField(default=timezone.now)
