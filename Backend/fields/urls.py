from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FieldViewSet, FieldUpdateViewSet, UserViewSet

router = DefaultRouter()
router.register(r'fields', FieldViewSet, basename='field')
router.register(r'updates', FieldUpdateViewSet, basename='update')
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
]