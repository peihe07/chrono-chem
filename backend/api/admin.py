from django.contrib import admin
from .models import Era, Chemist, HistoricalEvent, ChatHistory

@admin.register(Era)
class EraAdmin(admin.ModelAdmin):
    list_display = ('name', 'year', 'description', 'model_url', 'soundtrack_url')
    search_fields = ('name', 'description')
    ordering = ('year',)

@admin.register(Chemist)
class ChemistAdmin(admin.ModelAdmin):
    list_display = ('name', 'birth_year', 'death_year', 'era', 'position_x', 'position_y', 'position_z')
    list_filter = ('era',)
    search_fields = ('name', 'description')
    ordering = ('birth_year',)

@admin.register(HistoricalEvent)
class HistoricalEventAdmin(admin.ModelAdmin):
    list_display = ('title', 'year', 'chemist', 'event_type')
    list_filter = ('year', 'chemist', 'event_type')
    search_fields = ('title', 'description')
    ordering = ('year',)

@admin.register(ChatHistory)
class ChatHistoryAdmin(admin.ModelAdmin):
    list_display = ('chemist', 'role', 'content', 'timestamp')
    list_filter = ('chemist', 'role')
    search_fields = ('content',)
    ordering = ('timestamp',)
