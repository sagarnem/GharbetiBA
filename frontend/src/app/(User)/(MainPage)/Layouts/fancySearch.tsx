"use client";

import { useState } from 'react';
import { FiSearch, FiMapPin, FiChevronDown, FiSliders } from 'react-icons/fi';

export default function HeroSearchSection() {
  const [showAdvanced, setShowAdvanced] = useState(false);


  // Nepal-specific cities and districts
  const nepalLocations = [
    "Kathmandu", "Pokhara", "Lalitpur", "Bhaktapur", "Biratnagar",
    "Bharatpur", "Birgunj", "Butwal", "Dharan", "Nepalgunj",
    "Hetauda", "Itahari", "Janakpur", "Kirtipur", "Tulsipur"
  ];

  // Nepal-specific property types
  const propertyTypes = [
    { value: "apartment", label: "Apartment" },
    { value: "house", label: "House" },
    { value: "room", label: "Room" },
    { value: "studio", label: "Studio" },
    { value: "land", label: "Land" },
    { value: "commercial", label: "Commercial" },
    { value: "flat", label: "Flat" }
  ];

  // Nepal-specific price ranges (in NPR)
  const priceRanges = [
    { value: "0-10000", label: "Rs 0-10,000" },
    { value: "10001-20000", label: "Rs 10,001-20,000" },
    { value: "20001-40000", label: "Rs 20,001-40,000" },
    { value: "40001-70000", label: "Rs 40,001-70,000" },
    { value: "70001-100000", label: "Rs 70,001-1,00,000" },
    { value: "100001+", label: "Rs 1,00,001+" }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white rounded-xl shadow-md">
      {/* Search Tabs */}


      {/* Main Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Location Input with Nepal-specific suggestions */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiMapPin className="text-gray-400" />
          </div>
          <input
            type="text"
            list="nepal-locations"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
            placeholder="City, district, or area"
          />
          <datalist id="nepal-locations">
            {nepalLocations.map((location) => (
              <option key={location} value={location} />
            ))}
          </datalist>
        </div>

        {/* Property Type - Nepal specific */}
        <div className="relative flex-1">
          <select className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition">
            <option value="">All Property Types</option>
            {propertyTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
        </div>

        {/* Price Range - NPR */}
        <div className="relative flex-1">
          <select className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition">
            <option value="">Price Range (NPR)</option>
            {priceRanges.map((range) => (
              <option key={range.value} value={range.value}>{range.label}</option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
        </div>

        {/* Search Button */}
        <button className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
          <FiSearch />
          <span>Search</span>
        </button>
      </div>

      {/* Advanced Search Toggle */}
      <button 
        className="mt-4 flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors"
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        <FiSliders className="mr-2" />
        {showAdvanced ? 'Hide Advanced' : 'Show Advanced'} Search
      </button>

      {/* Advanced Search Options - Nepal focused */}
      {showAdvanced && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
              <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition">
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
              <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition">
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
              </select>
            </div>

            {/* Area in Aana/Ropani */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
              <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition">
                <option value="">Any</option>
                <option value="1-2">1-2 Aana</option>
                <option value="3-5">3-5 Aana</option>
                <option value="1-2ropani">1-2 Ropani</option>
                <option value="3-5ropani">3-5 Ropani</option>
                <option value="5+ropani">5+ Ropani</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Amenities - Nepal specific */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amenities</label>
              <div className="grid grid-cols-2 gap-2">
                {['Parking', 'Water Supply', 'Furnished', 'Backup Electricity', 'Security', 'Garden'].map((amenity) => (
                  <label key={amenity} className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      className="rounded text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Available From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Available From</label>
              <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition">
                <option value="">Any Time</option>
                <option value="immediate">Immediate</option>
                <option value="1month">Within 1 Month</option>
                <option value="3months">Within 3 Months</option>
              </select>
            </div>

            {/* Property Facing - Important in Nepal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facing Direction</label>
              <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition">
                <option value="">Any Direction</option>
                <option value="east">East</option>
                <option value="west">West</option>
                <option value="north">North</option>
                <option value="south">South</option>
                <option value="northeast">North-East</option>
                <option value="northwest">North-West</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}