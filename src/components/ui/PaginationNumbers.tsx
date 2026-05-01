import React from "react";

type PaginationNumbersProps = {
   currentPage: number;
   totalPages: number;
   onPageChange: (page: number) => void;
   maxVisible?: number;
   className?: string;
};

type PageItem = number | "ellipsis";

function buildPageItems(
   currentPage: number,
   totalPages: number,
   maxVisible: number,
): PageItem[] {
   if (totalPages <= 1) return [];

   const safeMax = Math.max(5, maxVisible);
   if (totalPages <= safeMax) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
   }

   const windowSize = safeMax - 2;
   const half = Math.floor(windowSize / 2);
   const clamped = Math.min(Math.max(currentPage, 1), totalPages);

   let start = clamped - half;
   let end = clamped + half;

   if (start < 2) {
      start = 2;
      end = start + windowSize - 1;
   }

   if (end > totalPages - 1) {
      end = totalPages - 1;
      start = end - windowSize + 1;
   }

   const items: PageItem[] = [1];

   if (start > 2) {
      items.push("ellipsis");
   }

   for (let page = start; page <= end; page += 1) {
      items.push(page);
   }

   if (end < totalPages - 1) {
      items.push("ellipsis");
   }

   items.push(totalPages);
   return items;
}

function PaginationNumbers({
   currentPage,
   totalPages,
   onPageChange,
   maxVisible = 5,
   className = "",
}: PaginationNumbersProps) {
   const items = buildPageItems(currentPage, totalPages, maxVisible);

   if (items.length === 0) return null;

   return (
      <nav
         className={`flex items-center gap-2 ${className}`}
         aria-label="Pagination"
      >
         {items.map((item, index) => {
            if (item === "ellipsis") {
               return (
                  <span
                     key={`ellipsis-${index}`}
                     className="px-2 text-sm text-secondary/50"
                  >
                     ...
                  </span>
               );
            }

            const isActive = item === currentPage;
            return (
               <button
                  key={item}
                  type="button"
                  onClick={() => onPageChange(item)}
                  aria-current={isActive ? "page" : undefined}
                  className={`min-w-[36px] h-9 px-3 rounded-full text-sm font-semibold transition-all duration-200 ${
                     isActive
                        ? "bg-primary text-white shadow"
                        : "text-secondary/70 hover:text-primary hover:bg-primary/10"
                  }`}
               >
                  {item}
               </button>
            );
         })}
      </nav>
   );
}

export default PaginationNumbers;
