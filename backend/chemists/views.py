from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from .models import Chemist, ChatHistory
from .serializers import ChemistSerializer, ChatHistorySerializer

class ChemistViewSet(viewsets.ModelViewSet):
    queryset = Chemist.objects.all()
    serializer_class = ChemistSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['era']
    search_fields = ['name', 'bio']

    def get_queryset(self):
        queryset = Chemist.objects.all()
        era = self.request.query_params.get('era', None)
        if era is not None:
            queryset = queryset.filter(era=era)
        return queryset

    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        chemist = self.get_object()
        content = request.data.get('content')
        
        if not content:
            return Response(
                {'error': '消息內容不能為空'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # 創建用戶消息
        user_message = ChatHistory.objects.create(
            chemist=chemist,
            role='user',
            content=content,
            timestamp=timezone.now()
        )

        # TODO: 這裡可以添加與 AI 模型的整合
        # 暫時返回一個簡單的回應
        assistant_message = ChatHistory.objects.create(
            chemist=chemist,
            role='assistant',
            content=f'收到您的消息：{content}',
            timestamp=timezone.now()
        )

        return Response({
            'user_message': ChatHistorySerializer(user_message).data,
            'assistant_message': ChatHistorySerializer(assistant_message).data
        })

    @action(detail=True, methods=['get'])
    def chat_history(self, request, pk=None):
        chemist = self.get_object()
        history = ChatHistory.objects.filter(chemist=chemist).order_by('timestamp')
        serializer = ChatHistorySerializer(history, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['delete'])
    def clear_history(self, request, pk=None):
        chemist = self.get_object()
        ChatHistory.objects.filter(chemist=chemist).delete()
        return Response(status=status.HTTP_204_NO_CONTENT) 