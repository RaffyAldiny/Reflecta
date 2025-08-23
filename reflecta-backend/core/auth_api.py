from django.contrib.auth import authenticate, get_user_model
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from django.utils import timezone

User = get_user_model()

COOKIE_DEFAULTS = dict(
    httponly=True,   # not readable by JS
    samesite="Lax",  # dev: both apps on 127.0.0.1 so Lax works
    secure=False,    # dev only; set True in production (HTTPS)
    path="/",
)

def _set_auth_cookies(response, user):
    # issue tokens
    refresh = RefreshToken.for_user(user)
    access = AccessToken.for_user(user)

    # set cookies
    # access: short-lived
    response.set_cookie(
        "access",
        str(access),
        max_age=int(access.lifetime.total_seconds()),
        **COOKIE_DEFAULTS,
    )
    # refresh: long-lived
    response.set_cookie(
        "refresh",
        str(refresh),
        max_age=int(refresh.lifetime.total_seconds()),
        **COOKIE_DEFAULTS,
    )
    return response

def _clear_auth_cookies(response):
    # deletion must match cookie attributes (path/samesite/secure)
    response.delete_cookie("access", path="/", samesite=COOKIE_DEFAULTS["samesite"])
    response.delete_cookie("refresh", path="/", samesite=COOKIE_DEFAULTS["samesite"])
    return response

def _user_payload(user: User):
    return {"id": user.id, "username": user.username, "email": user.email}

@api_view(["POST"])
@permission_classes([AllowAny])
@csrf_exempt
def register(request):
    username = (request.data.get("username") or "").strip()
    email = (request.data.get("email") or "").strip()
    password = request.data.get("password") or ""

    if not username or not password:
        return Response({"detail": "Username and password required"}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({"detail": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)

    # Auto-login after register (sets cookies)
    resp = Response(_user_payload(user), status=status.HTTP_201_CREATED)
    return _set_auth_cookies(resp, user)

@api_view(["POST"])
@permission_classes([AllowAny])
@csrf_exempt
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)
    if not user:
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

    resp = Response(_user_payload(user), status=status.HTTP_200_OK)
    return _set_auth_cookies(resp, user)

@api_view(["POST"])
@permission_classes([AllowAny])
@csrf_exempt
def refresh(request):
    """
    Issue a new access token from the httpOnly 'refresh' cookie.
    """
    token = request.COOKIES.get("refresh")
    if not token:
        return Response({"detail": "No refresh cookie"}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        refresh = RefreshToken(token)
        user_id = refresh.payload.get("user_id")
        user = User.objects.get(pk=user_id)
    except Exception:
        return Response({"detail": "Invalid refresh"}, status=status.HTTP_401_UNAUTHORIZED)

    access = AccessToken.for_user(user)
    resp = Response({"detail": "refreshed"}, status=status.HTTP_200_OK)
    resp.set_cookie(
        "access",
        str(access),
        max_age=int(access.lifetime.total_seconds()),
        **COOKIE_DEFAULTS,
    )
    return resp

@api_view(["POST"])
@permission_classes([AllowAny])
@csrf_exempt
def logout(request):
    resp = Response({"detail": "logged out"}, status=status.HTTP_200_OK)
    return _clear_auth_cookies(resp)

@api_view(["GET"])
def me(request):
    if not request.user or not request.user.is_authenticated:
        return Response({"detail": "Unauthenticated"}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(_user_payload(request.user), status=status.HTTP_200_OK)
