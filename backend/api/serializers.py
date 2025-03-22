from rest_framework import serializers
from .models import Era, Scientist, Event

class EraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Era
        fields = ['id', 'title', 'year', 'description']

class ScientistSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scientist
        fields = ['id', 'name']

class ScientistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scientist
        fields = ['id', 'name', 'birth_year', 'death_year', 'bio', 'era']

class EventSerializer(serializers.ModelSerializer):
    scientists = ScientistSimpleSerializer(many=True)

    class Meta:
        model = Event
        fields = ['id', 'title', 'year', 'description', 'location', 'era', 'scientists']