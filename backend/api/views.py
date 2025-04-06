from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Era, Chemist, HistoricalEvent, ChatHistory
from .serializers import (
    EraSerializer, ChemistSerializer, HistoricalEventSerializer,
    ChatHistorySerializer, ChatMessageSerializer
)
from rest_framework.decorators import api_view

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
    serializer_class = ChatHistorySerializer
    
    def create(self, request, *args, **kwargs):
        chemist_id = self.kwargs['chemist_id']
        content = request.data.get('content', '')
        
        if not content:
            return Response(
                {'error': '消息內容不能為空'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 創建用戶消息
        user_message = ChatHistory.objects.create(
            chemist_id=chemist_id,
            role='user',
            content=content,
            timestamp=timezone.now()
        )
        
        # TODO: 這裡可以添加與 AI 模型的整合
        # 暫時返回一個簡單的回應
        assistant_message = ChatHistory.objects.create(
            chemist_id=chemist_id,
            role='assistant',
            content=f'收到您的消息：{content}',
            timestamp=timezone.now()
        )
        
        return Response({
            'user_message': ChatHistorySerializer(user_message).data,
            'assistant_message': ChatHistorySerializer(assistant_message).data
        })

@api_view(['GET'])
def health_check(request):
    return Response({'status': 'ok'})