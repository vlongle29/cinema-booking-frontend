import { formatCurrency } from "../../../../utils/seatUtils";

/**
 * Toolbar for selecting active seat type during template editing
 */
const SeatTypeSelector = ({
   seatTypes,
   selectedSeatTypeId,
   onSelect,
}: {
   seatTypes: any[];
   selectedSeatTypeId: string;
   onSelect: (id: string) => void;
}) => {
   return (
      <div className="flex flex-wrap items-center gap-2 p-2 bg-[#252529] border border-[#393939] rounded-lg mb-4">
         {/* Seat type buttons */}
         {seatTypes.map((type) => {
            const isSelected = selectedSeatTypeId === type.id;
            return (
               <button
                  key={type.id}
                  type="button"
                  onClick={() => onSelect(type.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-2 rounded-md border text-sm transition-all cursor-pointer ${
                     isSelected
                        ? "border-[#f84565] bg-[#f84565]/15 text-white ring-1 ring-[#f84565]/40"
                        : "border-[#393939]/70 bg-[#1a1a1e]/60 hover:bg-[#393939]/40 text-[#d1d5dc]"
                  }`}
               >
                  <div
                     className="w-4 h-4 rounded-[4px] shrink-0"
                     style={{ backgroundColor: type.color }}
                  />
                  <div className="text-left">
                     <span className="font-semibold text-white text-sm leading-tight block">
                        {type.name}
                     </span>
                     <span className="text-xs text-[#797b7d] block leading-tight mt-0.5">
                        {formatCurrency(type.basePrice)}
                     </span>
                  </div>
               </button>
            );
         })}

         {/* Divider */}
         <div className="w-px h-6 bg-[#393939] mx-1 hidden sm:block" />

         {/* Aisle / Eraser button */}
         {(() => {
            const isAisleSelected = selectedSeatTypeId === "AISLE";
            return (
               <button
                  type="button"
                  onClick={() => onSelect("AISLE")}
                  className={`flex items-center gap-2.5 px-3.5 py-2 rounded-md border text-sm transition-all cursor-pointer ${
                     isAisleSelected
                        ? "border-amber-500 bg-amber-500/15 text-white ring-1 ring-amber-500/40"
                        : "border-[#393939]/70 bg-[#1a1a1e]/60 hover:bg-[#393939]/40 text-[#d1d5dc]"
                  }`}
               >
                  <div className="w-4 h-4 rounded-[4px] border border-dashed border-[#797b7d] bg-[#393939]/30 shrink-0" />
                  <div className="text-left">
                     <span className="font-semibold text-white text-sm leading-tight block">
                        Lối đi / Xóa ghế
                     </span>
                     <span className="text-xs text-[#797b7d] block leading-tight mt-0.5">
                        Nhấp chuột để xóa
                     </span>
                  </div>
               </button>
            );
         })()}
      </div>
   );
};

export default SeatTypeSelector;
