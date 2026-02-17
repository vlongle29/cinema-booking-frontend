import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";

// Imports từ các file đã tách
import { cn } from "../../lib/utils";
import type { SeatStatus } from "../../types/booking";
import {
   BOOKED_SEATS,
   MOVIE_TIMINGS,
   TICKET_PRICE,
} from "../../constants/mockData";
import Seat from "../../components/ui/Seat";

const SeatSelectPage: React.FC = () => {
   const navigate = useNavigate();

   // --- State Management ---
   const [selectedTiming, setSelectedTiming] = useState<string>("12:00");
   const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());

   // --- Logic Handlers ---
   const toggleSeat = (seatId: string) => {
      if (BOOKED_SEATS.has(seatId)) return;

      const newSelected = new Set(selectedSeats);
      if (newSelected.has(seatId)) {
         newSelected.delete(seatId);
      } else {
         newSelected.add(seatId);
      }
      setSelectedSeats(newSelected);
   };

   const getSeatStatus = (seatId: string): SeatStatus => {
      if (BOOKED_SEATS.has(seatId)) return "occupied";
      if (selectedSeats.has(seatId)) return "selected";
      return "available";
   };

   const handleCheckout = () => {
      if (selectedSeats.size === 0) {
         alert("Please select at least one seat to proceed.");
         return;
      }
      navigate("/checkout", {
         state: {
            seats: Array.from(selectedSeats),
            timing: selectedTiming,
            totalPrice: selectedSeats.size * TICKET_PRICE,
         },
      });
   };

   // --- Render Helpers ---
   const renderRow = (rowLabel: string) => (
      <div key={rowLabel} className="flex gap-2 justify-center mb-2">
         {Array.from({ length: 9 }, (_, i) => {
            const seatId = `${rowLabel}${i + 1}`;
            return (
               <Seat
                  key={seatId}
                  id={seatId}
                  label={seatId}
                  status={getSeatStatus(seatId)}
                  onClick={toggleSeat}
               />
            );
         })}
      </div>
   );

   return (
      <div className="mt-16 min-h-screen bg-[#0B0B0F] text-white flex flex-col items-center relative overflow-hidden pb-32">
         {/* Background Ambience */}
         <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-rose-900/20 rounded-full blur-[120px] pointer-events-none" />
         <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-rose-900/10 rounded-full blur-[120px] pointer-events-none" />

         {/* --- Section 1: Timings --- */}
         <div className="w-full max-w-4xl mt-8 px-4">
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
               <Clock className="w-4 h-4" /> Available Timings
            </h3>
            <div className="flex flex-wrap gap-3">
               {MOVIE_TIMINGS.map((time) => (
                  <button
                     key={time}
                     onClick={() => setSelectedTiming(time)}
                     className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200",
                        selectedTiming === time
                           ? "bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-900/40"
                           : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200 bg-transparent",
                     )}
                  >
                     {time}
                  </button>
               ))}
            </div>
         </div>

         {/* --- Section 2: Screen --- */}
         <div className="mt-12 mb-8 w-full flex flex-col items-center justify-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-8">
               Select your seat
            </h1>
            <div className="relative w-full max-w-lg flex flex-col items-center">
               <div className="w-3/4 h-16 border-t-4 border-rose-900/50 rounded-[50%] shadow-[0_-10px_20px_rgba(225,29,72,0.1)] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-rose-600/20 to-transparent blur-sm"></div>
               </div>
               <span className="text-gray-600 text-xs font-bold tracking-[0.2em] uppercase mt-[-40px]">
                  Screen Side
               </span>
            </div>
         </div>

         {/* --- Section 3: Seats Grid --- */}
         <div className="w-full max-w-6xl flex flex-col items-center gap-8 px-4 scale-90 md:scale-100 origin-top">
            <div className="flex flex-col items-center w-full">
               {["A", "B"].map(renderRow)}
            </div>

            <div className="flex gap-8 md:gap-24">
               <div className="flex flex-col gap-6">
                  <div className="flex flex-col">
                     {["C", "D"].map(renderRow)}
                  </div>
                  <div className="flex flex-col">
                     {["G", "H"].map(renderRow)}
                  </div>
               </div>

               <div className="flex flex-col gap-6">
                  <div className="flex flex-col">
                     {["E", "F"].map(renderRow)}
                  </div>
                  <div className="flex flex-col">
                     {["I", "J"].map(renderRow)}
                  </div>
               </div>
            </div>
         </div>

         {/* --- Section 4: Legend --- */}
         <div className="flex gap-6 mt-8 text-xs md:text-sm text-gray-400 font-medium">
            <div className="flex items-center gap-2">
               <div className="w-4 h-4 rounded bg-gray-800 border border-gray-700"></div>
               <span>Occupied</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-4 h-4 rounded border border-rose-500 bg-transparent"></div>
               <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-4 h-4 rounded bg-rose-600 border border-rose-600 shadow-[0_0_10px_rgba(225,29,72,0.5)]"></div>
               <span>Selected</span>
            </div>
         </div>

         {/* --- Section 5: Checkout Bar --- */}
         <div className="fixed bottom-0 left-0 w-full bg-[#0B0B0F]/90 backdrop-blur-md border-t border-gray-800 p-4 z-50">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
               <div className="flex flex-col">
                  <span className="text-gray-400 text-xs uppercase">
                     Selected Seats
                  </span>
                  <span className="text-white font-bold text-lg">
                     {selectedSeats.size > 0
                        ? Array.from(selectedSeats).join(", ")
                        : "None"}
                  </span>
               </div>

               <button
                  onClick={handleCheckout}
                  disabled={selectedSeats.size === 0}
                  className={cn(
                     "flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all duration-300",
                     selectedSeats.size > 0
                        ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30 hover:scale-105 active:scale-95"
                        : "bg-gray-800 text-gray-500 cursor-not-allowed",
                  )}
               >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
               </button>
            </div>
         </div>
      </div>
   );
};

export default SeatSelectPage;
