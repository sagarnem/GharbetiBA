from django.db import models
from django.conf import settings
from multiselectfield import MultiSelectField
User = settings.AUTH_USER_MODEL

class Post(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    rental_term = models.TextField(null=True, blank=True)
    near_by = MultiSelectField(max_length=255, blank=True, null=True, choices=[
        ('school', 'School'),
        ('hospital', 'Hospital'),
        ('market', 'Market'),
        ('bus_stop', 'Bus Stop'),
        ('park', 'Park'),
        ('temple', 'Temple'),
        ('mosque', 'Mosque'),
        ('church', 'Church'),
        ('restaurant', 'Restaurant'),
        ('shopping_mall', 'Shopping Mall'),
        ('bank', 'Bank'),
        ('atm', 'ATM'),
        ('gym', 'Gym'),
        ('pharmacy', 'Pharmacy'),
        ('gas_station', 'Gas Station'),
        ('police_station', 'Police Station'),
        ])
    category = models.CharField(
    max_length=50,
    choices=[
        # Residential Property Types
        ('single_room', 'Single Room'),
        ('two_rooms', 'Two Rooms'),
        ('1_bhk', '1 BHK'),
        ('2_bhk', '2 BHK'),
        ('3_bhk', '3 BHK'),
        ('4_bhk', '4 BHK'),
        ('flat', 'Flat'),
        ('house', 'House'),
        ('bungalow', 'Bungalow'),
        ('apartment', 'Apartment/Housing'),
        ('residential_land', 'Residential Land'),

        # Commercial Property Types
        ('shutter', 'Shutter'),
        ('office_space', 'Office Space'),
        ('restaurant_space', 'Restaurant/Hotel Space'),
        ('shop', 'Shop/Showroom'),
        ('commercial_land', 'Commercial Land'),
        ('warehouse', 'Warehouse/Godown'),
        ('industrial_building', 'Industrial Building'),
    ],
    default='single_room', blank=True, null=True
)
    status = models.CharField(max_length=20, choices=[
        ('available', 'Available'),
        ('sold', 'Sold Out'),
    ], default='available')

    def __str__(self):
        return self.title
    

class PostImage(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='post_images/')

    def __str__(self):
        return f"Image for {self.post.title}"
    

class Amenity(models.Model):
    post = models.OneToOneField(Post, on_delete=models.CASCADE, related_name='amenities')
    bedrooms = models.PositiveIntegerField(default=0)
    bathrooms = models.CharField(max_length=50, choices=[
        ('1', 'Sharing Bathroom'),
        ('2', 'Private Bathroom'),
    ], default='2')
    furnished = models.BooleanField(default=False)
    parking = models.BooleanField(default=False)
    pets_allowed = models.BooleanField(default=False)
    Balcony = models.BooleanField(default=False)
    rentalfloor = models.CharField(max_length=50, choices=[
        ('ground', 'Ground Floor'),
        ('first', 'First Floor'),
        ('second', 'Second Floor'),
        ('third', 'Third Floor'),
        ('fourth', 'Fourth Floor'),
        ('fifth', 'Fifth Floor'),
        ('sixth', 'Sixth Floor'),
        ('seventh', 'Seventh Floor'),
        ('eighth', 'Eighth Floor'),
        ('ninth', 'Ninth Floor'),
        ('tenth', 'Tenth Floor'),
        ('full', 'Full House'),
    ], default='ground')
    road_type = models.CharField(max_length=50, choices=[
        ('goreto', 'Goreto Bato'),
        ('black', 'Black Pitched'),
        ('gravel', 'Gravel Bato'),
        ('dhalan', 'Dhalan Bato'),
        ('mudddy', 'Muddy Bato'),
    ], default='black')
    water_supply = models.BooleanField(default=False)

    def __str__(self):
        return f"Amenity for Post: {self.post.title}"

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.email}"

class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='watchlist')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='watchlisted_by')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')
