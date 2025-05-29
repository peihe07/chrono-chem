from rest_framework import serializers
from .models import Era, Chemist, HistoricalEvent, ChatHistory

class ChatHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatHistory
        fields = ['id', 'role', 'content', 'timestamp']

class HistoricalEventSerializer(serializers.ModelSerializer):
    """歷史事件序列化器"""
    class Meta:
        model = HistoricalEvent
        fields = [
            'id',
            'title',
            'description',
            'location',
            'experiment_description',
            'date',
            'era',
            'created_at',
            'updated_at'
        ]

class EraSerializer(serializers.ModelSerializer):
    """時代序列化器"""
    class Meta:
        model = Era
        fields = [
            'id',
            'name',
            'year',
            'description',
            'model_url',
            'soundtrack_url',
            'created_at',
            'updated_at'
        ]

class EraDetailSerializer(serializers.ModelSerializer):
    """時代詳細序列化器"""
    events = HistoricalEventSerializer(many=True, read_only=True)

    class Meta:
        model = Era
        fields = [
            'id',
            'name',
            'year',
            'description',
            'model_url',
            'soundtrack_url',
            'events',
            'created_at',
            'updated_at'
        ]

class ChemistSerializer(serializers.ModelSerializer):
    """化學家序列化器"""
    chat_history = ChatHistorySerializer(many=True, read_only=True)
    events = HistoricalEventSerializer(many=True, read_only=True)

    class Meta:
        model = Chemist
        fields = [
            'id',
            'name',
            'era',
            'description',
            'position_x',
            'position_y',
            'position_z',
            'birth_year',
            'death_year',
            'portrait_path',
            'model_path',
            'bio',
            'chat_history',
            'events',
            'created_at',
            'updated_at'
        ]

class ChatMessageSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=1000)