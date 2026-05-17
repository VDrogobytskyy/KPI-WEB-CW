from django.contrib import admin
from django.urls import path, include, re_path
from django.views.static import serve
from django.views.generic import TemplateView
from pathlib import Path

spa = TemplateView.as_view(template_name='index.html')
build_dir = Path(__file__).resolve().parent.parent / "frontend" / "build"

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('base.urls')),
    path('favicon.ico', serve, {'path': 'favicon.ico', 'document_root': build_dir}),
    path('manifest.json', serve, {'path': 'manifest.json', 'document_root': build_dir}),
    path('robots.txt', serve, {'path': 'robots.txt', 'document_root': build_dir}),
    path('logo192.png', serve, {'path': 'logo192.png', 'document_root': build_dir}),
    path('logo512.png', serve, {'path': 'logo512.png', 'document_root': build_dir}),
    # Serve React SPA (built frontend) via Django for any non-API route.
    re_path(r'^(?!api/|admin/).*$', spa),
]
