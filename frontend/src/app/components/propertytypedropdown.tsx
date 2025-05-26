import { useState, useRef, useEffect } from "react";
import { Home } from "lucide-react";

const residentialCategories = [
  'single_room', 'two_rooms', '1_bhk', '2_bhk', '3_bhk', '4_bhk', 'flat', 'house', 'bungalow', 'apartment', 'residential_land'
];

const commercialCategories = [
  'shutter', 'office_space', 'restaurant_space', 'shop', 'commercial_land', 'warehouse', 'industrial_building'
];

const categoryOptions = [
  { value: 'single_room', label: 'Single Room' },
  { value: 'two_rooms', label: 'Two Rooms' },
  { value: '1_bhk', label: '1 BHK' },
  { value: '2_bhk', label: '2 BHK' },
  { value: '3_bhk', label: '3 BHK' },
  { value: '4_bhk', label: '4 BHK' },
  { value: 'flat', label: 'Flat' },
  { value: 'house', label: 'House' },
  { value: 'bungalow', label: 'Bungalow' },
  { value: 'apartment', label: 'Apartment/Housing' },
  { value: 'residential_land', label: 'Residential Land' },
  { value: 'shutter', label: 'Shutter' },
  { value: 'office_space', label: 'Office Space' },
  { value: 'restaurant_space', label: 'Restaurant/Hotel Space' },
  { value: 'shop', label: 'Shop/Showroom' },
  { value: 'commercial_land', label: 'Commercial Land' },
  { value: 'warehouse', label: 'Warehouse/Godown' },
  { value: 'industrial_building', label: 'Industrial Building' },
];

function PropertyTypeDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  const getLabel = (val) => {
    const option = categoryOptions.find((opt) => opt.value === val);
    return option ? option.label : "Property Type";
  };

  return (
    <div
      className="relative w-full max-w-[250px] font-sans"
      ref={dropdownRef}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex items-center gap-3 w-full bg-white rounded-lg px-5 py-3 text-left text-gray-500 text-sm font-semibold
          focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
      >
        <Home className="text-orange-500 w-4 h-4 flex-shrink-0" />
        <span className="flex-grow truncate">{value ? getLabel(value) : "Property Type"}</span>
        <svg
          className={`w-6 h-6 text-gray-500 transition-transform duration-300 ease-in-out ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute z-50 mt-2 bg-white rounded-xl shadow-2xl ring-1 ring-black ring-opacity-10 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-gray-100"
          style={{
            width: 520, // wider dropdown
            left: "50%", // position dropdown center relative to button
            transform: "translateX(-50%)", // center it exactly horizontally
          }}
        >
          {/* Residential Section */}
          <div className="p-5 border-b border-gray-200 bg-gray-50 rounded-t-xl">
            <h4 className="text-sm font-semibold mb-4 text-gray-900 tracking-wide uppercase">
              Residential
            </h4>
            <div className="flex flex-wrap gap-3">
              {residentialCategories.map((cat) => {
                const label = getLabel(cat);
                const isSelected = value === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleSelect(cat)}
                    type="button"
                    className={`px-5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition
                      ${isSelected
                        ? "bg-orange-600 text-white shadow-lg"
                        : "bg-white text-gray-700 hover:bg-orange-100 hover:text-orange-600"}
                      focus:outline-none focus:ring-2 focus:ring-orange-400`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Commercial Section */}
          <div className="p-5 bg-white rounded-b-xl">
            <h4 className="text-sm font-semibold mb-4 text-gray-900 tracking-wide uppercase">
              Commercial
            </h4>
            <div className="flex flex-wrap gap-3">
              {commercialCategories.map((cat) => {
                const label = getLabel(cat);
                const isSelected = value === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleSelect(cat)}
                    type="button"
                    className={`px-5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition
                      ${isSelected
                        ? "bg-orange-600 text-white shadow-lg"
                        : "bg-white text-gray-700 hover:bg-orange-100 hover:text-orange-600"}
                      focus:outline-none focus:ring-2 focus:ring-orange-400`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertyTypeDropdown;
