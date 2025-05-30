# Generated by Django 4.2.20 on 2025-05-25 08:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='category',
            field=models.CharField(blank=True, choices=[('single_room', 'Single Room'), ('two_rooms', 'Two Rooms'), ('1_bhk', '1 BHK'), ('2_bhk', '2 BHK'), ('3_bhk', '3 BHK'), ('4_bhk', '4 BHK'), ('flat', 'Flat'), ('house', 'House'), ('bungalow', 'Bungalow'), ('apartment', 'Apartment/Housing'), ('residential_land', 'Residential Land'), ('shutter', 'Shutter'), ('office_space', 'Office Space'), ('restaurant_space', 'Restaurant/Hotel Space'), ('shop', 'Shop/Showroom'), ('commercial_land', 'Commercial Land'), ('warehouse', 'Warehouse/Godown'), ('industrial_building', 'Industrial Building')], default='single_room', max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='post',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='post',
            name='location',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='post',
            name='price',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
        migrations.AddField(
            model_name='post',
            name='rental_term',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='post',
            name='status',
            field=models.CharField(choices=[('available', 'Available'), ('sold', 'Sold Out')], default='available', max_length=20),
        ),
        migrations.CreateModel(
            name='PostImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='post_images/')),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='post.post')),
            ],
        ),
        migrations.CreateModel(
            name='Amenity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bedrooms', models.PositiveIntegerField(default=0)),
                ('bathrooms', models.CharField(choices=[('1', 'Sharing Bathroom'), ('2', 'Private Bathroom')], default='2', max_length=50)),
                ('furnished', models.BooleanField(default=False)),
                ('parking', models.BooleanField(default=False)),
                ('pets_allowed', models.BooleanField(default=False)),
                ('Balcony', models.BooleanField(default=False)),
                ('rentalfloor', models.CharField(choices=[('ground', 'Ground Floor'), ('first', 'First Floor'), ('second', 'Second Floor'), ('third', 'Third Floor'), ('fourth', 'Fourth Floor'), ('fifth', 'Fifth Floor'), ('sixth', 'Sixth Floor'), ('seventh', 'Seventh Floor'), ('eighth', 'Eighth Floor'), ('ninth', 'Ninth Floor'), ('tenth', 'Tenth Floor'), ('full', 'Full House')], default='ground', max_length=50)),
                ('road_type', models.CharField(choices=[('goreto', 'Goreto Bato'), ('black', 'Black Pitched'), ('gravel', 'Gravel Bato'), ('dhalan', 'Dhalan Bato'), ('mudddy', 'Muddy Bato')], default='black', max_length=50)),
                ('water_supply', models.BooleanField(default=False)),
                ('post', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='amenities', to='post.post')),
            ],
        ),
    ]
