// types/listing.ts

export interface Amenity {
  bedrooms?: number;
  bathrooms?: number;
  furnished?: boolean;
  parking?: boolean;
  pets_allowed?: boolean;
  Balcony?: boolean;
  rentalfloor?: string | number;
  road_type?: string;
  water_supply?: boolean;
}


export interface Listing {
  id: number;
  slug: string;
  title: string;
  location: string;
  price: string;
  phone: string;
  uploaded_images: { id: number; image: string }[];
  description: string | string[];             // array of description paragraphs
  amenities: Amenity;
  rentalTerms: string[];
  securityFacilities: string[];
  availability: string;
  contactNote: string;
  created_at: string;
}
