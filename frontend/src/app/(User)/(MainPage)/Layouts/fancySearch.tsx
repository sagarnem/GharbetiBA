import {
  Pencil,
  MapPin,
  Search,
  Home,
  DollarSign,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PropertyTypeDropdown from "@/app/components/propertytypedropdown";
import BudgetDropdown from "@/app/components/budgetdropdown";
export default function HeroSearchSection() {
  //  const router = useRouter();
  const baseUrl = "http://localhost:8000";
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (title) params.append("title", title);
    if (location) params.append("location", location);
    if (propertyType && propertyType !== "Property Type") {
      params.append("category", propertyType);
    }
    if (budget) {
      if (budget === "Below Rs. 10,000") {
        params.append("max_price", "9999");
      } else if (budget === "Rs. 10,000 - 20,000") {
        params.append("min_price", "10000");
        params.append("max_price", "20000");
      } else if (budget === "Above Rs. 20,000") {
        params.append("min_price", "20001");
      }
    }

    fetch(`${baseUrl}/api/post/active-posts/?${params.toString()}`);
    // OR fetch directly if you're loading data here
    // fetch(`/api/post/public-posts/?${params.toString()}`).then(...)
  };
  return (
    <section className="relative bg-gradient-to-br from-[#FFF7ED] via-[#FFE9D0] to-[#FFD8A9] py-20 px-4 text-center">
      <div className="absolute inset-0 bg-[url('/kathmandu-pattern.svg')] opacity-10 bg-center bg-cover pointer-events-none" />
      <div className="relative z-10 max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
          Find Your Perfect Room
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-12">
          In Kathmandu and Beyond
        </p>

        {/* Search Bar Container */}
        <div className="backdrop-blur-md bg-white/90 border border-orange-100 rounded-2xl shadow-xl flex flex-wrap md:flex-nowrap items-center justify-between transition-all duration-300 ring-1 ring-orange-100 hover:ring-orange-300">

          {/* Input: Title */}
          <div className="flex items-center gap-2 px-4 py-4 w-full md:w-auto">
            <Pencil className="text-orange-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent w-full text-sm md:text-base outline-none placeholder-gray-500"
            />
          </div>

          <div className="hidden md:block w-px bg-gray-300 h-6" />

          {/* Input: Location */}
          <div className="flex items-center gap-2 px-4 py-4 w-full md:w-auto">
            <MapPin className="text-orange-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent w-full text-sm md:text-base outline-none placeholder-gray-500"
            />
            <Search className="text-gray-400 w-4 h-4" />
          </div>

          <div className="hidden md:block w-px bg-gray-300 h-6" />

          {/* Dropdown: Property Type */}
          <PropertyTypeDropdown value={propertyType} onChange={setPropertyType} />

          <div className="hidden md:block w-px bg-gray-300 h-6" />

          {/* Dropdown: Budget */}
          <BudgetDropdown value={budget} onChange={setBudget}/> 

          {/* Search Button */}
          <button onClick={handleSearch} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-none md:rounded-r-2xl font-semibold whitespace-nowrap transition-all duration-200">
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
