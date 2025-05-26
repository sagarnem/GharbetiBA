'use client';
import RoomsLayout from "./(User)/(MainPage)/layout";
import React, {useRef,useState } from "react";

  const sectionIds = [
    "details",
    "location",
    "amenities",
    "rental",
    "security",
    "price",
    "contact",
  ];

export default function Home() {
 const containerRef = useRef<HTMLDivElement>(null);
   const [activeSection, setActiveSection] = useState<string>("details");
 
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

  return (
    <div className="">
       <RoomsLayout>
         <div
      ref={containerRef}
      className="rounded-l-md border bg-white p-0 max-h-[calc(100vh-7rem-2rem)] overflow-y-auto transition border-orange-400 shadow-[0_0_10px_3px_rgba(255,165,0,0.2)]"
      style={{ scrollBehavior: "smooth" }}
    >
      <div className=" w-full text-center text-gray-500 sticky top-28 self-start h-fit  max-h-[80vh]">
        
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
      </nav></div>
        
        <h2 className="text-xl font-semibold">No details found</h2>
        <p>Please select a listing from the sidebar.</p>
      </div></div>
    </RoomsLayout>
    </div>
  );
}
