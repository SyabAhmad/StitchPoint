import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function ShopPagination({ currentPage, totalPages, setCurrentPage }) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const delta = 2;
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);
    if (left > 2) pages.push("...");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button
        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        disabled={currentPage === 1}
        className="w-9 h-9 rounded-lg flex items-center justify-center border border-black/10 text-black/40 hover:border-gold-500 hover:text-gold-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <FaChevronLeft className="text-xs" />
      </button>

      {getPages().map((page, i) =>
        page === "..." ? (
          <span key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center text-black/20 text-sm">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 ${
              currentPage === page
                ? "bg-gold-500 text-black"
                : "border border-black/10 text-black/50 hover:border-gold-500 hover:text-gold-500"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="w-9 h-9 rounded-lg flex items-center justify-center border border-black/10 text-black/40 hover:border-gold-500 hover:text-gold-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <FaChevronRight className="text-xs" />
      </button>
    </div>
  );
}
