from django.contrib.auth import authenticate
from rest_framework import viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings

from .models import Entry, MediaAsset, MusicTrack, MoodLabel, MoodDay
from .serializers import (
    RegisterSerializer, UserSerializer,
    EntrySerializer, MediaAssetSerializer,
    MusicTrackSerializer, MoodLabelSerializer, MoodDaySerializer
)
from .permissions import IsOwner

# ---------- cookie flags ----------
def _cookie_flags():
    # Dev: http (secure=False). Prod: HTTPS → secure=True.
    secure_flag = not settings.DEBUG
    return dict(httponly=True, samesite="Lax", secure=secure_flag, path="/")

# ---------- Auth ----------
@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    s = RegisterSerializer(data=request.data)
    s.is_valid(raise_exception=True)
    user = s.save()
    return Response(UserSerializer(user).data, status=201)

@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    user = authenticate(username=request.data.get("username"), password=request.data.get("password"))
    if not user:
        return Response({"detail": "Invalid credentials"}, status=400)
    refresh = RefreshToken.for_user(user)
    resp = Response({"ok": True})
    resp.set_cookie("access",  str(refresh.access_token), max_age=60*60,      **_cookie_flags())        # 1h
    resp.set_cookie("refresh", str(refresh),              max_age=60*60*24*7, **_cookie_flags())        # 7d
    return resp

@api_view(["POST"])
@permission_classes([AllowAny])
def refresh_access(request):
    token = request.COOKIES.get("refresh")
    if not token: return Response({"detail":"No refresh cookie"}, status=401)
    try:
        new_access = str(RefreshToken(token).access_token)
    except Exception:
        return Response({"detail":"Invalid refresh"}, status=401)
    resp = Response({"ok": True})
    resp.set_cookie("access", new_access, max_age=60*60, **_cookie_flags())
    return resp

@api_view(["POST"])
def logout(request):
    resp = Response({"ok": True})
    resp.delete_cookie("access", path="/")
    resp.delete_cookie("refresh", path="/")
    return resp

@api_view(["GET"])
def me(request):
    return Response(UserSerializer(request.user).data)

# ---------- Entries & Media ----------
class EntryViewSet(viewsets.ModelViewSet):
    serializer_class = EntrySerializer
    permission_classes = [IsOwner]
    def get_queryset(self):
        qs = Entry.objects.filter(user=self.request.user).order_by("-created_at")
        frm = self.request.query_params.get("from")
        to  = self.request.query_params.get("to")
        if frm: qs = qs.filter(created_for__gte=frm)
        if to:  qs = qs.filter(created_for__lte=to)
        return qs
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    @action(detail=True, methods=["post"])
    def media(self, request, pk=None):
        entry = self.get_object()
        data = request.data.copy(); data["entry"] = entry.id
        s = MediaAssetCreateSerializer(data=data, context={"request": request, "entry": entry})
        s.is_valid(raise_exception=True)
        obj = s.save()
        return Response(MediaAssetSerializer(obj).data, status=201)

class MediaAssetCreateSerializer(MediaAssetSerializer):
    class Meta(MediaAssetSerializer.Meta):
        fields = MediaAssetSerializer.Meta.fields + ["entry"]
        read_only_fields = MediaAssetSerializer.Meta.read_only_fields
    def create(self, data):
        data["entry"] = self.context["entry"]
        return super().create(data)

class MediaAssetViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MediaAssetSerializer
    permission_classes = [IsOwner]
    def get_queryset(self):
        return MediaAsset.objects.filter(entry__user=self.request.user).order_by("order","id")

# ---------- Music ----------
class MusicTrackViewSet(viewsets.ModelViewSet):
    serializer_class = MusicTrackSerializer
    permission_classes = [IsOwner]
    http_method_names = ["get","post","delete"]
    def get_queryset(self):
        return MusicTrack.objects.filter(user=self.request.user).order_by("-uploaded_at")
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# ---------- Mood ----------
class MoodLabelViewSet(viewsets.ModelViewSet):
    serializer_class = MoodLabelSerializer
    permission_classes = [IsOwner]
    http_method_names = ["get","post","patch","delete"]
    def get_queryset(self):
        return MoodLabel.objects.filter(user=self.request.user).order_by("name")
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MoodDayViewSet(viewsets.ModelViewSet):
    serializer_class = MoodDaySerializer
    permission_classes = [IsOwner]
    http_method_names = ["get","post","patch","delete"]
    def get_queryset(self):
        return MoodDay.objects.filter(user=self.request.user).order_by("-date")
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
