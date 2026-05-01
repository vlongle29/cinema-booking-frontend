import { formatCurrency } from "../../../lib/seatUtils";

/**
 * This section is to decide what type of seat this is, what is setSelectionSeatType?
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
      <div className="flex flex-wrap gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm mb-6">
         {/* Buttons for seat types from Database */}
         {seatTypes.map((type) => (
            <button
               key={type.id}
               onClick={() => onSelect(type.id)}
               className={`
            flex items-center gap-3 px-4 py-2 rounded-lg border-2 transition-all text-left
            ${
               selectedSeatTypeId === type.id
                  ? "border-blue-500 bg-blue-50 shadow-sm"
                  : "border-transparent hover:bg-gray-50"
            }
          `}
            >
               <div
                  className="w-5 h-5 rounded-sm shadow-inner"
                  style={{ backgroundColor: type.color }}
               ></div>
               <div>
                  <div className="font-semibold text-sm text-gray-800">
                     {type.name}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                     {formatCurrency(type.basePrice)}
                  </div>
               </div>
            </button>
         ))}

         {/* Vertical dividing line */}
         <div className="w-px bg-gray-300 mx-2 my-1 hidden sm:block"></div>

         {/* Aisle button */}
         <button
            onClick={() => onSelect("AISLE")}
            className={`
          flex items-center gap-3 px-4 py-2 rounded-lg border-2 transition-all text-left
          ${
             selectedSeatTypeId === "AISLE"
                ? "border-gray-500 bg-gray-100 shadow-sm"
                : "border-transparent hover:bg-gray-50"
          }
        `}
         >
            <div className="w-5 h-5 rounded-sm border-2 border-dashed border-gray-400 bg-gray-50"></div>
            <div>
               <div className="font-semibold text-sm text-gray-800">
                  Cục tẩy / Lối đi
               </div>
               <div className="text-xs text-gray-500 italic">
                  Nhấp/Chuột phải để xóa ghế
               </div>
            </div>
         </button>
      </div>
   );
};

export default SeatTypeSelector;
