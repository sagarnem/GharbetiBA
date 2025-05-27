'use client';
import React, {
  ReactNode,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import ContentCard from "./Layouts/ContentCard";
import { debounce } from "lodash";
import { useParams, useRouter } from "next/navigation";
import { listings } from "../../../data/data";
import HeroSearchSection from "./Layouts/fancySearch";
import { Listing } from "@/types/listing";
const PAGE_SIZE = 10;

export default function RoomsLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const params = useParams();
  const slug = decodeURIComponent((params?.slug as string) || "");
  const [selected, setSelected] = useState<string | null>(slug || null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleListings, setVisibleListings] = useState<Listing[]>(
    listings.slice(0, PAGE_SIZE)
  );
  const isLoading = useRef(false);

  // Load more listings for infinite scroll
  const loadMoreListings = useCallback(() => {
    if (isLoading.current || visibleListings.length >= listings.length) return;
    isLoading.current = true;

    const nextItems = listings.slice(
      visibleListings.length,
      visibleListings.length + PAGE_SIZE
    );

    setVisibleListings((prev) => [...prev, ...nextItems]);

    setTimeout(() => {
      isLoading.current = false;
    }, 300);
  }, [visibleListings]);

  // Scroll listener with debounce to load more when near bottom
  useEffect(() => {
    const handleScroll = debounce(() => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.scrollHeight;

      // Trigger loading more when scrolled at least 50%
      if ((scrollTop + windowHeight) / fullHeight >= 0.5) {
        loadMoreListings();
      }
    }, 100);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScroll.cancel();
    };
  }, [loadMoreListings]);

  // Update active index if listings change
  useEffect(() => {
    if (activeIndex >= visibleListings.length) {
      setActiveIndex(visibleListings.length - 1);
    }
  }, [visibleListings, activeIndex]);

  // Sync selected and activeIndex when slug changes (URL param)
  useEffect(() => {
    if (!slug) return;
    const index = listings.findIndex((item) => item.slug === slug);
    if (index !== -1) {
      setActiveIndex(index);
      setSelected(slug);
    }
  }, [slug]);

  // Get description matching active listing or fallback


  // Clicking a listing updates active state and URL without scroll jump
  const handleListingClick = (listing: Listing, index: number) => {
    setActiveIndex(index);
    setSelected(listing.slug);
    router.replace(`/${encodeURIComponent(listing.slug)}`, {
      scroll: false,
    });
  };

  return (
    <>
      {/* Hero Section */}
      <div className="mx-28">
    <div className="bg-red-200 w-full h-24 md:h-28 lg:h-32 flex items-center justify-center">
  <p className="text-base md:text-lg font-medium text-red-800">
    Your Banner Ad Here
  </p>
</div>

   {/* <section className="relative bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 py-16 px-6 text-center shadow-inner">
  <div className="absolute inset-0 bg-orange-50 opacity-40" />
  <div className="relative z-10 max-w-2xl mx-auto">
    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-4 leading-tight drop-shadow">
      Find Your Perfect Room
    </h1>
    <p className="text-lg md:text-xl text-gray-600 mb-6">
      In Kathmandu and Beyond — Filter, Compare, and Discover Comfort
    </p>
    <div className="flex items-center mt-8 shadow-lg rounded-full overflow-hidden bg-white border border-gray-200 focus-within:ring-2 focus-within:ring-orange-400">
      <input
        type="text"
        placeholder="Search by area, city, or landmark..."
        className="flex-grow px-6 py-4 text-base outline-none text-gray-800 placeholder-gray-500"
      />
      <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-4 font-semibold transition duration-200">
        Search
      </button>
    </div>
  </div>
</section> */}
<HeroSearchSection/>




      {/* Listings + Description */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {/* Sidebar Listings */}
        <div className="min-h-[80vh] overflow-y-auto">
          {visibleListings.map((listing, i) => (
            <section
              key={listing.slug}
              onClick={() => handleListingClick(listing, i)}
              className={`cursor-pointer border rounded mb-4 px-2 py-2 ${
                listing.slug === selected
                  ? "border-orange-500 border-2 bg-orange-50"
                  : "border-gray-300"
              }`}
            >
              <ContentCard {...listing} />
            </section>
          ))}
          {visibleListings.length < listings.length && (
            <p className="text-center text-gray-500 py-4">Loading more...</p>
          )}
        </div>

        {/* Main Content Description */}
        <div className="sticky top-28 self-start h-fit  max-h-[80vh]">
          {children }
        </div>
      </div></div>
    </>
  );
}
