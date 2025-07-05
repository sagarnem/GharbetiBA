import React, { useState, useRef, useEffect } from "react";
import { DollarSign } from "lucide-react";

const budgetOptions = [
  { value: "", label: "Budget" },
  { value: "below_10000", label: "Below Rs. 10,000" },
  { value: "10000_20000", label: "Rs. 10,000 - 20,000" },
  { value: "above_20000", label: "Above Rs. 20,000" },
];

interface BudgetDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

function BudgetDropdown({ value, onChange }: BudgetDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  const getLabel = (val: string) => {
    const option = budgetOptions.find((opt) => opt.value === val);
    return option ? option.label : "Budget";
  };

  return (
    <div className="relative w-56 font-sans" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex items-center gap-3 w-full bg-white rounded-lg px-4 py-3 text-left text-gray-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
      >
        <DollarSign className="text-orange-500 w-4 h-4" />
        <span className="flex-grow truncate">{getLabel(value)}</span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ease-in-out ${
            isOpen ? "rotate-180" : ""
          }`}
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
        <div className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-2xl ring-1 ring-black ring-opacity-10 max-h-60 overflow-auto scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-gray-100">
          {budgetOptions.map(({ value: val, label }) => (
            <button
              key={val}
              onClick={() => handleSelect(val)}
              type="button"
              className={`w-full px-4 py-2 text-left text-sm transition
                ${
                  value === val
                    ? "text-sm font-semibold mb-3 text-gray-900 tracking-wide uppercase items-center"
                    : "hover:bg-orange-100 hover:text-orange-600 text-gray-700"
                }
                focus:outline-none focus:ring-2 focus:ring-orange-400`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default BudgetDropdown;
