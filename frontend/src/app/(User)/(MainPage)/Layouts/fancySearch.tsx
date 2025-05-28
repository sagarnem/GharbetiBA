import { Pencil, MapPin, Search,  } from "lucide-react";
import { useState } from "react";
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
<section className="relative bg-gradient-to-br from-[#FFF7ED] via-[#FFE9D0] to-[#FFD8A9] py-12 px-4 sm:px-6 lg:px-8">
  <div className="absolute inset-0 bg-[url('/kathmandu-pattern.svg')] opacity-10 bg-center bg-cover pointer-events-none" />
  
  <div className="relative z-10 max-w-5xl mx-auto text-center">
    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2">
      Find Your Perfect Room
    </h1>
    <p className="text-lg sm:text-xl text-gray-600 mb-8">
      In Kathmandu and Beyond
    </p>

    <div className="backdrop-blur-sm bg-white/90 border border-orange-200 shadow-2xl rounded-2xl p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-2 items-stretch md:items-center justify-between transition-all duration-300">
      
      {/* Title Input */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 w-full shadow-sm">
        <Pencil className="text-orange-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent text-sm sm:text-base outline-none placeholder-gray-400"
        />
      </div>

      {/* Location Input */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 w-full shadow-sm">
        <MapPin className="text-orange-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full bg-transparent text-sm sm:text-base outline-none placeholder-gray-400"
        />
      </div>

      {/* Property Type Dropdown */}
      <div className="w-full">
        <PropertyTypeDropdown value={propertyType} onChange={setPropertyType} />
      </div>

      {/* Budget Dropdown */}
      <div className="w-full">
        <BudgetDropdown value={budget} onChange={setBudget} />
      </div>

      {/* Search Button */}
      <div className="w-full md:w-auto">
        <button
          onClick={handleSearch}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md"
        >
          <Search className="w-5 h-5" />
          Search
        </button>
      </div>
    </div>
  </div>
</section>

  );
}
