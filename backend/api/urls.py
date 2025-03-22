from django.urls import path
from .views import health_check, EraListView, ScientistListView, ScientistDetailView

urlpatterns = [
    path('health/', health_check, name='health_check'),
    path('eras/', EraListView.as_view(), name='era-list'),
    path('scientists/', ScientistListView.as_view(), name='scientist-list'),
    path('scientists/<int:pk>/', ScientistDetailView.as_view(), name='scientist-detail'),
]