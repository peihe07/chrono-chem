from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters import rest_framework as filters
from django.shortcuts import get_object_or_404
from ..models import Chemist
from ..serializers import ChemistSerializer
import time

class ChemistFilter(filters.FilterSet):
    era = filters.NumberFilter(field_name='era')
    
    class Meta:
        model = Chemist
        fields = ['era']

class ChemistViewSet(viewsets.ModelViewSet):
    queryset = Chemist.objects.all()
    serializer_class = ChemistSerializer
    filterset_class = ChemistFilter
    filter_backends = (filters.DjangoFilterBackend,)

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.filter_queryset(self.get_queryset())
            serializer = self.get_serializer(queryset, many=True)
            return Response({
                'status': 'success',
                'data': serializer.data,
                'message': '成功獲取化學家列表'
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'獲取化學家列表失敗: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response({
                'status': 'success',
                'data': serializer.data,
                'message': '成功獲取化學家詳情'
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'獲取化學家詳情失敗: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        try:
            chemist = self.get_object()
            message = request.data.get('message')
            
            if not message:
                return Response({
                    'status': 'error',
                    'message': '訊息不能為空'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # TODO: 實現與化學家的對話邏輯
            response_message = f"我是{chemist.name}，我收到了您的訊息：{message}"
            
            return Response({
                'status': 'success',
                'data': {
                    'assistant_message': {
                        'role': 'assistant',
                        'content': response_message,
                        'timestamp': int(time.time() * 1000)
                    }
                },
                'message': '訊息發送成功'
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'發送訊息失敗: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 