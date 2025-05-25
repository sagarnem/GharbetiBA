// "use client";
// import React, { useState, useEffect, useCallback, useRef } from "react";
// import ContentCard from "./ContentCard";
// import ContentDescription from "./ContentDescription";
// import { debounce } from "lodash";
// import { useParams, useRouter } from "next/navigation";
// import { listings, descriptions } from "../../../../data/data";
// import { Wallet, BedDouble, Truck, Flame, Droplet, Wifi } from "lucide-react";

// const categories = [
//   { label: "Furnished", icon: Wallet },
//   { label: "Under Rs. 10,000", icon: Wallet },
//   { label: "1BHK", icon: BedDouble },
//   { label: "With Parking", icon: Truck },
//   { label: "With Heater", icon: Flame },
//   { label: "Attached Bathroom", icon: Droplet },
//   { label: "Free Wi-Fi", icon: Wifi },
// ];

// const PAGE_SIZE = 10;

// export default function Contents() {
//   const router = useRouter();
//   const params = useParams();
//   const slug = decodeURIComponent((params?.slug as string) || "");

//   const [selected, setSelected] = useState<string | null>(slug || null);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [visibleListings, setVisibleListings] = useState(
//     listings.slice(0, PAGE_SIZE)
//   );

//   const isLoading = useRef(false);

//   const loadMoreListings = useCallback(() => {
//     if (isLoading.current || visibleListings.length >= listings.length) return;
//     isLoading.current = true;

//     const nextItems = listings.slice(
//       visibleListings.length,
//       visibleListings.length + PAGE_SIZE
//     );

//     setVisibleListings((prev) => [...prev, ...nextItems]);

//     setTimeout(() => {
//       isLoading.current = false;
//     }, 300);
//   }, [visibleListings]);

//   useEffect(() => {
//     const handleScroll = debounce(() => {
//       const scrollTop = window.scrollY;
//       const windowHeight = window.innerHeight;
//       const fullHeight = document.body.scrollHeight;

//       if ((scrollTop + windowHeight) / fullHeight >= 0.5) {
//         loadMoreListings();
//       }
//     }, 100);

//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//       handleScroll.cancel();
//     };
//   }, [loadMoreListings]);

//   useEffect(() => {
//     if (activeIndex >= visibleListings.length) {
//       setActiveIndex(visibleListings.length - 1);
//     }
//   }, [visibleListings, activeIndex]);

//   useEffect(() => {
//     if (!slug) return;

//     const index = listings.findIndex((item) => item.slug === slug);
//     if (index !== -1) {
//       setActiveIndex(index);
//       setSelected(slug);
//     }
//   }, [slug]);

//   const descriptionToShow = React.useMemo(() => {
//     const currentListing = listings.find((item) => item.slug === selected);
//     if (currentListing) {
//       return descriptions.find((desc) => desc.label === currentListing.label) || descriptions[activeIndex];
//     }
//     return descriptions[activeIndex];
//   }, [selected, activeIndex]);

//   const handleCategoryClick = (label: string) => {
//     const encoded = encodeURIComponent(label);
//     router.push(`/rooms/${encoded}`);
//     setSelected(label);
//   };

//   const handleListingClick = (listing: any, index: number) => {
//     setActiveIndex(index);
//     setSelected(listing.slug);
//    router.replace(`/${encodeURIComponent(listing.slug)}`, {
//     scroll: false,
//   });
//   };

//   return (
//     <>
//       <div className="bg-red-200 h-32" />
//       <section className="bg-red-500 py-10 px-4 text-center overflow-hidden h-screen flex flex-col">
//         <h1 className="text-4xl font-bold mb-2">Find Your Perfect Room</h1>
//         <p className="text-lg text-gray-700">In Kathmandu and Beyond</p>
//         <div className="mt-6 max-w-xl mx-auto">
//           <input
//             type="text"
//             placeholder="Search by location..."
//             className="w-full p-3 border rounded-lg shadow"
//           />
//         </div>
//       </section>

//       <section className="p-6 bg-white rounded-lg shadow-sm">
//         <h2 className="text-2xl font-bold mb-6 text-gray-800">
//           Browse by Category
//         </h2>
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//           {categories.map(({ label, icon: Icon }, i) => (
//             <div
//               key={i}
//               onClick={() => handleCategoryClick(label)}
//               className={`flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition 
//               ${
//                 selected === label
//                   ? "bg-orange-200 border-orange-500 text-orange-800"
//                   : "bg-orange-50 border-orange-100 hover:bg-orange-100 hover:border-orange-300"
//               }`}
//             >
//               <Icon className="w-6 h-6 mb-2" />
//               <span className="text-sm font-medium text-center">{label}</span>
//             </div>
//           ))}
//         </div>
//       </section>
// <h1>ITS me</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
//         <div className="min-h-[80vh]">
//           {visibleListings.map((listing, i) => (
//             <section
//               key={listing.slug}
//               onClick={() => handleListingClick(listing, i)}
//               className={`cursor-pointer border rounded mb-4 ${
//                 listing.slug === selected
//                   ? "border-orange-500 border-2 bg-orange-50"
//                   : "border-gray-300"
//               }`}
//             >
//               <ContentCard {...listing} />
//             </section>
//           ))}
//           {visibleListings.length < listings.length && (
//             <p className="text-center text-gray-500 py-4">Loading more...</p>
//           )}
//         </div>
//         <div className="sticky top-28 self-start h-fit overflow-y-auto max-h-[80vh]">
//           <ContentDescription {...descriptionToShow} />
//         </div>
//       </div>
//     </>
//   );
// }
