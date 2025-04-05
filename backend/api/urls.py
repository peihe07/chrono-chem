from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.HealthCheck.as_view(), name='health-check'),
    path('eras/', views.EraList.as_view(), name='era-list'),
    path('eras/<int:pk>/', views.EraDetail.as_view(), name='era-detail'),
    path('chemists/', views.ChemistList.as_view(), name='chemist-list'),
    path('chemists/<int:pk>/', views.ChemistDetail.as_view(), name='chemist-detail'),
    path('events/', views.HistoricalEventList.as_view(), name='event-list'),
    path('events/<int:pk>/', views.HistoricalEventDetail.as_view(), name='event-detail'),
    path('chat/<int:chemist_id>/', views.ChatHistoryList.as_view(), name='chat-history'),
    path('chat/<int:chemist_id>/send/', views.SendMessage.as_view(), name='send-message'),
]