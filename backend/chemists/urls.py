from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChemistViewSet

router = DefaultRouter()
router.register(r'chemists', ChemistViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 