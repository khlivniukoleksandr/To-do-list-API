from django.db import models
from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets

from api.models import Task
from api.serializers import TaskSerializer
from todolist.filters import TaskListFilter

def homepage_view(request):
    return render(request, 'homepage.html')

class ToDoList(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = TaskListFilter

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user).order_by('due_date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def list(self, request, *args, **kwargs):
        if request.accepted_renderer.format == 'html':
            return render(request, "to-do-list.html")
        return super().list(request, *args, **kwargs)

