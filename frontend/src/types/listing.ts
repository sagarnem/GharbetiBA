// types/listing.ts

import { LucideIcon } from "lucide-react";

export interface Amenity {
  label: string;
  icon?: LucideIcon | null;
}

export interface Listing {
  slug: string;
  title: string;
  location: string;
  price: string;
  phone: string;
  images: string[];
  description: string[];             // array of description paragraphs
  amenities: Amenity[];
  rentalTerms: string[];
  securityFacilities: string[];
  availability: string;
  contactNote: string;
}
