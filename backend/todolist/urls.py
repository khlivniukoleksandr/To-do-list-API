from django.contrib import admin
from django.urls import path, include

from api.views import homepage_view

urlpatterns = [
    path("admin/", admin.site.urls),
    path('', homepage_view, name='homepage'),
    path("api/tasks/", include("api.urls", namespace="tasks")),

]
