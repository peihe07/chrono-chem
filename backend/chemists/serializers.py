from rest_framework import serializers
from .models import Chemist, ChatHistory

class ChatHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatHistory
        fields = ['id', 'role', 'content', 'timestamp']

class ChemistSerializer(serializers.ModelSerializer):
    chat_history = ChatHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Chemist
        fields = ['id', 'name', 'era', 'description', 'position_x', 'position_y', 'position_z', 'model_path', 'chat_history'] 