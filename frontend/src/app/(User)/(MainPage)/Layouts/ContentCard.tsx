"use client";
import { LucideIcon } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Info,
  Home,
  Sofa,
  Wifi,
  Truck,
  Droplet,
  Heart,
} from "lucide-react";

type Amenity = {
  label: string;
  icon: string;
};

type Props = {
  title: string;
  location: string;
  price: string;
  phone: string;
  images: string[];
  amenities: Amenity[];
};

// Map icon name strings to actual icon components
const iconMap: Record<string, LucideIcon> = {
  Sofa,
  Droplet,
  Wifi,
  Truck,
};

const ContentCard = ({
  title,
  location,
  price,
  phone,
  images,
  amenities,
}: Props) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [wishlisted, setWishlisted] = useState(false);

  const toggleWishlist = () => setWishlisted(!wishlisted);

  return (
    <div
      className="z-0
        max-w-4xl mx-auto rounded border border-gray-200
        shadow-md transition overflow-hidden bg-white max-h-[480px] relative
        hover:shadow-[0_0_10px_2px_rgba(255,165,0,0.2)] hover:border-orange-400
      "
    >
      {/* Wishlist Button */}
      <button
        onClick={toggleWishlist}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className={`
          absolute top-4 right-4 w-10 h-10 flex items-center justify-center
          bg-white shadow-md transition hover:scale-110 active:scale-95
          ${wishlisted ? "" : "text-gray-400"}
        `}
      >
        <Heart
          size={24}
          fill={wishlisted ? "" : "none"}
          strokeWidth={2.5}
          className={`transition-transform ${
            wishlisted ? "scale-110" : "scale-100"
          }`}
        />
      </button>

      <div className="grid md:grid-cols-[40%_60%] h-full">
        {/* Image Section */}
        <div className="flex flex-col items-center bg-gray-50 h-full rounded-xl overflow-hidden">
          <div className="w-full h-28 md:h-52 rounded-sm overflow-hidden mb-4 shadow-sm">
            <Image
              src={selectedImage}
              alt="Main"
              width={150}
              height={150}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(img)}
                className={`w-10 h-10 rounded-sm overflow-hidden border-2 transition ${
                  selectedImage === img
                    ? "border-orange-500 ring-1 ring-orange-300"
                    : "border-transparent hover:border-gray-300"
                }`}
                aria-label={`Select image ${i + 1}`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${i + 1}`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="p-4 flex flex-col justify-between gap-6 h-full rounded-r-4xl">
          {/* Title & Location */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
              <Home size={24} className="text-orange-500" />
              {title}
            </h2>
            <p className="text-sm text-gray-600 flex items-center gap-2 mt-2">
              <MapPin size={18} className="text-gray-400" />
              {location}
            </p>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-4 text-sm">
            {amenities.slice(0, 3).map(({ label, icon }, idx) => {
              const Icon = iconMap[icon];
              return (
                <span
                  key={idx}
                  className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium flex items-center gap-1"
                >
                  {Icon && <Icon size={16} />}
                  {label}
                </span>
              );
            })}
            {amenities.length > 3 && (
              <span className="text-gray-500 text-sm flex items-center">
                ...+{amenities.length - 3} more
              </span>
            )}
          </div>

          {/* Price & Contact */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-t border-gray-200 pt-2">
            <div>
              <p className="text-xl font-bold text-green-700">{price}</p>
              <p className="text-sm text-gray-500">Available Now</p>
            </div>

            <div className="text-sm text-gray-700 space-y-2 text-right">
              <p className="flex items-center justify-end gap-3 font-medium">
                <Phone size={20} className="text-gray-400" />
                {phone}
              </p>
              <button className="flex items-center gap-2 text-blue-600 hover:underline hover:text-blue-800 font-semibold transition">
                <Info size={20} className="text-blue-600" />
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
