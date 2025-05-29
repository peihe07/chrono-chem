from rest_framework import viewsets, status
from rest_framework.response import Response
from django_filters import rest_framework as filters
from ..models import HistoricalEvent
from ..serializers import HistoricalEventSerializer

class HistoricalEventFilter(filters.FilterSet):
    era = filters.NumberFilter(field_name='era')
    
    class Meta:
        model = HistoricalEvent
        fields = ['era']

class HistoricalEventViewSet(viewsets.ModelViewSet):
    queryset = HistoricalEvent.objects.all()
    serializer_class = HistoricalEventSerializer
    filterset_class = HistoricalEventFilter
    filter_backends = (filters.DjangoFilterBackend,)

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.filter_queryset(self.get_queryset())
            serializer = self.get_serializer(queryset, many=True)
            return Response({
                'status': 'success',
                'data': serializer.data,
                'message': '成功獲取歷史事件列表'
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'獲取歷史事件列表失敗: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response({
                'status': 'success',
                'data': serializer.data,
                'message': '成功獲取歷史事件詳情'
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'獲取歷史事件詳情失敗: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 