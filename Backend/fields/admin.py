from django.contrib import admin
from .models import User, Field, FieldUpdate

# Register your models here.
# show the User model
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'role', 'is_staff')

# shows the Field model and includes your custom status property
@admin.register(Field)
class FieldAdmin(admin.ModelAdmin):
    list_display = ('name', 'crop_type', 'current_stage', 'status', 'assigned_agent')
    list_filter = ('current_stage', 'assigned_agent')
admin.site.register(FieldUpdate)