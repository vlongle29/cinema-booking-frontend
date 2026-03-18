import React from "react";
import type { City, Format } from "../../types/showtime";
import SkeletonLoader from "../common/SkeletonLoader";
import EmptyState from "../common/EmptyState";
import { AlertCircle } from "lucide-react";

interface FilterChipsProps {
   label: string;
   items: City[] | Format[];
   selected: string;
   onSelect: (id: string) => void;
   loading: boolean;
   error: string | null;
   isEmpty: boolean;
}

const FilterChips: React.FC<FilterChipsProps> = ({ label, items, selected, onSelect, loading, error, isEmpty }) => {
   if (isEmpty && !loading) {
      return null;
   }

   return (
      <div className="mb-4">
         <h3 className="text-xs font-semibold text-[#d1d5dc] mb-2 uppercase tracking-wider">
            {label}
         </h3>

         {loading ? (
            <SkeletonLoader count={5} type="chip" />
         ) : error ? (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
               <AlertCircle className="w-4 h-4 text-red-500" />
               <span className="text-sm text-red-400">{error}</span>
            </div>
         ) : items.length === 0 ? (
            <EmptyState
               title="No options available"
               description={`No ${label.toLowerCase()} available for your selection`}
            />
         ) : (
            <div className="flex gap-2 flex-wrap">
               {items.map((item) => {
                  const isSelected = selected === item.id;
                  const itemName = "name" in item ? item.name : "";
                  const badge = "badge" in item ? item.badge : null;
                  const count = "count" in item ? item.count : null;

                  return (
                     <button
                        key={item.id}
                        onClick={() => onSelect(item.id)}
                        className={`px-3 py-1.5 rounded-full font-medium text-sm transition-all ${
                           isSelected
                              ? "bg-[#f84565] text-white"
                              : "bg-[#1a1a1e] text-[#d1d5dc] border border-[#393939] hover:border-[#f84565]"
                        }`}
                     >
                        <div className="flex items-center gap-2">
                           <span>{itemName}</span>
                           {badge && (
                              <span className="text-xs bg-[#f84565]/30 px-2 py-0.5 rounded">
                                 {badge}
                              </span>
                           )}
                           {count && (
                              <span className="text-xs opacity-75">
                                 ({count})
                              </span>
                           )}
                        </div>
                     </button>
                  );
               })}
            </div>
         )}
      </div>
   );
};

export default FilterChips;