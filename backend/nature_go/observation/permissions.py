from rest_framework import permissions


class IsAdminOrReadOnly(permissions.IsAdminUser):
    """
    The request is authenticated as a user, or is a read-only request.
    """
    SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS']

    def has_permission(self, request, view):
        return super().has_permission(request, view) or request.method in self.SAFE_METHODS


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the snippet.
        return obj.user == request.user
    
class IsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to read or edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read/Write permissions are only allowed to the owner of the snippet.
        return obj.user == request.user