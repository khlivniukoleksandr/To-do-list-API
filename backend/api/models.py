from django.contrib.auth import get_user_model
from django.db import models

class Task(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("in-progress", "In Progress"),
        ("completed", "Completed"),
    ]

    title = models.CharField(max_length=100, )
    description = models.TextField(null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    #Додатково додав user щоб кожен користувач бачив лише свої завдання
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)


