'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'

export default function PostForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
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
      formData.append('is_active', data.is_active ? 'true' : 'false')

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

      const API_URL = 'http://localhost:8000/api/post/posts/'
      const token = localStorage.getItem('access_token')

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

  const nearbyOptions = [
    { value: 'school', label: 'School' },
    { value: 'hospital', label: 'Hospital' },
    { value: 'market', label: 'Market' },
    { value: 'bus_stop', label: 'Bus Stop' },
    { value: 'park', label: 'Park' },
    { value: 'temple', label: 'Temple' },
    { value: 'mosque', label: 'Mosque' },
    { value: 'church', label: 'Church' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'shopping_mall', label: 'Shopping Mall' },
    { value: 'bank', label: 'Bank' },
    { value: 'atm', label: 'ATM' },
    { value: 'gym', label: 'Gym' },
    { value: 'pharmacy', label: 'Pharmacy' },
    { value: 'gas_station', label: 'Gas Station' },
    { value: 'police_station', label: 'Police Station' },
  ]

  const categoryOptions = [
    // Residential
    { value: 'single_room', label: 'Single Room' },
    { value: 'two_rooms', label: 'Two Rooms' },
    { value: '1_bhk', label: '1 BHK' },
    { value: '2_bhk', label: '2 BHK' },
    { value: '3_bhk', label: '3 BHK' },
    { value: '4_bhk', label: '4 BHK' },
    { value: 'flat', label: 'Flat' },
    { value: 'house', label: 'House' },
    { value: 'bungalow', label: 'Bungalow' },
    { value: 'apartment', label: 'Apartment/Housing' },
    { value: 'residential_land', label: 'Residential Land' },
    // Commercial
    { value: 'shutter', label: 'Shutter' },
    { value: 'office_space', label: 'Office Space' },
    { value: 'restaurant_space', label: 'Restaurant/Hotel Space' },
    { value: 'shop', label: 'Shop/Showroom' },
    { value: 'commercial_land', label: 'Commercial Land' },
    { value: 'warehouse', label: 'Warehouse/Godown' },
    { value: 'industrial_building', label: 'Industrial Building' },
  ]

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'sold', label: 'Sold Out' },
  ]

  const bathroomOptions = [
    { value: '1', label: 'Sharing Bathroom' },
    { value: '2', label: 'Private Bathroom' },
  ]

  const floorOptions = [
    { value: 'ground', label: 'Ground Floor' },
    { value: 'first', label: 'First Floor' },
    { value: 'second', label: 'Second Floor' },
    { value: 'third', label: 'Third Floor' },
    { value: 'fourth', label: 'Fourth Floor' },
    { value: 'fifth', label: 'Fifth Floor' },
    { value: 'sixth', label: 'Sixth Floor' },
    { value: 'seventh', label: 'Seventh Floor' },
    { value: 'eighth', label: 'Eighth Floor' },
    { value: 'ninth', label: 'Ninth Floor' },
    { value: 'tenth', label: 'Tenth Floor' },
    { value: 'full', label: 'Full House' },
  ]

  const roadTypeOptions = [
    { value: 'goreto', label: 'Goreto Bato' },
    { value: 'black', label: 'Black Pitched' },
    { value: 'gravel', label: 'Gravel Bato' },
    { value: 'dhalan', label: 'Dhalan Bato' },
    { value: 'mudddy', label: 'Muddy Bato' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Create New Property Listing</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="divide-y divide-gray-200">
            {/* Basic Information Section */}
            <div className="px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title*
                  </label>
                  <input
                    {...register('title', { required: true })}
                    id="title"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-600">Title is required</p>}
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description*
                  </label>
                  <textarea
                    {...register('description', { required: true })}
                    id="description"
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">Description is required</p>}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price (Rs.)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="number"
                      step="0.01"
                      {...register('price')}
                      id="price"
                      className="block w-full rounded-md border-gray-300 pl-3 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    {...register('location')}
                    id="location"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Property Type
                  </label>
                  <select
                    {...register('category')}
                    id="category"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    {...register('status')}
                    id="status"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="near_by" className="block text-sm font-medium text-gray-700">
                    Nearby Places
                  </label>
                  <select
                    {...register('near_by')}
                    id="near_by"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  >
                    <option value="">Select nearby place</option>
                    {nearbyOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="rental_term" className="block text-sm font-medium text-gray-700">
                    Rental Terms
                  </label>
                  <input
                    {...register('rental_term')}
                    id="rental_term"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  />
                </div>

                <div className="sm:col-span-6">
                  <div className="flex items-center">
                    <input
                      {...register('is_active')}
                      id="is_active"
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                      Active Listing
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities Section */}
            <div className="px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Amenities</h3>
              
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    {...register('bedrooms')}
                    id="bedrooms"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">
                    Bathroom Type
                  </label>
                  <select
                    {...register('bathrooms')}
                    id="bathrooms"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  >
                    {bathroomOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="rentalfloor" className="block text-sm font-medium text-gray-700">
                    Floor
                  </label>
                  <select
                    {...register('rentalfloor')}
                    id="rentalfloor"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  >
                    {floorOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="road_type" className="block text-sm font-medium text-gray-700">
                    Road Type
                  </label>
                  <select
                    {...register('road_type')}
                    id="road_type"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  >
                    {roadTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <fieldset className="space-y-2">
                    <legend className="text-sm font-medium text-gray-700">Features</legend>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <input
                          {...register('furnished')}
                          id="furnished"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="furnished" className="ml-2 block text-sm text-gray-700">
                          Furnished
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          {...register('parking')}
                          id="parking"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="parking" className="ml-2 block text-sm text-gray-700">
                          Parking
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          {...register('pets_allowed')}
                          id="pets_allowed"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="pets_allowed" className="ml-2 block text-sm text-gray-700">
                          Pets Allowed
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          {...register('Balcony')}
                          id="Balcony"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="Balcony" className="ml-2 block text-sm text-gray-700">
                          Balcony
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          {...register('water_supply')}
                          id="water_supply"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="water_supply" className="ml-2 block text-sm text-gray-700">
                          Water Supply
                        </label>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Property Images</h3>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="images"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                    >
                      <span>Upload files</span>
                      <input
                        {...register('images')}
                        id="images"
                        type="file"
                        multiple
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="px-6 py-4 bg-gray-50 text-right">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : 'Create Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}