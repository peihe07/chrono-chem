from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Era, Chemist, HistoricalEvent, ChatHistory
from .serializers import (
    EraSerializer, ChemistSerializer, HistoricalEventSerializer,
    ChatHistorySerializer, ChatMessageSerializer
)

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
        return ChatHistory.objects.filter(chemist_id=chemist_id)

class SendMessage(APIView):
    def post(self, request, chemist_id):
        chemist = get_object_or_404(Chemist, id=chemist_id)
        serializer = ChatMessageSerializer(data=request.data)
        
        if serializer.is_valid():
            # 保存用戶訊息
            user_message = ChatHistory.objects.create(
                chemist=chemist,
                message=serializer.validated_data['message'],
                is_from_user=True
            )
            
            # TODO: 這裡可以整合 GPT API 來生成化學家的回應
            # 暫時使用固定的回應
            chemist_response = "感謝您的訊息！我是 " + chemist.name + "，很高興能與您交流。"
            
            # 保存化學家的回應
            ChatHistory.objects.create(
                chemist=chemist,
                message=chemist_response,
                is_from_user=False
            )
            
            return Response({
                'user_message': ChatHistorySerializer(user_message).data,
                'chemist_response': chemist_response
            }, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)