// types/listing.ts

import { LucideIcon } from "lucide-react";

export interface Amenity {
  label: string;
  icon?: LucideIcon | null;
}

export interface Listing {
  id: number;
  slug: string;
  title: string;
  location: string;
  price: string;
  phone: string;
  uploaded_images: string[];
  description: string[];             // array of description paragraphs
  amenities: Amenity[];
  rentalTerms: string[];
  securityFacilities: string[];
  availability: string;
  contactNote: string;
  created_at: string;
  images: string[];
}
