from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter

# 🔽 changed import
from core.auth_api import register, login, refresh, logout, me  # ← this import matters
from core.views import (
    EntryViewSet, MediaAssetViewSet, MusicTrackViewSet,
    MoodLabelViewSet, MoodDayViewSet
)

router = DefaultRouter()
router.register(r"entries", EntryViewSet, basename="entries")
router.register(r"media",   MediaAssetViewSet, basename="media")
router.register(r"music",   MusicTrackViewSet, basename="music")
router.register(r"mood/labels", MoodLabelViewSet, basename="mood-labels")
router.register(r"mood/days",   MoodDayViewSet,  basename="mood-days")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/register", register),
    path("api/auth/login",    login),
    path("api/auth/refresh",  refresh),   # 🔽 add refresh
    path("api/auth/logout",   logout),
    path("api/auth/me",       me),
    path("api/", include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
