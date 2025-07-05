from django.db import models
from django.conf import settings
from django.utils.text import slugify
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
    slug = models.SlugField(max_length=300, unique=True, editable=False)

    def __str__(self):
        return self.title
    
    def _generate_slug_base(self) -> str:
        """
        Turn the title into a URL‑safe slug. Strip trailing dashes
        so appending '-<id>' later looks clean.
        """
        return slugify(self.title).strip('-')

    # ---------- main save override ----------
    def save(self, *args, **kwargs):
        # Create slug only if we don't have one yet OR the title changed
        if not self.slug or self._state.adding or self.title_changed():
            base_slug = self._generate_slug_base()

            # First attempt: just the slugified title
            tentative_slug = base_slug

            # Does it already exist (other rows)?
            if Post.objects.filter(slug=tentative_slug).exclude(pk=self.pk).exists():
                # We need the primary‑key for uniqueness, so make sure we have it:
                if not self.pk:
                    super().save(*args, **kwargs)  # First save generates self.pk

                # Append the id to guarantee uniqueness
                tentative_slug = f"{base_slug}-{self.pk}"

            self.slug = tentative_slug

        super().save(*args, **kwargs)

    # ---------- utility to detect title change ----------
    def title_changed(self) -> bool:
        if not self.pk:
            return True  # new object
        old_title = Post.objects.filter(pk=self.pk).values_list('title', flat=True).first()
        return old_title != self.title
    

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
