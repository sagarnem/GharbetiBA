"use client";
import { useState } from "react";
import Image from "next/image";
import { MapPin,  Heart,Smile } from "lucide-react";


// import { Amenity } from "@/types/listing";
import { Listing } from "@/types/listing";

const ContentCard = ({ title, location, price, images, amenities }: Listing) => {
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

      <div className="grid grid-cols-[40%_60%] h-full ">
        {/* Image Section */}
        <div className="flex flex-col items-center bg-gray-50 h-full rounded overflow-hidden  relative">
          {/* Main Image */}
          <div className="w-full h-34 sm:h-50 aspect-video rounded overflow-hidden relative">
            <Image
              src={selectedImage}
              alt="Main"
              width={800}
              height={500}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition"></div>

            {/* Thumbnail Selector - overlaid on bottom */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3 bg-white/40 backdrop-blur-sm rounded px-2 py-1 overflow-x-auto max-w-[90%] no-scrollbar">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded overflow-hidden transition-all duration-200 
            ${
              selectedImage === img
                ? "border-2 border-orange-500 scale-110"
                : "border-2 border-transparent hover:border-gray-300 hover:scale-105"
            }
          `}
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
        </div>

        {/* Info Section */}
        <div className="p-1 pl-1.5 sm:p-4 flex flex-col justify-between gap-1.5 sm:gap-4 h-full rounded-r-2xl text-xs sm:text-sm">
          {/* Title & Location */}
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-1 sm:gap-2">
              {title}
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-600 flex items-center gap-0 mt-0.5">
              <MapPin size={14} className="text-gray-400" />
              {location}
            </p>
          </div>
          <p className="text-[11px] sm:text-xs text-gray-600 line-clamp-2">
            {title}
          </p>
          {/* Amenities */}
          <div className="flex flex-wrap gap-2 sm:gap-3 text-[11px] sm:text-xs">
            {amenities.slice(0, 3).map(({icon: Icon }, idx) => {
              // const Icon = iconMap[icon];
              return (
                <span
                  key={idx}
                  className="bg-orange-100 text-orange-700 px-2 py-[2px] rounded-full font-medium flex items-center gap-1"
                >
                  {Icon ? <Icon size={12} /> : <Smile  size={12} />}
                  {/* {label} */}
                </span>
              );
            })}
            {amenities.length > 3 && (
              <span className="text-gray-500 flex items-center">
                ...+{amenities.length - 3} more
              </span>
            )}
          </div>

          {/* Price & Contact */}
          <div className="flex sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-5 border-t border-gray-200 pt-2">
            <div>
              <p className="text-sm sm:text-base font-bold text-green-700">
                {price}
              </p>
              <p className="text-[11px] sm:text-xs text-gray-500">
                Available Now
              </p>
            </div>

            <button
              onClick={toggleWishlist}
              aria-label={
                wishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
              className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-semibold transition"
            >
              <Heart
                size={20}
                fill={wishlisted ? "#f97316" : "none"}
                stroke={wishlisted ? "#f97316" : "#9ca3af"}
                strokeWidth={2}
                className={`transition-transform duration-200 ${
                  wishlisted ? "scale-110" : "scale-100 hover:scale-105"
                }`}
              />
              {/* {wishlisted ? "Wishlisted" : "Add to Wishlist"} */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
