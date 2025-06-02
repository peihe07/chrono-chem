from rest_framework import generics, status, viewsets, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Era, Chemist, HistoricalEvent, ChatHistory, UserFeedback
from .serializers import (
    EraSerializer, ChemistSerializer, HistoricalEventSerializer,
    ChatHistorySerializer, ChatMessageSerializer, UserFeedbackSerializer
)
from rest_framework.decorators import api_view
from .services.ai_service import AIService

class HealthCheck(APIView):
    """
    健康檢查端點
    """
    def get(self, request):
        return Response({
            'status': 'ok',
            'timestamp': timezone.now().isoformat()
        })

class EraList(generics.ListAPIView):
    queryset = Era.objects.all()
    serializer_class = EraSerializer

class EraDetail(generics.RetrieveAPIView):
    queryset = Era.objects.all()
    serializer_class = EraSerializer

class ChemistList(generics.ListAPIView):
    queryset = Chemist.objects.all()
    serializer_class = ChemistSerializer

    def get_queryset(self):
        queryset = Chemist.objects.all()
        era_id = self.request.query_params.get('era', None)
        if era_id is not None:
            queryset = queryset.filter(era_id=era_id)
        return queryset

class ChemistDetail(generics.RetrieveAPIView):
    queryset = Chemist.objects.all()
    serializer_class = ChemistSerializer

class HistoricalEventList(generics.ListAPIView):
    queryset = HistoricalEvent.objects.all()
    serializer_class = HistoricalEventSerializer

    def get_queryset(self):
        queryset = HistoricalEvent.objects.all()
        era_id = self.request.query_params.get('era', None)
        chemist_id = self.request.query_params.get('chemist', None)
        if era_id is not None:
            queryset = queryset.filter(era_id=era_id)
        if chemist_id is not None:
            queryset = queryset.filter(chemist_id=chemist_id)
        return queryset

class HistoricalEventDetail(generics.RetrieveAPIView):
    queryset = HistoricalEvent.objects.all()
    serializer_class = HistoricalEventSerializer

class ChatHistoryList(generics.ListAPIView):
    serializer_class = ChatHistorySerializer

    def get_queryset(self):
        chemist_id = self.kwargs['chemist_id']
        return ChatHistory.objects.filter(chemist_id=chemist_id).order_by('timestamp')

class SendMessage(generics.CreateAPIView):
    serializer_class = ChatMessageSerializer
    
    def create(self, request, *args, **kwargs):
        chemist_id = self.kwargs['chemist_id']
        message = request.data.get('message', '')
        
        if not message:
            return Response(
                {'error': '消息內容不能為空'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            chemist = get_object_or_404(Chemist, id=chemist_id)
            
            # 創建用戶消息
            user_message = ChatHistory.objects.create(
                chemist=chemist,
                role='user',
                content=message,
                timestamp=timezone.now()
            )
            
            # 使用 AI 服務生成回應
            ai_service = AIService()
            ai_response = ai_service.generate_response(chemist, message)
            
            # 創建 AI 回應
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
            print(f"發送訊息失敗: {str(e)}")
            return Response({
                'status': 'error',
                'message': f'發送訊息失敗: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def health_check(request):
    return Response({'status': 'ok'})

class UserFeedbackViewSet(viewsets.ModelViewSet):
    queryset = UserFeedback.objects.all()
    serializer_class = UserFeedbackSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user if self.request.user.is_authenticated else None)