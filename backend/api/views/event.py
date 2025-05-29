from rest_framework import viewsets
from ..models import HistoricalEvent
from ..serializers import HistoricalEventSerializer

class HistoricalEventViewSet(viewsets.ModelViewSet):
    queryset = HistoricalEvent.objects.all()
    serializer_class = HistoricalEventSerializer 