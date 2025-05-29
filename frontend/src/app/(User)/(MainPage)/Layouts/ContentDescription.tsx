"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import FacebookComments from "./FacebookComment";
import {
  CheckCircle,
  MapPin,
  Smile,
  Phone,
  Eye,
  Share2,
  ClipboardCheck,
  ChevronDown,
} from "lucide-react";
import { useParams } from "next/navigation";

// import { Amenity } from "@/types/listing";
import { Listing } from "@/types/listing";
// interface ContentDescriptionProps {
//   title: string;
//   description: string[];
//   location: string;
//   amenities: Amenity[];
//   rentalTerms: string[];
//   securityFacilities: string[];
//   price: string;
//   availability: string;
//   phone: string;
//   contactNote: string;
// }

type SectionId =
  | "details"
  | "location"
  | "amenities"
  | "rental"
  | "security"
  | "price"
  | "contact"
  | "facebook-comments";

export default function ContentDescription({
  title,
  description,
  location,
  amenities,
  rentalTerms,
  securityFacilities,
  price,
  availability,
  phone,
  contactNote,
}: Listing) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<SectionId>("details");
  const [copied, setCopied] = useState(false);
  const params = useParams();
  const slug = decodeURIComponent((params?.slug as string) || "");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const sectionIds: SectionId[] = useMemo(
    () => ["details", "facebook-comments"],
    []
  );
  const url = useMemo(() => `${process.env.NEXT_PUBLIC_COMPANY_URL}/${slug}`, [slug]);

  // Scroll handler with throttling
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    let current: SectionId = activeSection;

    for (const id of sectionIds) {
      const section = container.querySelector(`#${id}`);
      if (section) {
        const { offsetTop, offsetHeight } = section as HTMLElement;
        if (
          offsetTop <= scrollTop + 100 &&
          offsetTop + offsetHeight > scrollTop + 60
        ) {
          current = id;
          break;
        }
      }
    }

    if (current !== activeSection) {
      setActiveSection(current);
    }
  }, [activeSection, sectionIds]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: SectionId) => {
      e.preventDefault();
      const container = containerRef.current;
      if (!container) return;

      const section = container.querySelector(`#${id}`);
      if (section) {
        const offsetTop = (section as HTMLElement).offsetTop - 60;
        container.scrollTo({ top: offsetTop, behavior: "smooth" });
        setActiveSection(id);
      }
    },
    []
  );

  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: description[0] ?? "",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Sharing failed:", err);
    }
  }, [title, description, url]);

  const renderListItems = (items: string[], icon?: React.ReactNode) => (
    <ul className="space-y-3 mb-6">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-gray-700 text-base">
          {icon || (
            <CheckCircle
              size={20}
              className="text-orange-400 flex-shrink-0 mt-0.5"
            />
          )}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      ref={containerRef}
      className="rounded-l border bg-white  max-h-[calc(100vh-7rem-2rem)] overflow-y-auto transition border-orange-400 shadow-[0_0_10px_3px_rgba(255,165,0,0.2)] scroll-smooth relative"
    >
      {/* Enhanced Sticky Navigation */}
      <nav className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-orange-200 shadow-sm">
        {/* Mobile Navigation Toggle */}
        <div className="sm:hidden flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="flex items-center gap-2 text-orange-600 font-medium"
          >
            {activeSection === "facebook-comments"
              ? "Facebook Comments"
              : activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            <ChevronDown
              size={18}
              className={`transition-transform ${
                isMobileNavOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          <div className="w-10 h-10 flex items-center justify-center bg-orange-100 rounded-full text-orange-600">
            {sectionIds.findIndex((id) => id === activeSection) + 1}/
            {sectionIds.length}
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden sm:block px-2">
          <ul className="flex gap-1 py-3">
            {sectionIds.map((id) => (
              <li key={id} className="flex-1 min-w-0">
                <a
                  href={`#${id}`}
                  onClick={(e) => {
                    handleNavClick(e, id);
                    setIsMobileNavOpen(false);
                  }}
                  className={`block w-full text-center px-3 py-2 rounded-md transition-all text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis ${
                    activeSection === id
                      ? "bg-orange-500 text-white shadow-md"
                      : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                  }`}
                >
                  {id === "facebook-comments"
                    ? "FB Comments"
                    : id.charAt(0).toUpperCase() + id.slice(1)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileNavOpen && (
          <div className="sm:hidden bg-white border-t border-gray-100 shadow-lg">
            <ul className="py-2 px-4 space-y-1">
              {sectionIds.map((id) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => {
                      handleNavClick(e, id);
                      setIsMobileNavOpen(false);
                    }}
                    className={`block px-4 py-3 rounded-md transition-colors ${
                      activeSection === id
                        ? "bg-orange-100 text-orange-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {id === "facebook-comments"
                      ? "Facebook Comments"
                      : id.charAt(0).toUpperCase() + id.slice(1)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* Content Sections */}
      <div className="px-4">
        {/* Details Section */}
        <section id="details" className="scroll-mt-16">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            {title}
          </h3>
          <div className="space-y-4">
            {description.map((para, i) => (
              <p
                key={i}
                className="text-gray-800 text-base sm:text-lg leading-relaxed"
              >
                {para}
              </p>
            ))}
          </div>
        </section>

        {/* Location Section */}
        <section id="location" className="scroll-mt-16">
          <h4 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
            Location
          </h4>
          <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-lg">
            <MapPin size={18} className="text-gray-400 flex-shrink-0" />
            <p className="text-sm sm:text-base">{location}</p>
          </div>
        </section>

        {/* Amenities Section */}
        <section id="amenities" className="scroll-mt-16">
          <h4 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
            Key Amenities
          </h4>
          <ul className="flex flex-wrap ">
            {amenities.map(({ icon: Icon, label }, i) => (
              <li
                key={i}
                className="flex items-center gap-2  bg-orange-100 text-orange-700 px-2 mx-1 py-[2px] rounded-md font-medium w-fit"
              >
                {Icon ? <Icon size={12} /> : <Smile size={12} />}

                <span>{label}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Rental Terms Section */}
        <section id="rental" className="scroll-mt-16">
          <h4 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
            Rental Terms
          </h4>
          {renderListItems(rentalTerms)}
        </section>

        {/* Security Section */}
        <section id="security" className="scroll-mt-16">
          <h4 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
            Security & Facilities
          </h4>
          {renderListItems(securityFacilities)}
        </section>

        {/* Price Section */}
        <section id="price" className="scroll-mt-16">
          <h4 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
            Price & Availability
          </h4>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="font-bold text-green-700 text-lg sm:text-xl mb-1">
              {price}
            </p>
            <p className="text-sm text-gray-600">{availability}</p>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="scroll-mt-16">
          <h4 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
            Contact Information
          </h4>
          <div className="space-y-3 bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 font-medium text-gray-700">
              <Phone size={18} className="text-blue-500 flex-shrink-0" />
              <a
                href={`tel:${phone}`}
                className="hover:text-blue-600 transition-colors"
              >
                {phone}
              </a>
            </div>
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <Eye size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <p>{contactNote}</p>
            </div>
          </div>
        </section>

        {/* Share Button */}
        <div className="flex justify-end">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600 transition-colors"
            aria-label="Share this listing"
          >
            {copied ? (
              <>
                <ClipboardCheck size={18} />
                Link Copied!
              </>
            ) : (
              <>
                <Share2 size={18} />
                Share
              </>
            )}
          </button>
        </div>
      </div>

      {/* Facebook Comments */}
      <div id="facebook-comments" className="px-4 sm:px-8 pb-6 scroll-mt-16">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Facebook Comments
        </h3>
        <FacebookComments url={url} />
      </div>
    </div>
  );
}
