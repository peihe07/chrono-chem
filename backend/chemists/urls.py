from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChemistViewSet, HistoricalEventViewSet

router = DefaultRouter()
router.register(r'chemists', ChemistViewSet)
router.register(r'events', HistoricalEventViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 