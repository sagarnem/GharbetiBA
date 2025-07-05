from django.db import models

# Create your models here.
class UploadedImage(models.Model):
    image = models.FileField(upload_to='uploads/')
    folder = models.CharField(max_length=100, blank=True, null=True) 
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.image.name

    def get_url(self):
        return self.image.url
