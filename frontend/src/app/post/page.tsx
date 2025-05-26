'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'

export default function PostForm() {
  const { register, handleSubmit, reset } = useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)

    try {
      const formData = new FormData()

      // Add post fields
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('price', data.price)
      formData.append('location', data.location)
      formData.append('category', data.category)
      formData.append('status', data.status)
      formData.append('near_by', data.near_by)
      formData.append('rental_term', data.rental_term)

      // Add amenity fields
      formData.append('amenities.bedrooms', data.bedrooms)
      formData.append('amenities.bathrooms', data.bathrooms)
      formData.append('amenities.furnished', data.furnished ? 'true' : 'false')
      formData.append('amenities.parking', data.parking ? 'true' : 'false')
      formData.append('amenities.pets_allowed', data.pets_allowed ? 'true' : 'false')
      formData.append('amenities.Balcony', data.Balcony ? 'true' : 'false')
      formData.append('amenities.rentalfloor', data.rentalfloor)
      formData.append('amenities.road_type', data.road_type)
      formData.append('amenities.water_supply', data.water_supply ? 'true' : 'false')

      // Add images
      for (let i = 0; i < data.images.length; i++) {
        formData.append('images', data.images[i])
      }

      // Replace with your Django API endpoint
      const API_URL = 'http://localhost:8000/api/post/posts/'

      const token = localStorage.getItem('access_token') // or however you store JWT

      await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })
      alert('Post created successfully!')
      reset()
    } catch (error) {
      console.error(error)
      alert('Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-4">
      <h2>Create a Post</h2>

      <input {...register('title')} placeholder="Title" required />
      <textarea {...register('description')} placeholder="Description" required />
      <input type="number" step="0.01" {...register('price')} placeholder="Price" />
      <input {...register('location')} placeholder="Location" />
      
      <select {...register('category')} defaultValue="single_room">
        <option value="single_room">Single Room</option>
        <option value="1_bhk">1 BHK</option>
        <option value="2_bhk">2 BHK</option>
        <option value="shop">Shop</option>
      </select>

      <select {...register('status')} defaultValue="available">
        <option value="available">Available</option>
        <option value="sold">Sold Out</option>
      </select>

      <input {...register('near_by')} placeholder="Nearby (e.g. school)" />
      <input {...register('rental_term')} placeholder="Rental Term" />

      <h3>Amenities</h3>
      <input type="number" {...register('bedrooms')} placeholder="Bedrooms" />
      <select {...register('bathrooms')}>
        <option value="1">Sharing Bathroom</option>
        <option value="2">Private Bathroom</option>
      </select>
      <label><input type="checkbox" {...register('furnished')} /> Furnished</label>
      <label><input type="checkbox" {...register('parking')} /> Parking</label>
      <label><input type="checkbox" {...register('pets_allowed')} /> Pets Allowed</label>
      <label><input type="checkbox" {...register('Balcony')} /> Balcony</label>
      <select {...register('rentalfloor')}>
        <option value="ground">Ground Floor</option>
        <option value="first">First Floor</option>
      </select>
      <select {...register('road_type')}>
        <option value="black">Black Pitched</option>
        <option value="mudddy">Muddy Road</option>
      </select>
      <label><input type="checkbox" {...register('water_supply')} /> Water Supply</label>

      <input type="file" multiple {...register('images')} />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Create Post'}
      </button>
    </form>
  )
}
