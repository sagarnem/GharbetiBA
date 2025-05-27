export interface Amenity {
  label: string;
  icon: string; // You could use a union type if icons are limited, e.g., "Sofa" | "Wifi" | ...
}

export interface Listing {
  slug: string;
  title: string;
  location: string;
  price: string;
  phone: string;
  images: string[];
  amenities: Amenity[];
}