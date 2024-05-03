from django.db import models

# Create your models here.
       
class Contact(models.Model):
    sno = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=13)
    email = models.EmailField(max_length=100)
    Issue = models.TextField(max_length=250, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email
    
class Feedback(models.Model):
    sno = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=100)
    feedbackMsg = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email

class FAQ(models.Model):
    sno = models.AutoField(primary_key=True)
    question = models.CharField(max_length=255)
    answer = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question
    
class LearnMore(models.Model):
    sno = models.AutoField(primary_key=True)
    algorithm = models.CharField(max_length=255)
    defination = models.CharField(max_length=255)
    timeComplexity = models.CharField(max_length=255)
    spaceComplexity = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.algorithm