// data/lib/api/roomApi.tsx
import { Listing } from '@/types/listing';

const API = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8000/api';

export async function fetchListings(): Promise<Listing[]> {
  const res = await fetch(`${API}/post/active-posts/`, {
    next: { revalidate: 60 },
  });
  console.log('Fetching listings from:', `${API}/post/active-posts/`);

  if (!res.ok) throw new Error('Failed to fetch listings');
  console.log('Response status:', res.status);
  const data = await res.json();
  return data.results;
}
