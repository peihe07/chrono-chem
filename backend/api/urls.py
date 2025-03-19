from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HistoricalEventViewSet

router = DefaultRouter()
router.register(r'events', HistoricalEventViewSet)

urlpatterns = [
    path('', include(router.urls)),
]