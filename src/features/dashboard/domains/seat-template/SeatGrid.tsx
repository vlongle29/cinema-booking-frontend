import React, { memo } from "react";
import type { Seat, SeatType } from "../../../../types/booking";

// Wrap SeatCell by memo for optimize render performance
const SeatCell = memo(
   ({
      seat,
      seatType,
      index,
      onClick,
      onContextMenu,
      readOnly,
   }: {
      seat: any;
      seatType: any;
      index: number;
      onClick?: (index: number) => void;
      onContextMenu?: (index: number) => void;
      readOnly: boolean;
   }) => {
      const isAisle = seat.isAisle;

      return (
         <div
            onClick={() => !readOnly && onClick?.(index)}
            onContextMenu={(e) => {
               e.preventDefault();
               if (!readOnly) onContextMenu?.(index);
            }}
            className={`
        w-8 h-8 sm:w-9 sm:h-9 rounded-[6px]
        flex items-center justify-center text-xs font-bold select-none 
        transition-all duration-150
        ${
           readOnly
              ? "cursor-default opacity-80"
              : "cursor-pointer hover:scale-105 active:scale-95 shadow-sm"
        }
        ${
           isAisle
              ? "bg-transparent border border-dashed border-[#393939] text-[#555] hover:bg-[#252529]/40"
              : "text-white ring-1 ring-white/15"
        }
      `}
            style={
               !isAisle && seatType ? { backgroundColor: seatType.color } : {}
            }
            title={
               !isAisle ? `${seat.seatNumber} (${seatType?.name || ""})` : "Lối đi"
            }
         >
            {!isAisle && (
               <span className="leading-none text-white tracking-tight">
                  {seat.seatNumber}
               </span>
            )}
         </div>
      );
   },
);

const SeatGrid = ({
   seats,
   columns,
   seatTypes,
   onSeatClick,
   onSeatRightClick,
   readOnly = false,
 }: {
   seats: any[];
   columns: number;
   seatTypes: any[];
   onSeatClick?: (index: number) => void;
   onSeatRightClick?: (index: number) => void;
   readOnly?: boolean;
}) => {
   return (
      <div className="w-full overflow-x-auto p-4 sm:p-6 bg-[#141417] rounded-lg border border-[#393939]">
         {/* Screen Indicator */}
         <div className="mb-6 sm:mb-8 flex flex-col items-center justify-center select-none w-full min-w-[260px]">
            <div className="w-full max-w-sm h-1.5 bg-gradient-to-r from-transparent via-[#f84565]/80 to-transparent rounded-full mb-2.5 shadow-[0_2px_8px_rgba(248,69,101,0.3)]" />
            <span className="text-[#797b7d] font-semibold tracking-[0.25em] uppercase text-xs">
               Màn hình
            </span>
         </div>

         <div
            className="grid gap-1.5 sm:gap-2 mx-auto justify-center"
            style={{
               gridTemplateColumns: `repeat(${columns}, minmax(0, max-content))`,
               width: "max-content",
            }}
         >
            {seats.map((seat: any, index: number) => {
               const seatType = seatTypes.find(
                  (t: any) => t.id === seat.seatTypeId,
               );
               return (
                  <SeatCell
                     key={`${seat.seatNumber}-${index}`}
                     index={index}
                     seat={seat}
                     seatType={seatType}
                     onClick={onSeatClick}
                     onContextMenu={onSeatRightClick}
                     readOnly={readOnly}
                  />
               );
            })}
         </div>
      </div>
   );
};

export default memo(SeatGrid);
