from django.db import models

# Create your models here.
from embed_video.fields import EmbedVideoField

class DocumentPost(models.Model):
    docpost_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=50)
    videoUrl = EmbedVideoField()
    head0 = models.CharField(max_length=500, default="")
    chead0 = models.CharField(max_length=5000, default="")
    head1 = models.CharField(max_length=500, default="")
    chead1 = models.CharField(max_length=5000, default="")
    head2 = models.CharField(max_length=500, default="")
    chead2 = models.CharField(max_length=5000, default="")
    pub_date = models.DateField(max_length=30)
    thumbnail = models.ImageField(upload_to="documentation/images", default="")
    
    def __str__(self):
        return str(self.title)

class Video(models.Model):
    title = models.CharField(max_length=100)
    added = models.DateTimeField(auto_now_add=True)
    videoUrl = EmbedVideoField()
    
    def __str__(self):
        return str(self.title)
    
    class Meta:
        ordering = ['-added']