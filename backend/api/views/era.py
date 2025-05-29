from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import Era, HistoricalEvent
from ..serializers import EraSerializer, EraDetailSerializer

class EraViewSet(viewsets.ModelViewSet):
    """時代 API 視圖集"""
    queryset = Era.objects.all()
    serializer_class = EraSerializer

    @action(detail=True, methods=['get'], url_path='full-detail')
    def era_detail(self, request, pk=None):
        """獲取時代詳細資訊"""
        era = self.get_object()
        serializer = EraDetailSerializer(era)
        return Response(serializer.data)

    def get_serializer_class(self):
        if self.action == 'era_detail':
            return EraDetailSerializer
        return EraSerializer 