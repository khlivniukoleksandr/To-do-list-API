from django.urls import path, include
from rest_framework.routers import DefaultRouter

from api.views import TodoList

app_name = 'tasks'

router = DefaultRouter()

router.register('', TodoList)

urlpatterns = [
    path('', include(router.urls)),
]
