from django.db import models
from django.shortcuts import render
from rest_framework import viewsets

from api.models import Task
from api.serializers import TaskSerializer


class TodoList(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
