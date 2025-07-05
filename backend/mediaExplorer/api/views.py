import os
import re
import shutil
import time

from rest_framework import generics, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from django.conf import settings
from django.core.files.storage import default_storage

from mediaExplorer.models import UploadedImage
from .serializers import UploadedImageSerializer


class UploadedImageListCreateAPIView(generics.ListCreateAPIView):
    queryset = UploadedImage.objects.all().order_by('-uploaded_at')
    serializer_class = UploadedImageSerializer
    pagination_class = None
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        file = request.FILES.get('image') or request.FILES.get('file')
        folder = re.sub(r'[^a-zA-Z0-9_-]', '', request.data.get('folder', '').strip())

        if not file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        sub_path = f'uploads/{folder}/' if folder else 'uploads/'
        saved_path = default_storage.save(os.path.join(sub_path, file.name), file)

        image = UploadedImage.objects.create(image=saved_path, folder=folder)
        return Response(self.get_serializer(image).data, status=status.HTTP_201_CREATED)


class RenameFolderAPIView(generics.GenericAPIView):
    serializer_class = None  # No serializer needed

    def post(self, request, *args, **kwargs):
        old_folder, new_folder = (request.data.get(k, '').strip() for k in ('old_folder', 'new_folder'))

        if not all([old_folder, new_folder]):
            return Response({"error": "Both old_folder and new_folder are required."}, status=status.HTTP_400_BAD_REQUEST)

        if any(re.sub(r'[^a-zA-Z0-9_-]', '', f) != f for f in (old_folder, new_folder)):
            return Response({"error": "Folder names contain invalid characters."}, status=status.HTTP_400_BAD_REQUEST)

        old_path = os.path.join(settings.MEDIA_ROOT, 'uploads', old_folder)
        new_path = os.path.join(settings.MEDIA_ROOT, 'uploads', new_folder)

        if not os.path.exists(old_path):
            return Response({"error": "Old folder does not exist."}, status=status.HTTP_400_BAD_REQUEST)
        if os.path.exists(new_path):
            return Response({"error": "New folder name already exists."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            shutil.move(old_path, new_path)
            images = UploadedImage.objects.filter(folder=old_folder)
            for img in images:
                img.folder = new_folder
                img.image.name = img.image.name.replace(f'uploads/{old_folder}/', f'uploads/{new_folder}/')
                img.save()
            return Response({"detail": "Folder renamed successfully."})
        except Exception as e:
            return Response({"error": f"Failed to rename folder: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UploadedImageDeleteAPIView(generics.DestroyAPIView):
    queryset = UploadedImage.objects.all()
    serializer_class = UploadedImageSerializer
    pagination_class = None
    lookup_field = 'id'

    def delete(self, request, *args, **kwargs):
        image = self.get_object()
        file_path = image.image.path
        hard_delete = request.query_params.get('hard_delete', 'false').lower() == 'true'

        try:
            if os.path.exists(file_path):
                if hard_delete:
                    os.remove(file_path)
                else:
                    recycle_bin = os.path.join(settings.MEDIA_ROOT, 'recycle_bin')
                    os.makedirs(recycle_bin, exist_ok=True)
                    filename = os.path.basename(file_path)
                    recycle_path = os.path.join(recycle_bin, filename)

                    if os.path.exists(recycle_path):
                        base, ext = os.path.splitext(filename)
                        recycle_path = os.path.join(recycle_bin, f"{base}_{int(time.time())}{ext}")

                    shutil.move(file_path, recycle_path)
        except Exception as e:
            return Response({"error": f"Failed to process file during deletion: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        image.delete()
        return Response({"detail": "Image deleted successfully", "hard_delete": hard_delete}, status=status.HTTP_204_NO_CONTENT)
