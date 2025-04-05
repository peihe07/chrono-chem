from rest_framework import serializers
from .models import Chemist, ChatHistory, HistoricalEvent

class ChatHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatHistory
        fields = ['id', 'role', 'content', 'timestamp']

class HistoricalEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoricalEvent
        fields = [
            'id',
            'title',
            'description',
            'year',
            'event_type',
            'image_path',
            'created_at',
            'updated_at'
        ]

class ChemistSerializer(serializers.ModelSerializer):
    chat_history = ChatHistorySerializer(many=True, read_only=True)
    events = HistoricalEventSerializer(many=True, read_only=True)
    position = serializers.SerializerMethodField()
    birth_year = serializers.IntegerField()
    death_year = serializers.IntegerField(allow_null=True)
    portrait_path = serializers.CharField(allow_null=True)
    model_path = serializers.CharField(allow_null=True)
    bio = serializers.CharField(allow_null=True)
    era = serializers.IntegerField()

    class Meta:
        model = Chemist
        fields = [
            'id', 
            'name', 
            'era', 
            'description', 
            'position',
            'birth_year',
            'death_year',
            'portrait_path',
            'model_path',
            'bio',
            'chat_history',
            'events'
        ]

    def get_position(self, obj):
        return {
            'x': obj.position_x,
            'y': obj.position_y,
            'z': obj.position_z
        } 