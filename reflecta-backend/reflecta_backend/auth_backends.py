from rest_framework_simplejwt.authentication import JWTAuthentication

class CookieJWTAuthentication(JWTAuthentication):
    """
    Reads JWT from the httpOnly 'access' cookie.
    Falls back to Authorization: Bearer for tools like curl/Postman.
    """
    def authenticate(self, request):
        token = request.COOKIES.get("access")
        if not token:
            return super().authenticate(request)
        validated = self.get_validated_token(token)
        return self.get_user(validated), validated
