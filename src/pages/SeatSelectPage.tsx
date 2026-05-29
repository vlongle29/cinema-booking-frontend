import React from "react";
import { useParams } from "react-router-dom";
import Seat from "@/components/ui/Seat"; // Render từng ghế
import {
   useSeatData,
   useSeatSelection,
   CinemaScreen,
   SeatLegend,
   SeatCheckoutBar,
} from "@/features/seat-selection/index";

const SeatSelectPage: React.FC = () => {
   const { id: showtimeId } = useParams<{ id: string }>();

   // 1. Kéo Data
   const { mergedSeats, maxCols, maxRows, isLoading } = useSeatData(showtimeId);

   // 2. Kéo Logic tương tác
   const { selectedSeats, toggleSeat, getSeatDisplayStatus, handleCheckout } =
      useSeatSelection(showtimeId, mergedSeats);

   // Trích xuất tên ghế đã chọn để hiển thị ở Footer
   const selectedSeatNames = mergedSeats
      .filter((s) => selectedSeats.has(s.id))
      .map((s) => s.seatNumber)
      .sort()
      .join(", ");

   return (
      <div className="mt-16 min-h-screen bg-[#0B0B0F] text-white flex flex-col items-center relative overflow-hidden pb-32">
         {/* Background Ambience tĩnh */}
         <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-rose-900/20 rounded-full blur-[120px] pointer-events-none" />
         <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-rose-900/10 rounded-full blur-[120px] pointer-events-none" />

         <CinemaScreen />

         {/* Lưới ghế */}
         {isLoading ? (
            <div className="text-rose-500 animate-pulse py-20">
               Loading seats...
            </div>
         ) : (
            <div className="w-full max-w-6xl mx-auto overflow-x-auto px-4 py-8 custom-scrollbar">
               <div
                  className="grid gap-2 sm:gap-3 w-max mx-auto"
                  style={{
                     gridTemplateColumns: `repeat(${maxCols}, minmax(36px, 40px))`,
                     gridTemplateRows: `repeat(${maxRows}, minmax(36px, 40px))`,
                  }}
               >
                  {mergedSeats.map((seat: any) => (
                     <div
                        key={seat.id}
                        className="flex items-center justify-center"
                        style={{
                           gridRow: seat.rowIndex + 1,
                           gridColumn: (seat.columnIndex || 0) + 1,
                        }}
                     >
                        {!seat.isAisle ? (
                           <Seat
                              id={seat.id}
                              seatNumber={seat.seatNumber}
                              label={seat.seatNumber}
                              status={getSeatDisplayStatus(seat)}
                              onClick={() => toggleSeat(seat)}
                           />
                        ) : (
                           <div className="w-8 h-8 sm:w-10 sm:h-10 opacity-0 pointer-events-none" />
                        )}
                     </div>
                  ))}
               </div>
            </div>
         )}

         <SeatLegend />

         <SeatCheckoutBar
            selectedSeatsSize={selectedSeats.size}
            selectedSeatNames={selectedSeatNames}
            onCheckout={handleCheckout}
         />
      </div>
   );
};

export default SeatSelectPage;
