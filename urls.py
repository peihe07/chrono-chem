from django.contrib import admin
from django.http import HttpResponse
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

def home(request):
    return HttpResponse("Hello, this is the ChronoChem API server.")

def health_check(request):
    return HttpResponse("OK", status=200)

urlpatterns = [
    path("", home),
    path("admin/", admin.site.urls),
    path("api/v1/health/", health_check),
    path("api/v1/", include("api.urls")),
    path("api/v2/", include("api.urls")),
]

if settings.DEBUG:
    urlpatterns += [
        path("__debug__/", include("debug_toolbar.urls")),
    ]
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) 