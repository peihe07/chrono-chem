from django.urls import path
from . import views

urlpatterns = [
    path('eras/', views.EraListView.as_view(), name='era-list'),
    path('scientists/', views.ScientistListView.as_view(), name='scientist-list'),
    path('events/', views.EventListView.as_view(), name='event-list'),
    path('scientist/<int:pk>/chat/', views.ScientistChatView.as_view(), name='scientist-chat'),
]