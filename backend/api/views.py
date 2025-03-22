from rest_framework import generics
from .models import Era, Scientist, Event
from .serializers import EraSerializer, ScientistSerializer, EventSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework import status

class EraListView(generics.ListAPIView):
    queryset = Era.objects.all().order_by('year')
    serializer_class = EraSerializer

class ScientistListView(generics.ListAPIView):
    serializer_class = ScientistSerializer

    def get_queryset(self):
        era_id = self.request.query_params.get('era')
        if era_id:
            return Scientist.objects.filter(era_id=era_id)
        return Scientist.objects.all()

class EventListView(generics.ListAPIView):
    serializer_class = EventSerializer

    def get_queryset(self):
        era_id = self.request.query_params.get('era')
        if era_id:
            return Event.objects.filter(era_id=era_id)
        return Event.objects.all()

# Optional GPT-4 模擬端點
class ScientistChatView(APIView):
    def get(self, request, pk):
        scientist = Scientist.objects.get(pk=pk)
        return Response({
            "message": f"Hello, I'm {scientist.name}. I contributed to the field of chemistry during the {scientist.era.title} era."
        })

@api_view(['GET'])
def health_check(request):
    """
    健康檢查端點
    """
    return Response(
        {"status": "healthy"},
        status=status.HTTP_200_OK
    )