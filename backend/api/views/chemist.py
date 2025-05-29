from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters import rest_framework as filters
from django.shortcuts import get_object_or_404
from django.utils import timezone
from ..models import Chemist, ChatHistory
from ..serializers import ChemistSerializer, ChatHistorySerializer
from ..services.ai_service import AIService
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
    ai_service = AIService()

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
            
            # 創建用戶訊息記錄
            user_message = ChatHistory.objects.create(
                chemist=chemist,
                role='user',
                content=message,
                timestamp=timezone.now()
            )
            
            # 生成 AI 回應
            ai_response = self.ai_service.generate_response(chemist, message)
            
            # 創建 AI 回應記錄
            assistant_message = ChatHistory.objects.create(
                chemist=chemist,
                role='assistant',
                content=ai_response,
                timestamp=timezone.now()
            )
            
            return Response({
                'status': 'success',
                'data': {
                    'assistant_message': {
                        'role': 'assistant',
                        'content': ai_response,
                        'timestamp': int(timezone.now().timestamp() * 1000)
                    }
                },
                'message': '訊息發送成功'
            })
            
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'發送訊息失敗: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get'])
    def chat_history(self, request, pk=None):
        try:
            chemist = self.get_object()
            history = ChatHistory.objects.filter(
                chemist=chemist
            ).order_by('timestamp')
            
            serializer = ChatHistorySerializer(history, many=True)
            return Response({
                'status': 'success',
                'data': serializer.data
            })
            
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'獲取聊天記錄失敗: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['delete'])
    def clear_history(self, request, pk=None):
        try:
            chemist = self.get_object()
            ChatHistory.objects.filter(chemist=chemist).delete()
            
            return Response({
                'status': 'success',
                'message': '聊天記錄已清除'
            })
            
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'清除聊天記錄失敗: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 