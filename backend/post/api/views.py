from rest_framework import viewsets, permissions, status, filters
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, CharFilter, NumberFilter
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from post.models import Post, PostImage, Amenity, Comment, Watchlist
from .serializers import (
    PostSerializer, PostImageSerializer,
    AmenitySerializer, CommentSerializer, WatchlistSerializer
)
from post.permissions import IsOwnerOrReadOnly, IsCommentOwnerOrReadOnly, IsOwnerRole
import logging

logger = logging.getLogger(__name__)

class FrontendPostFilter(FilterSet):
    title = CharFilter(field_name='title', lookup_expr='icontains')
    location = CharFilter(field_name='location', lookup_expr='icontains')
    category = CharFilter(field_name='category', lookup_expr='iexact')
    min_price = NumberFilter(field_name='price', lookup_expr='gte')
    max_price = NumberFilter(field_name='price', lookup_expr='lte')

    class Meta:
        model = Post
        fields = ['title', 'location', 'category', 'min_price', 'max_price']


class FrontendPostViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Post.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = PostSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = FrontendPostFilter
    search_fields = ['title', 'location', 'category']

class PostViewSet(viewsets.ModelViewSet):
    permission_classes = []

    def get_queryset(self):
        # Only return posts created by the logged-in user
        user = self.request.user
        if user.is_authenticated:
            return Post.objects.filter(owner=user)\
                .select_related('owner', 'amenities')\
                .prefetch_related('comments', 'images')\
                .order_by('-created_at')
        return Post.objects.none()  # Unauthenticated users get nothing

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated(), IsOwnerRole()]
        elif self.action in ['update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsOwnerOrReadOnly()]
        return [permissions.IsAuthenticated()]  # Optional: restrict listing to logged-in users

    def get_serializer_class(self):
        return PostSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            logger.error(f"Post creation validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def upload_images(self, request, pk=None):
        post = self.get_object()
        images = request.FILES.getlist('images')
        for img in images:
            PostImage.objects.create(post=post, image=img)
        return Response({"message": "Images uploaded"}, status=201)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-created_at')
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsCommentOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_serializer_context(self):
        return {'request': self.request, 'depth': 0}

class WatchlistViewSet(viewsets.ModelViewSet):
    queryset = Watchlist.objects.all()
    serializer_class = WatchlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Watchlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != request.user:
            return Response({"error": "You can only remove your own watchlist items."}, status=403)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
