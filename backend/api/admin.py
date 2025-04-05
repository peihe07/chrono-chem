from django.contrib import admin
from .models import Era, Chemist, HistoricalEvent, ChatHistory

@admin.register(Era)
class EraAdmin(admin.ModelAdmin):
    list_display = ('name', 'year', 'description')
    search_fields = ('name', 'description')
    ordering = ('year',)

@admin.register(Chemist)
class ChemistAdmin(admin.ModelAdmin):
    list_display = ('name', 'birth_year', 'death_year', 'era')
    list_filter = ('era',)
    search_fields = ('name', 'bio')
    ordering = ('birth_year',)

@admin.register(HistoricalEvent)
class HistoricalEventAdmin(admin.ModelAdmin):
    list_display = ('title', 'year', 'era', 'chemist', 'importance_level')
    list_filter = ('era', 'chemist', 'importance_level')
    search_fields = ('title', 'description')
    ordering = ('year',)

@admin.register(ChatHistory)
class ChatHistoryAdmin(admin.ModelAdmin):
    list_display = ('chemist', 'message', 'is_from_user', 'created_at')
    list_filter = ('chemist', 'is_from_user')
    search_fields = ('message',)
    ordering = ('-created_at',)
