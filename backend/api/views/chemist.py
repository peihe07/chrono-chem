from rest_framework import viewsets
from ..models import Chemist
from ..serializers import ChemistSerializer

class ChemistViewSet(viewsets.ModelViewSet):
    queryset = Chemist.objects.all()
    serializer_class = ChemistSerializer 