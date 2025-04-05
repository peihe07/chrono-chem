from rest_framework import serializers
from .models import Era, Chemist, HistoricalEvent, ChatHistory

class EraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Era
        fields = '__all__'

class ChemistSerializer(serializers.ModelSerializer):
    era_name = serializers.CharField(source='era.name', read_only=True)
    
    class Meta:
        model = Chemist
        fields = '__all__'

class HistoricalEventSerializer(serializers.ModelSerializer):
    era_name = serializers.CharField(source='era.name', read_only=True)
    chemist_name = serializers.CharField(source='chemist.name', read_only=True)
    
    class Meta:
        model = HistoricalEvent
        fields = '__all__'

class ChatHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatHistory
        fields = '__all__'

class ChatMessageSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=1000)