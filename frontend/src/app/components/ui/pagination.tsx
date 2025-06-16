import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const createPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        if (pages[pages.length - 1] !== "ellipsis") {
          pages.push("ellipsis");
        }
      }
    }

    return pages;
  };

  const pageNumbers = createPageNumbers();

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex justify-center items-center space-x-1 select-none font-sans text-sm"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1.5 rounded-md border text-sm transition duration-150 ${
          currentPage === 1
            ? "cursor-not-allowed bg-gray-100 text-gray-400 border-gray-300"
            : "bg-white text-orange-600 border-orange-300 hover:bg-orange-100"
        }`}
        aria-label="Previous page"
      >
        &larr;
      </button>

      {pageNumbers.map((page, idx) =>
        page === "ellipsis" ? (
          <span
            key={idx}
            className="px-2 text-gray-400 select-none"
            aria-hidden="true"
          >
            &hellip;
          </span>
        ) : (
          <button
            key={idx}
            onClick={() => onPageChange(page as number)}
            aria-current={currentPage === page ? "page" : undefined}
            className={`px-3 py-1.5 rounded-md border transition-colors duration-200 ${
              currentPage === page
                ? "bg-orange-600 text-white border-orange-600 font-semibold shadow-md"
                : "bg-white text-orange-700 border-orange-300 hover:bg-orange-100"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1.5 rounded-md border text-sm transition duration-150 ${
          currentPage === totalPages
            ? "cursor-not-allowed bg-gray-100 text-gray-400 border-gray-300"
            : "bg-white text-orange-600 border-orange-300 hover:bg-orange-100"
        }`}
        aria-label="Next page"
      >
        &rarr;
      </button>
    </nav>
  );
};

export default Pagination;
