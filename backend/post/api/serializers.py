from rest_framework import serializers
from post.models import Post, Comment, Watchlist, PostImage, Amenity
import json
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

class MultiSelectFieldSerializer(serializers.Field):
    def to_representation(self, value):
        if not value:
            return []

        if isinstance(value, str):
            return value.split(',')

        if isinstance(value, (list, tuple)):
            return list(value)

        raise TypeError(f'Unexpected type for near_by: {type(value)}')

    def to_internal_value(self, data):
        if isinstance(data, str):
            try:
                data = json.loads(data)
            except json.JSONDecodeError:
                raise serializers.ValidationError('Expected a list of items or valid JSON string.')

        if not isinstance(data, list):
            raise serializers.ValidationError('Expected a list of items.')

        valid_choices = dict(self.parent.Meta.model._meta.get_field('near_by').choices)
        for item in data:
            if item not in valid_choices:
                raise serializers.ValidationError(f'Invalid choice: {item}')
        
        return ','.join(data)


class PostSerializer(serializers.ModelSerializer):
    near_by = MultiSelectFieldSerializer()
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
