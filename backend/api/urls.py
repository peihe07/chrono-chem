from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.era import EraViewSet
from .views.chemist import ChemistViewSet
from .views.event import HistoricalEventViewSet
from .views.feedback import UserFeedbackViewSet

router = DefaultRouter()
router.register(r'era', EraViewSet, basename='era')
router.register(r'scientist', ChemistViewSet, basename='scientist')
router.register(r'event', HistoricalEventViewSet, basename='event')
router.register(r'feedback', UserFeedbackViewSet)

urlpatterns = [
    path('', include(router.urls)),
]