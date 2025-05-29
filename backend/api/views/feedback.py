from rest_framework import viewsets, permissions
from ..models import UserFeedback
from ..serializers import UserFeedbackSerializer

class UserFeedbackViewSet(viewsets.ModelViewSet):
    queryset = UserFeedback.objects.all()
    serializer_class = UserFeedbackSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user if self.request.user.is_authenticated else None) 