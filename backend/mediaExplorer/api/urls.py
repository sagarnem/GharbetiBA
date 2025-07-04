from django.urls import path
from mediaExplorer.api.views import (
    UploadedImageListCreateAPIView,
    # UploadedImageDetailAPIView,
    UploadedImageDeleteAPIView,
    RenameFolderAPIView
)

urlpatterns = [
    path('images/', UploadedImageListCreateAPIView.as_view(), name='image-list-create'),
    # path('images/<int:pk>/', UploadedImageDetailAPIView.as_view(), name='image-detail'),
    path('images/<int:id>/', UploadedImageDeleteAPIView.as_view(), name='image-delete'),
    path('rename-folder/', RenameFolderAPIView.as_view(), name='rename-folder'),
]
