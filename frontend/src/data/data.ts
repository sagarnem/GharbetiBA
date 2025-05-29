// app/_data/data.ts
import { Sofa, Droplet, Wifi, Truck } from "lucide-react";
import { Listing } from '../types/listing';
export const listings: Listing[] = [
  {
     slug: "furnished-room-kathmandus",
    title: "Spacious 1BHK Room",
    location: "Baneshwor, Kathmandu",
    price: "Rs. 12,000",
    phone: "9800000000",
    images: [
      "https://picsum.photos/seed/apt1/600/400",
      "https://picsum.photos/seed/apt2/600/400",
      "https://picsum.photos/seed/apt3/600/400",
    ],
    amenities: [
      { label: "Furnishedfsdfs sdfsd", icon: "Sofa" },
      { label: "Attached Bathroom", icon: "Droplet" },
      { label: "Free Wi-Fi", icon: "Wifi" },
      { label: "Parking", icon: "Truck" },
    ],
  },
   {
     slug: "furnished-room-kathmandus-1",
    title: "Spacious 1BHK Room",
    location: "Baneshwor, Kathmandu",
    price: "Rs. 12,000 / month",
    phone: "9800000000",
    images: [
      "https://picsum.photos/seed/apt1/600/400",
      "https://picsum.photos/seed/apt2/600/400",
      "https://picsum.photos/seed/apt3/600/400",
    ],
    amenities: [
      { label: "Furnishedfsdfs sdfsd", icon: "Sofa" },
      { label: "Attached Bathroom", icon: "Droplet" },
      { label: "Free Wi-Fi", icon: "Wifi" },
      { label: "Parking", icon: "Truck" },
    ],
  }, {
     slug: "furnished-room-kathmandus-2",
    title: "Spacious 1BHK Room",
    location: "Baneshwor, Kathmandu",
    price: "Rs. 12,000 / month",
    phone: "9800000000",
    images: [
      "https://picsum.photos/seed/apt1/600/400",
      "https://picsum.photos/seed/apt2/600/400",
      "https://picsum.photos/seed/apt3/600/400",
    ],
    amenities: [
      { label: "Furnishedfsdfs sdfsd", icon: "Sofa" },
      { label: "Attached Bathroom", icon: "Droplet" },
      { label: "Free Wi-Fi", icon: "Wifi" },
      { label: "Parking", icon: "Truck" },
    ],
  }, {
     slug: "furnished-room-kathmandus-3",
    title: "Spacious 1BHK Room",
    location: "Baneshwor, Kathmandu",
    price: "Rs. 12,000 / month",
    phone: "9800000000",
    images: [
      "https://picsum.photos/seed/apt1/600/400",
      "https://picsum.photos/seed/apt2/600/400",
      "https://picsum.photos/seed/apt3/600/400",
    ],
    amenities: [
      { label: "Furnishedfsdfs sdfsd", icon: "Sofa" },
      { label: "Attached Bathroom", icon: "Droplet" },
      { label: "Free Wi-Fi", icon: "Wifi" },
      { label: "Parking", icon: "Truck" },
    ],
  },
    {
    slug: "furnished-room-kathmandu-5",
    title: "Spacious 1BHK Room",
    location: "Baneshwor, Kathmandu",
    price: "Rs. 12,000 / month",
    phone: "9800000000",
     images: [
      "https://picsum.photos/seed/apt1/600/400",
      "https://picsum.photos/seed/apt2/600/400",
      "https://picsum.photos/seed/apt3/600/400",
    ],
    amenities: [
      { label: "Furnished", icon: "Sofa" },
      { label: "Attached Bathroom", icon: "Droplet" },
      { label: "Free Wi-Fi", icon: "Wifi" },
      { label: "Parking", icon: "Truck" },
    ],
  },  {
     slug: "spacious-1bhk-kathmandu-1",
    title: "Spacious 1BHK Room",
    location: "Baneshwor, Kathmandu",
    price: "Rs. 12,000 / month",
    phone: "9800000000",
    images: ["/img1.jpg", "/img2.jpg", "/img3.jpg"],
    amenities: [
      { label: "Furnished", icon: "Sofa" },
      { label: "Attached Bathroom", icon: "Droplet" },
      { label: "Free Wi-Fi", icon: "Wifi" },
      { label: "Parking", icon: "Truck" },
    ],
  }, 
 
  // ... more listings if needed
];

export const descriptions = [
  {
    slug: "furnished-room-kathmandus",
    title: "Property Description - Spacious 1BHKasdasd",
    description: [
      "Welcome to this spacious 1BHK room in BaneshworWelcome to this spacious 1BHK room in BaneshworWelcome to this spacious 1BHK room in BaneshworWelcome to this spacious 1BHK room in BaneshworWelcome to this spacious 1BHK room in Baneshwor...",
      "Peaceful and secure neighborhood with easy access...",
    ],
    location: "Baneshwor, Kathmandu",
    keyAmenities: [
      { icon: Wifi, text: "Fully Furnished" },
      { icon: Droplet, text: "Attached Bathroom" },
      { icon: Wifi, text: "High-Speed Wi-Fi" },
      { icon: Truck, text: "Parking Available" },
    ],
    rentalTerms: ["Minimum lease term: 6 months", "No pets allowed"],
    securityFacilities: ["CCTV surveillance", "On-call maintenance support"],
    price: "Rs. 12,000",
    availability: "Available Now",
    phone: "9800000000",
    contactNote: "Schedule a visit today.",
  },
  {
    title: "Property Description - Cozy Studiosad",
    slug: "furnished-room-kathmandu-1",
    description: [
      "This cozy studio apartment is located in Lazimpat...",
      "Great location for professionals and students.",
    ],
    location: "Lazimpat, Kathmandu",
    keyAmenities: [
      { icon: Sofa, text: "Fully Furnished" },
      { icon: Droplet, text: "Private Bathroom" },
      { icon: Wifi, text: "Wi-Fi Included" },
    ],
    rentalTerms: [
      "Minimum lease term: 3 months",
      "No smoking inside the apartment",
    ],
    securityFacilities: ["24/7 security guard", "Secure entrance"],
    price: "Rs. 15,000 / month",
    availability: "Available From June",
    phone: "9811111111",
    contactNote: "Contact for viewing appointment.",
  },
];
