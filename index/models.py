from django.db import models

# Create your models here.

class Question(models.Model):
    text = models.CharField(max_length=200)
    img = models.CharField(max_length=100, blank=True, null=True,)


class Answer(models.Model):
    text = models.CharField(max_length=100)
    isCorrect = models.BooleanField(default=False)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)


