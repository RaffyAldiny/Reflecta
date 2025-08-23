from rest_framework.permissions import BasePermission

class IsOwner(BasePermission):
    """Object-level check: user owns the resource (directly or via entry.user)."""
    def has_object_permission(self, request, view, obj):
        u = getattr(obj, "user", None)
        if u is None and hasattr(obj, "entry"):
            u = getattr(obj.entry, "user", None)
        return u == request.user
