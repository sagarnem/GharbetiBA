from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, CommentViewSet, WatchlistViewSet, FrontendPostViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'watchlist', WatchlistViewSet)
router.register(r'active-posts', FrontendPostViewSet, basename='active-posts') 

urlpatterns = [
    path('', include(router.urls)),
]