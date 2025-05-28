"use client";
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
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className=" w-full h-24 md:h-28 lg:h-32 flex items-center justify-center bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg mb-2 shadow-sm">
          <p className="text-base md:text-lg font-medium text-orange-800">
            Your Banner Ad Here
          </p>
        </div>

        <HeroSearchSection />

        {/* Listings + Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          {/* Sidebar Listings */}
          <div className=" overflow-y-auto">
            {visibleListings.map((listing, i) => (
              <section
                key={listing.slug}
                onClick={() => handleListingClick(listing, i)}
                className={`cursor-pointer border rounded mb-2   ${
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
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
