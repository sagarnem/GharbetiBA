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
import HeroSearchSection from "./Layouts/fancySearch";
import { Listing } from "@/types/listing";
import { fetchListings } from "@/data/data";
import MobileFooterNav from "./Layouts/MobilefooterNav";
import { Filter } from "lucide-react";
const PAGE_SIZE = 10;

export default function RoomsLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const params = useParams();
  const slug = decodeURIComponent((params?.slug as string) || "");

  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [visibleListings, setVisibleListings] = useState<Listing[]>([]);
  const [selected, setSelected] = useState<string | null>(slug || null);
  // const [activeIndex, setActiveIndex] = useState(0);
  const isLoading = useRef(false);

  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    fetchListings().then((data) => {
      setAllListings(data);
      setVisibleListings(data.slice(0, PAGE_SIZE));
    });
  }, []);
  // Fetch listings once
  useEffect(() => {
    if (!allListings.length) return; // Wait till listings are fetched

    const index = allListings.findIndex((item) => item.slug === slug);
    if (slug && index !== -1) {
      setSelected(slug);
      // setActiveIndex(index);
    } else {
      setSelected(null);
      // setActiveIndex(0);
    }
  }, [slug, allListings]);

  // Load more listings on scroll
  const loadMoreListings = useCallback(() => {
    if (isLoading.current || visibleListings.length >= allListings.length)
      return;
    isLoading.current = true;

    const nextItems = allListings.slice(
      visibleListings.length,
      visibleListings.length + PAGE_SIZE
    );

    setVisibleListings((prev) => [...prev, ...nextItems]);

    setTimeout(() => {
      isLoading.current = false;
    }, 300);
  }, [visibleListings, allListings]);

  useEffect(() => {
    const handleScroll = debounce(() => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.scrollHeight;

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

  const handleListingClick = (listing: Listing) => {
    setSelected(listing.slug);
    router.replace(`/${encodeURIComponent(listing.slug)}`, {
      scroll: false,
    });
    setModalOpen(true);

    if (window.innerWidth < 768) {
      setModalOpen(true);
    }
  };

  return (
    <div className="max-w-[1320px] w-full mx-auto px-2 sm:px-4">
      {/* Hero Section */}
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className=" w-full h-24 md:h-28 lg:h-32 flex items-center justify-center bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg mb-2 shadow-sm">
          <p className="text-base md:text-lg font-medium text-orange-800">
            Your Banner Ad Here
          </p>
        </div>

        {/* Search Section */}
        <HeroSearchSection />

        {/* Listings and Detail Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
           
          {/* Sidebar - Listings */}
          <div className="overflow-y-auto">
            <div className="flex justify-between">
            <h3 className="text-xl font-semibold text-gray-900 my-2">{visibleListings.length} rooms available</h3>
            
             <button  className="flex items-center text-gray-800 rounded-md  border-gray-400 border p-1 m-2">
                <Filter className="h-4 w-4" />
                Filters
              </button>
            {/* {searchQuery && <p className="text-gray-600 mt-1">Results for "{searchQuery}"</p>} */}
            </div>
            {visibleListings.map((listing) => (
              <section
                key={listing.slug}
                onClick={() => handleListingClick(listing)}
                className={`cursor-pointer border rounded mb-2 ${
                  listing.slug === selected
                    ? "border-orange-500 border-2 bg-orange-50"
                    : "border-gray-300"
                }`}
              >
                <ContentCard {...listing} />
              </section>
            ))}
            {visibleListings.length < allListings.length && (
              <p className="text-center text-gray-500 py-4">Loading more...</p>
            )}
          </div>

          {/* Main Detail View - Desktop */}
          {/* <div className="hidden md:block sticky top-28 self-start h-fit max-h-[80vh]">
            {children}
          </div> */}
        </div>

        {/* Modal for Mobile */}
        {modalOpen && (
          <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-start bg-black/5 bg-opacity-70 backdrop-blur-sm p-4 sm:p-6 "
            onClick={() => setModalOpen(false)}
          >
            <div
              className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-lg relative flex flex-col"
              onClick={(e) => e.stopPropagation()}
              style={{ minHeight: "300px" }}
            >
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-2"></div>

              <button
                onClick={() => setModalOpen(false)}
                aria-label="Close modal"
                className="bg-red-500 absolute top-1 right-4 p-0.5 rounded-full hover:bg-gray-200 active:bg-gray-300 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white-600 hover:text-gray-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="px-0 pb-6 pt-2 text-gray-900 text-sm sm:text-base leading-relaxed tracking-normal">
                {children}
              </div>
            </div>
          </div>
        )}
      </div>
      <MobileFooterNav/>
    </div>
  );
}
