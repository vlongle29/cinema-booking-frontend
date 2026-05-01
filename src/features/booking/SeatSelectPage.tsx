import React, { useEffect, useState, useMemo, useRef, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { seatService } from "../../services/seatService";
import { showtimeService } from "../../services/showtimeService";
import { SEAT_STATUS } from "../../constants/websocketEvents";

// Imports từ các file đã tách
import { cn } from "../../lib/utils";
import type { SeatStatus } from "../../types/booking";
import { TICKET_PRICE } from "../../constants/mockData";
import Seat from "../../components/ui/Seat";
import { AuthContext } from "../../context/AuthContext";
import { useBookingWebSocket } from "../../hooks/useBookingWebSocket";
import { bookingService } from "../../services/bookingService";

interface productItem {
   productId: string;
   priceAtPurchase: number;
   quantity: number;
}

interface bookingConfirmRequest {
   showtimeId: string;
   seatIds: string[];
   products: productItem[];
}

const SeatSelectPage: React.FC = () => {
   const navigate = useNavigate();
   const { id: showtimeId } = useParams<{ id: string }>();

   // Khởi tạo WebSocket hook với showtimeId và accessToken
   const { seatStatus } = useBookingWebSocket(showtimeId || "");

   // --- State Management ---
   const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());
   const [seatLayout, setSeatLayout] = useState<any[]>([]);
   const [seatStatuses, setSeatStatuses] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      console.log("showtimeId", showtimeId);

      const loadData = async () => {
         if (!showtimeId) return;

         try {
            if (!showtimeId) return;
            setIsLoading(true);

            // 1. Lấy chi tiết suất chiếu để có roomId
            const showtimeRes =
               await showtimeService.getShowtimeById(showtimeId);
            const roomId = showtimeRes.data.roomId;

            // 2. Load Layout và Status song song
            const [layoutRes, statusRes] = await Promise.all([
               seatService.getSeatsByRoom(roomId),
               showtimeService.getAllSeatStatus(showtimeId),
            ]);

            if (layoutRes.data) setSeatLayout(layoutRes.data);
            if (statusRes.data?.seats) {
               setSeatStatuses(statusRes.data.seats);
            }
         } catch (error) {
            console.error("Failed to fetch seats:", error);
         } finally {
            setIsLoading(false);
         }
      };
      loadData();
   }, [showtimeId]);

   // --- 3. MERGE DATA SOURCES ---
   const mergedSeats = useMemo(() => {
      return seatLayout.map((seat: any) => {
         // Tìm trạng thái tương ứng từ showtime status API
         const statusInfo = seatStatuses.find((s: any) => s.seatId === seat.id);

         // Lấy trạng thái Real-time từ WebSocket
         const realTimeStatus = seatStatus[seat.id];
         // console.log(
         //    `Seat ${seat.seatNumber} - Real-time: ${realTimeStatus}, API: ${statusInfo?.status}`,
         // );

         // Ưu tiên Real-time -> API -> Available
         const finalStatus =
            realTimeStatus || statusInfo?.status || SEAT_STATUS.AVAILABLE;

         return {
            ...seat,
            currentStatus: finalStatus, // Quan trọng: Sử dụng finalStatus đã tính toán ở trên
            currentPrice:
               statusInfo?.price || seat.seatType?.basePrice || TICKET_PRICE,
            heldByBookingId: statusInfo?.heldByBookingId,
         };
      });
   }, [seatLayout, seatStatuses, seatStatus]);

   // --- TÍNH TOÁN MA TRẬN GRID (Sử dụng trực tiếp dữ liệu từ API) ---
   const maxCols =
      seatLayout.length > 0
         ? Math.max(...seatLayout.map((s: any) => s.columnIndex)) + 1
         : 10;

   const maxRows =
      seatLayout.length > 0
         ? Math.max(...seatLayout.map((s: any) => s.rowIndex)) + 1
         : 10;

   // --- Logic Handlers ---
   const toggleSeat = (seat: any) => {
      // Không cho chọn nếu ghế đã được đặt hoặc bị khóa bởi người khác
      if (
         seat.currentStatus === SEAT_STATUS.BOOKED ||
         seat.currentStatus === SEAT_STATUS.LOCKED ||
         seat.currentStatus === "HELD"
      ) {
         return;
      }

      const newSelected = new Set(selectedSeats);
      if (newSelected.has(seat.id)) {
         newSelected.delete(seat.id);
      } else {
         newSelected.add(seat.id);
      }
      setSelectedSeats(newSelected);
   };

   const getSeatStatus = (seat: any): SeatStatus => {
      if (selectedSeats.has(seat.id)) return "selected";
      if (
         seat.currentStatus === SEAT_STATUS.BOOKED ||
         seat.currentStatus === SEAT_STATUS.LOCKED ||
         seat.currentStatus === "HELD"
      ) {
         return "occupied";
      }
      return "available";
   };

   const handleCheckout = async () => {
      if (selectedSeats.size === 0) {
         alert("Please select at least one seat to proceed.");
         return;
      }

      const seatIds = Array.from(selectedSeats);

      try {
         // 1. Gọi API xác nhận đặt ghế (cần await vì là thao tác mạng)
         const response = await bookingService.confirmBooking(
            showtimeId || "",
            seatIds,
            [], // Hiện tại chưa có sản phẩm nào được chọn
         );

         // Lấy danh sách seatNumber để hiển thị ở trang sau
         const seatNumbers = mergedSeats
            .filter((s) => selectedSeats.has(s.id))
            .map((s) => s.seatNumber);

         const totalPrice = response.data.tickets.reduce(
            (total: number, ticket: any) => total + ticket.price,
            0,
         );

         navigate("/checkout", {
            state: {
               showtimeId,
               seats: seatNumbers,
               timing: "",
               bookingId: response.data.id,
               ticketPrice: totalPrice,
               totalAmount: totalPrice,
               products: [], // Hiện tại chưa có sản phẩm nào được chọn
            },
         });
         console.log("Booking confirmation response:", response);
      } catch (error) {
         console.error("Lỗi khi tạo đơn hàng:", error);
         alert("Không thể đặt ghế lúc này. Vui lòng thử lại!");
      }
   };

   return (
      <div className="mt-16 min-h-screen bg-[#0B0B0F] text-white flex flex-col items-center relative overflow-hidden pb-32">
         {/* Background Ambience */}
         <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-rose-900/20 rounded-full blur-[120px] pointer-events-none" />
         <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-rose-900/10 rounded-full blur-[120px] pointer-events-none" />

         {/* --- Section 1: Screen --- */}
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

         {/* --- Section 2: Seats Grid --- */}
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
                  {/* In lưới ghế (Sử dụng mergedSeats) */}
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
                              status={getSeatStatus(seat)}
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

         {/* --- Section 3: Legend --- */}
         <div className="flex gap-6 mt-12 text-xs md:text-sm text-gray-400 font-medium">
            <div className="flex items-center gap-2">
               <div className="w-5 h-5 rounded-md bg-gray-800 border border-gray-700"></div>
               <span>Occupied</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-5 h-5 rounded-md border-2 border-rose-500 bg-transparent"></div>
               <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-5 h-5 rounded-md bg-rose-600 shadow-[0_0_12px_rgba(225,29,72,0.6)]"></div>
               <span>Selected</span>
            </div>
         </div>

         {/* --- Section 4: Checkout Bar --- */}
         <div className="fixed bottom-0 left-0 w-full bg-[#0B0B0F]/90 backdrop-blur-md border-t border-gray-800 p-4 z-50">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
               <div className="flex flex-col">
                  <span className="text-gray-400 text-xs uppercase">
                     Selected Seats
                  </span>
                  <span className="text-white font-bold text-lg">
                     {selectedSeats.size > 0
                        ? mergedSeats
                             .filter((s) => selectedSeats.has(s.id))
                             .map((s) => s.seatNumber)
                             .sort()
                             .join(", ")
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
                  Proceed to Payment
                  <ArrowRight className="w-5 h-5" />
               </button>
            </div>
         </div>
      </div>
   );
};

export default SeatSelectPage;
