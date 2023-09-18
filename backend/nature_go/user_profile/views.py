from rest_framework.generics import RetrieveAPIView
from .models import Profile
from .serializers import ProfileSerializer
from rest_framework import permissions

class ProfileView(RetrieveAPIView):
    serializer_class = ProfileSerializer
    pagination_class = None
    queryset = Profile.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
    
    def get_object(self):
        # Ensure that the profile exists
        Profile.objects.get_or_create(user=self.request.user) 
        return Profile.objects.filter(user=self.request.user).first()