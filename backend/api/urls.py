from django.urls import path, include
from rest_framework.routers import DefaultRouter

from api.views import ToDoList

app_name = 'tasks'

router = DefaultRouter()

router.register('', ToDoList)

urlpatterns = [
    path('', include(router.urls)),
]
