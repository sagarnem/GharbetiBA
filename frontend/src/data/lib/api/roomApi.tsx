// data/lib/api/roomApi.tsx
import { Listing } from '@/types/listing';

const API = process.env.NEXT_PUBLIC_API_URL;

export async function fetchListings(): Promise<Listing[]> {
  const res = await fetch(`${API}/post/active-posts/`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error('Failed to fetch listings');
  const data = await res.json();
  return data.results;
}
