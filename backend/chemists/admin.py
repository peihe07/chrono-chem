from django.contrib import admin
from .models import Chemist, ChatHistory

@admin.register(Chemist)
class ChemistAdmin(admin.ModelAdmin):
    list_display = ('name', 'era', 'description')
    list_filter = ('era',)
    search_fields = ('name', 'description')

@admin.register(ChatHistory)
class ChatHistoryAdmin(admin.ModelAdmin):
    list_display = ('chemist', 'role', 'content', 'timestamp')
    list_filter = ('chemist', 'role', 'timestamp')
    search_fields = ('content',)
    date_hierarchy = 'timestamp' 