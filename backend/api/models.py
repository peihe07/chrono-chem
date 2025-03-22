from django.db import models

class Era(models.Model):
    title = models.CharField(max_length=100)
    year = models.IntegerField()
    description = models.TextField()

    def __str__(self):
        return f"{self.title} ({self.year})"

class Scientist(models.Model):
    name = models.CharField(max_length=100)
    birth_year = models.IntegerField(null=True, blank=True)
    death_year = models.IntegerField(null=True, blank=True)
    bio = models.TextField()
    era = models.ForeignKey(Era, related_name='scientists', on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Event(models.Model):
    title = models.CharField(max_length=150)
    year = models.IntegerField()
    description = models.TextField()
    location = models.CharField(max_length=100)
    era = models.ForeignKey(Era, related_name='events', on_delete=models.CASCADE)
    scientists = models.ManyToManyField(Scientist, related_name='events')

    def __str__(self):
        return self.title