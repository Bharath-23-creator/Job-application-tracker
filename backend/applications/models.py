
from django.conf import settings
from django.db import models


class JobApplication(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='job_applications',
        null=True,
        blank=True,
    )
    company = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    job_type = models.CharField(max_length=50)
    salary = models.CharField(max_length=50)
    application_date = models.DateField()
    job_link = models.URLField(blank=True)
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=50, default='Applied')

    def __str__(self):
        return f"{self.company} - {self.role}"
