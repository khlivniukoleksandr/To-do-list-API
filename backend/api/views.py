from django.db import models
from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets

from api.models import Task
from api.serializers import TaskSerializer
from todolist.filters import TaskListFilter


class ToDoList(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = TaskListFilter