from django.db import models

class HistoricalEvent(models.Model):
    title = models.CharField(max_length=255)
    year = models.IntegerField()
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.year})"