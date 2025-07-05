from rest_framework import serializers
from mediaExplorer.models import UploadedImage
class UploadedImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedImage
        fields = '__all__'