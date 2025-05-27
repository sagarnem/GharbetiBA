"use client";

import React, { useState, useEffect, useRef ,useMemo} from "react";
import FacebookComments from "./FacebookComment";
import {
  CheckCircle,
  MapPin,
  Phone,
  Eye,
  Share2,
  ClipboardCheck,
} from "lucide-react";

interface Amenity {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  text: string;
}

interface ContentDescriptionProps {
  title: string;
  description: string[];
  location: string;
  keyAmenities: Amenity[];
  rentalTerms: string[];
  securityFacilities: string[];
  price: string;
  availability: string;
  phone: string;
  contactNote: string;
}
import { useParams } from "next/navigation";

export default function ContentDescription({
  title,
  description,
  location,
  keyAmenities,
  rentalTerms,
  securityFacilities,
  price,
  availability,
  phone,
  contactNote,
}: ContentDescriptionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>("details");
  const [copied, setCopied] = useState(false);

const sectionIds = useMemo(
  () => [
    "details",
    "location",
    "amenities",
    "rental",
    "security",
    "price",
    "contact",
  ],
  []
);
  const params = useParams();
  const slug = decodeURIComponent((params?.slug as string) || "");

useEffect(() => {
  
const container = containerRef.current;
  if (!container) return;
  function onScroll() {
    const container = containerRef.current;
  if (!container) return;
    let current = activeSection;
    const scrollTop = container.scrollTop;

    for (const id of sectionIds) {
      const section = container.querySelector(`#${id}`);
      if (section) {
        const offsetTop = (section as HTMLElement).offsetTop;
        if (offsetTop <= scrollTop + 60) {
          current = id;
        }
      }
    }

    if (current !== activeSection) {
      setActiveSection(current);
    }
  }

  container.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // initial check

  return () => container.removeEventListener("scroll", onScroll);
}, [activeSection, sectionIds]);

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;
    const section = container.querySelector(`#${id}`);
    if (section) {
      const offsetTop = (section as HTMLElement).offsetTop;
      container.scrollTo({ top: offsetTop, behavior: "smooth" });
      setActiveSection(id);
    }
  }

  const handleShare = async () => {
    const shareData = {
      title,
      text: description[0] ?? "",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Share cancelled or failed:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Clipboard write failed:", err);
      }
    }
  };
 const url = `https://gharbhetiba.mantracodex.com/${slug}`;

  return (
    <div
      ref={containerRef}
      className="rounded-l-md border bg-white p-0 max-h-[calc(100vh-7rem-2rem)] overflow-y-auto transition border-orange-400 shadow-[0_0_10px_3px_rgba(255,165,0,0.2)]"
      style={{ scrollBehavior: "smooth" }}
    >
      {/* Sticky Nav (Inside Scrollable Area) */}
      <nav className="sticky top-0 z-10 bg-white border-b border-orange-400 shadow-sm px-8">
        <ul className="flex gap-4 py-3 text-sm font-medium text-gray-700">
          {sectionIds.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => handleNavClick(e, id)}
                className={`hover:text-orange-600 ${
                  activeSection === id ? "text-orange-600 font-semibold" : ""
                }`}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Scrollable Content */}
      <div className="px-8 py-6">
        <h3
          id="details"
          className="text-3xl font-extrabold text-gray-900 mb-6 border-b border-gray-200 pb-2"
        >
          {title}
        </h3>

        {description.map((para, i) => (
          <p key={i} className="text-gray-800 text-lg leading-relaxed mb-6">
            {para}
          </p>
        ))}

        <h4
          id="location"
          className="text-2xl font-semibold text-gray-900 mb-4"
        >
          Location
        </h4>
        <p className="text-sm text-gray-600 flex items-center gap-2 mb-6">
          <MapPin size={18} className="text-gray-400" />
          {location}
        </p>

        <h4
          id="amenities"
          className="text-2xl font-semibold text-gray-900 mb-4"
        >
          Key Amenities
        </h4>
        <ul className="space-y-3 mb-6">
          {keyAmenities.map(({ icon: Icon, text }, i) => (
            <li
              key={i}
              className="flex items-center gap-3 text-gray-700 text-base"
            >
              {Icon && <Icon size={16} />}
              <span>{text}</span>
            </li>
          ))}
        </ul>

        <h4 id="rental" className="text-2xl font-semibold text-gray-900 mb-4">
          Rental Terms
        </h4>
        <ul className="space-y-3 mb-6">
          {rentalTerms.map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-3 text-gray-700 text-base"
            >
              <CheckCircle
                size={20}
                className="text-orange-400 flex-shrink-0"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h4
          id="security"
          className="text-2xl font-semibold text-gray-900 mb-4"
        >
          Security & Facilities
        </h4>
        <ul className="space-y-3 mb-6">
          {securityFacilities.map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-3 text-gray-700 text-base"
            >
              <CheckCircle
                size={20}
                className="text-orange-400 flex-shrink-0"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h4 id="price" className="text-2xl font-semibold text-gray-900 mb-4">
          Price & Availability
        </h4>
        <div className="text-base text-gray-700 mb-6">
          <p className="font-bold text-green-700 text-xl mb-1">{price}</p>
          <p className="text-sm text-gray-500">{availability}</p>
        </div>

        <h4 id="contact" className="text-2xl font-semibold text-gray-900 mb-4">
          Contact Information
        </h4>
        <div className="text-sm text-gray-700 space-y-2">
          <p className="flex items-center gap-3 font-medium">
            <Phone size={20} className="text-gray-400" />
            {phone}
          </p>
          <p className="flex items-center gap-3 font-medium">
            <Eye size={20} className="text-blue-600" />
            {contactNote}
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600 transition"
          >
            {copied ? (
              <>
                <ClipboardCheck size={20} />
                Link Copied!
              </>
            ) : (
              <>
                <Share2 size={20} />
                Share
              </>
            )}
          </button>
        </div>
      </div>
       <FacebookComments url={url} />
    </div>
  );
}
