from rest_framework import serializers
from post.models import Post, Comment, Watchlist, PostImage, Amenity

class CommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'user', 'post', 'text', 'parent', 'replies', 'created_at']

    def get_replies(self, obj):
        return CommentSerializer(obj.replies.all(), many=True).data


class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ['id', 'image']


class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        exclude = ['post']


class PostSerializer(serializers.ModelSerializer):
    amenities = AmenitySerializer(required=False)
    comments = CommentSerializer(many=True, read_only=True)
    images = serializers.ListField(
        child=serializers.FileField(max_length=None, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )
    uploaded_images = PostImageSerializer(many=True, read_only=True, source='images')

    class Meta:
        model = Post
        fields = [
            'id', 'owner', 'title', 'description', 'price', 'location',
            'rental_term', 'near_by', 'category', 'status', 'is_active',
            'created_at', 'updated_at', 'amenities', 'images',
            'uploaded_images', 'comments'
        ]
        read_only_fields = ['owner', 'created_at', 'updated_at', 'uploaded_images', 'comments']

    def create(self, validated_data):
        amenities_data = validated_data.pop('amenities', None)
        images_data = validated_data.pop('images', [])

        post = Post.objects.create(**validated_data)
        
        if amenities_data and isinstance(amenities_data, dict):
            Amenity.objects.create(post=post, **amenities_data)

        for image in images_data:
            PostImage.objects.create(post=post, image=image)

        return post

class WatchlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Watchlist
        fields = ['id', 'user', 'post', 'added_at']
