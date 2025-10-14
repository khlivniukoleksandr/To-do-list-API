import django_filters

from api.models import Task


class TaskListFilter(django_filters.rest_framework.FilterSet):
    due_date = django_filters.DateFilter(field_name="due_date", lookup_expr="exact")
    status = django_filters.CharFilter(field_name="status", lookup_expr="exact")

    class Meta:
        model = Task
        fields = ["due_date", "status"]

