from rest_framework.generics import RetrieveAPIView
from .models import Profile
from .serializers import ProfileSerializer

class ProfileView(RetrieveAPIView):
    serializer_class = ProfileSerializer
    pagination_class = None
    queryset = Profile.objects.all()
    
    def get_object(self):
        # Ensure that the profile exists
        Profile.objects.get_or_create(user=self.request.user) 
        return Profile.objects.filter(user=self.request.user).first()